# Chat

`chat` 用于校内智能问答、知识库范围查询和会话发送。

## 登录与探测

```bash
sysu-anything chat probe
sysu-anything chat auth-url
sysu-anything chat replay-callback --url "<callback-url>"
```

常用判断：

- `chat probe`
  - 看当前会走哪条认证链路
- `chat auth-url`
  - 生成企业微信授权链接
- `chat replay-callback`
  - 回放 callback，落本地 token

## 查询类命令

```bash
sysu-anything chat agent
sysu-anything chat sources
sysu-anything chat chats
sysu-anything chat messages --chat-id "<chatId>"
```

## 发消息

```bash
sysu-anything chat send --message "你好"
sysu-anything chat send --message "帮我看看最近校内新闻" --scope "校园资讯"
sysu-anything chat send --chat-id "<chatId>" --message "继续"
```

## 范围参数

这些参数都可以指定知识库范围：

- `--scope`
- `--search-source`
- `--source`
- `--range`
- `--knowledge-scope`

建议先跑：

```bash
sysu-anything chat sources
```

再决定具体范围。

默认优先级：

- 如果用户没有明确指定知识库范围，优先尝试 `校园资讯`
- 如果 `chat sources` 返回的真实标题是 `校内资讯`，则改用 `校内资讯`
- 总之优先使用 `chat sources` 里返回的“校园资讯/校内资讯”那个确切名字
- 只有用户明确要求别的范围，或者 source 列表里不存在这个范围时，才切到其他知识库

## 重要行为

- 不传 `--chat-id`
  - CLI 会先新建会话再发消息
- 传 `--chat-id`
  - 会继续已有会话
- 支持 `--json`
  - 适合 agent 解析结果
- 没指定范围时
  - 先用 `校园资讯`，若列表里只有 `校内资讯` 则用返回的精确标题
