---
name: ask_notebook
description: Whenever encountering a complex error or bug, use NotebookLM to research the issue by uploading the error context, adding relevant internet sources, and querying for a specific, actionable solution before attempting a fix.
---

# Ask NotebookLM for Error Resolution

## Purpose
Use this skill whenever you encounter a complex error, an unfamiliar bug, or a recurring issue that isn't immediately obvious. Instead of guessing or applying trial-and-error fixes, use NotebookLM as a dedicated research assistant to synthesize a precise solution.

## Workflow

When an error occurs, follow these steps systematically:

### 1. Capture Context
Gather the necessary context surrounding the error:
- Exact error message and stack trace.
- The specific code block causing the issue.
- Any relevant configuration files or environment details.

### 2. Upload Error to NotebookLM
Use the `nlm` CLI tool to upload the error context as a text source to the active project notebook.
```powershell
$errorNote = @"
[Insert Error Message & Code Context Here]
"@
nlm source add <notebook_id> --text $errorNote --title "Error Log: [Brief Error Description]" --wait
```

### 3. Supplement with Internet Sources (Optional but Recommended)
If the error pertains to a specific third-party library, framework bug, or complex concept, perform a web search to find the most relevant documentation, GitHub issues, or StackOverflow threads.
Add these URLs to the notebook to enrich its knowledge base:
```powershell
nlm source add <notebook_id> --url "https://github.com/..." --url "https://stackoverflow.com/..." --wait
```

### 4. Query the Notebook
Once the sources are processed, query the notebook to ask for a specific solution. Frame your question to ask for the root cause and a step-by-step fix.
```powershell
nlm query notebook <notebook_id> "Dựa vào log lỗi và các tài liệu vừa cung cấp, nguyên nhân cốt lõi gây ra lỗi là gì? Hãy đưa ra hướng dẫn từng bước và đoạn code cụ thể để khắc phục." --json
```

### 5. Review and Apply
- Review the synthesized solution from NotebookLM.
- Ensure it adheres to the project's architecture and `yagni` principles.
- Apply the fix and verify that the error is resolved.
