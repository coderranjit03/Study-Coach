import os
from supabase import create_client

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://hleebrradmqgythwfjli.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZWVicnJhZG1xZ3l0aHdmamxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUxMDY5OCwiZXhwIjoyMDY4MDg2Njk4fQ.usU02txmLxxoQxzRnj-tJ6IWKivYTBn2C3YH8LnMTF0')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def seed_code_games():
    sample_games = [
        {
            'language': 'Python',
            'topic': 'Loops',
            'difficulty': 'basic',
            'type': 'fill_blank',
            'prompt': 'Complete the for loop to print numbers 0 to 4.',
            'code_snippet': 'for i in range(___):\n    print(i)',
            'answer': '5',
            'explanation': 'range(5) gives 0,1,2,3,4'
        },
        {
            'language': 'Python',
            'topic': 'Lists',
            'difficulty': 'basic',
            'type': 'output',
            'prompt': 'What is the output of this code?',
            'code_snippet': 'x = [1, 2, 3]\nprint(x[1])',
            'answer': '2',
            'explanation': 'x[1] is 2.'
        },
        {
            'language': 'Python',
            'topic': 'Strings',
            'difficulty': 'basic',
            'type': 'fill_blank',
            'prompt': 'Fill in the blank to concatenate two strings.',
            'code_snippet': 'result = "Hello" ___ "World"',
            'answer': '+',
            'explanation': 'Use + to concatenate strings.'
        },
        {
            'language': 'Python',
            'topic': 'Variables',
            'difficulty': 'basic',
            'type': 'output',
            'prompt': 'What is the output of this code?',
            'code_snippet': 'a = 10\nb = 5\nprint(a + b)',
            'answer': '15',
            'explanation': '10 + 5 = 15.'
        },
        {
            'language': 'Python',
            'topic': 'Conditionals',
            'difficulty': 'basic',
            'type': 'fill_blank',
            'prompt': 'Fill in the blank to check if x is greater than 5.',
            'code_snippet': 'if x ___ 5:\n    print("x is greater than 5")',
            'answer': '>',
            'explanation': 'Use > for greater than.'
        },
        {
            'language': 'Python',
            'topic': 'Functions',
            'difficulty': 'basic',
            'type': 'fill_blank',
            'prompt': 'Fill in the blank to define a function named greet.',
            'code_snippet': '___ greet():\n    print("Hello!")',
            'answer': 'def',
            'explanation': 'Use def to define a function.'
        },
        {
            'language': 'Python',
            'topic': 'Lists',
            'difficulty': 'basic',
            'type': 'output',
            'prompt': 'What is the output of this code?',
            'code_snippet': 'nums = [10, 20, 30]\nprint(len(nums))',
            'answer': '3',
            'explanation': 'The list has 3 elements.'
        },
        {
            'language': 'Python',
            'topic': 'Loops',
            'difficulty': 'basic',
            'type': 'output',
            'prompt': 'What is the output of this code?',
            'code_snippet': 'for i in range(3):\n    print(i * 2)',
            'answer': '0\n2\n4',
            'explanation': 'i=0:0, i=1:2, i=2:4.'
        },
        {
            'language': 'Python',
            'topic': 'Strings',
            'difficulty': 'basic',
            'type': 'output',
            'prompt': 'What is the output of this code?',
            'code_snippet': 's = "abc"\nprint(s.upper())',
            'answer': 'ABC',
            'explanation': 'upper() makes all letters uppercase.'
        },
        {
            'language': 'Python',
            'topic': 'Bug Fix',
            'difficulty': 'basic',
            'type': 'bug_fix',
            'prompt': 'Fix the bug so the function returns the sum of a and b.',
            'code_snippet': 'def add(a, b):\n    return a - b',
            'answer': 'return a + b',
            'explanation': 'The operator should be +, not -.'
        },
        {
            'language': 'Python',
            'topic': 'Write Code',
            'difficulty': 'basic',
            'type': 'write_code',
            'prompt': 'Write a function to return the square of a number.',
            'code_snippet': 'def square(x):\n    # your code here',
            'answer': 'return x * x',
            'explanation': 'return x * x returns the square.'
        },
    ]
    for game in sample_games:
        supabase.table('code_games').insert(game).execute()
    print('Sample code games inserted.')

if __name__ == "__main__":
    seed_code_games() 