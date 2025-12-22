Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { lessonId } = await req.json();

        if (!lessonId) {
            throw new Error('Lesson ID is required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            throw new Error('No authorization header');
        }

        const token = authHeader.replace('Bearer ', '');

        // Verify token and get user
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': serviceRoleKey
            }
        });

        if (!userResponse.ok) {
            throw new Error('Invalid token');
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        // Load lesson to resolve course_id
        const lessonResponse = await fetch(
            `${supabaseUrl}/rest/v1/lessons?id=eq.${lessonId}&select=id,course_id`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        if (!lessonResponse.ok) {
            const errorText = await lessonResponse.text();
            throw new Error(`Failed to load lesson: ${errorText}`);
        }

        const lessonData = await lessonResponse.json();
        const lesson = lessonData && lessonData.length > 0 ? lessonData[0] : null;

        if (!lesson) {
            throw new Error('Lesson not found');
        }

        // Check if lesson already completed
        const checkResponse = await fetch(
            `${supabaseUrl}/rest/v1/user_progress?user_id=eq.${userId}&lesson_id=eq.${lessonId}`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const existingProgress = await checkResponse.json();

        if (existingProgress && existingProgress.length > 0 && existingProgress[0].completed) {
            return new Response(JSON.stringify({
                data: {
                    message: 'Lesson already completed',
                    alreadyCompleted: true
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Mark lesson as complete
        const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/user_progress`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify({
                user_id: userId,
                lesson_id: lessonId,
                course_id: lesson.course_id,
                completed: true,
                completed_at: new Date().toISOString()
            })
        });

        if (!upsertResponse.ok) {
            const errorText = await upsertResponse.text();
            throw new Error(`Failed to update progress: ${errorText}`);
        }

        // Award XP for lesson completion (50 XP)
        const xpResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/award_xp`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                p_user_id: userId,
                p_amount: 50,
                p_reason: 'lesson_completion'
            })
        });

        let newXp = null;
        if (xpResponse.ok) {
            newXp = await xpResponse.json();
        }

        return new Response(JSON.stringify({
            data: {
                message: 'Lesson completed successfully',
                xpAwarded: 50,
                newXp: newXp
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Complete lesson error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'COMPLETE_LESSON_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
