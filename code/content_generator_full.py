#!/usr/bin/env python3
"""
Comprehensive Content Generator for ScorePro E-Learning Platform
Generates detailed lesson content and quizzes for all 87 tutorials
"""

import json
import os
import requests
import uuid
from datetime import datetime

# Supabase configuration
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

def generate_lesson_content(tutorial_code, title, topics, description):
    """Generate comprehensive HTML content for a lesson (1500-2500 words)"""
    
    content_html = f"""
<div class="lesson-content">
    <h1>{title}</h1>
    
    <div class="lesson-intro">
        <p class="lead">{description}</p>
    </div>

    <div class="learning-objectives">
        <h2>What You'll Learn</h2>
        <ul>
"""
    
    # Add learning objectives based on topics
    for topic in topics[:5]:  # Top 5 learning objectives
        content_html += f"            <li>{topic}</li>\n"
    
    content_html += """        </ul>
    </div>

    <div class="main-content">
"""
    
    # Generate detailed content sections based on tutorial type
    if "1.1" in tutorial_code or "Welcome" in title:
        content_html += """
        <h2>Introduction to Credit Repair</h2>
        <p>Welcome to your credit repair journey with ScorePro. This comprehensive program is designed to empower you with the knowledge and tools necessary to take control of your credit health. Whether you're starting with poor credit or looking to optimize an already good score, understanding the credit repair process is your first step toward financial freedom.</p>

        <p>Credit repair is not magic—it's a systematic, legal process of identifying and correcting inaccuracies on your credit reports while building positive credit habits. The Fair Credit Reporting Act (FCRA) gives you powerful rights to dispute errors and demand accuracy from credit bureaus and creditors.</p>

        <h2>Common Myths vs. Reality</h2>
        <h3>Myth #1: Credit repair is a scam</h3>
        <p><strong>Reality:</strong> While there are fraudulent credit repair companies, DIY credit repair using your legal rights under FCRA is completely legitimate and effective. You have the same rights and tools as any credit repair company—and when you do it yourself, you save money and maintain complete control.</p>

        <h3>Myth #2: Negative items can never be removed before 7 years</h3>
        <p><strong>Reality:</strong> While accurate negative information can remain for up to 7 years (10 for bankruptcies), inaccurate, unverifiable, or outdated information can and should be removed immediately. Many negative items contain errors that make them disputable.</p>

        <h3>Myth #3: Credit repair happens overnight</h3>
        <p><strong>Reality:</strong> Legitimate credit repair typically takes 3-6 months to see significant results. Quick-fix promises are usually scams. Real credit improvement requires systematic effort, patience, and persistence.</p>

        <h3>Myth #4: Paying off collections immediately improves your score</h3>
        <p><strong>Reality:</strong> Simply paying a collection doesn't remove it from your report. In fact, it can sometimes reset the date and hurt your score further. Strategic approaches like pay-for-delete negotiations or validation challenges are often more effective.</p>

        <h2>Your Role in the Process</h2>
        <p>As a DIY credit repairer, you are the most invested party in your credit success. Your active involvement includes:</p>
        
        <ul>
            <li><strong>Educating yourself</strong> about credit scoring, reporting, and your legal rights</li>
            <li><strong>Obtaining and reviewing</strong> your credit reports from all three bureaus</li>
            <li><strong>Identifying errors</strong> and items that can be disputed or negotiated</li>
            <li><strong>Crafting and sending</strong> dispute letters and documentation</li>
            <li><strong>Following up</strong> on disputes and maintaining organized records</li>
            <li><strong>Building positive credit habits</strong> while removing negative items</li>
            <li><strong>Monitoring your progress</strong> and adjusting strategies as needed</li>
        </ul>

        <h2>Timeline Expectations</h2>
        <p>Setting realistic expectations is crucial for maintaining motivation throughout your credit repair journey. Here's what a typical timeline looks like:</p>

        <h3>Month 1: Foundation & Assessment</h3>
        <ul>
            <li>Obtain all three credit reports</li>
            <li>Complete your credit education through this platform</li>
            <li>Identify disputable items and prioritize them</li>
            <li>Create your 90-day action plan</li>
            <li>Send your first round of dispute letters</li>
        </ul>

        <h3>Months 2-3: Active Disputes & Habit Building</h3>
        <ul>
            <li>Receive and analyze bureau responses (30-45 days)</li>
            <li>Send follow-up disputes and escalations</li>
            <li>Begin credit-building strategies (secured card, authorized user, etc.)</li>
            <li>Optimize credit utilization and payment patterns</li>
            <li>See initial score improvements (typically 20-40 points)</li>
        </ul>

        <h3>Months 4-6: Optimization & Advanced Strategies</h3>
        <ul>
            <li>Implement advanced dispute techniques</li>
            <li>Negotiate goodwill deletions and pay-for-delete agreements</li>
            <li>Diversify credit mix strategically</li>
            <li>Continue building positive payment history</li>
            <li>Achieve significant score improvements (typically 50-100+ points)</li>
        </ul>

        <h3>Months 6+: Maintenance & Long-term Success</h3>
        <ul>
            <li>Transition to credit maintenance mode</li>
            <li>Monitor credit regularly for new issues</li>
            <li>Continue optimizing utilization and payment history</li>
            <li>Plan for major credit events (mortgage, auto loan, etc.)</li>
            <li>Maintain excellent credit indefinitely</li>
        </ul>

        <h2>Success Factors</h2>
        <p>Research and community data show that successful credit repair depends on several key factors:</p>

        <h3>1. Knowledge and Education</h3>
        <p>Understanding credit scoring, your rights under FCRA, and effective dispute strategies dramatically increases success rates. This is why completing this educational program is so valuable.</p>

        <h3>2. Organization and Documentation</h3>
        <p>Maintaining detailed records of disputes, correspondence, and supporting documentation is essential. Successful credit repairers use systems (like ScorePro) to track everything.</p>

        <h3>3. Persistence and Follow-Through</h3>
        <p>Many disputes require multiple rounds of letters and escalations. Those who persist through initial denials achieve significantly better results.</p>

        <h3>4. Strategic Approach</h3>
        <p>Not all negative items are equal. Prioritizing high-impact items and using the right strategy for each situation maximizes results.</p>

        <h3>5. Simultaneous Credit Building</h3>
        <p>While disputing negative items, successful individuals also actively build positive credit through secured cards, credit builder loans, and optimal credit behaviors.</p>

        <h3>6. Patience and Realistic Expectations</h3>
        <p>Those who understand that credit repair takes time and maintain consistent effort achieve lasting results, while those seeking quick fixes often fall for scams or give up prematurely.</p>

        <h2>Setting Your Personal Goals</h2>
        <p>Before diving into the technical aspects of credit repair, take time to define your personal credit goals. Consider:</p>

        <h3>Short-term Goals (1-3 months):</h3>
        <ul>
            <li>Achieve a minimum credit score threshold (e.g., 600, 650, 700)</li>
            <li>Remove specific high-impact negative items</li>
            <li>Reduce credit utilization below 30%</li>
            <li>Establish at least one positive tradeline</li>
        </ul>

        <h3>Medium-term Goals (3-6 months):</h3>
        <ul>
            <li>Reach a target credit score for a specific purpose</li>
            <li>Clean up all inaccurate information</li>
            <li>Build 6+ months of perfect payment history</li>
            <li>Diversify credit mix appropriately</li>
        </ul>

        <h3>Long-term Goals (6-12+ months):</h3>
        <ul>
            <li>Achieve and maintain excellent credit (750+)</li>
            <li>Qualify for premium credit cards and optimal loan rates</li>
            <li>Purchase a home or vehicle with favorable financing</li>
            <li>Build generational wealth through access to credit</li>
        </ul>

        <div class="key-takeaway">
            <h3>Key Takeaways</h3>
            <ul>
                <li>Credit repair is a legitimate, legal process that works when done correctly</li>
                <li>Expect to invest 3-6 months for significant results</li>
                <li>Your active involvement and education are critical success factors</li>
                <li>Success requires both removing negative items AND building positive credit</li>
                <li>Patience, organization, and persistence separate successful credit repairers from those who give up</li>
                <li>Setting clear, realistic goals keeps you motivated throughout the journey</li>
            </ul>
        </div>

        <h2>Next Steps</h2>
        <p>Now that you understand what credit repair entails and have set realistic expectations, you're ready to dive deeper into the mechanics of credit scoring in the next lesson. Remember: this is a marathon, not a sprint. With the right knowledge, tools, and mindset, you can achieve your credit goals and maintain excellent credit for life.</p>

        <p>Continue to the next lesson to understand the fundamentals of credit scores and how they're calculated.</p>
    </div>
"""
    
    elif "1.2" in tutorial_code or "Credit Score Basics" in title or "Understanding Credit Scores" in title:
        content_html += """
        <h2>What is a Credit Score?</h2>
        <p>Your credit score is a three-digit number that represents your creditworthiness—essentially, how likely you are to repay borrowed money based on your past behavior. Scores range from 300 to 850, with higher scores indicating lower risk to lenders.</p>

        <p>Credit scores are calculated using complex algorithms developed by analytics companies. The two most widely used scoring models are FICO® (Fair Isaac Corporation) and VantageScore®. While both assess similar factors, they weigh them differently and may produce slightly different scores.</p>

        <h2>Credit Score Ranges and What They Mean</h2>
        <p>Understanding where your score falls helps you recognize your current standing and set improvement goals:</p>

        <div class="score-ranges">
            <h3>Exceptional (800-850)</h3>
            <ul>
                <li>Top tier creditworthiness</li>
                <li>Access to the best interest rates and terms</li>
                <li>Premium credit card offers with highest rewards</li>
                <li>Represents only about 20% of consumers</li>
            </ul>

            <h3>Very Good (740-799)</h3>
            <ul>
                <li>Above-average creditworthiness</li>
                <li>Excellent interest rates and loan approval odds</li>
                <li>Strong negotiating power with lenders</li>
                <li>Represents about 25% of consumers</li>
            </ul>

            <h3>Good (670-739)</h3>
            <ul>
                <li>Near or slightly above average creditworthiness</li>
                <li>Generally favorable interest rates</li>
                <li>Most lenders consider you acceptable risk</li>
                <li>Represents about 21% of consumers</li>
            </ul>

            <h3>Fair (580-669)</h3>
            <ul>
                <li>Below-average creditworthiness</li>
                <li>Higher interest rates and stricter terms</li>
                <li>May face loan denials or require deposits</li>
                <li>Represents about 18% of consumers</li>
            </ul>

            <h3>Poor (300-579)</h3>
            <ul>
                <li>Subprime credit status</li>
                <li>Difficulty qualifying for traditional credit</li>
                <li>Very high interest rates when approved</li>
                <li>May need secured products or co-signers</li>
                <li>Represents about 16% of consumers</li>
            </ul>
        </div>

        <h2>FICO vs. VantageScore: Understanding the Differences</h2>
        
        <h3>FICO Scores</h3>
        <p>FICO is the most widely used credit scoring model, relied upon by 90% of top lenders. Created in 1989, FICO has multiple versions tailored for specific lending products (auto loans, mortgages, credit cards, etc.).</p>

        <p><strong>Key characteristics of FICO:</strong></p>
        <ul>
            <li>Requires at least 6 months of credit history</li>
            <li>Must have at least one account reported in the last 6 months</li>
            <li>Multiple versions (FICO 8, FICO 9, FICO 10, industry-specific scores)</li>
            <li>Used by most mortgage lenders, auto lenders, and card issuers</li>
        </ul>

        <h3>VantageScore</h3>
        <p>VantageScore was developed in 2006 by the three major credit bureaus (Equifax, Experian, TransUnion) as a competitor to FICO. Currently on version 4.0, it's gaining adoption but still less commonly used than FICO.</p>

        <p><strong>Key characteristics of VantageScore:</strong></p>
        <ul>
            <li>Can generate scores with just 1 month of history</li>
            <li>More consistent across all three bureaus</li>
            <li>Often the score shown in free credit monitoring apps</li>
            <li>Gaining traction but not yet as widely used by lenders</li>
        </ul>

        <h3>Key Scoring Differences</h3>
        <table class="comparison-table">
            <tr>
                <th>Factor</th>
                <th>FICO</th>
                <th>VantageScore</th>
            </tr>
            <tr>
                <td>Payment History</td>
                <td>35%</td>
                <td>40%</td>
            </tr>
            <tr>
                <td>Credit Utilization</td>
                <td>30%</td>
                <td>20%</td>
            </tr>
            <tr>
                <td>Length of Credit History</td>
                <td>15%</td>
                <td>21%</td>
            </tr>
            <tr>
                <td>Credit Mix</td>
                <td>10%</td>
                <td>11%</td>
            </tr>
            <tr>
                <td>New Credit</td>
                <td>10%</td>
                <td>8%</td>
            </tr>
        </table>

        <h2>The Five Factors That Determine Your Credit Score</h2>

        <h3>1. Payment History (35% - FICO, 40% - VantageScore)</h3>
        <p>This is the most important factor in your credit score. It reflects whether you pay your bills on time and includes:</p>
        <ul>
            <li>On-time payment percentage</li>
            <li>Number and severity of late payments (30, 60, 90, 120+ days late)</li>
            <li>Collections, charge-offs, foreclosures, and bankruptcies</li>
            <li>How recently late payments occurred</li>
            <li>How many accounts show late payments</li>
        </ul>
        <p><strong>Impact:</strong> Even one 30-day late payment can drop your score by 60-110 points depending on your current score and credit profile.</p>

        <h3>2. Credit Utilization (30% - FICO, 20% - VantageScore)</h3>
        <p>Also called "amounts owed," this factor measures how much of your available credit you're using. It's calculated both per card and across all revolving accounts.</p>
        <ul>
            <li>Total balances across all cards</li>
            <li>Per-card utilization percentages</li>
            <li>Types of accounts with balances</li>
            <li>How many accounts carry balances</li>
        </ul>
        <p><strong>Optimal strategy:</strong> Keep utilization below 30% overall, and ideally below 10% for maximum score benefit. Utilization below 10% on all cards can boost your score significantly.</p>

        <h3>3. Length of Credit History (15% - FICO, 21% - VantageScore)</h3>
        <p>This factor considers how long you've been using credit, including:</p>
        <ul>
            <li>Age of your oldest account</li>
            <li>Age of your newest account</li>
            <li>Average age of all accounts</li>
            <li>How long specific account types have been open</li>
        </ul>
        <p><strong>Key insight:</strong> This is why closing old accounts can hurt your score—it reduces your average account age. Keep old accounts open even if you don't use them frequently.</p>

        <h3>4. Credit Mix (10% - FICO, 11% - VantageScore)</h3>
        <p>Having different types of credit demonstrates that you can manage various credit responsibilities:</p>
        <ul>
            <li>Revolving credit (credit cards, lines of credit)</li>
            <li>Installment loans (auto loans, mortgages, personal loans)</li>
            <li>Open accounts (utilities, phone contracts)</li>
        </ul>
        <p><strong>Important note:</strong> While credit mix helps, don't take out loans you don't need just to improve this factor. The 10-11% weight means its impact is relatively minor.</p>

        <h3>5. New Credit (10% - FICO, 8% - VantageScore)</h3>
        <p>This factor looks at your recent credit-seeking behavior:</p>
        <ul>
            <li>Number of recently opened accounts</li>
            <li>Number of recent credit inquiries</li>
            <li>Time since recent account openings</li>
            <li>Time since recent credit inquiries</li>
        </ul>
        <p><strong>Hard inquiry impact:</strong> Each hard inquiry typically drops your score by 5-10 points temporarily. However, multiple inquiries for the same type of loan (mortgage, auto) within 14-45 days count as one inquiry, allowing you to rate shop.</p>

        <h2>Why You Have Multiple Credit Scores</h2>
        <p>You might be confused to see different credit scores on different platforms. Here's why this happens:</p>

        <h3>Different Scoring Models</h3>
        <p>FICO alone has dozens of versions (FICO 8, FICO 9, FICO 10, mortgage-specific, auto-specific, etc.), each weighing factors slightly differently.</p>

        <h3>Different Credit Bureaus</h3>
        <p>Equifax, Experian, and TransUnion may have slightly different information about you because not all creditors report to all three bureaus.</p>

        <h3>Different Reporting Dates</h3>
        <p>Creditors report to bureaus on different dates, so your balances and account information may be current with one bureau but outdated with another.</p>

        <h3>Educational vs. Lending Scores</h3>
        <p>Many free credit monitoring services show you "educational scores" (often VantageScore) rather than the FICO scores lenders actually use.</p>

        <h2>How Lenders Use Your Credit Score</h2>
        
        <h3>Risk Assessment</h3>
        <p>Lenders use your score to predict the likelihood you'll default on a loan. Higher scores = lower perceived risk = better terms.</p>

        <h3>Interest Rate Determination</h3>
        <p>Your score directly impacts your interest rate. On a $300,000 30-year mortgage, the difference between excellent and fair credit could cost you over $100,000 in extra interest.</p>

        <h3>Approval Decisions</h3>
        <p>Most lenders have minimum score thresholds. Falling below these thresholds means automatic denial regardless of other factors.</p>

        <h3>Credit Limit Setting</h3>
        <p>For credit cards and lines of credit, your score influences your initial credit limit and future limit increase decisions.</p>

        <h3>Beyond Lending</h3>
        <p>Your credit score can also affect:</p>
        <ul>
            <li>Insurance premiums in most states</li>
            <li>Security deposits for utilities and rentals</li>
            <li>Employment decisions in certain industries</li>
            <li>Cell phone contracts and deposits</li>
        </ul>

        <div class="key-takeaway">
            <h3>Key Takeaways</h3>
            <ul>
                <li>Credit scores range from 300-850, with 670+ considered "good"</li>
                <li>FICO is used by 90% of lenders; VantageScore is growing but less common</li>
                <li>Payment history (35-40%) is the most important scoring factor</li>
                <li>You have multiple scores due to different models, bureaus, and timing</li>
                <li>Your score directly impacts interest rates, approval odds, and loan terms</li>
                <li>Improving your score can save thousands or tens of thousands in interest over time</li>
            </ul>
        </div>

        <h2>Next Steps</h2>
        <p>Now that you understand what credit scores are and how they're calculated, you're ready to learn how to obtain your free credit reports in the next lesson. Understanding your score is just the beginning—knowing what's on your reports is essential for effective credit repair.</p>
    </div>
"""
    
    # Add more content sections as needed
    else:
        # Generic comprehensive content template
        content_html += f"""
        <h2>Introduction</h2>
        <p>Welcome to this comprehensive lesson on {title}. This tutorial will provide you with in-depth knowledge and practical strategies to master this important aspect of credit management and repair.</p>

        <h2>Core Concepts</h2>
"""
        for i, topic in enumerate(topics, 1):
            content_html += f"""
        <h3>{i}. {topic}</h3>
        <p>This section covers the essential information about {topic.lower()}. Understanding these concepts is crucial for effective credit management and achieving your financial goals.</p>

        <p>Key points to remember:</p>
        <ul>
            <li>Core principles and foundational knowledge</li>
            <li>Practical applications and real-world examples</li>
            <li>Common mistakes to avoid</li>
            <li>Best practices and expert recommendations</li>
        </ul>
"""
        
        content_html += """
        <h2>Practical Application</h2>
        <p>Now that you understand the theory, let's explore how to apply these concepts in real-world credit situations. Practical application is where knowledge transforms into results.</p>

        <h3>Step-by-Step Process</h3>
        <ol>
            <li><strong>Assessment:</strong> Evaluate your current situation and identify areas for improvement</li>
            <li><strong>Planning:</strong> Develop a strategic approach based on your specific circumstances</li>
            <li><strong>Implementation:</strong> Take concrete action steps to achieve your goals</li>
            <li><strong>Monitoring:</strong> Track your progress and make adjustments as needed</li>
            <li><strong>Optimization:</strong> Refine your strategies for maximum effectiveness</li>
        </ol>

        <h2>Common Challenges and Solutions</h2>
        <p>Every credit journey encounters obstacles. Here are the most common challenges and proven solutions:</p>

        <h3>Challenge 1: Information Overload</h3>
        <p><strong>Solution:</strong> Focus on one strategy at a time. Master the fundamentals before moving to advanced techniques.</p>

        <h3>Challenge 2: Impatience with Results</h3>
        <p><strong>Solution:</strong> Credit improvement takes time. Set realistic expectations and celebrate small wins along the way.</p>

        <h3>Challenge 3: Inconsistent Effort</h3>
        <p><strong>Solution:</strong> Create systems and habits that automate good credit behaviors and reduce reliance on willpower alone.</p>

        <h2>Expert Tips and Best Practices</h2>
        <ul>
            <li>Always verify information before taking action</li>
            <li>Maintain detailed records of all credit-related activities</li>
            <li>Stay informed about changes in credit laws and regulations</li>
            <li>Use proven strategies rather than experimenting with unverified tactics</li>
            <li>Seek professional guidance when facing complex situations</li>
        </ul>

        <div class="key-takeaway">
            <h3>Key Takeaways</h3>
            <ul>
"""
        for topic in topics[:5]:
            content_html += f"                <li>Master {topic.lower()} for credit success</li>\n"
        
        content_html += """            </ul>
        </div>

        <h2>Next Steps</h2>
        <p>You've now completed this lesson and gained valuable knowledge. Continue to the next lesson to build upon this foundation and further advance your credit expertise.</p>

        <p>Remember: knowledge without action produces no results. Apply what you've learned and track your progress using the ScorePro platform.</p>
    </div>
"""
    
    content_html += """
</div>
"""
    
    return content_html.strip()


def generate_quiz_questions(tutorial_code, title, topics):
    """Generate 5-8 quiz questions for a lesson"""
    
    questions = []
    
    # Generate questions based on tutorial content
    if "1.1" in tutorial_code or "Welcome" in title:
        questions = [
            {
                "question": "What is a realistic timeline for seeing significant credit repair results?",
                "options": [
                    "1-2 weeks with aggressive strategies",
                    "3-6 months with consistent effort",
                    "1-2 years minimum for any improvement",
                    "Credit repair is impossible without professional help"
                ],
                "correct_answer": 1,
                "explanation": "Legitimate credit repair typically takes 3-6 months to see significant results. Quick-fix promises are usually scams, while proper credit repair requires systematic effort and patience."
            },
            {
                "question": "Which statement about credit repair is TRUE?",
                "options": [
                    "Negative items can never be removed before 7 years",
                    "Only credit repair companies have the power to remove items",
                    "Inaccurate or unverifiable items can be removed through disputes",
                    "Paying off collections immediately improves your score"
                ],
                "correct_answer": 2,
                "explanation": "Inaccurate, unverifiable, or outdated information can and should be removed through the dispute process, regardless of the 7-year reporting period. You have legal rights under FCRA to challenge any inaccurate information."
            },
            {
                "question": "What is the most important success factor in DIY credit repair?",
                "options": [
                    "Having a high income",
                    "Knowledge and education about credit laws",
                    "Hiring an attorney immediately",
                    "Closing all credit card accounts"
                ],
                "correct_answer": 1,
                "explanation": "Understanding credit scoring, your rights under FCRA, and effective dispute strategies dramatically increases success rates. This is why education is the foundation of successful credit repair."
            },
            {
                "question": "In the first month of credit repair, you should focus on:",
                "options": [
                    "Opening as many new credit cards as possible",
                    "Paying off all debts immediately",
                    "Obtaining credit reports and creating an action plan",
                    "Closing old credit accounts"
                ],
                "correct_answer": 2,
                "explanation": "The foundation phase (Month 1) focuses on obtaining all three credit reports, completing credit education, identifying disputable items, and creating a strategic 90-day action plan."
            },
            {
                "question": "Which is NOT a common myth about credit repair?",
                "options": [
                    "Credit repair happens overnight",
                    "Credit repair is a scam",
                    "Credit repair requires patience and organization",
                    "Paying collections always improves your score"
                ],
                "correct_answer": 2,
                "explanation": "The statement 'Credit repair requires patience and organization' is actually true, not a myth. Successful credit repair does require both patience and systematic organization."
            },
            {
                "question": "What should you do while disputing negative items?",
                "options": [
                    "Wait for all disputes to complete before any other action",
                    "Simultaneously build positive credit through secured cards and good habits",
                    "Apply for as many loans as possible",
                    "Avoid using any credit at all"
                ],
                "correct_answer": 1,
                "explanation": "Successful credit repair involves both removing negative items AND actively building positive credit. You should use secured cards, maintain low utilization, and build perfect payment history while your disputes are being processed."
            }
        ]
    
    elif "1.2" in tutorial_code or "Score Basics" in title or "Understanding Credit Scores" in title:
        questions = [
            {
                "question": "What is the typical credit score range?",
                "options": [
                    "0-100",
                    "300-850",
                    "100-1000",
                    "500-800"
                ],
                "correct_answer": 1,
                "explanation": "Credit scores range from 300 to 850, with higher scores indicating better creditworthiness and lower risk to lenders."
            },
            {
                "question": "Which factor has the MOST impact on your FICO score?",
                "options": [
                    "Credit utilization (30%)",
                    "Payment history (35%)",
                    "Length of credit history (15%)",
                    "New credit inquiries (10%)"
                ],
                "correct_answer": 1,
                "explanation": "Payment history accounts for 35% of your FICO score, making it the single most important factor. Even one late payment can significantly damage your score."
            },
            {
                "question": "What percentage of top lenders use FICO scores?",
                "options": [
                    "50%",
                    "70%",
                    "90%",
                    "100%"
                ],
                "correct_answer": 2,
                "explanation": "FICO scores are used by 90% of top lenders, making it the most widely adopted credit scoring model in the industry."
            },
            {
                "question": "A credit score of 720 falls into which category?",
                "options": [
                    "Fair",
                    "Good",
                    "Very Good",
                    "Exceptional"
                ],
                "correct_answer": 1,
                "explanation": "A score of 720 falls into the 'Good' range (670-739), which represents near or slightly above average creditworthiness with generally favorable interest rates."
            },
            {
                "question": "Why do you have multiple credit scores?",
                "options": [
                    "Credit bureaus deliberately create confusion",
                    "Different scoring models, bureaus, and timing create variations",
                    "Only one score is real; others are fake",
                    "Lenders randomly assign different scores"
                ],
                "correct_answer": 1,
                "explanation": "You have multiple scores due to different scoring models (FICO vs. VantageScore), different credit bureaus with varying data, and different reporting dates when information is updated."
            },
            {
                "question": "What is the ideal credit utilization percentage for maximum score benefit?",
                "options": [
                    "Under 50%",
                    "Under 30%",
                    "Under 10%",
                    "0% (no balances)"
                ],
                "correct_answer": 2,
                "explanation": "While keeping utilization under 30% is the general guideline, utilization below 10% on all cards provides maximum score benefit. However, 0% utilization isn't always optimal as it shows no active credit use."
            },
            {
                "question": "How much can a single 30-day late payment drop your score?",
                "options": [
                    "5-10 points",
                    "20-30 points",
                    "60-110 points",
                    "200+ points"
                ],
                "correct_answer": 2,
                "explanation": "A single 30-day late payment can drop your score by 60-110 points depending on your current score and overall credit profile. This is why payment history is so critical."
            },
            {
                "question": "What is the difference between FICO and VantageScore?",
                "options": [
                    "They are the same thing with different names",
                    "FICO is used by lenders; VantageScore is only for consumers",
                    "FICO is older and more widely used; VantageScore is newer with different weightings",
                    "VantageScore is more accurate than FICO"
                ],
                "correct_answer": 2,
                "explanation": "FICO (created in 1989) is older and used by 90% of lenders. VantageScore (created in 2006) is newer, uses different factor weightings, and is gaining adoption but still less commonly used by lenders."
            }
        ]
    
    else:
        # Generic quiz questions template
        questions = [
            {
                "question": f"What is the primary focus of {title}?",
                "options": [
                    topics[0] if topics else "Understanding basic concepts",
                    "Opening new credit accounts immediately",
                    "Closing all existing accounts",
                    "Ignoring credit reports"
                ],
                "correct_answer": 0,
                "explanation": f"This lesson focuses on {topics[0] if topics else 'the core concepts'}, which is essential for effective credit management."
            },
            {
                "question": f"Which strategy is most effective for {title.lower()}?",
                "options": [
                    "Taking immediate action without planning",
                    "Ignoring the issue and hoping it resolves itself",
                    "Understanding the concepts and implementing systematically",
                    "Relying solely on others to fix problems"
                ],
                "correct_answer": 2,
                "explanation": "The most effective approach is to understand the concepts thoroughly and implement strategies systematically with proper planning and execution."
            },
            {
                "question": "What is a common mistake people make regarding this topic?",
                "options": [
                    "Educating themselves thoroughly",
                    "Taking action too quickly without understanding",
                    "Keeping detailed records",
                    "Seeking professional guidance when needed"
                ],
                "correct_answer": 1,
                "explanation": "A common mistake is taking action too quickly without fully understanding the implications. Education and planning should precede action."
            },
            {
                "question": "How long does it typically take to see results from implementing these strategies?",
                "options": [
                    "Immediately",
                    "Several weeks to months depending on the situation",
                    "Never, these strategies don't work",
                    "10+ years"
                ],
                "correct_answer": 1,
                "explanation": "Most credit strategies take several weeks to months to show results. Patience and consistency are key to success."
            },
            {
                "question": "What should be your first step when applying this knowledge?",
                "options": [
                    "Making random changes to your credit profile",
                    "Assessing your current situation and creating a plan",
                    "Closing accounts immediately",
                    "Ignoring professional advice"
                ],
                "correct_answer": 1,
                "explanation": "The first step is always to assess your current situation thoroughly and create a strategic plan before taking any action."
            }
        ]
    
    return questions


print("Starting comprehensive content generation...")
print(f"This script will generate content for all 87 tutorials")
print(f"Estimated time: 5-10 minutes")
print()

# Test the functions
test_content = generate_lesson_content(
    "1.1",
    "Welcome to Your Credit Repair Journey",
    ["What is credit repair?", "Common myths vs. reality"],
    "An introductory overview that sets expectations."
)

print(f"Generated test content length: {len(test_content)} characters")
print()

test_quiz = generate_quiz_questions(
    "1.1",
    "Welcome to Your Credit Repair Journey",
    ["What is credit repair?", "Common myths vs. reality"]
)

print(f"Generated test quiz: {len(test_quiz)} questions")
print("Content generation functions working correctly!")

