# Advanced Preset

为 SillyTavern 设计的高级预设扩展：用 Markdown + YAML 编写预设，扩展在生成时接管 Chat Completion 请求，提供分阶段工作流、五种传输方式、结构化产物（选项、记忆、回顾、摘要…）、补丁编辑与 Token 节省。

内置 [花瓣预设 v7](https://github.com/mirrorange/petals-preset)。

## 安装

SillyTavern → 扩展 → 安装扩展，填入：

```
https://github.com/mirrorange/advanced-preset
```

安装后在 Chat Completion 预设下拉中选择 `AP · <预设名>` 即可启用对应预设；点击预设下拉旁的图层按钮（或扩展设置中的「打开面板」）打开面板，面板覆盖在 AI 响应配置面板之上。

## 功能一览

| | |
| --- | --- |
| 传输 | 预填充 · 纯文本 · 结构化输出（`json_schema`）· 单步工具 · 多步工具；工具参数流式输出（含 Vertex AI Gemini 3+ 的 `streamFunctionCallArguments`；SillyTavern 尚未支持时可用 [服务端插件](contrib/sillytavern-gemini-tool-args/)） |
| 工作流 | 由预设声明的阶段序列（如 linear / iterative / edit / task），流式展示每个阶段 |
| 结构 | 回复、代写、选项、记忆、回顾、事件摘要、自定义结构，以卡片显示在消息下方 |
| 元指令 | `@叙述者 …` 触发任务回合；代写按钮直接走元指令 |
| 配置 | 推荐配置 ⊕ 用户差异（稀疏存储），采样参数与 Carrier 预设双向同步 |
| 开发 | `ap dev` 本地热更新、组装预览、请求记录、事件日志 |

## 编写预设

```sh
node packages/cli/dist/ap.js init my-preset --id my-preset --name "My Preset"
cd my-preset
node ../packages/cli/dist/ap.js dev        # 面板「调试」页填入 http://localhost:4747
node ../packages/cli/dist/ap.js build      # 产物 dist/<id>.apreset.json
```

模板仓库：[advanced-preset-template](https://github.com/mirrorange/advanced-preset-template)。CLI 命令：`build` / `check` / `dev` / `preview` / `init`（`ap --help`）。

## 仓库结构

| 路径 | 内容 |
| --- | --- |
| `src/` | 扩展本体（Vue 3 + TS，Shadow DOM UI） |
| `src/core/` | 生成管线：分类、组装、拦截、Orchestrator、传输驱动、响应编码 |
| `src/store/` | 设置、预设、配置层、Carrier、Sidecar、事件日志 |
| `src/ui/` | 阶段面板、卡片、设置面板与主题 |
| `packages/protocol/` | 预设协议：表达式、宏、结构、工作流、解析器、补丁、配置层（扩展与 CLI 共用） |
| `packages/cli/` | `ap` 工具链（打包后提交在 `dist/ap.js`，无需安装依赖即可运行） |
| `dist/` | 构建产物（SillyTavern 直接加载，需随源码一起提交） |

## 开发

```sh
pnpm install
pnpm build        # protocol → cli → 扩展，并写入 dist/build.json
pnpm test         # vitest
pnpm typecheck    # vue-tsc
```

修改内置预设后运行 `pnpm sync-presets` 将 `../petals-preset/dist` 同步到 `dist/presets/`。
