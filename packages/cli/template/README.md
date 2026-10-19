# __PRESET_NAME__

一个 [Advanced Preset](https://github.com/mirrorange/advanced-preset)（AP）预设，用于 SillyTavern。

> 这个仓库由 [AP 预设模板](https://github.com/mirrorange/advanced-preset-template)生成。第一次写 AP 预设？从[预设开发指南](https://github.com/mirrorange/advanced-preset/blob/main/docs/guide/README.md)开始。

## 快速开始

需要 [Node.js](https://nodejs.org/) 20 或更新版本，以及装好 AP 扩展的 SillyTavern。

```sh
npm install
npm run dev        # 修改后自动重新构建，并在 http://localhost:4747 提供预设
```

在 SillyTavern 中打开 **AP 面板 → 调试 → 开发源**，填入 `http://localhost:4747`。之后每次保存文件，预设都会自动重新载入。

## 用 AI Agent 编写

仓库里已经带好了 AP 的 [Agent Skills](.agents/skills)，以及给 Agent 看的 [AGENTS.md](AGENTS.md)。用 Codex、Claude Code、Cursor、Gemini CLI 等 Agent 打开这个文件夹，然后这样开始：

> 我想做一个 AP 预设。请使用 ap-preset-design 技能，先和我讨论设计，整理成 DESIGN.md，确认后再动手写。

| 技能 | 用途 |
| --- | --- |
| `ap-preset-design` | 和你一起设计预设，写出 `DESIGN.md` |
| `ap-preset-authoring` | 编写、修改源码（附完整的格式参考） |
| `ap-preset-testing` | 检查、预览、排查问题、发布 |

Claude Code 读取 `.claude/skills`：运行 `npx ap skills install --target .claude/skills` 再装一份。升级 AP 版本后运行 `npm run skills` 更新技能。详见[用 AI Agent 编写预设](https://github.com/mirrorange/advanced-preset/blob/main/docs/guide/02-build-with-ai-agent.md)。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 开发服务器：监视源码、自动构建、供 AP 调试页载入 |
| `npm run check` | 检查错误（`npx ap check --strict` 把警告也算作失败） |
| `npm run preview` | 查看组装结果，例如 `npm run preview -- --transport prefill` |
| `npm run build` | 生成 `dist/__PRESET_ID__.apreset.json` |
| `npm run skills` | 安装 / 更新 `.agents/skills` 中的 AP 技能 |

## 文件

| 路径 | 内容 |
| --- | --- |
| `preset.yaml` | 清单：角色、区域、参数、结构、推荐配置…… |
| `modules/**/*.md` | 模组，一个文件一个；`<!-- @entry -->` 切分条目 |
| `workflows/*.md` | 工作流，一个文件一个；`<!-- @section -->` 写出每个阶段 |
| `locales/*.yaml` | 面板文字翻译 |
| `dist/` | 构建产物（发布时提交） |
| `.agents/skills/`、`AGENTS.md` | 给 AI Agent 的说明 |
| `.github/workflows/build.yml` | 推送时自动检查、构建；推送 `v*` 标签时自动发布 Release |

## 发布

1. 修改 `preset.yaml` 中的 `version`；
2. `npm run build`，把 `dist/` 一起提交并推送；
3. （可选）推送 `v1.0.0` 这样的标签，GitHub Actions 会创建 Release。

用户在 AP 面板 → 预设 → **导入链接**中填入 `https://github.com/<用户名>/<仓库名>/blob/main/dist/__PRESET_ID__.apreset.json` 即可安装，之后可以一键“从来源更新”。

## 文档

- [预设开发指南](https://github.com/mirrorange/advanced-preset/blob/main/docs/guide/README.md)：从零开始，概念与设计方法；
- [参考文档](https://github.com/mirrorange/advanced-preset/blob/main/docs/reference/README.md)：逐字段的格式说明；
- [花瓣预设](https://github.com/mirrorange/petals-preset)：一个完整的大型 AP 预设。
