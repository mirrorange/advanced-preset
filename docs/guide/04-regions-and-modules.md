# 4. 区域、模组与条目：把提示词拆成积木

传统预设是一长串提示词。AP 换了一种思路：先把请求划分成几个**区域**，再把提示词拆成一个个**模组**，每个模组把自己的内容放进合适的区域。

## 区域：请求里的“格子”

**区域**是请求中的一段固定位置。你在 `preset.yaml` 里从上到下列出区域，它们在请求中的顺序也就是这个顺序。

花瓣预设的区域：

| 区域 | 放什么 | 说明 |
| --- | --- | --- |
| `top` | Freesia 的身份、核心要求 | 请求的开头 |
| `role` | 角色设定（Freesia 与 Petals 是谁） | |
| `mode` | 写作模式（续写 / 扩写）与“开场对话” | |
| `guidelines` | 写作指南：节奏、禁用表达、事件摘要格式…… | 整块包在 `<guidelines>` 标签里 |
| `writing_style` | 选中的文风 | 整块包在 `<writing_style>` 标签里 |
| `settings` | 角色卡、世界书、用户人设 | **原生区域**：由 ST 填入，AP 不写内容 |
| `history` | 剧情总结、最近的元指令对话 | 紧挨在聊天记录**之前** |
| （聊天记录） | ST 的聊天记录 | |
| `memory` | 聊天记忆、全局记忆 | 紧挨在聊天记录**之后** |
| `questions` | 本轮要考虑的问题清单 | |
| `task` | 工作流说明，或者元指令任务说明 | 工作流放在这里 |
| `bottom` | 最后的提醒：“现在开始工作流” | 请求的末尾 |

划分区域时考虑三件事：

1. **位置**：模型对开头和结尾的内容最敏感。身份放开头，“现在开始写”放结尾，需要“新鲜”的信息（记忆、当前状态）放在聊天记录之后；
2. **分组包裹**：同一类内容放在一个区域里，可以让 AP 把它们合并成一条消息，并包上一个标签（如 `<guidelines>…</guidelines>`），模型更容易理解“这些都是写作指南”；
3. **角色**：每个区域有默认的消息角色（system / user / assistant），大多数情况下用 system。

区域还有三个特殊标记，告诉 AP 聊天记录在哪里：

- **历史开始**（`historyStart`）：聊天记录之前的那个区域（花瓣是 `history`）；
- **历史结束**（`historyEnd`）：聊天记录之后的那个区域（花瓣是 `memory`）；
- **末尾**（`tail`）：请求最后的区域（花瓣是 `bottom`）。

另外要指定把**工作流说明**放进哪个区域（花瓣是 `task`）。

## 模组：一个功能一个文件

**模组**是一个 Markdown 文件，代表预设的一个功能或一组规则。比如花瓣的“节奏控制”：

```markdown
---
id: pacing-control
name: Pacing Control
group: guidelines
region: guidelines
order: 600
---
## Pacing Control

- **Preferred approach**: Focus on the immediate moment—current dialogue exchanges, ongoing actions, and subtle environmental or emotional details—rather than rushing toward future plot points.
- **Avoid**: Cramming multiple significant events, revelations, or emotional turning points into a single response.
```

`---` 之间的是模组的设定：

- `id`：模组的唯一名字（不写就用文件名），用户的开关状态就记在这个名字下面，发布后尽量不要改；
- `name` / `description`：面板上显示的名称和说明；
- `group`：在“模组”页显示在哪个分组下（见[下一章](05-switches-and-params.md)）；
- `region`：内容放进哪个区域；
- `order`：在区域里的先后，数字小的在前（默认 1000）。

`---` 下面就是提示词正文，原样交给模型。正文里可以使用 ST 的宏（`{{user}}`、`{{char}}`……），也可以使用 AP 的宏，例如 `{{ap::name::narrator}}` 会被替换成叙述者的名字（用户可以在“写作”页改名）。

### 为什么要拆成模组

- **可以开关**：每个模组都可以成为面板上的一个开关；
- **可以加条件**：整个模组可以只在某些情况下生效（见[条件](06-conditions.md)）；
- **好维护**：想改“节奏控制”，打开那一个文件就行；
- **好分享**：模组之间互不干扰，加一个新功能就是加一个新文件。

经验上，**一个模组讲一件事**。如果你发现一个模组里写了“节奏”“用词”“格式”三件事，而用户可能只想要其中一件，就把它拆开。

## 条目：一个模组往多个地方放内容

有时一个功能需要在几个位置各放一段话。比如花瓣的核心模组 `core` 既要在开头放身份说明，又要在结尾放“现在开始”的提醒。这时用 `<!-- @entry -->` 把模组分成几个**条目**，每个条目可以有自己的区域、顺序和条件：

```markdown
---
id: core
name: Core
toggle: always
---
<!-- @entry id=top-imperative region=top order=100 -->
You are {{ap::name::narrator}}, daughter of day and night, …

<!-- @entry id=bottom-imperative region=bottom order=900 -->
Start the workflow {{ap::workflow::hint}} now. Deliver every stage in order, exactly as the task section specifies.
```

`<!-- … -->` 是 HTML 注释的写法，这里被 AP 用作**指令**。不是指令的普通注释会作为文字保留，例如花瓣里的 `<!-- Workflow Indicator -->` 就是写给模型看的标记。

想给自己或协作者留说明、又不想发给模型时，写**注释** `<!--# … -->`（`<!--` 后面紧跟 `#`）。注释可以写在行内，也可以跨多行；里面的指令不会执行，所以也能用来临时停用一段内容：

```markdown
<!--# 这段是给 Claude 的预填充，改动前先看第 7 章 -->
<!-- @entry id=bottom-prefill region=bottom order=900 when='transport == "prefill"' -->
…

<!--#
旧版写法，暂时停用：
<!-- @if params.length > 0 -->Aim for about {{ap::param::length}} words.<!-- @end -->
-->
```

完整规则见 [指令参考](../reference/directives.md#注释)。

没有 `@entry` 的模组，整个正文就是一个条目，使用 frontmatter 里的 `region` 和 `order`。

## 区域里的内容怎样排列

同一个区域里，条目按 `order` 从小到大排；`order` 相同时按模组顺序排（可以在 `preset.yaml` 的 `moduleOrder` 里调整）。

区域的**合并方式**决定这些条目变成几条消息：

| 合并方式 | 效果 | 花瓣的例子 |
| --- | --- | --- |
| 不合并（默认） | 每个条目一条消息 | `role`、`mode`、`task` |
| 合并 | 所有条目拼成一条消息 | `top`、`memory` |
| 合并并包裹 | 拼成一条消息，再包上标签 | `guidelines` → `<guidelines>…</guidelines>` |

所以花瓣的写作指南虽然来自十几个模组，模型看到的却是一个整齐的块：

```
<guidelines>
## Language
…
## Pacing Control
…
## Event Synopsis
…
</guidelines>
```

### 换一个角色说话

条目默认使用区域的角色。如果某段内容需要以“用户”或“助手”的身份出现，比如一段示范对话，可以在正文中用 `<!-- @as user -->`、`<!-- @as assistant -->` 开始一条新消息：

```markdown
<!-- @as user -->
我们先确认一下写作要求。

<!-- @as assistant -->
好的，我会遵守以下要求……
```

花瓣的做法有些不同：它常常**在 system 消息里写对话**，比如

```
{{ap::prefix::user}}That's good. I have summarized some writing techniques for you, please adhere to them.
```

其中 `{{ap::prefix::user}}` 会变成 `{{user}}: `。这种“剧本式”的写法让整份提示词读起来像 Freesia、Petals 和用户之间的对话，是花瓣风格的一部分（见[两种写法](07-styles-and-transports.md)）。

## 原生内容放在哪里

角色卡、世界书、用户人设、示例对话这些 **ST 原生内容**，由 ST 自己填写。你在 `preset.yaml` 的 Carrier 设定里排好它们和各区域的相对顺序，AP 会生成一个对应的 ST 预设（下拉里的 `AP · <预设名>`）。也可以关掉不需要的 ST 原生条目，比如花瓣关闭了 ST 自带的“主提示词”和“越狱提示词”，因为这些功能已经由模组提供。

这部分通常建好一次就不用再动，交给 Agent 即可。

下一章：[开关、分组、单选与参数](05-switches-and-params.md)。
