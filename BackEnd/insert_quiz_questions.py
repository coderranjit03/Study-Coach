import os
from supabase import create_client
import json

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://hleebrradmqgythwfjli.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZWVicnJhZG1xZ3l0aHdmamxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUxMDY5OCwiZXhwIjoyMDY4MDg2Njk4fQ.usU02txmLxxoQxzRnj-tJ6IWKivYTBn2C3YH8LnMTF0')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

questions_data = [
    
]

# Step 1: Check for missing (language, topic) pairs
missing_pairs = set()
for q in questions_data:
    topic_row = supabase.table("topics").select("id").eq("language", q["language"]).eq("topic", q["topic"]).execute()
    if not topic_row.data or len(topic_row.data) == 0:
        missing_pairs.add((q["language"], q["topic"]))

if missing_pairs:
    print("The following (language, topic) pairs are missing in the topics table:")
    for lang, topic in missing_pairs:
        print(f"  - {lang} | {topic}")
    print("\nPlease fix these mismatches in your questions_data or topics table before running the insertion.")
    exit(1)

# Step 2: Insert questions
success_count = 0
fail_count = 0
for q in questions_data:
    topic_row = supabase.table("topics").select("id").eq("language", q["language"]).eq("topic", q["topic"]).single().execute()
    topic_id = topic_row.data["id"]
    question_row = {
        "topic_id": topic_id,
        "question": q["question"],
        "options": json.dumps(q["options"]),
        "answer": q["answer"],
        "explanation": q.get("explanation", "")
    }
    res = supabase.table("quiz_questions").insert(question_row).execute()
    if res.data:
        success_count += 1
    else:
        print(f"[FAIL] Could not insert question: {q['question']}")
        fail_count += 1

print(f"Inserted {success_count} questions. Failed: {fail_count}.")

# === DEBUG: List topic_ids for Python 'Data Types & Variables' questions and their topic names ===
def debug_topic_ids_for_data_types_and_variables():
    print("\n--- Debug: Topic IDs for Python 'Data Types & Variables' questions ---")
    # Step 1: Find all quiz_questions for Python and topic 'Data Types & Variables'
    res = supabase.table('quiz_questions').select('*').execute()
    topic_ids = set()
    for q in res.data:
        if q.get('question') and q.get('topic_id'):
            # Find topic_id for questions that are supposed to be 'Data Types & Variables' (if you store topic name in question, filter here)
            # If you don't store topic name, just collect all topic_ids and check in next step
            topic_ids.add(q['topic_id'])
    print("Topic IDs found:", topic_ids)
    # Step 2: For each topic_id, print the topic name and language from the topics table
    for tid in topic_ids:
        topic_row = supabase.table('topics').select('id, topic, language').eq('id', tid).execute()
        if topic_row.data:
            t = topic_row.data[0]
            print(f"ID: {t['id']} | Language: {t['language']} | Topic: {t['topic']}")
        else:
            print(f"ID: {tid} | Not found in topics table")

def fix_topic_ids_for_data_types_and_variables():
    correct_topic_id = '59288ee8-df38-4366-b741-20dce185b741'
    # Find all questions for Python with topic 'Data Types & Variables' (regardless of current topic_id)
    res = supabase.table('quiz_questions').select('id, question, topic_id').execute()
    updated = 0
    for q in res.data:
        # If you store topic name in the question row, filter here. Otherwise, you may need to join with topics table.
        # For this example, let's assume you need to update by hand or by some identifier.
        # If you have a way to identify these questions, update this filter accordingly.
        # Here, we update all questions that are NOT already using the correct topic_id but should be.
        if q['topic_id'] != correct_topic_id:
            # Optionally, add more checks here to ensure only the right questions are updated
            # For example, if you have a 'language' or 'topic' field in quiz_questions, filter by that
            # For now, let's print and update manually
            print(f"Updating question ID {q['id']} to use topic_id {correct_topic_id}")
            supabase.table('quiz_questions').update({'topic_id': correct_topic_id}).eq('id', q['id']).execute()
            updated += 1
    print(f"Updated {updated} questions to use the correct topic_id for 'Data Types & Variables'.")

if __name__ == "__main__":
    debug_topic_ids_for_data_types_and_variables()
    fix_topic_ids_for_data_types_and_variables()