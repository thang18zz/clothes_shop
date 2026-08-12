---
name: hang_check
description: Detect indefinitely hanging background tasks. If a task is stuck, unresponsive, or waiting indefinitely for user input (such as authentication) and cannot be resolved programmatically, cancel the task and report the issue to the user immediately.
---

# Hang Check and Task Management

## Purpose
Use this skill to proactively manage background tasks that enter an unresponsive or infinitely hanging state, preventing the agent and the workflow from being deadlocked.

## Workflow

### 1. Identify Hanging Tasks
A background task may be considered "hanging" if:
- It has been running for an unusually long time without any new console output (e.g., `Last progress: never` or no updates for several minutes).
- The command executed is known to occasionally require interactive user input that cannot be provided via standard background execution (e.g., SSH key passwords, GitHub OAuth prompts, Git Credential Manager, interactive CLI prompts).

### 2. Check Task Status
Use the `manage_task` tool with `Action: status` to review the latest output of the suspected hanging task.
- Do NOT continuously poll the task in a loop. Check once if you suspect it is stuck based on the time elapsed.

### 3. Cancel the Task
If the task is confirmed to be hanging and you cannot resolve it programmatically (e.g., by sending input via `manage_task` with `Action: send_input`), you must abort it to free up system resources.
- Use the `manage_task` tool with `Action: kill` and the corresponding `TaskId`.

### 4. Report to the User
After killing the task, immediately notify the user. Your report MUST include:
- The command that was hanging.
- The likely reason it was stuck (e.g., waiting for authentication, interactive prompt).
- Clear, actionable instructions for the user to execute the command manually in their own terminal to bypass the interactive block.
