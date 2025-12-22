
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
        id: 'user-avatars',
        name: 'user-avatars',
        public: true,
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp"],
        file_size_limit: 2097152
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

    // Create SECURE access policies for the bucket
    // - Public SELECT: Anyone can view avatars (needed for displaying profile pictures)
    // - Authenticated INSERT: Only logged-in users can upload to their own folder
    // - Authenticated UPDATE: Only file owners can update
    // - Authenticated DELETE: Only file owners can delete
    const policyQueries = [
        // Allow public to view objects in this bucket (needed for displaying avatars)
        `CREATE POLICY "Public Access for user-avatars" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');`,
        // Allow authenticated users to upload to their own folder only
        `CREATE POLICY "Authenticated Upload for user-avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);`,
        // Allow authenticated users to update their own files only
        `CREATE POLICY "Owner Update for user-avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'user-avatars' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);`,
        // Allow authenticated users to delete their own files only
        `CREATE POLICY "Owner Delete for user-avatars" ON storage.objects FOR DELETE USING (bucket_id = 'user-avatars' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);`
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
        name: 'user-avatars',
        public: true,
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp"],
        file_size_limit: 2097152,
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
