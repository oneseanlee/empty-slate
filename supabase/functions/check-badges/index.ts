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

        const newBadges = [];

        // Get user progress and stats
        const progressResponse = await fetch(
            `${supabaseUrl}/rest/v1/user_progress?user_id=eq.${userId}&completed=eq.true`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const completedLessons = await progressResponse.json();
        const lessonCount = completedLessons?.length || 0;

        // Get user XP
        const xpResponse = await fetch(
            `${supabaseUrl}/rest/v1/user_xp?user_id=eq.${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const xpData = await xpResponse.json();
        const userXp = xpData && xpData.length > 0 ? xpData[0] : null;
        const currentStreak = userXp?.current_streak || 0;

        // Get existing badges
        const userBadgesResponse = await fetch(
            `${supabaseUrl}/rest/v1/user_badges?user_id=eq.${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const existingBadges = await userBadgesResponse.json();
        const earnedBadgeIds = existingBadges?.map((ub: any) => ub.badge_id) || [];

        // Get all badges
        const badgesResponse = await fetch(
            `${supabaseUrl}/rest/v1/badges`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const allBadges = await badgesResponse.json();

        // Check milestone badges
        const milestones = [
            { count: 1, slug: 'first-lesson' },
            { count: 10, slug: '10-lessons' },
            { count: 50, slug: '50-lessons' },
            { count: 87, slug: 'all-lessons' }
        ];

        for (const milestone of milestones) {
            if (lessonCount >= milestone.count) {
                const badge = allBadges?.find((b: any) => b.slug === milestone.slug);
                if (badge && !earnedBadgeIds.includes(badge.id)) {
                    // Award badge
                    await fetch(`${supabaseUrl}/rest/v1/user_badges`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            badge_id: badge.id,
                            earned_at: new Date().toISOString()
                        })
                    });
                    newBadges.push(badge);
                }
            }
        }

        // Check streak badges
        const streaks = [
            { days: 7, slug: '7-day-streak' },
            { days: 30, slug: '30-day-streak' },
            { days: 100, slug: '100-day-streak' }
        ];

        for (const streak of streaks) {
            if (currentStreak >= streak.days) {
                const badge = allBadges?.find((b: any) => b.slug === streak.slug);
                if (badge && !earnedBadgeIds.includes(badge.id)) {
                    // Award badge
                    await fetch(`${supabaseUrl}/rest/v1/user_badges`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            badge_id: badge.id,
                            earned_at: new Date().toISOString()
                        })
                    });
                    newBadges.push(badge);
                }
            }
        }

        return new Response(JSON.stringify({
            data: {
                newBadges: newBadges,
                totalBadgesEarned: earnedBadgeIds.length + newBadges.length
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Check badges error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'CHECK_BADGES_FAILED',
                message: error instanceof Error ? error.message : 'Unknown error'
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
