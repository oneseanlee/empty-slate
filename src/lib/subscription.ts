import { supabase } from './supabase';

// Subscription types
export type PlanType = 'free' | 'pro' | 'enterprise';

export interface UserSubscription {
  plan_type: PlanType;
  status: 'active' | 'trialing' | 'canceled' | 'past_due';
  course_limit: number;
}

// Get user's subscription status
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  try {
    // Try to get subscription from stripe_subscriptions table first
    const { data: subscription, error } = await supabase
      .from('stripe_subscriptions')
      .select(`
        status,
        stripe_plans!price_id (
          plan_type,
          monthly_limit
        )
      `)
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])
      .maybeSingle();

    // If stripe tables don't exist or subscription not found, check for user-specific flag
    if (error || !subscription) {
      // Try to get user profile that might contain subscription info
      const { data: user } = await supabase
        .from('users')
        .select('subscription_plan')
        .eq('auth_user_id', userId)
        .maybeSingle();

      // If user has a subscription plan set, use that
      if (user?.subscription_plan && user.subscription_plan !== 'free') {
        return {
          plan_type: user.subscription_plan as PlanType,
          status: 'active',
          course_limit: user.subscription_plan === 'enterprise' ? 87 : 87
        };
      }

      // Default to free plan
      return {
        plan_type: 'free',
        status: 'active',
        course_limit: 5
      };
    }

    if (subscription && subscription.stripe_plans && Array.isArray(subscription.stripe_plans) && subscription.stripe_plans.length > 0) {
      const plan = subscription.stripe_plans[0] as { plan_type?: string; monthly_limit?: number };
      return {
        plan_type: (plan.plan_type || 'free') as PlanType,
        status: (subscription.status || 'active') as 'active' | 'trialing' | 'canceled' | 'past_due',
        course_limit: plan.monthly_limit || 87
      };
    }
    
    if (subscription && subscription.stripe_plans && !Array.isArray(subscription.stripe_plans)) {
      const plan = subscription.stripe_plans as { plan_type?: string; monthly_limit?: number };
      return {
        plan_type: (plan.plan_type || 'free') as PlanType,
        status: (subscription.status || 'active') as 'active' | 'trialing' | 'canceled' | 'past_due',
        course_limit: plan.monthly_limit || 87
      };
    }

    // No active subscription found, return free plan
    return {
      plan_type: 'free',
      status: 'active',
      course_limit: 5
    };
  } catch (error) {
    console.error('Subscription check error:', error);
    // Return free plan as fallback
    return {
      plan_type: 'free',
      status: 'active',
      course_limit: 5
    };
  }
}

// Check if user can access a course
export async function canAccessCourse(userId: string, courseId: string): Promise<boolean> {
  try {
    const subscription = await getUserSubscription(userId);
    
    // Pro and Enterprise users have full access
    if (subscription.plan_type === 'pro' || subscription.plan_type === 'enterprise') {
      return true;
    }

    // Free users: check if course is in free tier
    // Get course details
    const { data: course } = await supabase
      .from('courses')
      .select('id, display_order')
      .eq('id', courseId)
      .single();

    // First 5 courses (by display_order) are free for free users
    // If course display_order is less than 5, allow access
    if (course && (course.display_order ?? 0) < 5) {
      return true;
    }

    // Otherwise, check if user has completed fewer than 5 courses
    const { count } = await supabase
      .from('user_progress')
      .select('course_id', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Allow access if user hasn't reached the 5-course limit
    return (count || 0) < subscription.course_limit;
  } catch (error) {
    console.error('Access check error:', error);
    return false;
  }
}

// Check if user can access certificates
export async function canAccessCertificates(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription.plan_type === 'pro' || subscription.plan_type === 'enterprise';
}

// Check if user can access quizzes
export async function canAccessQuiz(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription.plan_type === 'pro' || subscription.plan_type === 'enterprise';
}

// Get feature access for display
export async function getFeatureAccess(userId: string) {
  const subscription = await getUserSubscription(userId);
  
  return {
    plan: subscription.plan_type,
    status: subscription.status,
    features: {
      allCourses: subscription.plan_type !== 'free',
      certificates: subscription.plan_type === 'pro' || subscription.plan_type === 'enterprise',
      allQuizzes: subscription.plan_type === 'pro' || subscription.plan_type === 'enterprise',
      prioritySupport: subscription.plan_type === 'pro' || subscription.plan_type === 'enterprise',
      whiteLabel: subscription.plan_type === 'enterprise',
      businessTraining: subscription.plan_type === 'enterprise',
      coaching: subscription.plan_type === 'enterprise',
    },
    courseLimit: subscription.course_limit,
  };
}
