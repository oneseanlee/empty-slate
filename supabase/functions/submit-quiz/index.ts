Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { quizId, answers } = await req.json();

        if (!quizId || !answers) {
            throw new Error('Quiz ID and answers are required');
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

        // Get quiz details
        const quizResponse = await fetch(
            `${supabaseUrl}/rest/v1/quizzes?id=eq.${quizId}`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const quizData = await quizResponse.json();
        if (!quizData || quizData.length === 0) {
            throw new Error('Quiz not found');
        }

        const quiz = quizData[0];
        const questions = quiz.questions_json || [];

        // Calculate score
        let correctCount = 0;
        const totalQuestions = questions.length;

        questions.forEach((question: any, index: number) => {
            if (answers[index] === question.correctAnswer) {
                correctCount++;
            }
        });

        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        const passed = score >= (quiz.passing_score || 70);

        // Save quiz attempt
        const attemptResponse = await fetch(`${supabaseUrl}/rest/v1/quiz_attempts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                user_id: userId,
                quiz_id: quizId,
                score: score,
                passed: passed,
                answers_json: answers,
                completed_at: new Date().toISOString()
            })
        });

        if (!attemptResponse.ok) {
            const errorText = await attemptResponse.text();
            throw new Error(`Failed to save quiz attempt: ${errorText}`);
        }

        // Award XP based on score (only if passed)
        let xpAwarded = 0;
        if (passed) {
            // Award XP: 100 for perfect score, scaled down based on percentage
            xpAwarded = Math.round(score);
            
            await fetch(`${supabaseUrl}/rest/v1/rpc/award_xp`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    p_user_id: userId,
                    p_amount: xpAwarded,
                    p_reason: 'quiz_completion'
                })
            });
        }

        return new Response(JSON.stringify({
            data: {
                score: score,
                passed: passed,
                correctCount: correctCount,
                totalQuestions: totalQuestions,
                xpAwarded: xpAwarded
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Submit quiz error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'SUBMIT_QUIZ_FAILED',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
