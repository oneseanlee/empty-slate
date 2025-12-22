# ScorePro E-Learning Platform - API Documentation

**Version:** 1.0  
**Last Updated:** October 23, 2025  
**Base URL:** https://nybgfstvvufadfcbesus.supabase.co  

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [REST API Endpoints](#rest-api-endpoints)
4. [Edge Functions](#edge-functions)
5. [Real-time Subscriptions](#real-time-subscriptions)
6. [Storage API](#storage-api)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)
9. [Code Examples](#code-examples)

---

## Overview

### API Architecture

The ScorePro platform uses Supabase, providing:

1. **REST API** - Auto-generated from database schema (PostgREST)
2. **Edge Functions** - Custom serverless functions (Deno runtime)
3. **Real-time API** - WebSocket subscriptions for live updates
4. **Storage API** - File upload/download

### Base URLs

```
REST API:      https://nybgfstvvufadfcbesus.supabase.co/rest/v1/
Edge Functions: https://nybgfstvvufadfcbesus.supabase.co/functions/v1/
Storage API:   https://nybgfstvvufadfcbesus.supabase.co/storage/v1/
```

### API Keys

**Anon Key (Public):** Use in frontend  
**Service Role Key:** Backend only (full access, bypasses RLS)

---

## Authentication

### Sign Up

**Endpoint:** `POST /auth/v1/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "options": {
    "data": {
      "full_name": "John Doe"
    }
  }
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "full_name": "John Doe"
    }
  }
}
```

### Sign In

**Endpoint:** `POST /auth/v1/token?grant_type=password`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** Same as Sign Up

### Sign Out

**Endpoint:** `POST /auth/v1/logout`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** 204 No Content

### Password Reset

**Request Reset:**
```javascript
POST /auth/v1/recover
{
  "email": "user@example.com"
}
```

**Update Password:**
```javascript
POST /auth/v1/user
Headers: Authorization: Bearer {access_token}
{
  "password": "newpassword123"
}
```

---

## REST API Endpoints

### General Format

**Base URL:** `/rest/v1/{table_name}`

**Headers:**
```
apikey: {SUPABASE_ANON_KEY}
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Query Operators

**Select:**
```
GET /rest/v1/courses?select=id,title,description
```

**Filter:**
```
GET /rest/v1/courses?category_id=eq.{uuid}
GET /rest/v1/lessons?is_active=eq.true
GET /rest/v1/user_progress?user_id=eq.{uuid}&completed=eq.true
```

**Order:**
```
GET /rest/v1/courses?order=display_order.asc
GET /rest/v1/quiz_submissions?order=created_at.desc
```

**Limit/Offset:**
```
GET /rest/v1/courses?limit=10&offset=20
```

**Range (Pagination):**
```
Headers: Range: 0-9
```

### Categories

**Get All Categories:**
```
GET /rest/v1/categories?select=*&order=display_order.asc
```

**Get Single Category:**
```
GET /rest/v1/categories?id=eq.{uuid}&select=*
```

**Get Category with Courses:**
```
GET /rest/v1/categories?select=*,courses(*)&id=eq.{uuid}
```

### Courses

**Get All Courses:**
```
GET /rest/v1/courses?select=*,categories(name)&order=display_order.asc
```

**Get Courses by Category:**
```
GET /rest/v1/courses?category_id=eq.{uuid}&select=*
```

**Get Course with Lessons:**
```
GET /rest/v1/courses?id=eq.{uuid}&select=*,lessons(*)
```

### Lessons

**Get Lesson:**
```
GET /rest/v1/lessons?id=eq.{uuid}&select=*
```

**Get Lessons by Course:**
```
GET /rest/v1/lessons?course_id=eq.{uuid}&order=display_order.asc
```

**Get Lesson with Quiz:**
```
GET /rest/v1/lessons?id=eq.{uuid}&select=*,quizzes(*)
```

### Quizzes

**Get Quiz:**
```
GET /rest/v1/quizzes?lesson_id=eq.{uuid}&select=*
```

**Response Example:**
```json
{
  "id": "uuid",
  "lesson_id": "uuid",
  "title": "Credit Score Basics - Quiz",
  "questions": [
    {
      "question": "What percentage is payment history?",
      "options": ["35%", "30%", "15%", "10%"],
      "correct_answer": 0,
      "explanation": "Payment history is 35% of FICO score."
    }
  ],
  "passing_score": 70,
  "xp_reward": 20
}
```

### User Progress

**Get User's Progress:**
```
GET /rest/v1/user_progress?user_id=eq.{uuid}&select=*,lessons(title)
```

**Get Completed Lessons:**
```
GET /rest/v1/user_progress?user_id=eq.{uuid}&completed=eq.true
```

**Create Progress Record:**
```
POST /rest/v1/user_progress
{
  "user_id": "uuid",
  "lesson_id": "uuid",
  "completed": false
}
```

**Update Progress:**
```
PATCH /rest/v1/user_progress?user_id=eq.{uuid}&lesson_id=eq.{uuid}
{
  "completed": true,
  "completed_at": "2025-10-23T10:30:00Z"
}
```

### User XP

**Get User XP:**
```
GET /rest/v1/user_xp?user_id=eq.{uuid}
```

**Response:**
```json
{
  "user_id": "uuid",
  "total_xp": 450,
  "level": 5,
  "current_streak": 7,
  "longest_streak": 14,
  "last_activity_date": "2025-10-23"
}
```

### Badges

**Get All Badges:**
```
GET /rest/v1/badges?select=*&order=display_order.asc
```

**Get User's Earned Badges:**
```
GET /rest/v1/user_badges?user_id=eq.{uuid}&select=*,badges(*)
```

### Certificates

**Get User's Certificates:**
```
GET /rest/v1/certificates?user_id=eq.{uuid}&select=*,categories(name)
```

**Verify Certificate:**
```
GET /rest/v1/certificates?certificate_code=eq.{code}
```

### Subscriptions

**Get User Subscription:**
```
GET /rest/v1/subscriptions?user_id=eq.{uuid}&status=eq.active
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "tier": "pro",
  "status": "active",
  "current_period_end": "2025-11-23T00:00:00Z",
  "stripe_subscription_id": "sub_xxx"
}
```

---

## Edge Functions

### 1. Complete Lesson

**Endpoint:** `POST /functions/v1/complete-lesson`

**Purpose:** Mark lesson as complete and award XP

**Request:**
```json
{
  "lessonId": "uuid"
}
```

**Response:**
```json
{
  "data": {
    "progress": {
      "user_id": "uuid",
      "lesson_id": "uuid",
      "completed": true,
      "completed_at": "2025-10-23T10:30:00Z"
    },
    "xp": {
      "total_xp": 460,
      "level": 5,
      "xp_earned": 10
    }
  }
}
```

**Errors:**
```json
{
  "error": {
    "code": "ALREADY_COMPLETED",
    "message": "Lesson already completed"
  }
}
```

### 2. Submit Quiz

**Endpoint:** `POST /functions/v1/submit-quiz`

**Purpose:** Submit quiz answers, calculate score, award XP if passed

**Request:**
```json
{
  "quizId": "uuid",
  "answers": [
    {"question_index": 0, "selected_answer": 0},
    {"question_index": 1, "selected_answer": 2}
  ]
}
```

**Response:**
```json
{
  "data": {
    "submission": {
      "id": "uuid",
      "score": 85,
      "passed": true,
      "answers": [
        {"question_index": 0, "selected_answer": 0, "correct": true},
        {"question_index": 1, "selected_answer": 2, "correct": false}
      ]
    },
    "xp": {
      "total_xp": 480,
      "xp_earned": 20
    },
    "new_badges": []
  }
}
```

### 3. Check Badges

**Endpoint:** `POST /functions/v1/check-badges`

**Purpose:** Check and award eligible badges

**Request:**
```json
{}
```

**Response:**
```json
{
  "data": {
    "new_badges": [
      {
        "badge_id": "uuid",
        "name": "10 Lessons Complete",
        "xp_reward": 50
      }
    ],
    "total_badges": 5
  }
}
```

### 4. Generate Certificate

**Endpoint:** `POST /functions/v1/generate-certificate`

**Purpose:** Generate certificate for completed category

**Request:**
```json
{
  "categoryId": "uuid"
}
```

**Response:**
```json
{
  "data": {
    "certificate": {
      "id": "uuid",
      "certificate_code": "CERT-2025-XXXX",
      "category_id": "uuid",
      "issued_at": "2025-10-23T10:30:00Z"
    }
  }
}
```

**Errors:**
```json
{
  "error": {
    "code": "INCOMPLETE_CATEGORY",
    "message": "Not all courses in category completed"
  }
}
```

---

## Real-time Subscriptions

### Subscribe to Progress Updates

**Example: Listen to your own progress changes**

```javascript
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const subscription = supabase
  .channel('user-progress')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_progress',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Progress updated:', payload.new)
      // Update UI with new progress
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### Subscribe to XP Changes

```javascript
const subscription = supabase
  .channel('user-xp')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'user_xp',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('XP updated:', payload.new)
      // Show XP gain animation
    }
  )
  .subscribe()
```

### Subscribe to Badge Awards

```javascript
const subscription = supabase
  .channel('user-badges')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'user_badges',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Badge earned:', payload.new)
      // Show badge earned notification
    }
  )
  .subscribe()
```

---

## Storage API

### Buckets

- `avatars` - User profile pictures
- `lesson-files` - Lesson attachments/resources
- `lesson-images` - Lesson content images
- `certificates` - Generated certificate PDFs (future)
- `videos` - Video content (or links to external hosting)

### Upload File

**Endpoint:** `POST /storage/v1/object/{bucket}/{path}`

**Example:**
```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true
  })

if (data) {
  const publicURL = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/avatar.png`)
  console.log('Avatar URL:', publicURL.data.publicUrl)
}
```

### Download File

**Endpoint:** `GET /storage/v1/object/{bucket}/{path}`

**Example:**
```javascript
const { data, error } = await supabase.storage
  .from('lesson-files')
  .download('resources/credit-report-sample.pdf')

if (data) {
  // Create download link
  const url = URL.createObjectURL(data)
  window.open(url)
}
```

### Delete File

```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .remove([`${userId}/avatar.png`])
```

### List Files

```javascript
const { data, error } = await supabase.storage
  .from('lesson-files')
  .list('resources', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' }
  })
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional context (optional)"
  }
}
```

### Common Error Codes

**Authentication Errors:**
- `UNAUTHORIZED` - Missing or invalid access token
- `INVALID_CREDENTIALS` - Wrong email/password
- `EMAIL_NOT_CONFIRMED` - Email verification required

**Permission Errors:**
- `FORBIDDEN` - User doesn't have permission
- `SUBSCRIPTION_REQUIRED` - Feature requires paid subscription

**Validation Errors:**
- `INVALID_INPUT` - Request data validation failed
- `MISSING_REQUIRED_FIELD` - Required field not provided

**Resource Errors:**
- `NOT_FOUND` - Resource doesn't exist
- `ALREADY_EXISTS` - Duplicate resource
- `ALREADY_COMPLETED` - Lesson/quiz already completed

**Server Errors:**
- `INTERNAL_ERROR` - Server error (500)
- `SERVICE_UNAVAILABLE` - Temporary outage (503)

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (success, no response body)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Rate Limiting

### Limits

**Supabase Free Tier:**
- REST API: No hard limit (reasonable use)
- Edge Functions: 500K invocations/month
- Storage: 1GB, 2GB bandwidth/month

**Supabase Pro Tier:**
- REST API: No hard limit
- Edge Functions: 2M invocations/month
- Storage: 100GB, 200GB bandwidth/month

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698076800
```

### Handling Rate Limits

```javascript
try {
  const response = await fetch(endpoint, options)
  
  if (response.status === 429) {
    const resetTime = response.headers.get('X-RateLimit-Reset')
    const waitSeconds = resetTime - Math.floor(Date.now() / 1000)
    console.log(`Rate limited. Retry in ${waitSeconds} seconds`)
    
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000))
    return fetch(endpoint, options)
  }
  
  return response
} catch (error) {
  console.error('API error:', error)
}
```

---

## Code Examples

### Initialize Supabase Client

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nybgfstvvufadfcbesus.supabase.co'
const supabaseAnonKey = 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Complete User Flow

```javascript
// 1. Sign up
const { data: authData, error: authError } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'John Doe' }
  }
})

if (authError) {
  console.error('Signup error:', authError)
  return
}

const userId = authData.user.id

// 2. Get course catalog
const { data: categories, error: catError } = await supabase
  .from('categories')
  .select(`
    *,
    courses (
      *,
      lessons (count)
    )
  `)
  .order('display_order')

// 3. Get a lesson
const { data: lesson, error: lessonError } = await supabase
  .from('lessons')
  .select('*, quizzes(*)')
  .eq('id', lessonId)
  .single()

// 4. Mark lesson complete (via Edge Function)
const { data: completionData, error: completionError } = await supabase.functions.invoke(
  'complete-lesson',
  {
    body: { lessonId }
  }
)

console.log('XP earned:', completionData.xp.xp_earned)

// 5. Take quiz (via Edge Function)
const answers = [
  { question_index: 0, selected_answer: 0 },
  { question_index: 1, selected_answer: 2 }
]

const { data: quizResult, error: quizError } = await supabase.functions.invoke(
  'submit-quiz',
  {
    body: { quizId, answers }
  }
)

if (quizResult.submission.passed) {
  console.log('Quiz passed! Score:', quizResult.submission.score)
  console.log('XP earned:', quizResult.xp.xp_earned)
  
  if (quizResult.new_badges.length > 0) {
    console.log('New badges earned:', quizResult.new_badges)
  }
}

// 6. Get user progress
const { data: progress, error: progressError } = await supabase
  .from('user_progress')
  .select('*, lessons(title)')
  .eq('user_id', userId)
  .eq('completed', true)

console.log('Completed lessons:', progress.length)

// 7. Get user XP and level
const { data: xp, error: xpError } = await supabase
  .from('user_xp')
  .select('*')
  .eq('user_id', userId)
  .single()

console.log('Level:', xp.level, 'XP:', xp.total_xp)

// 8. Get earned badges
const { data: badges, error: badgesError } = await supabase
  .from('user_badges')
  .select('*, badges(*)')
  .eq('user_id', userId)

console.log('Badges earned:', badges.length)
```

### Admin: Get Platform Analytics

```javascript
// Total users
const { count: totalUsers } = await supabase
  .from('users')
  .select('*', { count: 'exact', head: true })

// Active subscriptions
const { count: activeSubscriptions } = await supabase
  .from('subscriptions')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'active')
  .neq('tier', 'free')

// Lessons completed today
const today = new Date().toISOString().split('T')[0]
const { count: completionsToday } = await supabase
  .from('user_progress')
  .select('*', { count: 'exact', head: true })
  .eq('completed', true)
  .gte('completed_at', today)

// Top users by XP
const { data: leaderboard } = await supabase
  .from('user_xp')
  .select('*, users(full_name, email)')
  .order('total_xp', { ascending: false })
  .limit(10)

console.log({
  totalUsers,
  activeSubscriptions,
  completionsToday,
  leaderboard
})
```

---

## Webhooks (Stripe Integration)

### Webhook Endpoint

**URL:** `https://nybgfstvvufadfcbesus.supabase.co/functions/v1/stripe-webhook`

**Events to Subscribe:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Example Handler:**
```javascript
// Edge Function: stripe-webhook

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  // Verify webhook signature
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    webhookSecret
  )
  
  switch (event.type) {
    case 'customer.subscription.updated':
      const subscription = event.data.object
      
      // Update database
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000)
        })
        .eq('stripe_subscription_id', subscription.id)
      
      break
    
    case 'invoice.payment_succeeded':
      const invoice = event.data.object
      
      // Record payment
      await supabaseAdmin
        .from('payments')
        .insert({
          user_id: invoice.metadata.user_id,
          amount: invoice.amount_paid,
          status: 'succeeded',
          stripe_payment_id: invoice.payment_intent
        })
      
      break
  }
  
  return new Response(JSON.stringify({ received: true }), {
    status: 200
  })
})
```

---

## Best Practices

### Security

1. **Never expose Service Role Key** in frontend code
2. **Use RLS policies** instead of service role key when possible
3. **Validate all inputs** before sending to API
4. **Use HTTPS** for all API calls (enforced by Supabase)
5. **Implement CSRF protection** for state-changing operations

### Performance

1. **Use select() wisely** - Only fetch columns you need
2. **Implement pagination** for large datasets
3. **Use single()** when expecting one result
4. **Cache static data** (categories, courses) in frontend
5. **Use indexes** on frequently queried columns

### Error Handling

1. **Always check for errors** in responses
2. **Provide user-friendly messages** for common errors
3. **Log errors** for debugging
4. **Implement retry logic** for transient failures
5. **Handle network errors** gracefully

### Real-time

1. **Unsubscribe** when components unmount
2. **Use specific filters** to reduce unnecessary updates
3. **Throttle** rapid updates in UI
4. **Handle reconnection** automatically (built-in)

---

## Conclusion

This API documentation covers all endpoints and features of the ScorePro E-Learning Platform. For implementation examples, see the frontend code in `scorepro-platform/src/`.

**Key Resources:**
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript)
- [PostgREST API Docs](https://postgrest.org/en/stable/api.html)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)

---

*API Documentation Version: 1.0*  
*Last Updated: October 23, 2025*  
*For questions or issues, consult Supabase documentation or contact support.*
