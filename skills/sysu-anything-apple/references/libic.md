# Libic Apple 集成

Apple 入口：

```bash
node dist/apple-cli.js libic reserve ...
```

先做一次 macOS 预检查：

```bash
node dist/apple-cli.js apple doctor
```

## 登录要求

- `libic reserve --confirm --calendar --reminders` 之前，先检查：

```bash
node dist/cli.js libic whoami
```

- 如果失败，恢复路径：

```bash
node dist/cli.js libic refresh
node dist/cli.js libic whoami
```

## 当前支持的闭环

```bash
node dist/apple-cli.js libic reserve --kind 15 --room 401 --date 2026-04-10 --start 10:00 --end 11:00 --confirm --calendar --reminders
```

也支持带额外参数：

```bash
node dist/apple-cli.js libic reserve --kind 2 --lab 1 --room 309 --date 2026-04-10 --start 14:00 --end 16:00 --title "课程讨论" --memo "软件工程课程讨论" --confirm --calendar --reminders
```

## Apple 写入内容

每次成功同步通常会创建或更新：

- 1 个 Apple Calendar 事件
- 1 个“预约开始”提醒
- 1 个“提前到场/带电脑”提醒

## 重要边界

- `reserve` 不加 `--confirm` 时仍然只是预约预览，Apple sync 会跳过
- 只有 libic 站点确认预约成功后，Apple 才会写入
- 有些房型可能还需要：
  - `--captcha`
  - `--app-url`
  - `--services`

## 幂等行为

- Apple 侧使用稳定 `sourceKey`
- 同一条 libic 预约重复执行时，会更新已有事件 / 提醒，而不是无限重复创建
