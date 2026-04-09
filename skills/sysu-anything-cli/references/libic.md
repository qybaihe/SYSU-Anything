# Libic 图书馆空间 / 研讨室

`libic` 对应：

```bash
sysu-anything libic ...
```

目标站点：

- `https://libic.sysu.edu.cn/`

## 能力拆分

- `refresh`
  - 复用 CAS 会话播种 libic 自己的站点登录态
  - 会自动处理 `/auth/address -> /authcenter -> /auth/token`
- `whoami`
  - 看当前 libic 用户信息和 token 状态
- `room-types`
  - 列可预约空间类型
- `labs`
  - 按房型查看楼层 / 分区
- `available`
  - 查某天某房型的可预约空档
- `reserve`
  - 默认只预览预约 payload
  - 只有显式加 `--confirm` 才会真正提交

## 登录与状态

- `libic` 不是只有 `session.json` 就够了
- 成功进入 libic 后，会把站点 cookie 和 token 持久化到 `~/.sysu-anything/libic-session.json`
- 推荐检查命令：

```bash
sysu-anything libic whoami
```

- 如果失败，恢复路径是：

```bash
sysu-anything libic refresh
sysu-anything libic whoami
```

## 常用命令

```bash
sysu-anything libic refresh
sysu-anything libic room-types
sysu-anything libic labs --kind 15
sysu-anything libic available --kind 15 --date 2026-04-10
sysu-anything libic reserve --kind 15 --room 401 --date 2026-04-10 --start 10:00 --end 11:00
sysu-anything libic reserve --kind 15 --room 401 --date 2026-04-10 --start 10:00 --end 11:00 --members 24330001,24330002 --confirm
```

## 已知注意点

- `reserve` 默认预览，不要替用户自动补 `--confirm`
- 有些房型会额外要求：
  - `--captcha`
  - `--app-url`
  - `--services`
- `--members` 会自动把当前账号补到第一个位置，不需要重复传自己

## Apple 侧

如果用户明确要把已成功预约的研讨室同步到 Apple Calendar / Reminders，切到：

```bash
sysu-anything-apple libic reserve --kind 15 --room 401 --date 2026-04-10 --start 10:00 --end 11:00 --confirm --calendar --reminders
```

Apple 版只有在 `--confirm` 后预约成功时才会写入本地 Calendar / Reminders。
