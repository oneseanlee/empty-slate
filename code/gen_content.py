#!/usr/bin/env python3
import os
import json
import requests
import uuid
from datetime import datetime

# Supabase config
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

print('Fetching courses...')
response = requests.get(
    f'{SUPABASE_URL}/rest/v1/courses',
    headers=headers,
    params={'select': '*'}
)

courses = response.json()
print(f'Found {len(courses)} courses')
print(f'First course: {courses[0]["title"] if courses else "None"}')
