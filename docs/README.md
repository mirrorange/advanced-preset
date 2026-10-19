# Advanced Preset 文档

Advanced Preset（下文简称 **AP**）是一个 SillyTavern 扩展：预设作者用 Markdown + YAML 写出“提示词模组”和“工作流”，AP 在每次生成时按当前的设置、聊天情况和模型能力把它们组装成请求，并把模型的回复解析成正文、阶段记录和各种卡片。

文档分为三部分，按你的身份选择从哪里开始：

| 你是… | 从这里开始 |
| --- | --- |
| **预设使用者**：只想安装、使用预设 | [仓库 README](../README.md) 的「安装」与「使用」 |
| **预设开发者**（大多数人）：想设计自己的预设，没有编程背景也没关系 | [预设开发指南](guide/README.md) |
| **高级开发者 / AI Agent**：需要每个字段、每条规则的准确定义 | [参考文档](reference/README.md) |

> 推荐的做法：**用 AI Agent 帮你写预设**。你负责想清楚“预设应该让模型怎么写”，Agent 负责把它变成正确的文件。AP 为此提供了现成的 [Agent Skills](guide/02-build-with-ai-agent.md#agent-skills)，模板仓库里已经带好，也可以用 `ap skills install` 安装到任何预设仓库。

## 预设开发指南（面向初学者）

不讲实现细节，只讲概念和设计方法，全程用 [花瓣预设](https://github.com/mirrorange/petals-preset) 做例子。

1. [预设是什么，AP 又做了什么](guide/01-what-is-a-preset.md)
2. [用 AI Agent 创建预设](guide/02-build-with-ai-agent.md)
3. [准备环境与实时预览](guide/03-setup-and-live-preview.md)
4. [区域、模组与条目：把提示词拆成积木](guide/04-regions-and-modules.md)
5. [开关、分组、单选与参数：把选择权交给用户](guide/05-switches-and-params.md)
6. [条件：让提示词随情况变化](guide/06-conditions.md)
7. [两种写法与五种传输方式](guide/07-styles-and-transports.md)
8. [工作流：让模型分步骤思考与写作](guide/08-workflows.md)
9. [内置功能：元指令、记忆、总结、代写、选项与事件摘要](guide/09-built-in-features.md)
10. [构建变量：让模组一起拼出一份清单](guide/10-build-variables.md)
11. [推荐配置、插入点与界面翻译](guide/11-configs-and-extension.md)
12. [测试、发布与更新](guide/12-test-and-release.md)
13. [案例：花瓣预设是怎样设计出来的](guide/13-petals-case-study.md)
14. [术语表与常见问题](guide/glossary-and-faq.md)

## 参考文档（面向高级开发者与 Agent）

- [总览：源码结构与构建流程](reference/README.md)
- [`preset.yaml` 清单](reference/manifest.md)
- [模组文件](reference/modules.md) · [工作流文件](reference/workflows.md) · [指令](reference/directives.md)
- [条件表达式与变量](reference/expressions.md) · [宏](reference/macros.md) · [构建变量](reference/build-variables.md)
- [结构](reference/structures.md) · [传输方式与工具文案](reference/transports.md)
- [元指令、任务与历史改写](reference/meta-and-tasks.md)
- [配置、Carrier 与迁移](reference/configuration.md) · [用户模组与插入点](reference/user-modules.md) · [界面翻译](reference/locales.md)
- [组装流程](reference/assembly.md) · [CLI](reference/cli.md) · [产物与运行期数据](reference/artifact-and-runtime.md)

## 相关仓库

| 仓库 | 内容 |
| --- | --- |
| [advanced-preset](https://github.com/mirrorange/advanced-preset) | 扩展本体、CLI（`ap`）、本文档 |
| [advanced-preset-template](https://github.com/mirrorange/advanced-preset-template) | 新预设的起点（由 `ap init` 生成，含 Agent Skills 与 GitHub Actions） |
| [petals-preset](https://github.com/mirrorange/petals-preset) | 花瓣预设 v7，完整的真实例子 |
