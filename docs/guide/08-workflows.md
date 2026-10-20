# 8. 工作流：让模型分步骤思考与写作

“先想清楚再动笔”能明显提高写作质量。传统预设靠一段“请先在 `<thinking>` 里思考……”来实现，思考内容和正文混在一起。AP 把这件事做成了**工作流**：你声明每一轮要经过哪些**阶段**，AP 负责让模型按顺序完成，实时显示每个阶段，并且只把正文写进聊天记录。

## 花瓣的四个工作流

| 工作流 | 阶段 | 特点 |
| --- | --- | --- |
| Linear（线性） | 提问（Freesia）→ 规划与建议（Petals）→ 写作（Freesia） | 日常使用 |
| Iterative（迭代） | 提问 → 建议 → 草稿 → 审阅与反馈（Petals）→ 修改定稿 | 质量更高，Token 更多；可以用另一种语言打草稿 |
| Edit（编辑） | 提问 → 建议 → 写作 → 自检 → 精确修改 | 写完后自我检查，用“查找替换”修正问题 |
| Task（任务） | 思考 → 输出（可选） | 处理 `@Freesia` 元指令、代写、总结，自动使用 |

用户在“配置”页选择故事工作流；任务工作流由 AP 在需要时自动使用。

## 阶段

每个阶段说明四件事：

- **谁来做**（actor）：花瓣有 Freesia（叙述者）和 Petals（编辑）两个角色。让不同角色负责不同阶段，模型更容易从不同视角审视故事；
- **做什么**（kind）：
  - **文本**（`text`）：思考、提问、建议、审阅——过程性的内容；
  - **正文**（`content`）：故事本身。最后一个正文阶段的内容就是这一轮的回复；
  - **修改**（`patch`）：对已写好的正文做“把 A 换成 B”的精确修改；
- **叫什么**（label）：显示在界面上的名称，如“Asking Questions”；
- **是否可选**（optional）、**何时出现**（when）：比如修改阶段可以为空；某个阶段只在某参数设置后出现。

正文阶段之前的阶段，就是这一轮的“思维链”。它们显示在消息上方（可以折叠），**不会**作为聊天记录发给下一轮，所以不占用后续的 Token。

## 工作流文件

工作流是 `workflows/` 下的一个 Markdown 文件：开头的设定声明阶段，正文分成几个**段落**（section），告诉模型每个阶段该怎么做。花瓣 Linear 的骨架：

```markdown
---
id: linear
name: Linear
description: Questions → planning → final draft. The everyday workflow.
hint: (Typically, {{ap::name::narrator}} consults {{ap::name::editor}} …)
stages:
  - { id: questions, actor: narrator, kind: text,    label: Asking Questions }
  - { id: planning,  actor: editor,   kind: text,    label: Planning and Creative Input }
  - { id: final,     actor: narrator, kind: content, label: Drafting }
---
<!-- @section intro style=dialogue -->
（开场：Freesia 召唤 Petals……）

<!-- @section stage:questions style=dialogue -->
{{ap::prefix::narrator}}I will initialize the workflow by asking {{ap::name::editor}} a series of questions …

<!-- @section stage:questions style=imperative -->
Ask {{ap::name::editor}} every item under `Mandatory questions` …

（planning、final 同理）

<!-- @section outro style=dialogue -->
{{ap::prefix::user}}Here's a summary of the workflow.
{{ap::workflow::summary}}
If everything is clear, you may begin your workflow now.
```

段落有四种：

| 段落 | 位置 | 用途 |
| --- | --- | --- |
| `preamble` | 最前面 | 背景说明，比如 Edit 工作流的“编辑系统”规则 |
| `intro` | 阶段说明之前 | 开场白 |
| `stage:<阶段id>` | 每个阶段一段 | 这个阶段要做什么 |
| `outro` | 最后 | 总结、“现在开始” |

每个段落可以标注 `style=dialogue` 或 `style=imperative`，只在对应写法下出现；不标注则两种写法都用。花瓣的对话式段落写成 Freesia、Petals 和用户之间的剧本，指令式段落是简明的步骤说明。指令式下，AP 还会在每个阶段说明前自动加一个标题，比如花瓣的：

```
### Step 1 · Asking Questions (Freesia) → `step1_questions`
```

整个工作流说明会合成一条消息，放进你指定的区域（花瓣是 `task`）。

### 两个方便的宏

- `{{ap::workflow::summary}}`：自动生成的流程概要，例如 `Start -> Asking Questions (Freesia) -> Planning and Creative Input (Petals) -> Drafting (Freesia) -> (End)`。阶段有条件时，概要只列出这一轮实际出现的阶段；
- `{{ap::workflow::hint}}`：工作流设定里的 `hint`，一句话描述流程，花瓣把它放在结尾的“现在开始工作流”里。

## 模型看到的字段名和工具名

指令式写法下，每个阶段对应一个 JSON 字段（结构化、工具）或一个工具（多工具）。它们的**名字和说明也是提示词**——模型会读它们来决定写什么。花瓣为每个阶段都写了专门的名字和说明：

```yaml
  - id: questions
    actor: narrator
    kind: text
    label: Asking Questions
    field: { name: "step{{n}}_questions", description: "{{ap::name::narrator}} asks {{ap::name::editor}} the questions for this turn. Questions only, no explanations." }
    tool:
      name: ask_questions
      description: "{{ap::name::narrator}} asks {{ap::name::editor}} the questions for this turn."
      param: { name: questions, description: "Mandatory questions and the relevant optional ones. Questions only, no explanations." }
```

`{{n}}` 是阶段序号。字段名带上序号（`step1_…`、`step2_…`）能提醒模型按顺序填写。没写的名字会使用预设的统一模板。

## 编辑工作流：写完再改

Edit 工作流在正文之后加了两个阶段：

1. **自检**（文本，标签 `<Freesia_Review>`）：对照写作指南找出问题；
2. **修改**（修改阶段，可选，标签 `<Freesia_Edit>`）：给出一组“原文 → 新文”的精确替换。

AP 会把这些替换应用到正文上；用户在界面上可以看到修改前后的差异，也可以退回到修改前的草稿。这种“写完再改”比“一次写对”更容易达到严格的格式要求。

## 任务工作流

用户用 `@Freesia` 和 Freesia 说话（不是在推进故事）时，或者请她代写、总结时，故事工作流就不合适了。这时 AP 自动改用**任务工作流**（设定里写 `kind: task`）。花瓣的任务工作流只有两个阶段：在 `<thinking>` 里思考，然后（只有被明确要求时）输出正文。具体的任务说明由元指令、代写、总结等模组提供（见[内置功能](09-built-in-features.md)）。

任务工作流也用于其他扩展或脚本发起的生成（比如某些插件请模型生成一段内容）。没有任务工作流时，这些情况会退回到故事工作流，`ap check` 会提醒你。

## 设计工作流的建议

- **质量与成本的平衡** 更多阶段可能提升质量，但花费 Token 和时间也更多。花瓣提供轻（Linear）、重（Iterative）、修（Edit）三档，让用户自己权衡；
- **每个阶段只做一件事**，并写清楚它的产出：提问阶段“只列问题，不解释”；建议阶段“回答问题并指出重复、陈词滥调”；
- **用角色分工制造视角差**：让“编辑”而不是“作者”来批评草稿，模型更愿意指出问题；
- **把要考虑的问题做成清单**：花瓣的提问阶段依赖一份问题清单，清单由各个模组共同提供（见[构建变量](10-build-variables.md)）；
- **第一个工作流就是默认工作流**，选一个最稳妥的放在最前面（或在 `workflowOrder` 里排序）。

下一章：[内置功能](09-built-in-features.md)。
