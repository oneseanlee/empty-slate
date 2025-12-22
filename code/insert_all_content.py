#!/usr/bin/env python3
"""
Main script to generate and insert all 87 tutorial contents into Supabase
"""
import os
import sys
import json
import requests
import uuid
from datetime import datetime

# Add the content generator module
sys.path.append(os.path.dirname(__file__))
from content_generator_full import generate_lesson_content, generate_quiz_questions

# Supabase configuration
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

# Fetch all courses that need content
print("Fetching courses from database...")
response = requests.get(
    f'{SUPABASE_URL}/rest/v1/courses',
    headers=headers,
    params={'select': '*'}
)

courses = response.json()
print(f"Found {len(courses)} courses")

# Curriculum mapping for detailed content
curriculum_map = {
    "Welcome to Your Credit Repair Journey": {"code": "1.1", "duration": 20, "xp": 15, "topics": ["What is credit repair?", "Common myths vs. reality", "Timeline expectations"]},
    "Understanding Your Credit Score Basics": {"code": "1.2", "duration": 30, "xp": 20, "topics": ["Credit score ranges", "FICO vs. VantageScore", "Five scoring factors"]},
    "Understanding Credit Scores: The Basics": {"code": "1.2", "duration": 30, "xp": 20, "topics": ["Credit score ranges", "FICO vs. VantageScore", "Five scoring factors"]},
    # Add more mappings as needed
}

# Counter for progress
lesson_count = 0
quiz_count = 0

# Process each course
for course in courses:
    course_id = course['id']
    course_title = course['title']
    description = course.get('description', '')
    
    # Check if lesson already exists
    check_response = requests.get(
        f'{SUPABASE_URL}/rest/v1/lessons',
        headers=headers,
        params={'course_id': f'eq.{course_id}', 'select': 'id'}
    )
    
    existing_lessons = check_response.json()
    if existing_lessons and len(existing_lessons) > 0:
        print(f"✓ Skipping '{course_title}' - lesson already exists")
        continue
    
    # Get curriculum details or use defaults
    curr_data = curriculum_map.get(course_title, {
        "code": "X.X",
        "duration": 30,
        "xp": 20,
        "topics": ["Core concepts", "Practical applications", "Best practices"]
    })
    
    # Extract topics from description if not in curriculum map
    if "code" not in curriculum_map.get(course_title, {}):
        curr_data["topics"] = [description, "Implementation strategies", "Common challenges"]
    
    print(f"\n📝 Generating content for: {course_title}")
    
    # Generate lesson content
    content_html = generate_lesson_content(
        curr_data["code"],
        course_title,
        curr_data["topics"],
        description
    )
    
    # Create lesson
    lesson_slug = course_title.lower().replace(' ', '-').replace(':', '').replace('&', 'and')
    lesson_data = {
        'id': str(uuid.uuid4()),
        'course_id': course_id,
        'title': course_title,
        'slug': lesson_slug,
        'content_type': 'text',
        'content_html': content_html,
        'duration_minutes': curr_data["duration"],
        'xp_reward': curr_data["xp"],
        'is_active': True,
        'display_order': 1
    }
    
    # Insert lesson
    lesson_response = requests.post(
        f'{SUPABASE_URL}/rest/v1/lessons',
        headers=headers,
        json=lesson_data
    )
    
    if lesson_response.status_code in [200, 201]:
        lesson_id = lesson_response.json()[0]['id']
        lesson_count += 1
        print(f"  ✓ Created lesson ({len(content_html)} chars)")
        
        # Generate quiz questions
        quiz_questions = generate_quiz_questions(
            curr_data["code"],
            course_title,
            curr_data["topics"]
        )
        
        # Create quiz
        quiz_data = {
            'id': str(uuid.uuid4()),
            'lesson_id': lesson_id,
            'title': f"{course_title} - Quiz",
            'passing_score': 70,
            'questions_json': quiz_questions,
            'is_active': True
        }
        
        quiz_response = requests.post(
            f'{SUPABASE_URL}/rest/v1/quizzes',
            headers=headers,
            json=quiz_data
        )
        
        if quiz_response.status_code in [200, 201]:
            quiz_count += 1
            print(f"  ✓ Created quiz ({len(quiz_questions)} questions)")
        else:
            print(f"  ✗ Failed to create quiz: {quiz_response.text}")
    else:
        print(f"  ✗ Failed to create lesson: {lesson_response.text}")

print(f"\n{'='*60}")
print(f"✅ Content generation complete!")
print(f"   Lessons created: {lesson_count}")
print(f"   Quizzes created: {quiz_count}")
print(f"{'='*60}")

