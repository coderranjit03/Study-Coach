# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
from DB.supabase_client import supabase

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.route("/generate-plan", methods=["POST"])
def generate_plan():
    data = request.get_json()
    goal = data.get("goal")
    days = data.get("duration", 30)
    start_date = data.get("startDate", "today")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
Generate a {days}-day structured study plan for achieving the goal: '{goal}'.
Start date is {start_date}.
Return the plan in the following exact format (not JSON, not markdown, not code block):

📆 Day 1: sun july 20 2025
**Introduction to Web Development**

Familiarize yourself with the basics of HTML, CSS, and JavaScript.
Install a code editor (e.g., Visual Studio Code, Sublime Text) and a web browser for testing (e.g., Google Chrome, Firefox).
Complete a beginner's tutorial or course for each language.

------------------------------------------------------------------------------------------

📆 Day 2: mon july 21 2025
**HTML Deep Dive**

Study more in-depth HTML topics such as forms, tables, lists, and embedded media.
Practice creating basic web pages and experiment with HTML structure.
Use a validator tool like the W3C Markup Validation Service to check your HTML.

---------------------------------------------------------------------------------------

Repeat this format for all days. Use bold (**) for the day title. Do NOT return JSON, code blocks, curly braces, or markdown. Do NOT use triple backticks. Do NOT include any explanation. Only return the formatted plan as shown above.

INCORRECT:
```
[
  {{ "day": 1, ... }}
]
```
CORRECT:
📆 Day 1: ... (as above)
"""

    payload = {
        "model": "mistralai/mistral-small-3.1-24b-instruct:free",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions",
                             json=payload, headers=headers)

    if response.status_code == 200:
        res_data = response.json()
        content = res_data.get("choices", [{}])[0].get("message", {}).get("content", "")
        return jsonify({"plan": content})
    else:
        return jsonify({"error": "Failed to generate plan"}), response.status_code

@app.route("/update-progress", methods=["POST"])
def update_progress():
    data = request.get_json()
    plan_id = data.get("plan_id")
    progress = data.get("progress")
    feedback = data.get("feedback")
    if not plan_id or progress is None:
        return jsonify({"error": "Missing plan_id or progress"}), 400
    update_data = {"progress": progress}
    if feedback is not None:
        update_data["feedback"] = feedback
    try:
        response = supabase.table("study_plan").update(update_data).eq("id", plan_id).execute()
        if response.data:
            return jsonify({"success": True, "data": response.data})
        else:
            return jsonify({"error": "Plan not found or not updated"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/adapt-plan", methods=["POST"])
def adapt_plan():
    print("Received /adapt-plan request")
    data = request.get_json()
    plan = data.get("plan")
    progress = data.get("progress")
    feedback = data.get("feedback")
    goal = data.get("goal")
    days = data.get("days")
    start_date = data.get("start_date")

    if not plan or progress is None:
        return jsonify({"error": "Missing plan or progress"}), 400

    # Prepare a prompt for the LLM
    prompt = f"""
You are an AI study coach. Here is the user's original study plan:
---
{plan}
---

Here is the user's progress (in JSON):
{progress}

Here is the user's feedback (if any):
{feedback}

The user's goal: {goal}
Total days: {days}
Start date: {start_date}

Adapt the plan as follows:
- Reschedule any incomplete or missed tasks to future days.
- Add review sessions for tasks marked as difficult or skipped.
- If the user found tasks too easy, increase the challenge slightly.
- If the user found tasks too hard, make them easier or break them down.
- Do not remove completed tasks, but mark them as done.
- Make sure the plan is clear and actionable.
Return the adapted plan in the following exact format (not JSON, not markdown, not code block):

📆 Day 1: sun july 20 2025
**Introduction to Web Development**

Familiarize yourself with the basics of HTML, CSS, and JavaScript.
Install a code editor (e.g., Visual Studio Code, Sublime Text) and a web browser for testing (e.g., Google Chrome, Firefox).
Complete a beginner's tutorial or course for each language.

------------------------------------------------------------------------------------------

📆 Day 2: mon july 21 2025
**HTML Deep Dive**

Study more in-depth HTML topics such as forms, tables, lists, and embedded media.
Practice creating basic web pages and experiment with HTML structure.
Use a validator tool like the W3C Markup Validation Service to check your HTML.

---------------------------------------------------------------------------------------

Repeat this format for all days. Use bold (**) for the day title. Do NOT return JSON, code blocks, curly braces, or markdown. Do NOT use triple backticks. Do NOT include any explanation. Only return the formatted plan as shown above.

INCORRECT:
```
[
  {{ "day": 1, ... }}
]
```
CORRECT:
📆 Day 1: ... (as above)
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "mistralai/mistral-small-3.1-24b-instruct:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    print("Sending request to OpenRouter API")
    response = requests.post("https://openrouter.ai/api/v1/chat/completions",
                             json=payload, headers=headers)
    print("OpenRouter API response:", response.text)
    if response.status_code == 200:
        res_data = response.json()
        content = res_data.get("choices", [{}])[0].get("message", {}).get("content", "")
        print("Returning to frontend:", {"adapted_plan": content})
        return jsonify({"adapted_plan": content})
    else:
        print("Returning to frontend error:", {"error": "Failed to adapt plan"})
        return jsonify({"error": "Failed to adapt plan"}), response.status_code

@app.route('/api/quiz-questions', methods=['GET'])
def get_quiz_questions():
    print("/api/quiz-questions called")
    language = request.args.get('language')
    topic = request.args.get('topic')
    print("Params:", language, topic)
    # Join quiz_questions with topics to filter by language and topic name
    query = supabase.table('quiz_questions').select('*, topics(topic, language)').execute()
    if hasattr(query, 'error') and query.error:
        print("Supabase ERROR:", query.error)
        return jsonify({"error": str(query.error)}), 500
    if not hasattr(query, 'data') or not query.data:
        print("No data returned from Supabase.")
        return jsonify([])
    print("All query data:", query.data)
    # Filter in Python since supabase-py does not support join+where easily
    filtered = [
        q for q in query.data
        if (
            (not language or (q.get('topics') and q['topics'].get('language') == language)) and
            (not topic or (q.get('topics') and q['topics'].get('topic') == topic))
        )
    ]
    print("Filtered questions:", filtered)
    return jsonify(filtered)

@app.route('/api/topics', methods=['GET'])
def get_topics():
    language = request.args.get('language')
    if not language:
        return jsonify({'error': 'Missing language parameter'}), 400
    try:
        response = supabase.table('topics').select('topic, topic_order').eq('language', language).order('topic_order').execute()
        topics = response.data if response.data else []
        return jsonify({'topics': topics})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/code-games', methods=['GET'])
def get_code_game():
    language = request.args.get('language')
    topic = request.args.get('topic')
    difficulty = request.args.get('difficulty')

    query = supabase.table('code_games').select('*')
    if language:
        query = query.eq('language', language)
    if topic:
        query = query.eq('topic', topic)
    if difficulty:
        query = query.eq('difficulty', difficulty)

    res = query.execute()
    games = res.data if hasattr(res, 'data') else []
    if not games:
        return jsonify({'error': 'No code games found'}), 404

    import random
    random.shuffle(games)
    selected_games = games[:10]
    return jsonify(selected_games)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
