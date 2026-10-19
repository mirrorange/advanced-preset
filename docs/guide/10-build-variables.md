# 10. 构建变量：让模组一起拼出一份清单

有时候，一份提示词需要由**很多模组共同决定**。最典型的例子是花瓣的“要考虑的问题”：

- 核心模组提供基础问题：“根据写作指南，创作中要注意什么？”“接下来的剧情怎么发展？”；
- 选了 Kardia 文风，就多一个问题：“写作方式应该怎样校准？”；
- 打开了某条写作指南，可能又多一个问题。

如果把问题清单写死在一个地方，每加一个模组都要回去改它，还要用一堆条件判断“哪个模组开了”。**构建变量**解决的就是这个问题：先声明一个变量，各个模组生效时往里面“添一笔”，最后在一个地方统一读出来。

## 三种变量

| 类型 | 模组怎么更新 | 适合 |
| --- | --- | --- |
| 文本（string） | 在末尾追加一段文字 | 一段由多个模组拼接的说明 |
| 列表（list） | 追加一项或几项 | 简单的要点清单 |
| 字典（dict） | 按“键 → 值”设置条目；后面的模组可以覆盖或删除前面的同名条目 | 需要“替换”或“删除”某项的清单（推荐） |

## 花瓣的问题清单

**第一步：在 `preset.yaml` 里声明变量。**

```yaml
vars:
  mandatoryQuestions:
    type: dict
    label: Mandatory questions
    description: Asked in every questions stage.
  optionalQuestions:
    type: dict
    label: Optional questions
    description: The narrator picks the 2–3 most relevant.
```

**第二步：模组在设定里添加条目。** 核心问题模组：

```yaml
vars:
  mandatoryQuestions:
    guidelines: What should be considered during the creation process based on the instructions in `<guidelines>`?
    outline: Based on the latest input of {{ap::name::user}}, … how will the next part of the story unfold?
  optionalQuestions:
    impact: What emotional impact or tension should this segment create for the reader?
    repetition: Are there any overused imagery or repetitive phrases that should be avoided?
    twists: Are there opportunities to introduce twists, surprises, or new elements into the story?
```

Kardia 文风模组：

```yaml
vars:
  mandatoryQuestions:
    calibrate: How should the writing approach be calibrated? Please analyze according to the steps in `<writing_style>`.
  optionalQuestions:
    references: Are there opportunities to invoke specific reference points or stylistic tropes relevant to the identified genre?
```

只有**生效**的模组才会添加条目。关掉 Kardia、换成别的文风，`calibrate` 这个问题就自然消失了。

**第三步：在一个地方读出来。** 核心问题模组的正文：

```markdown
## Questions to Consider

### Mandatory questions

{{ap::var::mandatoryQuestions::values}}

### Optional questions

Choose the 2–3 most relevant:

{{ap::var::optionalQuestions::values}}
```

模型看到的是一个整齐的列表：

```
### Mandatory questions

- What should be considered during the creation process based on the instructions in `<guidelines>`?
- Based on the latest input of {{user}}, … how will the next part of the story unfold?
- How should the writing approach be calibrated? …
```

## 读取变量的几种方式

| 写法 | 结果 |
| --- | --- |
| `{{ap::var::名字}}` | 整个变量：文本原样输出；列表输出为 `- 项` 的清单；字典输出为 `键: 值` 的清单 |
| `{{ap::var::名字::values}}` | 字典的所有值（清单） |
| `{{ap::var::名字::keys}}` | 字典的所有键（清单） |
| `{{ap::var::名字::某个键}}` | 字典里的一项 |
| `{{ap::var::名字::0}}`、`::-1` | 列表的第一项、最后一项 |

条目的顺序跟随模组的顺序；一个键被后面的模组覆盖时，位置保持不变。

## 用字典的好处

- **可以替换**：后面的模组设置同一个键，就替换前面的内容；
- **可以删除**：把某个键的值写成 `null`，就删除它。比如某个文风模组觉得 `twists`（转折）不适合自己，可以删掉它；
- **用户也能改**：用户在“我的模组”里可以向这些变量添加条目、覆盖或删除内置条目——比如加一个自己关心的问题（见[下一章](11-configs-and-extension.md#插入点让用户加入自己的提示词)）。所以，**变量和键的名字发布后要保持稳定**。

`npm run check` 会提醒你：两个可能同时生效的模组设置了同一个键（可能是笔误），或者某个变量从来没有被读取。

## 什么时候用构建变量

- 多个模组想往**同一处**添内容（问题清单、要点清单、额外的格式要求）；
- 希望用户能**往清单里加东西**，又不想让他们改动整段提示词。

只有一个模组用到的内容，直接写在模组里就好。

下一章：[推荐配置、插入点与界面翻译](11-configs-and-extension.md)。
