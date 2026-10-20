# 2. 用 AI Agent 创建预设

## 为什么推荐用 Agent

一个 AP 预设既有“创作”的部分，也有“工程”的部分：

- **创作**：模型扮演谁、按什么步骤写、要遵守哪些写作原则、给用户哪些选择——这是只有你能决定的；
- **工程**：文件放在哪里、字段怎么拼写、条件怎么写、每种传输方式下格式是否正确、构建有没有报错；这些规则很多，但都是固定的。

Agent（能读写文件、运行命令的 AI 编程助手，例如 Codex、Claude Code、Cursor 等）非常擅长第二部分。AP 为它们准备了 **Agent Skills**，一组写给 Agent 看的说明书，教它如何设计、编写、测试 AP 预设。有了它们，你只需要用平常说话的方式描述想法，然后检查效果。

**大多数预设开发者不需要了解 AP 的技术细节。** 把精力放在提示词和功能设计上：你写提示词的内容，说明它在什么情况下出现；Agent 负责把它放进正确的文件、写对格式、跑通检查。

## 第一步：准备工具

你需要：

1. **Node.js**（20 或更高版本）：从 [nodejs.org](https://nodejs.org/) 下载安装 LTS 版本即可。AP 的开发工具 `ap` 运行在 Node.js 上。
2. **一个 AI Agent**：任选一个你能用的。它需要能在你的电脑上读写文件、运行命令。
3. **Git 与 GitHub 账号**（推荐）：用来保存历史版本、发布预设。不熟悉命令行可以用 [GitHub Desktop](https://desktop.github.com/)。
4. **SillyTavern 和 AP 扩展**：用来实际试用你的预设（安装方法见[仓库 README](../../README.md#安装)）。

## 第二步：创建预设仓库

任选一种方式。

**方式 A：用模板仓库（最简单）**

1. 打开 [advanced-preset-template](https://github.com/mirrorange/advanced-preset-template)，点击 **Use this template → Create a new repository**；
2. 把新仓库克隆（Clone）到电脑上；
3. 用 Agent 打开这个文件夹。

**方式 B：用命令创建**

在终端中运行（版本号换成 [Releases](https://github.com/mirrorange/advanced-preset/releases) 里的最新版本）：

```sh
npx --yes https://github.com/mirrorange/advanced-preset/releases/download/v1.5.0/advanced-preset-1.5.0.tgz init my-preset --name "我的预设" --author 你的名字
cd my-preset
npm install
```

两种方式得到的东西一样：一个可以直接构建的小预设，外加：

- `.agents/skills/`：AP 的 Agent Skills；
- `AGENTS.md`：告诉 Agent 先读这些技能；
- `.github/workflows/build.yml`：推送到 GitHub 后自动检查、构建，打标签时自动发布。

## Agent Skills

模板自带三个技能：

| 技能 | 什么时候用 | 它会做什么 |
| --- | --- | --- |
| `ap-preset-design` | 从零设计一个预设，或者大改结构 | 和你一起把想法整理成一份设计稿：角色、区域、模组清单、分组与单选、参数、工作流、内置功能、推荐配置 |
| `ap-preset-authoring` | 按设计稿写文件，或者做任何修改 | 编写 `preset.yaml`、模组、工作流和界面翻译；附带完整的参考文档 |
| `ap-preset-testing` | 修改之后、发布之前 | 运行检查、在各传输方式下预览组装结果、排查问题、准备发布 |

大多数 Agent 会自动发现 `.agents/skills` 下的技能，并在合适的时候使用。如果你的 Agent 不认识这个目录，直接告诉它“先阅读 `AGENTS.md` 和 `.agents/skills` 里的 `SKILL.md`”。

已有的预设仓库（比如不是从模板创建的，或者模板版本较旧）可以随时安装或更新技能：

```sh
npx ap skills install          # 安装到 .agents/skills（已存在的 ap-* 技能会被更新）
npx ap skills list             # 查看 CLI 自带了哪些技能
```

`npx ap` 使用的是仓库 `package.json` 中记录的 AP 版本。想要更新到最新的技能，先把 `package.json` 里 `advanced-preset` 的版本号改成最新版（或者让 Agent 帮你改），再 `npm install`。

## 第三步：告诉 Agent 你想要什么

第一次对话，先让 Agent 进入**设计**阶段，而不是直接写文件。可以这样说：

> 我想做一个 AP 预设。请使用 ap-preset-design 技能，先和我讨论设计，整理成 DESIGN.md，确认后再动手写。
>
> 我的想法：模型扮演一位叫“砚”的说书人，用章回体讲故事。要有三种文风可选（古典白话 / 现代通俗 / 武侠），可以设回复字数。每轮先列出本章要点，再写正文。希望每章结尾给出三个“下回分解”的选项。主要用 DeepSeek 和 Gemini。

Agent 会追问一些问题，比如：

- 说书人和用户是什么关系？
- 哪些规则总是生效，哪些让用户开关？
- 要不要支持 `@砚` 直接对话、记忆、剧情总结？
- 各个模型分别用哪种传输方式？

不用担心答不上来——说“你推荐什么？”就好，技能里有现成的设计建议，也会参考花瓣预设的做法。

设计稿确认后，再说：

> 按 DESIGN.md 实现这个预设，使用 ap-preset-authoring 技能。写完运行检查和预览。

## 第四步：边看边改

让 Agent 在后台运行开发服务器：

> 运行 `npm run dev`，保持它开着。

然后在 ST 中打开 AP 面板 → **调试** → **开发源**，填入 `http://localhost:4747`。之后每次 Agent 保存文件，预设都会自动重新构建并重新载入，你直接在 ST 里发消息看效果（详见[下一章](03-setup-and-live-preview.md)）。

改进时，描述**现象和期望**：

- “Gemini 下回复总是跳过要点直接写正文，帮我看看工作流说明是不是不够清楚。”
- “加一个‘慢节奏’开关，打开后要求每轮只推进一个场景。”
- “把三种文风改成单选，默认古典白话。”
- “我在 DeepSeek 预填充模式下看到了两次开场白，帮我预览一下 prefill 模式的组装结果。”

## 你应该亲自把关的事

Agent 可以保证文件格式正确，但**提示词好不好、模型写得好不好，只有你能判断**。建议你：

1. **亲自读一遍提示词**。让 Agent 运行 `npm run preview`，或在调试页看“最近组装”，确认模型实际看到的内容是你想要的；
2. **在每种计划支持的模型和传输方式下都试几轮**，包括重新生成、继续、`@` 元指令等；
3. **小步修改、经常提交**。一次只改一件事，好了就让 Agent 提交（commit），坏了可以退回；
4. **不要让 Agent 改动你不理解的大量提示词**。提示词的措辞是预设的灵魂，让 Agent 先说明打算怎么改。

## 不用 Agent 也可以

本指南后面的章节讲的都是概念和设计方法，同样适用于手写预设。手写时可以对照[模板](https://github.com/mirrorange/advanced-preset-template)和花瓣预设，并用 `npm run check` 检查错误——它的报错会指出文件和位置。

下一章：[准备环境与实时预览](03-setup-and-live-preview.md)。
