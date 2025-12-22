-- Migration: create_award_xp_function
-- Created at: 1761088181

-- Function to award XP to users
CREATE OR REPLACE FUNCTION award_xp(
    p_user_id UUID,
    p_amount INTEGER,
    p_reason TEXT DEFAULT 'manual'
)
RETURNS TABLE (
    total_xp INTEGER,
    level INTEGER,
    current_streak INTEGER
) AS $$
DECLARE
    v_new_total_xp INTEGER;
    v_new_level INTEGER;
    v_current_streak INTEGER;
    v_last_activity DATE;
    v_today DATE;
BEGIN
    v_today := CURRENT_DATE;
    
    -- Get current XP data
    SELECT user_xp.total_xp, user_xp.current_streak, user_xp.last_activity_date
    INTO v_new_total_xp, v_current_streak, v_last_activity
    FROM user_xp
    WHERE user_xp.user_id = p_user_id;
    
    -- If no record exists, initialize
    IF v_new_total_xp IS NULL THEN
        INSERT INTO user_xp (user_id, total_xp, level, current_streak, last_activity_date)
        VALUES (p_user_id, 0, 1, 0, v_today);
        v_new_total_xp := 0;
        v_current_streak := 0;
    END IF;
    
    -- Add XP
    v_new_total_xp := v_new_total_xp + p_amount;
    
    -- Calculate level (100 XP per level)
    v_new_level := FLOOR(v_new_total_xp / 100) + 1;
    
    -- Update streak
    IF v_last_activity IS NULL OR v_last_activity < v_today THEN
        IF v_last_activity = v_today - INTERVAL '1 day' THEN
            -- Consecutive day
            v_current_streak := v_current_streak + 1;
        ELSIF v_last_activity IS NULL OR v_last_activity < v_today - INTERVAL '1 day' THEN
            -- Streak broken, restart
            v_current_streak := 1;
        END IF;
    END IF;
    
    -- Update user_xp
    UPDATE user_xp
    SET 
        total_xp = v_new_total_xp,
        level = v_new_level,
        current_streak = v_current_streak,
        last_activity_date = v_today,
        updated_at = NOW()
    WHERE user_xp.user_id = p_user_id;
    
    RETURN QUERY SELECT v_new_total_xp, v_new_level, v_current_streak;
END;
$$ LANGUAGE plpgsql;;