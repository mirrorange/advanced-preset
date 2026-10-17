---
id: task
name: Task
kind: task
description: Used for pure meta instructions and script calls.
stages:
  - { id: thinking, actor: narrator, kind: text, tag: thinking, label: Thinking }
  - { id: content, actor: narrator, kind: content, optional: true, label: Output }
---
<!-- @section stage:thinking style=dialogue -->
First think inside `<thinking>` tags.

<!-- @section stage:thinking style=imperative -->
Think the task through.

<!-- @section stage:content -->
Then give the result. Story content only when explicitly requested.
