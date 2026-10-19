---
id: linear
name: Linear
description: Plan, then write.
hint: (plan first, then write the content)
stages:
  - { id: plan, actor: narrator, kind: text, label: Planning }
  - { id: final, actor: narrator, kind: content, label: Writing }
---
<!-- @section intro style=dialogue -->
{{ap::prefix::user}}Let's confirm the workflow.

<!-- @section stage:plan style=dialogue -->
{{ap::prefix::narrator}}First I will outline the next scene in a few bullet points, considering:

{{ap::var::considerations::values}}

<!-- @section stage:plan style=imperative -->
Outline the next scene in a few bullet points, considering:

{{ap::var::considerations::values}}

<!-- @section stage:final style=dialogue -->
{{ap::prefix::narrator}}Then I will output <START_OF_CONTENT> and write the story.

<!-- @section stage:final style=imperative -->
Write the story content.

<!-- @section outro style=dialogue -->
{{ap::prefix::user}}Summary: `{{ap::workflow::summary}}`. Begin.

<!-- @section intro style=imperative -->
Complete these stages in order:
