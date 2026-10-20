# advanced-preset · `ap`

[Advanced Preset](https://github.com/mirrorange/advanced-preset)（AP）的命令行工具链：把 Markdown + YAML 编写的预设源码编译成 SillyTavern 中 AP 扩展可加载的 `.apreset.json`，并提供检查、组装预览、热更新开发服务器、新预设模板与 Agent Skills。

[![npm](https://img.shields.io/npm/v/advanced-preset?color=d6409f)](https://www.npmjs.com/package/advanced-preset)
[![license](https://img.shields.io/badge/license-MIT-8b5cf6)](https://github.com/mirrorange/advanced-preset/blob/main/LICENSE)
![node](https://img.shields.io/node/v/advanced-preset?color=2563eb)

## 快速开始

创建一个新的预设仓库（需要 Node.js 20+）：

```sh
npx advanced-preset@latest init my-preset --name "我的预设"
cd my-preset
npm install
npm run dev          # 在 AP 面板 → 调试 → 开发源 填入 http://localhost:4747
```

在已有的预设仓库中安装：

```sh
npm install -D advanced-preset
npx ap check --strict
```

## 命令

| 命令 | 作用 |
| --- | --- |
| `ap build [dir] [--out dist] [--strict]` | 编译源码为 `dist/<id>.apreset.json` |
| `ap check [dir] [--strict]` | 只校验，不输出产物；`--strict` 把警告也视为错误 |
| `ap dev [dir] [--port 4747] [--host 127.0.0.1]` | 监视源码、自动重建，并为 AP 调试页提供产物 |
| `ap preview [dir] [--transport t] [--workflow w] [--config c] …` | 以与运行期相同的组装器输出请求消息 |
| `ap init <dir> [--id x] [--name "…"] [--author me]` | 从内置模板创建新预设仓库 |
| `ap skills list` / `ap skills install [dir] [--target .agents/skills]` | 列出 / 安装、更新内置的 AP Agent Skills |

完整说明见 [CLI 参考](https://github.com/mirrorange/advanced-preset/blob/main/docs/reference/cli.md)。

## 文档

- [预设开发指南](https://github.com/mirrorange/advanced-preset/blob/main/docs/guide/README.md)：面向新手，以花瓣预设为例，推荐用 AI Agent 开发；
- [参考文档](https://github.com/mirrorange/advanced-preset/blob/main/docs/reference/README.md)：源码格式、编译规则与运行期行为；
- [花瓣预设](https://github.com/mirrorange/petals-preset)：完整的真实例子。

## 包内容

- `dist/ap.js`：自包含的单文件 CLI，无运行时依赖；
- `template/`：`ap init` 使用的预设模板（含 `.agents/skills`、`AGENTS.md`、GitHub Actions）。

## 许可

CLI 以 [MIT](LICENSE) 许可发布；`template/` 中的模板内容以 [CC0 1.0](template/LICENSE) 发布，生成的预设可以自由选用任何许可。
