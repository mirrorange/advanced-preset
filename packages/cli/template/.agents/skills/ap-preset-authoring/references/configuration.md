# 配置、Carrier 与迁移

**配置**是用户在面板里能调的一切：传输方式、采样参数、角色名字与前缀、模组开关、参数值、省 token……预设通过 `configurationDefaults` 给出默认值，通过 `configurations` 提供若干**推荐配置**（如“Gemini”“Claude”），用户在此基础上做自己的修改。

**Carrier** 是 AP 为每个预设生成的 SillyTavern Chat Completion 预设，负责把 AP 的区域锚点和 ST 原生提示词（角色卡、世界书……）排成顺序。

## 配置层

一个生效的配置由三层深度合并得到：

```
configurationDefaults（清单）  ⊕  推荐配置 / 用户保存的配置的 diff  ⊕  用户当前的 diff
```

- 推荐配置与用户数据都只保存**稀疏 diff**（与下层不同的叶子）。预设更新了默认值，没被用户改过的项会自动跟着变；
- 数组按值整体比较、整体替换；
- 用户可以把当前配置另存为“我的配置”，也可以随时切回某个推荐配置。

## 配置结构

```yaml
configurationDefaults:
  connection:
    transport: structured
    forceTool: true
    parallelTools: false
    sendThoughtSignature: false
    openAiSignatures: false
    streamToolArguments: auto
    maxSteps: 6
    finalFallback: true
    assumeToolSupport: false
    workflow: story            # 默认：第一个 story 工作流
    syntheticTurn: init        # 默认：第一个示范轮次，没有则 null
    target: { type: current }  # 默认绑定发送到哪里（1.13，见连接绑定）
    bindings: {}               # 额外的连接绑定：id → 绑定
    binding: default           # 未开启多模型时使用的绑定
  sampling:
    temperature: 1
    openai_max_tokens: 8192
  identity:
    names: { narrator: "" }    # 空字符串 = 使用角色的默认名字
    prefixes: { narrator: "" } # 空字符串 = 使用角色的默认前缀
  modules: { options: true }   # 只能写用户可开关的模组
  params: { length: 600 }
  tokenSaving: { enabled: false, keepFullTurns: 6, truncateUserAfter: 2000, userInput: truncate }
  cache: { enabled: false, ttlMinutes: 5, maxDeferredTurns: 6 }
  meta: { enabled: true, recentCount: 3 }
  storylines: { enabled: true, freezeVariables: all }   # 只在预设声明了 storylines 时存在
  multiModel: { enabled: false, actors: {} }            # 只在预设声明了 multiModel 时存在
```

| 段 | 字段 | 默认 | 说明 |
| --- | --- | --- | --- |
| `connection` | `transport` | `structured` | 传输方式（[transports.md](transports.md)） |
| | `forceTool` | `true` | 工具传输强制调用工具（`tool_choice`） |
| | `parallelTools` | `false` | 多工具模式允许一次调用多个阶段工具 |
| | `sendThoughtSignature` | `false` | Gemini 思维签名渠道：`false`（关闭）/ `vertex` / `aistudio`；`true` 等同 `vertex`（[transports.md](transports.md#思维签名)）。渠道值需要 `minAdvancedPreset: 1.11.0` |
| | `openAiSignatures` | `false` | OpenAI 兼容连接（OpenRouter / CLIProxyAPI）也发送思维签名（[transports.md](transports.md#思维签名)） |
| | `streamToolArguments` | `auto` | Gemini 工具参数流式：`auto` / `on` / `off` |
| | `maxSteps` | `6` | 多工具模式最多请求几次 |
| | `finalFallback` | `true` | 解析不出正文时用原始文本作为正文 |
| | `assumeToolSupport` | `false` | 工具传输跳过 ST 对 API 源和模型的检查（[transports.md](transports.md#能力检查)） |
| | `workflow` | 第一个 `story` 工作流 | 故事轮使用的工作流（必须是 `story` 工作流） |
| | `syntheticTurn` | 第一个示范轮次或 `null` | 工具传输插入的示范轮次 |
| | `target` | `{ type: current }` | 默认绑定的去向（[连接绑定](#连接绑定)）。需要 1.13.0 |
| | `bindings` | `{}` | 额外的连接绑定，id → 绑定（[连接绑定](#连接绑定)） |
| | `binding` | `default` | 未开启多模型时所有请求使用的绑定；开启时用于元指令回复与脚本调用 |
| `sampling` | 任意键 | `{}` | ST Chat Completion 预设的设置项，见下 |
| `identity` | `names.<actor>` / `prefixes.<actor>` | `''` | 覆盖角色名字 / 前缀；空字符串表示用清单 `actors` 的值 |
| `modules` | `<module id>` | 模组的 `default` | 用户可开关模组的状态 |
| `params` | `<param id>` | 参数的 `default` | 参数值（列表参数为字符串数组，合并时整体替换） |
| `tokenSaving` | `enabled` / `keepFullTurns` / `truncateUserAfter` / `userInput` | `false` / 清单 `tokenSaving` 的值 | 省 token（[meta-and-tasks.md](meta-and-tasks.md#省-token)） |
| `cache` | `enabled` / `ttlMinutes` / `maxDeferredTurns` | `false` / `5` / `6` | 缓存优化：粘性渲染历史（[meta-and-tasks.md](meta-and-tasks.md#缓存优化粘性渲染)）；`ttlMinutes`、`maxDeferredTurns` 为 0 分别表示不限时、从不推迟 |
| `meta` | `enabled` | `true` | 元指令总开关；`false` 时不处理元指令（[meta-and-tasks.md](meta-and-tasks.md#元指令)） |
| | `recentCount` | 清单 `meta.recentCount` | `{{ap::recent_meta}}` 的条数 |
| `storylines` | `enabled` | `true` | 故事线开关（只在预设声明了 [`storylines`](manifest.md#故事线-storylines) 时存在）；`false` 时 `#标签` 作为文字发送，历史保持原顺序（[meta-and-tasks.md](meta-and-tasks.md#故事线)） |
| | `freezeVariables` | `all` | 哪些轮次不更新 MVU / 酒馆助手的聊天与消息变量：`all` 主线以外的故事线、`if` 只有 if 线、`off` 不阻止；本轮的结果为条件变量 `storyline.frozen`（[支线轮次的变量](meta-and-tasks.md#支线轮次的变量)） |
| `multiModel` | `enabled` | `false` | 多模型开关（只在预设声明了 [`multiModel`](manifest.md#多模型-multimodel) 时存在） |
| | `actors.<actor>` | `{}` | 执行该角色的步骤的绑定 id；没写的角色使用默认绑定 |

### sampling

`sampling` 是自由的键值表，键使用 **ST Chat Completion 预设文件**中的名字（`temperature`、`top_p`、`openai_max_tokens`、`stream_openai`、`reasoning_effort`、`use_sysprompt`……）。它写入 Carrier，并与 ST 的设置双向同步：用户在 ST 里调温度，AP 配置也跟着变；在 AP 里切换推荐配置，ST 的设置也跟着变。

ST 内部有几项的设置名与预设文件不同，AP 自动换算：`temperature`→`temp_openai`、`frequency_penalty`→`freq_pen_openai`、`presence_penalty`→`pres_pen_openai`、`top_p`→`top_p_openai`、`top_k`→`top_k_openai`、`top_a`→`top_a_openai`、`min_p`→`min_p_openai`、`repetition_penalty`→`repetition_penalty_openai`。请在清单里使用左边的名字。

### 诊断

- `configurationDefaults.modules` 中不存在或不是用户可开关的模组、`params` 中不存在的参数：错误；
- `params` 的值与参数类型不符（如列表参数不是字符串数组、数字参数不是数字）：错误（推荐配置的 diff 同样检查）；
- 未知的段（如 `configurationDefaults.foo`）：警告；
- `cache.enabled` 不是布尔值、`ttlMinutes` / `maxDeferredTurns` 不是非负数：错误；`cache` 中未知的键：警告；
- `connection.transport` / `streamToolArguments` / `sendThoughtSignature` 取值非法、`workflow` 不存在或是任务工作流、`syntheticTurn` 不存在：错误（推荐配置的 diff 同样检查）；
- `connection.target` 或绑定的 `target` 不是 `{ type: current | profile | model }`、`model` 为空、`profile` 缺失：错误；`profile` 目标：警告（连接配置文件只存在于某一个 SillyTavern 中，其他用户没有它）；
- 绑定 id 为 `default`、绑定的传输选项取值非法：错误；绑定中未知的选项：警告；
- `connection.binding` 或 `multiModel.actors` 指向不存在的绑定：错误；
- 预设没有声明 `multiModel` 却写了 `multiModel` 段：警告（忽略）；`multiModel.enabled` 不是布尔值、`actors` 中不存在的角色：错误；`actors` 中写了用户角色：警告（用户角色不执行步骤）。

## 推荐配置 `configurations`

```yaml
configurations:
  - id: gemini
    name: Gemini
    description: Tool calling with thought signatures.
    diff:
      sampling: { use_sysprompt: false }
      connection: { transport: tool-single, sendThoughtSignature: vertex }
      modules: { skip-thought: true }
  - id: claude
    name: Claude
    diff:
      connection: { transport: prefill }
defaultConfiguration: gemini
```

| 字段 | 说明 |
| --- | --- |
| `id` | 必填，唯一 |
| `name` | 面板显示名（默认 `id`），可在 `locales` 翻译 |
| `description` | 面板说明 |
| `diff` | 相对 `configurationDefaults` 的稀疏 diff |

- 没有写 `configurations` 时，自动生成 `{ id: default, name: Default, diff: {} }`；
- `defaultConfiguration` 默认是第一个推荐配置，必须存在（错误）；新用户与找不到原推荐配置的用户使用它；
- diff 中不存在于配置结构的键：错误；id 重复：错误；
- 某个推荐配置让同一单选集启用了多个模组：警告。

`ap preview --config <id>` 用指定推荐配置预览组装结果（[cli.md](cli.md)）。

## 连接绑定

**连接绑定**把“请求发到哪里”与“用什么传输方式发”组合在一起，在面板「配置 → 连接」中编辑。绑定是配置的一部分，随推荐配置、保存的配置与用户 diff 分层保存。

- **默认绑定**（id `default`）就是 `connection` 本身：`transport`、`forceTool` 等传输字段加上 `connection.target`。1.13 之前的配置与推荐配置因此原样成为默认绑定，不需要迁移；
- **额外的绑定**写在 `connection.bindings` 中，每个绑定有 `name`、`target` 与自己的传输选项（`transport` `forceTool` `parallelTools` `syntheticTurn` `sendThoughtSignature` `openAiSignatures` `streamToolArguments` `maxSteps` `assumeToolSupport`）。没写的传输选项取默认绑定的值；`workflow`、`finalFallback` 属于连接本身，不随绑定变化；
- **未开启多模型**时，所有请求使用 `connection.binding` 选中的绑定；
- **开启多模型**（预设声明了 [`multiModel`](manifest.md#多模型-multimodel)，且 `multiModel.enabled` 为真）时，故事轮的每个步骤由 `multiModel.actors` 中为其角色指定的绑定执行，没有指定的角色使用默认绑定；元指令回复与脚本调用（任务轮）仍是一次请求，使用 `connection.binding`。阶段如何划分、先前步骤如何回放见 [workflows.md](workflows.md)；
- 指向不存在的绑定（例如已删除）时使用默认绑定，并在组装调试中警告；
- 在面板中删除来自推荐配置或保存的配置的绑定时，用户 diff 记录 `null` 把它遮住；指向它的选择与角色映射改回默认绑定。

```yaml
configurations:
  - id: duo
    name: Two models
    diff:
      connection:
        transport: tool-single                  # 默认绑定：当前连接、单工具
        bindings:
          fast:
            name: Fast drafts
            target: { type: model, model: gemini-2.5-flash }
            transport: structured
      multiModel: { enabled: true, actors: { critic: fast } }
```

### 绑定的去向 `target`

| `type` | 字段 | 发送到 |
| --- | --- | --- |
| `current` | — | SillyTavern 当前的 API 连接（与 1.12 完全相同，请求体不做任何改动） |
| `model` | `model` | 当前的 API 连接，只换模型名称 |
| `profile` | `profile` | SillyTavern 连接配置管理（Connection Manager）中的一个 Chat Completion 连接配置文件（按 id） |

AP 不切换 SillyTavern 的连接：它让 ST 自己（`openai.js` 的 `createGenerationParameters`）分别按当前设置与目标设置生成请求体，把两者不同的字段换进这一次请求。这样与来源相关的字段（如 Claude 的 `top_k` / `use_sysprompt`、OpenRouter 的 `provider`、自定义来源的 `custom_url` / `custom_include_body`、只对部分模型有效的 `reasoning_effort`）与 ST 直接连接该配置文件时一致，而 AP 的提示词、工具、流式设置以及其他扩展对请求体的修改保持不变。无法载入 `openai.js` 时（如部分 ST 分支），只换下表中的连接字段。

连接配置文件中**切换**的内容：

- API（`chat_completion_source`）与模型；配置文件没有记录模型时，用 ST 为该来源保存的模型；
- 服务器地址（`api-url`：自定义来源的 `custom_url`、Vertex AI 区域、Z.AI / SiliconFlow / MiniMax / Pollinations 端点）；
- 反向代理（按名称取 ST 的代理预设：`reverse_proxy` / `proxy_password`）；
- API 密钥：使用 ST 为该来源保存的当前密钥；配置文件记录了 `secret-id` 时使用那一个密钥；
- 提示词后处理（`custom_prompt_post_processing`）。

**不切换**的内容：配置文件的对话补全预设（采样参数与提示词仍由 AP 的配置与 Carrier 决定）、停止词、回复前缀、推理模板、正则预设；自定义来源的请求头与额外请求体参数沿用当前设置。下列配置文件不能使用（请求前报错，说明原因）：已不存在的配置文件、Text Completion 配置文件，以及保存了自己的“自定义连接”快照的配置文件（其凭据无法安全地单独换入）。

工具传输的[能力检查](transports.md#能力检查)按绑定进行：检查的是该绑定实际发送的来源、模型与提示词后处理，`assumeToolSupport` 取绑定自己的值。

## Carrier

AP 为每个已安装的预设维护一个 ST Chat Completion 预设，名为 `AP · <预设 name>`（按内部元数据 `extensions.advanced_preset.presetId` 查找，不依赖名称）。**用户在 ST 预设下拉框里选中某个 Carrier，就等于启用了对应的 AP 预设。** 选中 Carrier 时，ST 的导出按钮导出 AP 预设产物而非 Carrier，重命名与另存为按钮隐藏；ST 的导入按钮遇到 AP 产物时按 AP 预设安装。

```yaml
carrier:
  label: 🌸 Petals             # 锚点提示词名字的前缀，默认预设 name
  order:
    - top                      # 区域 id → 该区域的锚点
    - role
    - main: false              # ST 原生提示词；{ id: false } 表示放入但默认关闭
    - worldInfoBefore
    - charDescription
    - scenario
    - worldInfoAfter
    - dialogueExamples
    - history
    - chatHistory              # 必须有
    - task
    - bottom
  prompts:                     # 可选：覆盖提示词字段，或声明额外的提示词
    jailbreak: { content: "" }
```

`order` 的每一项是：

- **区域 id**（非原生区域）：生成锚点提示词——`identifier: ap_<区域 id>`、`name: <label> · <区域 id>`、`role` 为区域的角色、内容为锚点 `⟦ap:region:<区域 id>⟧`、`forbid_overrides: true`；
- **ST 原生提示词 id**：`main` `worldInfoBefore` `personaDescription` `charDescription` `charPersonality` `scenario` `enhanceDefinitions` `nsfw` `worldInfoAfter` `dialogueExamples` `chatHistory` `jailbreak`；
- **`carrier.prompts` 中声明的 id**：额外的自定义提示词（system 角色，内容由 `prompts.<id>` 提供）；
- 写成 `{ <id>: false }` 时放入顺序但默认关闭。

`prompts.<id>` 中的字段会覆盖生成的提示词对象（ST 预设的 prompt 字段，如 `content`、`role`、`name`）。

约束（错误）：每个非原生区域都必须出现在 `order` 中；必须包含 `chatHistory`；不能重复；不认识的 id 报错。原生区域（`native: true`）只在区域顺序中标记 ST 内容的位置，不写入 `order`。

**运行期**：

- 组装时 ST 按 Carrier 的顺序拼出提示词，AP 在每个锚点处换入区域内容（[assembly.md](assembly.md)）。锚点永远不会原样发给模型；
- 安装或更新预设后，如果产物哈希变化，Carrier 被**重建**。用户手动改过 Carrier 的提示词时，重建会覆盖并提示；`chat_completion_source`、`reverse_proxy`、`proxy_password` 这些与连接绑定的字段会保留；
- 重建的 Carrier 如果正被选中，会立即重新应用到 ST 当前设置（ST 按已应用的设置而不是磁盘上的预设拼提示词），新增的区域锚点马上生效。区域有内容但提示词里没有它的锚点时，组装调试会警告 `region <id>: its anchor is not in the prompt …`；
- 预设的[正则脚本](regex-and-quick-replies.md#正则脚本-regex-scripts)写在 Carrier 的 `extensions.regex_scripts` 中，是 ST 的预设正则：只在选中 Carrier 时生效，随 Carrier 重建；
- 预设的[酒馆助手脚本](tavern-helper-scripts.md)写在 Carrier 的 `extensions.tavern_helper` 中。重建时只替换预设自己的脚本，脚本开关、脚本变量、预设变量与用户自己添加的脚本保留（[运行期](tavern-helper-scripts.md#运行期)）；
- 所以要改提示词内容，请改预设源码，而不是改 Carrier。

## 迁移

字段 `migrations`。模组、参数、插入点、构建变量的 id 是用户数据的键。发布后改名会让用户的设置“失联”，这时用迁移告诉 AP 新旧 id 的对应关系：

```yaml
migrations:
  - from: "<7.0.0"
    rename:
      modules: { old-pacing: pacing }
      params: { wordCount: length }
      insertionPoints: { before-task: task-before }
      vars: { questionList: questions }
```

| 字段 | 说明 |
| --- | --- |
| `from` | 用户之前安装的版本满足这个范围时应用：`<7.0.0`、`>=6 <7`、`6.x`、`=6.2.0` 等。不是合法范围时报错 |
| `rename.modules` | 配置 diff 中的模组开关、用户模组中引用的模组 |
| `rename.params` | 配置 diff 中的参数值、用户模组中引用的参数 |
| `rename.insertionPoints` | 用户模组条目的插入点 |
| `rename.vars` | 用户模组对构建变量的更新 |

**应用时机**：预设升级后（已安装版本低于新版本）第一次加载时，按顺序应用所有 `from` 匹配的迁移——

1. 对用户的当前配置与所有保存的配置做重命名；
2. 对用户模组做重命名（插入点、变量，以及表达式中引用的 `modules.<id>` / `params.<id>`）；
3. 然后**删除新版本中不存在的键**（配置结构中没有的键、已不存在的模组与参数）；
4. 如果启用的用户模组仍引用不存在的插入点，提示用户。

迁移也用于导入旧版本导出的用户模组文件。重命名目标在新版本中不存在时给出警告；未知的 `rename` 段给出警告。
