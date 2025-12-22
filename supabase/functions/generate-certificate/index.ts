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
        const { certificateType, categoryId } = await req.json();

        if (!certificateType) {
            throw new Error('Certificate type is required');
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

        // Get user profile
        const profileResponse = await fetch(
            `${supabaseUrl}/rest/v1/users?auth_user_id=eq.${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const profileData = await profileResponse.json();
        if (!profileData || profileData.length === 0) {
            throw new Error('User profile not found');
        }

        const user = profileData[0];
        const userName = user.profile_data?.full_name || user.email;

        // Get category info if applicable
        let categoryName = null;
        if (categoryId) {
            const categoryResponse = await fetch(
                `${supabaseUrl}/rest/v1/categories?id=eq.${categoryId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                }
            );

            const categoryData = await categoryResponse.json();
            if (categoryData && categoryData.length > 0) {
                categoryName = categoryData[0].name;
            }
        }

        // Generate verification code
        const verificationCode = crypto.randomUUID().slice(0, 8).toUpperCase();

        // Create certificate record
        const certificateResponse = await fetch(`${supabaseUrl}/rest/v1/certificates`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                user_id: userId,
                certificate_type: certificateType,
                category_id: categoryId || null,
                verification_code: verificationCode,
                issued_at: new Date().toISOString(),
                certificate_url: null // Will be updated after PDF generation
            })
        });

        if (!certificateResponse.ok) {
            const errorText = await certificateResponse.text();
            throw new Error(`Failed to create certificate: ${errorText}`);
        }

        const certificateData = await certificateResponse.json();
        const certificate = certificateData[0];

        // Generate simple certificate data (PDF generation would happen here in production)
        const certificateTitle = certificateType === 'category' 
            ? `${categoryName} Mastery Certificate`
            : 'Credit Repair Master Certificate';

        return new Response(JSON.stringify({
            data: {
                certificateId: certificate.id,
                verificationCode: verificationCode,
                title: certificateTitle,
                userName: userName,
                issuedAt: certificate.issued_at,
                message: 'Certificate generated successfully. PDF generation will be implemented in production.'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Generate certificate error:', error);

        return new Response(JSON.stringify({
            error: {
                code: 'GENERATE_CERTIFICATE_FAILED',
                message: error instanceof Error ? error.message : 'Unknown error'
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
