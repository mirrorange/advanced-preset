# 7. 两种写法与五种传输方式

不同模型“听懂”提示词的方式不一样。AP 支持五种**传输方式**——模型以什么形式交回它的输出。你不需要了解它们的技术细节，但需要知道：**同一段提示词，在不同传输方式下可能要换一种说法。**

## 五种传输方式

| 传输方式 | 面板名称 | 模型怎样输出 | 适合 |
| --- | --- | --- | --- |
| `prefill` | 预填充 | 整段对话被写成一条“助手预填充”，模型接着往下写 | 支持预填充的接口（如官方 DeepSeek、较早的 Claude） |
| `plaintext` | 纯文本 | 模型在一条回复里，用前缀（`Freesia:`、`Petals:`）或标签区分各个步骤 | 不支持预填充、但能很好地遵守格式的模型 |
| `structured` | 结构化 | 模型输出一个 JSON 对象，每个步骤一个字段 | 支持结构化输出（`json_schema`）的接口 |
| `tool-single` | 工具 | 模型调用一次工具，把所有步骤填进参数 | 工具调用能力强的模型（Gemini、DeepSeek、新版 Claude） |
| `tool-multi` | 多工具 | 每个步骤一个工具，模型逐个调用 | 需要更强约束、愿意多花请求的场合 |

无论哪种方式，用户在聊天里看到的效果都一样：上方逐步展开的工作流阶段，中间的正文，下方的卡片（选项、事件摘要……）。区别只在“模型和 AP 之间怎么交接”。

AP 会根据你的工作流和功能自动生成 JSON Schema 和工具定义；字段名、工具名和它们的说明文字由你在预设里写（模型会看到它们，所以它们也是提示词的一部分，见[工作流](08-workflows.md#模型看到的字段名和工具名)）。

## 两种写法：对话式与指令式

五种传输方式可以归为两类写法（AP 称为 **style**）：

- **对话式**（`dialogue`）：预填充与纯文本。模型直接“说话”，提示词常写成角色之间的对话或剧本，用前缀标出谁在说话；
- **指令式**（`imperative`）：结构化、工具、多工具。模型填写字段或调用工具，提示词更适合写成清晰的指令：“在某某字段里写……”。

> 这是默认的对应关系，可以在 `preset.yaml` 的 `styles` 里改。

花瓣的同一个“开始工作流”提醒，两种写法分别是：

**对话式**（纯文本）——像剧本一样，让用户和 Freesia“对话”，并示范开头：

```
{{ap::prefix::user}}Next, You will speak just one sentence as Assistant. Output `<!-- Workflow Start -->` IMMEDIATELY after the Assistant prefix …

{{ap::prefix::narrator}}I will output only `<!-- Workflow Start -->` as Assistant, after which I will immediately resume the workflow starting from my prefix `{{ap::prefix::narrator}}`.

<!-- Workflow Indicator -->
```

**指令式**——一句清楚的指令：

```
Start the workflow {{ap::workflow::hint}} now. Deliver every stage in order, exactly as the task section specifies.
```

## 怎样为不同写法准备内容

有三种做法，从粗到细：

**1. 整个条目分开写**，用条件区分。花瓣的身份说明有三个版本：

```markdown
<!-- @entry id=top-prefill region=top order=100 when='transport == "prefill"' -->
（预填充版）

<!-- @entry id=top-plaintext region=top order=100 when='transport == "plaintext"' -->
（纯文本版：多了“Assistant 只输出 Workflow Start 标记”的说明）

<!-- @entry id=top-imperative region=top order=100 when='transport in ["structured", "tool-single", "tool-multi"]' -->
（指令式版：更简短，强调“每个阶段都交到指定的字段或工具里”）
```

**2. 条目中的一小段分开写**，用 `@style`：

```markdown
## Options

Suggest four next inputs for {{user}}.
<!-- @style dialogue -->
Write them after the story, in the format below.
<!-- @style imperative -->
Put them in the `options` field.
<!-- @end -->
```

连续两个 `@style` 表示切换，最后用 `@end` 结束。

**3. 只写一份**。大多数写作指南（节奏、禁用表达……）与输出格式无关，两种写法通用，不必分开。

### 让 AP 替你选格式说明

很多内置功能（选项、事件摘要、记忆……）本身就需要两种格式说明：对话式下“用某某标签包起来”，指令式下“填进某某字段”。你在功能的设定里把两种说明都写好，模组里只写一句 `{{ap::structure::options}}`，AP 会按当前写法放进对应的那一种（见[内置功能](09-built-in-features.md)）。

## 对话式的几个关键设定

对话式下，AP 靠**前缀**和**标签**来分辨模型写的是哪一步：

- **角色前缀**：每个角色有一个前缀，默认是“名字: ”（如 `Freesia: `）。模型写 `Petals: ` 开头的段落，AP 就知道这是 Petals 的阶段；如果模型开始写 `{{user}}: `，AP 会认为它在替用户说话，在那里截断；
- **正文标记**：模型在正文前输出 `<START_OF_CONTENT>`（可以改），AP 从这里开始把内容当作故事正文。花瓣在工作流的写作阶段说明里明确要求模型先输出这个标记；
- **阶段标签**：有些阶段用标签包起来更稳定，比如花瓣的审阅阶段 `<Freesia_Review>…</Freesia_Review>`；
- **预填充引导**：预填充模式下，聊天记录被改写成助手预填充之前，会有一条很短的用户消息（花瓣是 `<START_OF_STORY>`）。

这些都是在 `preset.yaml` 里设一次就好的东西，Agent 会帮你写。

## 示范轮次（工具模式）

工具模式下，可以在请求末尾放一轮“虚拟”的工具调用，向模型示范：先调用一个初始化工具，工具返回“现在请调用某某工具完成工作流”。这叫**示范轮次**。花瓣的 `start_workflow` 就是这样一个示范，它能明显提高 Gemini 等模型按要求调用工具的稳定性。用户可以在“配置”页选择用哪个示范轮次，或者不用。

## 选哪种传输方式

你不需要支持全部五种，但最好在推荐配置里为每类主要模型选好一种。花瓣的选择可以参考：

| 模型 | 花瓣的推荐 |
| --- | --- |
| Gemini | 工具（并行工具调用、思维签名、跳过思考） |
| DeepSeek | 工具，或官方 API 下的预填充 |
| Claude ≤ 4.5 | 预填充 |
| Claude 4.6 – 5 | 纯文本 |
| Claude ≥ 5.5 | 工具 |
| 其他 | 结构化输出，或工具 |

**每种你推荐的传输方式，都要实际测试过。**预览命令 `npx ap preview --transport <方式>` 可以快速检查每种方式下的提示词。

下一章：[工作流：让模型分步骤思考与写作](08-workflows.md)。
