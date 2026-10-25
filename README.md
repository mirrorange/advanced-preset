<div align="center">

# 🌸 Advanced Preset

**为 SillyTavern Chat Completion 设计的数据驱动预设引擎**

用 Markdown + YAML 编写预设；生成时由扩展接管请求，<br>
带来分阶段工作流、五种传输方式、结构化卡片、补丁编辑与 Token 节省。

[![npm](https://img.shields.io/npm/v/advanced-preset?label=ap%20cli&color=d6409f)](https://www.npmjs.com/package/advanced-preset)
[![license](https://img.shields.io/badge/license-MIT-8b5cf6)](LICENSE)
[![SillyTavern](https://img.shields.io/badge/SillyTavern-extension-2563eb)](https://github.com/SillyTavern/SillyTavern)

[安装](#-安装) · [功能](#-功能) · [编写预设](#-编写预设) · [文档](docs/README.md) · [开发](#-开发)

</div>

内置 [花瓣预设 v7](https://github.com/mirrorange/petals-preset)：与小苍兰一起写故事吧！Freesia 写故事，Petals 提建议。

## 📦 安装

在 SillyTavern 中打开 **扩展 → 安装扩展**，填入：

```
https://github.com/mirrorange/advanced-preset
```

然后：

1. 在对话补全预设下拉中选择 `AP · <预设名>`，启用对应的 AP 预设；
2. 预设下拉下方出现「当前预设使用 Advanced Preset」横幅，点击 **打开面板**（扩展设置中也有入口）。面板覆盖在 AI 响应配置抽屉之上。

> [!TIP]
> ST 的预设 **导入** 按钮可以直接导入 `.apreset.json`：安装为 AP 预设、自动选中并打开面板。选中 `AP · <预设名>` 时，**导出** 按钮导出 AP 预设本身（可再次导入），重命名与另存为按钮会隐藏。其他预设的导入导出保持 ST 原生行为。

扩展支持 ST 的自动更新；在扩展管理面板更新后会自动重新加载。

## ✨ 功能

| | |
| --- | --- |
| **传输** | 预填充 · 纯文本 · 结构化输出（`json_schema`）· 单步工具 · 多步工具；工具参数流式输出（含 Vertex AI Gemini 3+ 的 `streamFunctionCallArguments`） |
| **工作流** | 由预设声明的阶段序列（如 linear / iterative / edit / task），流式展示每个阶段 |
| **结构** | 回复、代写、选项、记忆、回顾、事件摘要、自定义结构，以卡片显示在消息下方 |
| **元指令** | `@叙述者 …` 触发任务回合；代写按钮直接走元指令 |
| **配置** | 推荐配置 ⊕ 用户差异（稀疏存储），采样参数与 Carrier 预设双向同步 |
| **我的模组** | 在预设开放的插入位置加入自己的提示词，可视化触发条件，可导入导出，随预设更新保留 |
| **多语言** | 面板中英双语；预设可翻译自己的名称、描述、模组、参数等面板文字 |
| **开发** | `ap dev` 本地热更新、组装预览、请求记录、事件日志 |

<details>
<summary><b>我的模组</b>：在不修改预设的前提下加入自己的提示词</summary>

面板「模组」页顶部的「我的模组」属于当前预设，内容插入到预设声明的插入位置（例如写作指南块内、任务之前）。

- 内容支持 `{{ap::…}}`、SillyTavern 宏与 `<!-- @if … -->` 等指令；可按条目选择消息角色。
- 触发条件全部或任一满足时生效：传输方式、工作流、参数、模组开关、关键词（本轮输入或最近 N 条消息，可用正则）或任意表达式；不设条件即始终生效。
- 可更新预设声明的构建变量（如「规划要点」）：字符串追加、列表添加项、字典设置键；与内置同键时以用户为准，值留空即移除该内置项。
- 可导出为 `*.ap-modules.json` 分享或备份；导入较旧版本预设的导出文件时按迁移表更新。
- 预设更新后模组原样保留：插入位置被改名时自动跟随，被移除时标出警告、该段内容暂不插入。

</details>

## ✍️ 编写预设

AP 预设就是一个普通的代码仓库：`preset.yaml` 加上若干 Markdown 模组与工作流，由 [`ap` 命令行](https://www.npmjs.com/package/advanced-preset)编译成 `dist/<id>.apreset.json`，用户通过链接或文件安装。

推荐的做法是 **让 AI Agent 帮你写**：你描述想要的效果，Agent 按 AP 自带的 Agent Skills 设计、编写、测试预设。

```sh
npx advanced-preset@latest init my-preset --name "我的预设"
cd my-preset && npm install
```

> 也可以在 [advanced-preset-template](https://github.com/mirrorange/advanced-preset-template) 页面点击 **Use this template** 创建仓库。

1. 用 Agent（Codex、Claude Code、Cursor、Gemini CLI……）打开仓库，说：“请使用 ap-preset-design 技能，先和我讨论设计。”
2. 运行 `npm run dev`，在 AP 面板 → **调试** → **开发源** 中填入 `http://localhost:4747`，边改边看。

| 文档 | 内容 |
| --- | --- |
| [预设开发指南](docs/guide/README.md) | 面向新手：概念、设计方法、用 Agent 开发、测试与发布，以花瓣预设为例 |
| [参考文档](docs/reference/README.md) | 面向高级开发者与 Agent：源码格式、编译规则、运行期行为的完整说明 |
| [Agent Skills](packages/cli/template/.agents/skills) | `ap-preset-design` / `ap-preset-authoring` / `ap-preset-testing`，模板自带，也可用 `npx ap skills install` 安装 |
| [`ap` 命令行](docs/reference/cli.md) | `build` / `check` / `dev` / `preview` / `init` / `skills` |

完整目录见 [docs/](docs/README.md)。

## 🛠️ 开发

```sh
pnpm install
pnpm build        # protocol → cli → 扩展，并写入 dist/build.json
pnpm test         # vitest
pnpm typecheck    # vue-tsc
```

- 修改内置预设后运行 `pnpm sync-presets`，把 `../petals-preset/dist` 同步到 `dist/presets/`；
- 修改 `docs/reference/` 或 `docs/guide/13-petals-case-study.md` 后运行 `pnpm sync-skills`，更新 Agent Skills 中的文档副本（`pnpm test` 会检查是否同步）；
- `dist/` 与 `packages/cli/dist/ap.js` 需随源码一起提交：ST 直接从仓库加载扩展（推送到 `dev` 时 CI 会自动重建并提交，功能分支仍需手动构建）。

<details>
<summary><b>仓库结构</b></summary>

| 路径 | 内容 |
| --- | --- |
| `src/` | 扩展本体（Vue 3 + TS，Shadow DOM UI） |
| `src/core/` | 生成管线：分类、组装、拦截、Orchestrator、传输驱动、响应编码 |
| `src/store/` | 设置、预设、配置层、Carrier、Sidecar、事件日志 |
| `src/ui/` | 阶段面板、卡片、设置面板与主题 |
| `packages/protocol/` | 预设协议：表达式、宏、结构、工作流、解析器、补丁、配置层（扩展与 CLI 共用，不单独发布） |
| `packages/cli/` | npm 包 `advanced-preset`（`ap` 命令，打包为自包含的 `dist/ap.js`）；`template/` 是 `ap init` 的模板，含 Agent Skills |
| `docs/` | 预设开发指南与参考文档 |
| `dist/` | 扩展构建产物与内置预设 |

</details>

### 发布

1. 同步修改 `package.json`、`manifest.json`、`packages/cli/package.json` 中的版本号，`pnpm build` 后提交；
2. 推送 `v<版本>` 标签。GitHub Actions（[`release.yml`](.github/workflows/release.yml)）会检查标签与版本号一致、运行测试与类型检查、通过 npm Trusted Publishing 发布 `advanced-preset`，并创建 GitHub Release。

### dev 预发布

功能分支合并进 `dev` 并推送后，同一工作流会：

1. 构建、类型检查、测试；`dist/` 与已提交的不同时由 `github-actions[bot]` 自动提交 `build: rebuild dist`；
2. 若 CLI（`packages/`、`pnpm-lock.yaml`）自上一个 dev 版本以来有变化，以 `dev` 标签发布预发布版本到 npm，版本号为 `<下一补丁版本>-dev.<UTC 时间>.g<提交>`（如 `1.7.1-dev.20261025083000.g7ca1ca3`；若版本号已升但未发布，则用该版本号）。

预设仓库的 `dev` 分支可把依赖写为 `"advanced-preset": "dev"`，用 `npm update advanced-preset` 跟随最新 dev 版本（`npm i -D advanced-preset@dev` 会写入固定版本号，不建议）；合并进 `main` 前改回已发布的版本范围。预发布版本不会匹配 `^1.8.0` 这类范围，也不会移动 `latest`。

## 📄 许可

扩展、协议与 CLI 以 [MIT](LICENSE) 许可发布。`packages/cli/template/`（预设模板）与 `dist/presets/` 中内置的花瓣预设以 [CC0 1.0](packages/cli/template/LICENSE) 发布。
