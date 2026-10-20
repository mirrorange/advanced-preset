# 3. 准备环境与实时预览

这一章介绍开发时会用到的几个命令，以及怎样在 SillyTavern 里“边改边看”。如果你使用 Agent，可以直接让它执行这些命令；了解它们的作用能帮助你更好地检查结果。

## 四个命令

在预设仓库里（第一次需要先运行 `npm install`）：

| 命令 | 作用 | 什么时候用 |
| --- | --- | --- |
| `npm run dev` | 启动开发服务器：每次保存文件自动重新构建，并通知 ST 重新载入 | 开发时一直开着 |
| `npm run check` | 只检查，不生成文件；报告错误（必须修）和警告（建议修） | 每次改完 |
| `npm run preview` | 在终端里打印“模型将看到的提示词” | 想确认某种情况下的提示词内容 |
| `npm run build` | 生成 `dist/<id>.apreset.json` | 准备发布或手动安装时 |

这些命令背后是 AP 的命令行工具 `ap`，也可以用 `npx ap <命令>` 直接调用，比如 `npx ap preview --transport prefill`。完整的参数见 [CLI 参考](../reference/cli.md)。

## 在 SillyTavern 里实时预览

1. 在预设仓库运行 `npm run dev`，终端里会显示服务地址（默认 `http://localhost:4747`）；
2. 打开 ST，打开 AP 面板 → **调试**；
3. 在 **开发源** 的“服务地址”里填入这个地址，状态变成“在线”；
4. 在 Chat Completion 预设下拉中选择 `AP · <你的预设名>`。

之后每次保存文件，预设会自动重新载入，下一次生成就会使用新的内容。面板“预设”页里，这个预设会标注来源为“开发”。

> 提示：开发服务器运行在你自己的电脑上。如果 ST 运行在另一台设备上（比如手机或服务器），浏览器需要能访问这个地址；可以用 `npm run dev -- --host 0.0.0.0` 让局域网内的设备访问，并把地址里的 `localhost` 换成电脑的局域网 IP。

如果构建出错，终端会显示错误位置，ST 里继续使用上一次成功构建的版本。

## 看清楚模型到底收到了什么

调试页还有两块很有用的信息：

- **最近组装**：最近一次生成时，每个区域放进了哪些内容、生效了哪些模组。适合检查“这个模组为什么没生效”“这段话出现了两次”；
- **请求**：最近发出的请求与模型的原始响应。适合检查模型的输出格式是否符合要求。

不打开 ST 也能看组装结果：

```sh
npm run preview                                   # 默认配置
npx ap preview --transport prefill                # 换一种传输方式
npx ap preview --config gemini                    # 用某个推荐配置
npx ap preview --enable style-eros --disable options   # 临时打开 / 关闭模组
npx ap preview --meta pure                        # 模拟用户输入了一条纯元指令
npx ap preview --out preview.txt                  # 写进文件，方便慢慢看
```

预览把每个区域分开显示，例如：

```
Petals Preset 7.6.0 · plaintext (dialogue) · workflow linear · config other
modules: core, context, role-freesia, mode-expansion, event-synopsis, options, …
stages: Start -> Asking Questions (Freesia) -> Planning and Creative Input (Petals) -> Drafting (Freesia) -> (End)

━━ top ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[system]
You are Freesia, daughter of day and night, …
━━ settings (native) ━━━━━━━━━━━━━━━━━━
━━ history (empty) ━━━━━━━━━━━━━━━━━━━━
```

`[system]` 等标记表示这条消息的角色；“native”表示这里由 ST 填入角色卡等内容，“empty”表示这次没有内容。在预览里，`{{user}}`、`{{char}}` 这类 ST 宏保持原样，真正生成时由 ST 替换。

## 安装构建好的预设

不用开发服务器时，也可以手动安装：运行 `npm run build`，然后在 AP 面板 → **预设** → 导入 **文件**（或直接用 ST 对话补全预设的导入按钮），选择 `dist/` 里的 `.apreset.json`。发布到网上后，用户还可以通过 **链接** 导入，并在之后“从来源更新”（见[测试、发布与更新](12-test-and-release.md)）。

下一章：[区域、模组与条目](04-regions-and-modules.md)。
