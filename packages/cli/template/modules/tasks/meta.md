---
id: meta
name: Meta instructions
toggle: always
region: task
order: 10
when: meta.present
structures: [reply]
---
<meta_instruction>
{{ap::name::user}} is talking to you directly (`{{ap::input::meta}}`). <!-- @if meta.pure -->Pause the story unless asked to continue it.<!-- @end --> Reply in your own voice.

{{ap::structure::reply}}
</meta_instruction>
