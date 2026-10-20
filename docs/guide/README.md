# 预设开发指南

这份指南写给**想设计自己的预设、但不一定会编程**的人。读完以后，你应该能：

- 说清楚一个 AP 预设由哪些部分组成，每部分负责什么；
- 用“模组 + 工作流”的思路设计预设，而不是写一大段越来越难维护的提示词；
- 指挥 AI Agent 把你的设计变成一个能用、能发布的预设；
- 在 SillyTavern 里实时看到修改效果，并发布给别人使用。

指南里**不讲接口细节**。需要知道“这个字段到底怎么写”时，交给 AI Agent，或者查阅[参考文档](../reference/README.md)。

## 怎么读

| 你的情况 | 建议路线 |
| --- | --- |
| 第一次接触 | 按顺序读 1 → 2 → 3，然后边做边读 4 – 9 |
| 已经会写 SillyTavern 预设 | 读 1（了解差异）→ 2 → 4 → 8 → 13 |
| 只想马上动手 | 读 2，按里面的步骤让 Agent 开始干活；遇到不懂的词查[术语表](glossary-and-faq.md) |

## 目录

1. [预设是什么，AP 又做了什么](01-what-is-a-preset.md)
2. [用 AI Agent 创建预设](02-build-with-ai-agent.md)（推荐所有人阅读）
3. [准备环境与实时预览](03-setup-and-live-preview.md)
4. [区域、模组与条目：把提示词拆成积木](04-regions-and-modules.md)
5. [开关、分组、单选与参数：把选择权交给用户](05-switches-and-params.md)
6. [条件：让提示词随情况变化](06-conditions.md)
7. [两种写法与五种传输方式](07-styles-and-transports.md)
8. [工作流：让模型分步骤思考与写作](08-workflows.md)
9. [内置功能：元指令、记忆、总结、代写、选项与事件摘要](09-built-in-features.md)
10. [构建变量：让模组一起拼出一份清单](10-build-variables.md)
11. [推荐配置、插入点与界面翻译](11-configs-and-extension.md)
12. [测试、发布与更新](12-test-and-release.md)
13. [案例：花瓣预设是怎样设计出来的](13-petals-case-study.md)
14. [术语表与常见问题](glossary-and-faq.md)

## 贯穿全文的例子

指南中的例子都来自[花瓣预设（Petals Preset）v7](https://github.com/mirrorange/petals-preset)。简单认识一下它：

- **Freesia** 是“编织故事的魔女”，负责写故事，也负责回应你对她说的话；
- **Petals** 是 Freesia 召唤的小精灵，扮演编辑：回答 Freesia 的问题、提出建议、审阅草稿；
- 每次回复，Freesia 和 Petals 都会先按**工作流**讨论（提问 → 建议 → 写作，或者再加上草稿与修改），讨论过程显示在消息上方，正文才是故事本身；
- 你可以在面板里选择文风（Kardia、Aisthesis…）、开关各种写作指南、设定回复语言和长度，也可以用 `@Freesia …` 直接和她说话、让她记住你的偏好或总结剧情。

建议把花瓣预设的仓库下载下来，读到哪一章就打开对应的文件看一看。
