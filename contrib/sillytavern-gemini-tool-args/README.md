# SillyTavern 服务端插件：Gemini 工具参数流式

给尚未合入 SillyTavern PR「Gemini: opt-in streaming of function call arguments」的 SillyTavern 版本补上这个功能，面向熟悉 SillyTavern 服务端的进阶用户。

## 作用

SillyTavern 后端在构造 Gemini 请求时会丢掉 Advanced Preset 发送的 `stream_function_call_arguments` 字段，所以 Vertex AI 上的 Gemini 3+ 只会在生成结束后一次性返回完整的工具调用。

安装插件后，满足以下全部条件的请求会在 `toolConfig.functionCallingConfig` 中加上 `streamFunctionCallArguments: true`（`mode` 保留 `tool_choice` 映射出的值，没有时为 `AUTO`），行为与 PR 一致：

- 聊天补全来源为 Google AI Studio（`makersuite`）或 Vertex AI（`vertexai`）；
- 流式请求；
- 请求体中 `stream_function_call_arguments: true`（由 Advanced Preset 的「流式工具参数」设置控制）；
- 请求带有函数声明（工具）。

其他请求不做任何修改。插件只改请求；返回的 `partialArgs` 分片原样转发给前端，由 Advanced Preset 重新拼装。

## 安装

1. 将本目录复制到 `SillyTavern/plugins/`，即 `SillyTavern/plugins/sillytavern-gemini-tool-args/index.mjs`。目录必须直接位于 `plugins/` 下，插件按相对路径加载 SillyTavern 内部模块。
2. 在 `config.yaml` 中设置 `enableServerPlugins: true`。
3. 重启 SillyTavern。启动日志中出现 `[gemini-stream-function-call-arguments] Active` 即为生效。

## 卸载

删除 `plugins/sillytavern-gemini-tool-args/` 并重启。若没有其他服务端插件，可以把 `enableServerPlugins` 改回 `false`。

SillyTavern 合入该 PR 后，后端会自行设置这个字段，插件变为空操作，届时请卸载。

## 风险与限制

- SillyTavern 没有修改 Gemini 请求的钩子，插件依赖内部实现：它在 `/api/backends/chat-completions/generate` 路由前插入中间件，并临时包装全局 `JSON.stringify`。包装只在已开启该功能的请求上下文（AsyncLocalStorage）中生效，且每个请求只修改第一个 Gemini 请求体；其他场景的开销只有一次上下文查询。
- 已在 SillyTavern 1.19.0（staging `ad29cbd`）上测试。SillyTavern 内部结构变化后插件可能失效：找不到内部路由时插件会加载失败并在日志中报错，不做任何修改；但不能排除更隐蔽的失效方式，升级 SillyTavern 后请留意。
- Gemini API（AI Studio）的 generateContent 接口不接受 `streamFunctionCallArguments`；该字段仅 Vertex AI 的 Gemini 3+ 支持（不含 Gemini 3.1 Flash-Lite）。
- TauriTavern 不支持服务端插件，也不需要本插件：Advanced Preset 在 TauriTavern 上会自动通过自定义请求体发送该字段。
