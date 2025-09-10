import os
from supabase import create_client, Client

# Set your Supabase URL and Key here or use environment variables
SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://hleebrradmqgythwfjli.supabase.co')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsZWVicnJhZG1xZ3l0aHdmamxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjUxMDY5OCwiZXhwIjoyMDY4MDg2Njk4fQ.usU02txmLxxoQxzRnj-tJ6IWKivYTBn2C3YH8LnMTF0')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

topics_data = [
    # Python
    *[("Python", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Operators & Expressions", "Control Flow (if, else, elif)", "Loops (for, while, break, continue)", "Functions & Arguments", "Modules & Packages", "File I/O", "Exception & Exception & Error Handling", "Data Structures (Lists, Tuples, Sets, Dicts)", "List/Dict Comprehensions", "Lambda & Higher-Order Functions", "Decorators", "Generators & Iterators", "OOP (Classes, Objects, Inheritance, Polymorphism)", "Magic Methods & Dunder Methods", "Context Managers", "Regular Expressions", "Multithreading & Multiprocessing", "Asyncio & Asynchronous Programming", "Virtual Environments & pip", "Testing (unittest, pytest)", "Logging & Debugging", "Type Hints & Annotations", "Advanced Modules (collections, itertools, functools, etc.)"
    ])],
    # JavaScript
    *[("JavaScript", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables (var, let, const)", "Operators & Expressions", "Control Flow (if, else, switch)", "Loops (for, while, do-while, for...in, for...of)", "Functions & Arrow Functions", "Scope & Closures", "Objects & Prototypes", "Arrays & Array Methods", "ES6+ Features (let/const, arrow functions, destructuring, spread/rest, etc.)", "Classes & OOP", "Promises & Async/Await", "Exception & Error Handling (try/catch/finally)", "DOM Manipulation", "Events & Event Handling", "Fetch API & AJAX", "Modules (import/export)", "Local Storage & Session Storage", "Regular Expressions", "Testing (Jest, Mocha)", "Webpack/Babel (basics)", "Advanced Patterns (currying, memoization, etc.)"
    ])],
    # C
    *[("C", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Operators & Expressions", "Control Flow (if, else, switch)", "Loops (for, while, do-while)", "Functions", "Arrays & Strings", "Pointers", "Structs & Unions", "File I/O", "Dynamic Memory Management (malloc, free)", "Preprocessor Directives", "Exception & Error Handling (errno, return codes)", "Bitwise Operations", "Recursion", "Modular Programming (header/source files)", "Linked Lists", "Stacks & Queues", "Trees & Graphs (basics)", "Advanced Memory Management"
    ])],
    # C++
    *[("C++", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Operators & Expressions", "Control Flow (if, else, switch)", "Loops (for, while, do-while)", "Functions & Overloading", "Arrays & Strings", "Pointers & References", "Structs & Unions", "Classes & Objects", "Inheritance & Polymorphism", "Templates (Function & Class)", "STL (Vectors, Maps, Sets, etc.)", "Exception Handling", "File I/O", "Namespaces", "Lambda Expressions", "Smart Pointers", "Move Semantics & Rvalue References", "Multithreading (std::thread, mutex, etc.)", "Advanced Memory Management"
    ])],
    # Java
    *[("Java", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Operators & Expressions", "Control Flow (if, else, switch)", "Loops (for, while, do-while, for-each)", "Methods & Overloading", "Arrays & Strings", "Classes & Objects", "Inheritance & Polymorphism", "Interfaces & Abstract Classes", "Exception Handling", "Collections Framework (List, Set, Map, etc.)", "Generics", "File I/O", "Threads & Concurrency", "Lambda Expressions & Streams", "Annotations", "Packages & Access Modifiers", "Inner & Anonymous Classes", "Java Memory Management (GC)"
    ])],
    # TypeScript
    *[("TypeScript", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Type Annotations", "Interfaces & Types", "Functions", "Classes & OOP", "Generics", "Enums", "Modules & Namespaces", "Type Inference", "Type Guards & Narrowing", "Advanced Types (Union, Intersection, etc.)", "Decorators", "Exception & Error Handling", "Working with JavaScript Libraries"
    ])],
    # C#
    *[("C#", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Operators & Expressions", "Control Flow (if, else, switch)", "Loops (for, while, do-while, foreach)", "Methods & Overloading", "Arrays & Collections", "Classes & Objects", "Inheritance & Polymorphism", "Interfaces & Abstract Classes", "Exception Handling", "LINQ", "Delegates & Events", "Generics", "File I/O", "Async & Await", "Properties & Indexers", "Namespaces & Assemblies", "Attributes", "Memory Management (GC)"
    ])],
    # Go
    *[("Go", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, else, switch)", "Loops (for)", "Functions & Multiple Return Values", "Pointers", "Structs & Interfaces", "Slices, Maps, Arrays", "Methods & Receivers", "Packages & Modules", "Exception & Error Handling", "Goroutines & Channels", "Concurrency Patterns", "File I/O", "Testing"
    ])],
    # Rust
    *[("Rust", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, match)", "Loops (for, while, loop)", "Functions", "Ownership & Borrowing", "References & Lifetimes", "Structs & Enums", "Traits & Trait Objects", "Pattern Matching", "Collections (Vec, HashMap, etc.)", "Exception & Error Handling (Result, Option)", "Modules & Crates", "Closures & Iterators", "Macros", "Concurrency & Threads", "Unsafe Rust"
    ])],
    # Kotlin
    *[("Kotlin", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, when)", "Loops (for, while, do-while)", "Functions & Lambdas", "Classes & Objects", "Inheritance & Interfaces", "Null Safety", "Collections & Generics", "Extension Functions", "Coroutines", "Exception Handling", "Data Classes", "Sealed & Enum Classes", "Type Aliases"
    ])],
    # Swift
    *[("Swift", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, switch)", "Loops (for, while, repeat-while)", "Functions & Closures", "Optionals", "Classes & Structs", "Enums", "Protocols & Extensions", "Generics", "Exception & Error Handling", "Memory Management (ARC)", "Pattern Matching", "Concurrency (async/await)"
    ])],
    # Dart
    *[("Dart", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, switch)", "Loops (for, while, do-while)", "Functions & Lambdas", "Classes & Objects", "Inheritance & Mixins", "Generics", "Collections", "Asynchronous Programming (Future, Stream, async/await)", "Exception Handling", "Libraries & Packages"
    ])],
    # Ruby
    *[("Ruby", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, unless, case)", "Loops (for, while, until, each)", "Methods & Blocks", "Arrays & Hashes", "Classes & Modules", "Inheritance & Mixins", "Exception Handling", "File I/O", "Regular Expressions", "Metaprogramming", "Gems & Bundler"
    ])],
    # Bash
    *[("Bash", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Variables & Parameters", "Control Flow (if, case)", "Loops (for, while, until)", "Functions", "File Operations (redirection, pipes)", "String Manipulation", "Arrays", "Process Management", "Scripting Best Practices", "Exception & Error Handling", "Regular Expressions (grep, sed, awk)"
    ])],
    # PowerShell
    *[("PowerShell", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Variables & Data Types", "Control Flow (if, switch)", "Loops (for, foreach, while, do-while)", "Functions & Scripts", "Cmdlets & Pipelines", "Objects & Properties", "File & Directory Operations", "Modules", "Exception & Error Handling", "Remoting", "Scripting Best Practices"
    ])],
    # Lua
    *[("Lua", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, elseif)", "Loops (for, while, repeat-until)", "Functions", "Tables", "Metatables & Metamethods", "Modules & Packages", "Coroutines", "Exception & Error Handling"
    ])],
    # R
    *[("R", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, else)", "Loops (for, while, repeat)", "Functions", "Vectors, Lists, Matrices, Data Frames", "Factors", "Data Import/Export", "Data Manipulation (dplyr, tidyr)", "Plotting & Visualization", "Statistical Analysis", "Packages", "Exception & Error Handling"
    ])],
    # Julia
    *[("Julia", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, else)", "Loops (for, while)", "Functions", "Modules & Packages", "Arrays & Tuples", "Multiple Dispatch", "Macros", "Metaprogramming", "Parallel & Distributed Computing", "Exception & Error Handling"
    ])],
    # MATLAB
    *[("MATLAB", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types & Variables", "Control Flow (if, switch)", "Loops (for, while)", "Functions & Scripts", "Matrices & Arrays", "Plotting & Visualization", "File I/O", "Toolboxes", "Simulink (basics)", "Exception & Error Handling"
    ])],
    # SQL
    *[("SQL", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Data Types", "SELECT Queries", "Filtering & Sorting", "Joins (INNER, LEFT, RIGHT, FULL)", "Aggregations (GROUP BY, HAVING)", "Subqueries", "Views", "Indexes", "Transactions", "Stored Procedures & Functions", "Triggers", "Exception & Error Handling"
    ])],
    # GraphQL
    *[("GraphQL", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Schemas & Types", "Queries", "Mutations", "Subscriptions", "Resolvers", "Fragments", "Directives", "Exception & Error Handling"
    ])],
    # HTML
    *[("HTML", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Elements & Attributes", "Forms & Input", "Tables", "Semantic HTML", "Multimedia (audio, video, images)", "Links & Navigation", "HTML5 APIs (basics)", "Accessibility"
    ])],
    # CSS
    *[("CSS", topic, i+1) for i, topic in enumerate([
        "Basics & Syntax", "Selectors & Specificity", "Box Model", "Colors & Units", "Typography", "Layout (Flexbox, Grid)", "Positioning", "Transitions & Animations", "Responsive Design", "Preprocessors (Sass, LESS - basics)", "Variables (Custom Properties)"
    ])],
]

# Flatten the list
all_topics = [
    {"language": lang, "topic": topic, "topic_order": order} for (lang, topic, order) in topics_data
]

# Bulk insert
for row in all_topics:
    supabase.table("topics").insert(row).execute()

print(f"Inserted {len(all_topics)} topics into the topics table.") 