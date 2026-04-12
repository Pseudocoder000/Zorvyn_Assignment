/**
 * 🔥 GEMINI API SETUP - GET FREE KEY IN 2 MINUTES
 */

/*

STEP 1: GET FREE GEMINI API KEY
================================

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key

That's it! Totally free, no credit card needed.


STEP 2: ADD TO .env FILE
========================

File: /Backend/.env

Add this line:
GEMINI_API_KEY=paste_your_key_here

Example:
GEMINI_API_KEY=AIzaSyDkghP3x4c5z9w2q1r0s9t8u7v6w5x4y3z

Save the file.


STEP 3: TEST IT
===============

Run:
  node test-gemini-parser.js

You should see:
  ✅ SUCCESS! Gemini extracted transactions
  [parsed JSON transactions]
  📊 Summary with amounts


STEP 4: IT'S READY
==================

The backend is already configured to use Gemini.
Just upload a file and it will work!

*/

export const SETUP = {
  apiKeyUrl: "https://makersuite.google.com/app/apikey",
  cost: "FREE",
  setup_time: "2 minutes",
  monthly_limit: "60 requests free",
  paid_plan: "$5 onwards"
};
