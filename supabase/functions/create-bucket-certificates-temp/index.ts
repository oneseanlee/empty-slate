
Deno.serve(async (req) => {
    const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    };

    if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
    }

    try {
    // Get service role key from environment
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
        return new Response(JSON.stringify({
        error: { code: 'CONFIG_ERROR', message: 'Missing Supabase configuration' }
        }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
        });
    }

    // Storage API endpoint
    const storageUrl = `${supabaseUrl}/storage/v1/bucket`;

    // Prepare bucket configuration
    const bucketConfig: {
        id: string;
        name: string;
        public: boolean;
        allowed_mime_types?: string[];
        file_size_limit?: number;
    } = {
        id: 'certificates',
        name: 'certificates',
        public: true,
        allowed_mime_types: ["application/pdf", "image/png"],
        file_size_limit: 10485760
    };

    // Create bucket using Storage API
    const response = await fetch(storageUrl, {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(bucketConfig)
    });

    const responseData = await response.json();

    if (!response.ok) {
        return new Response(JSON.stringify({
        error: {
            code: 'BUCKET_CREATION_FAILED',
            message: responseData.error || responseData.message || 'Failed to create bucket',
            status: response.status
        }
        }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
        });
    }

    // Create SECURE access policies for the certificates bucket
    // - Public SELECT: Anyone can view/download certificates (needed for verification)
    // - Admin INSERT: Only admins/system can create certificates (via edge functions using service role)
    // - No public UPDATE/DELETE: Certificates should be immutable
    const policyQueries = [
        // Allow public to view/download certificates (for verification)
        `CREATE POLICY "Public Access for certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');`,
        // Only authenticated admins can upload certificates (typically done by backend/edge functions)
        `CREATE POLICY "Admin Upload for certificates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role IN ('reseller_admin', 'super_admin')));`,
        // Only admins can update certificates
        `CREATE POLICY "Admin Update for certificates" ON storage.objects FOR UPDATE USING (bucket_id = 'certificates' AND auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role IN ('reseller_admin', 'super_admin')));`,
        // Only admins can delete certificates
        `CREATE POLICY "Admin Delete for certificates" ON storage.objects FOR DELETE USING (bucket_id = 'certificates' AND auth.role() = 'authenticated' AND EXISTS (SELECT 1 FROM users WHERE auth_user_id = auth.uid() AND role IN ('reseller_admin', 'super_admin')));`
    ];

    // Execute policy creation queries
    const policyResults = [];
    for (const query of policyQueries) {
        try {
        const policyResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            },
            body: JSON.stringify({ query: query })
        });

        if (policyResponse.ok) {
            policyResults.push(`Policy created: ${query.split('"')[1]}`);
        } else {
            const errorText = await policyResponse.text();
            policyResults.push(`Policy failed: ${query.split('"')[1]} - ${errorText}`);
        }
        } catch (policyError) {
        policyResults.push(`Policy error: ${policyError instanceof Error ? policyError.message : 'Unknown error'}`);
        }
    }

    // Return success response
    return new Response(JSON.stringify({
        success: true,
        message: 'Bucket created successfully with secure access policies',
        bucket: {
        name: 'certificates',
        public: true,
        allowed_mime_types: ["application/pdf", "image/png"],
        file_size_limit: 10485760,
        policies: policyResults
        }
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

    } catch (error) {
    return new Response(JSON.stringify({
        error: { code: 'FUNCTION_ERROR', message: error instanceof Error ? error.message : 'Unknown error' }
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
    });
    }
});
