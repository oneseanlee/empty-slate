import json
import os
from typing import Dict, List
import requests

# Supabase configuration
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
    'Content-Type': 'application/json'
}

# Curriculum content mapping from the PDF
curriculum_data = {
    # Category 1: Getting Started (8 tutorials)
    "1.1": {
        "title": "Welcome to Your Credit Repair Journey",
        "duration": 20,
        "xp": 15,
        "topics": [
            "What is credit repair?",
            "Common myths vs. reality",
            "Your role in the process",
            "Timeline expectations (typically 3-6 months)",
            "Success factors",
            "Setting your goals"
        ]
    },
    "1.2": {
        "title": "Understanding Your Credit Score Basics",
        "duration": 30,
        "xp": 20,
        "topics": [
            "Credit score basics and ranges (300-850)",
            "FICO vs. VantageScore differences",
            "The five scoring factors explained",
            "Why you have multiple scores",
            "How lenders use your score",
            "Score ranges and their meanings"
        ]
    },
    "1.3": {
        "title": "How to Get Your Free Credit Reports",
        "duration": 25,
        "xp": 20,
        "topics": [
            "Your legal right to free reports",
            "AnnualCreditReport.com walkthrough",
            "Alternative free report sources",
            "How often to check your reports",
            "Avoiding credit report scams",
            "What to do after receiving reports"
        ]
    },
    "1.4": {
        "title": "The Three Credit Bureaus Explained",
        "duration": 25,
        "xp": 20,
        "topics": [
            "Credit bureau business model",
            "Equifax overview and contact info",
            "Experian overview and contact info",
            "TransUnion overview and contact info",
            "Why information differs between bureaus",
            "Bureau responsibilities under FCRA"
        ]
    },
    "1.5": {
        "title": "Reading Your Credit Report - First Look",
        "duration": 30,
        "xp": 25,
        "topics": [
            "Credit report structure overview",
            "Personal information section",
            "Account information section",
            "Inquiry section",
            "Public records section",
            "Bureau-specific formatting differences"
        ]
    },
    "1.6": {
        "title": "Common Credit Report Errors to Look For",
        "duration": 35,
        "xp": 25,
        "topics": [
            "Top 10 most common errors",
            "Duplicate account entries",
            "Incorrect payment history",
            "Wrong account balances",
            "Outdated negative items",
            "Identity errors and fraud indicators",
            "Mixed credit files"
        ]
    },
    "1.7": {
        "title": "Creating Your Credit Repair Action Plan",
        "duration": 45,
        "xp": 30,
        "topics": [
            "Credit situation assessment",
            "Prioritization framework",
            "Creating your 90-day roadmap",
            "Setting SMART goals",
            "Quick wins identification",
            "Progress tracking setup"
        ]
    },
    "1.8": {
        "title": "ScorePro Platform Introduction & Setup",
        "duration": 30,
        "xp": 20,
        "topics": [
            "Account creation and setup",
            "Dashboard overview",
            "Importing credit reports",
            "Setting up credit monitoring",
            "Configuring alerts",
            "Goal-setting features"
        ]
    }
}

print(f"Starting content generation for tutorial 1.1...")
print(f"Supabase URL: {SUPABASE_URL}")
print(f"Service key available: {bool(SUPABASE_SERVICE_KEY)}")
