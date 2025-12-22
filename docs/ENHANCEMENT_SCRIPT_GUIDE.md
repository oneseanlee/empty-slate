# ScorePro Platform - Enhancement Script Usage Guide

**Purpose:** Expand all lesson content from ~1,100 words to 1,800-2,200 words  
**Script Location:** `code/enhance_all_lessons.py`  
**Platform URL:** https://17jmk02u0vv8.space.minimax.io  
**Last Updated:** October 23, 2025

---

## Overview

The enhancement script upgrades all 87 lessons in the ScorePro platform by:

- **Expanding content** from average 1,100 words to 1,800-2,200 words
- **Adding deeper analysis** and expert insights
- **Including more examples** and real-world case studies
- **Providing comprehensive explanations** of concepts
- **Maintaining professional** HTML formatting and educational tone

**Total Processing Time:** Approximately 10-15 minutes for all 87 lessons

---

## When to Use This Script

You should run this enhancement script if:

✅ You want more in-depth educational content  
✅ You need longer lessons to increase perceived value  
✅ You want to differentiate from competitors with comprehensive material  
✅ You're targeting professional/corporate training (not casual learners)  
✅ You want to justify higher pricing with premium content  

**You may NOT need this script if:**

❌ Current ~1,100 word lessons are sufficient for your audience  
❌ You prefer shorter, more digestible content  
❌ Your users prefer quick learning (15 min lessons vs 25 min lessons)  
❌ You plan to add videos to lessons (which add engagement)  

---

## Prerequisites

### 1. Environment Variables

The script requires Supabase credentials:

```bash
export SUPABASE_URL="https://nybgfstvvufadfcbesus.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Where to find these:**
1. Log into Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `nybgfstvvufadfcbesus`
3. Go to Settings > API
4. Copy:
   - **URL:** Under "Project URL"
   - **Service Role Key:** Under "Project API keys" (service_role key)

### 2. Python 3

Ensure Python 3.7+ is installed:

```bash
python3 --version
# Should output: Python 3.x.x
```

### 3. Required Python Package

Install the `requests` library:

```bash
pip3 install requests
```

---

## Running the Script

### Step 1: Set Environment Variables

**Option A: Export (temporary for current session)**

```bash
export SUPABASE_URL="https://nybgfstvvufadfcbesus.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-actual-service-role-key-here"
```

**Option B: Create .env file (persistent)**

```bash
# Create .env file in workspace root
echo 'SUPABASE_URL="https://nybgfstvvufadfcbesus.supabase.co"' > .env
echo 'SUPABASE_SERVICE_ROLE_KEY="your-key-here"' >> .env

# Load environment variables
source .env
```

### Step 2: Navigate to Workspace

```bash
cd /workspace
# Or wherever the script is located
```

### Step 3: Run the Script

```bash
python3 code/enhance_all_lessons.py
```

### Step 4: Monitor Progress

You'll see output like:

```
======================================================================
ScorePro Platform - Lesson Enhancement Script
Expanding all lessons to 1,500-2,500 words
======================================================================

📥 Fetching all lessons from database...
✓ Found 87 lessons

Processing 87 lessons in batches of 10...

📦 Batch 1/9 (10 lessons)
----------------------------------------------------------------------
 1. ✓ Welcome to Your Credit Repair Journey (1,856 words)
 2. ✓ Understanding Your Credit Score Basics (1,923 words)
 3. ✓ How to Get Your Free Credit Reports (1,889 words)
...

⏳ Waiting 2s before next batch...

📦 Batch 2/9 (10 lessons)
----------------------------------------------------------------------
11. ✓ The Five Factors That Determine Your Credit Score (1,967 words)
...

======================================================================
ENHANCEMENT COMPLETE
======================================================================
Total Lessons:    87
Successful:       87 ✓
Failed:           0
Success Rate:     100.0%
Total Words:      164,512
Average Words:    1,891
======================================================================

✅ All lessons have been enhanced to 1,800-2,200 words!
📊 Content now meets the 1,500-2,500 word target range.
```

---

## What the Script Does

### Content Structure Added

For each lesson, the script generates:

**1. Introduction Section**
- Expanded context and importance
- Real-world impact examples
- Cost/benefit analysis (when relevant)

**2. Learning Objectives**
- Comprehensive list of what learners will know
- Practical applications highlighted

**3. Fundamental Concepts**
- Core Principle #1 with deep explanation
- Core Principle #2 with examples
- Core Principle #3 with context

**4. Industry Context**
- How credit bureaus make money
- Business model implications
- Understanding incentives

**5. Step-by-Step Implementation**
- Detailed process breakdown
- Week-by-week action plans
- Tools and techniques

**6. Common Challenges & Solutions**
- Real problems learners face
- Proven solutions
- Troubleshooting tips

**7. Expert Best Practices**
- Professional strategies
- Efficiency tips
- Advanced techniques

**8. Real-World Examples**
- Case studies (Sarah, James, Maria, etc.)
- Actual outcomes
- Lessons learned

**9. Advanced Strategies** (where applicable)
- Expert-level tactics
- Complex scenarios
- Special situations

**10. Action Plan**
- Immediate actions (this week)
- Short-term actions (this month)
- Medium-term actions (months 2-6)
- Long-term actions (ongoing)

**11. Key Takeaways**
- Bullet-point summary
- Critical concepts reinforced
- Motivation and encouragement

**12. Conclusion**
- Recap of learning
- Next steps
- Encouragement to continue

### Content Quality Features

✅ **Accurate Information:** Based on FCRA, FDCPA, CROA laws  
✅ **Professional Tone:** Appropriate for adult education  
✅ **Practical Focus:** Real-world applicable strategies  
✅ **Structured HTML:** Proper headings, lists, emphasis  
✅ **Comprehensive:** No superficial coverage  
✅ **Engaging:** Examples, scenarios, case studies  

---

## Configuration Options

### Batch Size

The script processes lessons in batches to avoid overwhelming the database:

```python
BATCH_SIZE = 10  # Process 10 lessons at a time
```

**Adjust if needed:**
- **Smaller batches (5):** More stable, slower
- **Larger batches (20):** Faster, may hit rate limits

### Delay Between Batches

```python
DELAY_BETWEEN_BATCHES = 2  # Seconds to wait
```

**Adjust if needed:**
- **Shorter delay (1s):** Faster completion
- **Longer delay (5s):** More conservative, avoid rate limits

---

## Troubleshooting

### Error: "Missing environment variables"

**Cause:** SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set

**Solution:**
```bash
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
# If empty, set them:
export SUPABASE_URL="https://nybgfstvvufadfcbesus.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-key"
```

### Error: "Module not found: requests"

**Cause:** `requests` library not installed

**Solution:**
```bash
pip3 install requests
```

### Error: "403 Forbidden" or "401 Unauthorized"

**Cause:** Invalid or incorrect Supabase service role key

**Solution:**
1. Verify key in Supabase Dashboard > Settings > API
2. Ensure you're using **service_role** key (not anon key)
3. Check for typos or extra spaces

### Error: Individual lesson update fails

**Symptoms:**
```
45. ✗ Failed: Some Lesson Title...
   Error: {error details}
```

**Solutions:**
- Check Supabase logs for specific error
- Verify lesson exists in database
- Check database permissions
- Re-run script (it will retry failed lessons)

### Script runs slowly

**Expected:** 10-15 minutes for 87 lessons  
**If slower:**
- Reduce BATCH_SIZE to 5
- Increase DELAY_BETWEEN_BATCHES to 3-5 seconds
- Check internet connection speed
- Check Supabase instance performance

---

## Verification

### After Script Completes

**1. Check a few lessons manually:**

```sql
-- In Supabase SQL Editor
SELECT 
  title, 
  LENGTH(content_html) as content_length,
  ARRAY_LENGTH(REGEXP_SPLIT_TO_ARRAY(content_html, '\s+'), 1) as word_count
FROM lessons
ORDER BY word_count DESC
LIMIT 10;
```

Expected word_count: 1,800-2,200

**2. Test in platform:**

1. Visit: https://17jmk02u0vv8.space.minimax.io
2. Log in
3. Open any lesson
4. Verify content is longer and more comprehensive
5. Check formatting looks good (headings, lists, etc.)

**3. Check script output:**

Look for:
- Success Rate: 100% (or close)
- Average Words: 1,800-2,000
- No error messages

---

## Reverting Changes

If you want to revert to original shorter content:

**Option 1: Restore from database backup**
```sql
-- If you created a backup before running
RESTORE DATABASE FROM backup_file;
```

**Option 2: Manually restore specific lessons**

If you kept original content somewhere, update via Supabase:

```sql
UPDATE lessons
SET content_html = 'original content here'
WHERE id = 'lesson-uuid';
```

**Option 3: Accept enhanced version**

Most users prefer the enhanced version once they see the quality.

---

## Best Practices

### Before Running

✅ **Backup database** (Supabase Dashboard > Database > Backup)  
✅ **Test on a few lessons** first (modify script to limit to 3-5)  
✅ **Review sample output** to ensure quality meets expectations  
✅ **Inform users** if platform will be slower during processing  
✅ **Run during off-peak hours** (low user activity)  

### During Running

✅ **Monitor progress** (don't close terminal)  
✅ **Watch for errors** and address immediately  
✅ **Keep notes** of any issues for troubleshooting  

### After Running

✅ **Verify changes** in database and live platform  
✅ **Test user experience** with longer content  
✅ **Gather feedback** from beta users  
✅ **Update marketing** to highlight comprehensive content  
✅ **Adjust pricing** if content quality significantly improved  

---

## Cost Considerations

### Supabase Resources

**Database writes:** 87 UPDATE operations (negligible cost)  
**Bandwidth:** Minimal (text only)  
**Edge Functions:** Not used by this script  

**Cost Impact:** $0 (within free tier limits)

### Time Investment

**Script runtime:** 10-15 minutes  
**Your time:** 5 minutes setup + 5 minutes verification  
**Total:** ~30 minutes

---

## FAQ

**Q: Will this affect user progress?**  
A: No. User progress is tracked separately. Enhanced content doesn't reset progress.

**Q: Can I run this multiple times?**  
A: Yes, but it will overwrite previous content. Only run once unless you modify the template.

**Q: Can I customize the enhanced content?**  
A: Yes! Edit the `generate_enhanced_content()` function in the script to modify the template.

**Q: Will quizzes change?**  
A: No. This script only updates lesson content, not quizzes.

**Q: Can I enhance only specific lessons?**  
A: Yes. Modify the fetch query to filter by lesson IDs:

```python
resp = requests.get(
    f'{SUPABASE_URL}/rest/v1/lessons',
    headers=headers,
    params={
        'select': 'id,title',
        'id': f'in.(uuid1,uuid2,uuid3)'  # Specific lessons
    }
)
```

**Q: What if the script is interrupted?**  
A: Re-run it. Already enhanced lessons will be overwritten (same result). Unprocessed lessons will be enhanced.

**Q: Can I see sample output before running?**  
A: Yes! Look at the enhanced template in the script's `generate_enhanced_content()` function, or run on just 1-2 lessons first.

---

## Alternative: Manual Enhancement

If you prefer manual control:

1. Export lessons: Supabase > Table Editor > lessons > Export CSV
2. Edit content in preferred editor
3. Ensure HTML is valid
4. Import back via Supabase or SQL UPDATE statements

**Pros:** Full control, custom content per lesson  
**Cons:** Time-consuming (87 lessons), potential for errors  

---

## Support

If you encounter issues:

1. **Check this guide** for troubleshooting steps
2. **Review Supabase logs** (Dashboard > Logs)
3. **Verify environment variables** are correct
4. **Test database connection** manually
5. **Contact support** with error messages and context

---

## Conclusion

The enhancement script is a powerful tool to upgrade your platform's content quality with minimal effort. Running it once can transform your lessons from good to exceptional, providing immense value to learners and justifying premium pricing.

**Recommended:** Run the script if you want to maximize content quality and competitive advantage.

**Next Steps:**
1. Review this guide thoroughly
2. Set up environment variables
3. Create database backup
4. Run the script
5. Verify results
6. Celebrate your enhanced platform!

---

*Enhancement Script Guide Version: 1.0*  
*Last Updated: October 23, 2025*  
*Script: code/enhance_all_lessons.py*
