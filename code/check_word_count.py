#!/usr/bin/env python3
import os
import requests

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
    'Content-Type': 'application/json'
}

# Fetch one lesson to check word count
response = requests.get(
    f'{SUPABASE_URL}/rest/v1/lessons',
    headers=headers,
    params={'select': '*', 'limit': '1'}
)

if response.status_code == 200:
    lesson = response.json()[0]
    content = lesson['content_html']
    word_count = len(content.split())
    
    print(f"Sample lesson: {lesson['title']}")
    print(f"Character count: {len(content)}")
    print(f"Approximate word count: {word_count}")
    print(f"Target: 1500-2500 words")
    print(f"Status: {'✓ MEETS' if word_count >= 1500 else '✗ SHORT'}")
else:
    print(f"Error: {response.status_code}")
