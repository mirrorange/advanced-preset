# 6. 条件：让提示词随情况变化

开关由用户决定，**条件**由当时的情况决定：用的是哪种传输方式、用户这一轮说了什么、某个参数有没有填写……条件为真，内容就出现；为假，内容就消失。用户不需要做任何事。

## 三个可以写条件的地方

| 位置 | 写法 | 控制范围 |
| --- | --- | --- |
| 模组 | frontmatter 里的 `when:` | 整个模组（包括它带来的[结构](09-built-in-features.md)和[构建变量](10-build-variables.md)） |
| 条目 | `<!-- @entry … when="…" -->` | 这一个条目 |
| 正文中的一段 | `<!-- @if 条件 -->` … `<!-- @else -->` … `<!-- @end -->` | 中间这段文字 |

模组、条目两层条件都为真，条目才会出现。

## 条件长什么样

条件是一个很小的“判断句”。几个花瓣里的真实例子：

| 条件 | 意思 |
| --- | --- |
| `transport == "prefill"` | 当前传输方式是预填充 |
| `transport in ["structured", "tool-single", "tool-multi"]` | 当前传输方式是这三种之一 |
| `params.language != ""` | 用户填写了“回复语言” |
| `params.length > 0` | 用户设置了长度 |
| `modules.mode-preface` | “成人内容前言”模组是打开的 |
| `!modules.mode-preface` | ……是关闭的（`!` 表示“不是”） |
| `meta.present` | 用户这一轮使用了元指令 `@Freesia` |
| `!meta.pure && gen.type != "impersonate"` | 这一轮不是纯元指令，也不是代写 |
| `stages.questions` | 当前工作流里有“提问”这个阶段 |

规则只有几条：

- `==` 等于，`!=` 不等于，`>`、`>=`、`<`、`<=` 比大小；
- `in [ … ]` 属于其中之一；
- `&&` 并且，`||` 或者，`!` 不是，可以用括号 `( )` 组合；
- 文字用双引号或单引号括起来：`"prefill"`；数字、`true`、`false` 直接写。

## 常用的情况

下面是最常用的几类“情况”（完整列表见[参考文档](../reference/expressions.md)）：

| 写法 | 含义 | 常见用途 |
| --- | --- | --- |
| `transport` | 传输方式：`prefill`、`plaintext`、`structured`、`tool-single`、`tool-multi` | 不同传输方式用不同措辞 |
| `style` | 写法：`dialogue`（对话式）或 `imperative`（指令式） | 同上，更简洁（见[下一章](07-styles-and-transports.md)） |
| `workflow` | 当前工作流的 id | 某个工作流专用的说明 |
| `modules.<模组id>` | 某个模组是否生效 | 模组之间的配合 |
| `params.<参数id>` | 某个参数的值 | 只在用户设置后才出现的规则 |
| `stages.<阶段id>` | 当前工作流是否有这个阶段 | 只在有“提问”阶段时给出问题清单 |
| `meta.present` / `meta.pure` / `meta.mixed` | 有元指令 / 整条都是元指令 / 元指令夹在故事输入里 | 元指令相关的说明 |
| `meta.task` | 自动识别出的任务：`"summary"`（总结）或 `"impersonate"`（代写） | 总结、代写的专用说明 |
| `gen.type` | 生成类型：`normal`、`regenerate`、`swipe`、`continue`、`impersonate`…… | 代写时去掉写作指南 |
| `memory.hasChat` / `memory.hasGlobal` | 有没有聊天记忆 / 全局记忆 | 没有记忆时不放空标签 |
| `recap.present` | 有没有剧情总结 | 同上 |
| `input.shaped` | 本次输入是否被[整形](09-built-in-features.md#用户输入整形)（包裹或提取） | 只在有本次输入时放 `<input>` 标签 |
| `chat.group` | 是否是群聊 | 群聊专用规则 |

## 用 `@if` 控制一小段

整个条目都要变时用条目条件；只有一两句话不同时，用 `@if` 更方便：

```markdown
## Length

- Write about {{ap::param::length}} words.
<!-- @if params.lengthMode == "atLeast" -->
- It is fine to write more when the scene needs it.
<!-- @else -->
- Do not pad the content to reach the length.
<!-- @end -->
```

`@if` 可以嵌套，`@else` 可以省略。

## 写条件时的小陷阱

- **YAML 里的引号**：frontmatter 中，含有 `!` 或引号的条件要整个用单引号括起来：

  ```yaml
  when: '!meta.pure && gen.type != "impersonate"'
  ```

- **`@entry` 里的引号**：属性值用单引号括起来，里面就可以直接写双引号：

  ```markdown
  <!-- @entry id=top-prefill region=top when='transport == "prefill"' -->
  ```

  （花瓣用的是双引号加反斜杠 `when="transport == \"prefill\""`，效果相同。）

- **写错名字**：`params.langauge` 这种拼写错误会被 `npm run check` 发现并报错，所以每次改完记得检查。

## 设计建议

- **先想“谁需要它”**：一段规则只对某种传输方式、某个工作流、某种生成类型有意义时，就加上条件。少说无关的话，模型更专注；
- **元指令和代写要“安静”**：花瓣的文风、事件摘要、选项在纯元指令和代写时都不出现——这时模型不是在写故事，写作指南只会干扰它；
- **参数没填就不出现**：与其写“如果用户没有指定语言，就……”，不如直接让这条规则在没填时消失。

下一章：[两种写法与五种传输方式](07-styles-and-transports.md)。
