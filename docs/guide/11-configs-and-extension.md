# 11. 推荐配置、插入点与界面翻译

这一章讲的是“预设怎样适应不同的用户”：不同模型用不同的推荐配置；用户想加自己的提示词时有固定的位置可放；中文用户看到中文界面。

## 推荐配置

**配置**是用户在“配置”页看到的那一组设定：传输方式、工作流、采样参数（温度等）、各模组的开关、参数、角色名称……AP 把配置分成三层：

1. **默认配置**：`preset.yaml` 里的 `configurationDefaults`，所有推荐配置的共同基础；
2. **推荐配置**：在默认配置的基础上“只写不同的地方”，比如“Gemini：传输方式改为工具，打开并行工具调用，打开跳过思考”；
3. **用户修改**：用户在面板上的改动，单独保存，可以另存为自己的配置。

预设更新时，前两层随预设更新，第三层保留。所以你可以放心地改进推荐配置，用户的个人设置不会丢。

花瓣有 8 套推荐配置（Gemini、DeepSeek 工具 / 预填充、三档 Claude、其他模型的结构化 / 工具），默认是“其他（结构化输出）”。一套推荐配置大致是这样：

```yaml
configurations:
  - id: gemini
    name: Gemini
    diff:
      sampling: { use_sysprompt: false }
      connection: { transport: tool-single, sendThoughtSignature: true, parallelTools: true, syntheticTurn: init-skip-thought }
      modules: { skip-thought: true }
```

设计推荐配置的建议：

- **按“用户会选的东西”命名**：用户知道自己用的是什么模型，但不一定知道“结构化输出”是什么；
- **默认配置要稳**：选一个大多数模型都能用的方案作为默认；
- **配置 id 发布后不要改**：用户选中的配置记在 id 下。

## 插入点：让用户加入自己的提示词

用户常常想加一点自己的东西：一条额外的写作规则、一个特定场景的提醒。AP 的“我的模组”允许用户在面板上写自己的模组，前提是你在预设里开放了**插入点**——明确告诉用户“这里可以放东西”。

花瓣开放了 6 个插入点：

| 插入点 | 位置 |
| --- | --- |
| After identity | 身份与核心说明之后 |
| After role | 角色设定之后 |
| Guidelines | 写作指南块内，内置指南之后 |
| Writing style | 文风块内，所选文风之后 |
| After history | 聊天记录与记忆之后，适合放当前状态或提醒 |
| Before task | 工作流说明之前 |

每个插入点指向一个区域和一个位置（`order`），用户的内容会跟随这个区域的合并方式，比如放进“Guidelines”的内容会出现在 `<guidelines>` 标签里面。

用户的模组可以：

- 设置触发条件：传输方式、工作流、参数、模组开关、关键词（本轮输入或最近几条消息，可以用正则），或者直接写条件表达式；
- 更新预设的[构建变量](10-build-variables.md)，比如往问题清单里加一个问题；
- 导出为 `*.ap-modules.json` 分享给别人。

设计插入点的建议：

- **少而精**：开放用户真正需要的几个位置，每个写清楚说明；
- **id 要稳定**：用户的模组记住的是插入点 id。以后调整区域结构时，保留旧 id，或者用[迁移](12-test-and-release.md#改名与迁移)把旧 id 映射到新 id。

### 模组模板：给用户一个起点

面对空白的编辑器，很多用户不知道该写什么、该放在哪个插入点。**模组模板**是你随预设附带的示例模组：用户点「新建模组」时，可以选择从空白开始，或者从某个模板开始。选中模板后，AP 复制一份给用户，之后就是用户自己的模组，随便改。

模板放在 `module-templates/` 目录，一个文件一个，写法和模组很像。花瓣的「自定义文风」模板（节选）：

```markdown
---
name: Custom writing style
description: Your own style guide in the writing style block, plus questions Freesia asks Petals before writing.
point: writing-style
when: '!meta.pure && gen.type != "impersonate"'
vars:
  mandatoryQuestions:
    custom-style: How should this part of the story apply the custom writing style in `<writing_style>`?
---
<!--#
How to use this template: rewrite the style guide below; edit the questions in "Build variables" …
-->
## Writing Style: Baimiao

…
```

- `point` 是插入点，正文就是要插入的内容；需要多个插入点时，用 `<!-- @entry point=… -->` 另起一段；
- `vars` 更新构建变量（这里给 Freesia 的提问清单加一个问题），`when` 成为用户模组的触发条件；
- 正文**原样**交给用户：`<!--# … -->` 注释会出现在用户的编辑器里，但不会发给模型——用它写“怎样修改”的说明正合适；
- 想给中文用户一份中文版，再写一个 `custom-style.zh-cn.md`（整份翻译）。

写模板时，给出一份能直接用的完整示例，而不是“在这里填写”的占位符；用 `npx ap preview --module-templates all` 看看它生效后的样子。完整规则见参考文档的[模组模板](../reference/user-modules.md#模组模板-module-templates)。

## 角色名称与前缀

`preset.yaml` 里的**角色**（actors）是参与写作的身份：叙述者、编辑、用户……每个角色有名字、前缀和界面颜色。用户可以在“写作”页改名，所有用到 `{{ap::name::…}}`、`{{ap::prefix::…}}` 的地方都会跟着变。所以提示词里提到角色时，**用宏，不要把名字写死**。

## 界面翻译

预设里的名称和说明（预设本身的名称与描述、模组名、分组名、参数说明、配置名……）通常用英文写。想让中文用户看到中文界面，在 `locales/zh-cn.yaml` 里写对应的翻译：

```yaml
name: 花瓣预设
description: 与小苍兰一起写故事吧！Freesia 写故事，Petals 提建议，双角色驱动的工作流
groups:
  style:
    label: 文风
    description: 选择一种主文风（也可不用）；NSFW 场景可额外叠加 Eros。
modules:
  mode-continuation:
    name: 续写
    description: 你的输入是故事的一部分；Freesia 从结尾处直接接着写，不复述你的内容。
```

翻译**只影响面板显示，不会进入提示词**。翻译文件里写了不存在的 id 时，`npm run check` 会提醒你。

## 主题颜色

`theme` 可以设置面板的主色和强调色（亮色、暗色各一套），角色的 `color` 决定界面上各角色阶段的颜色。花瓣用的是紫粉色系。

下一章：[测试、发布与更新](12-test-and-release.md)。
