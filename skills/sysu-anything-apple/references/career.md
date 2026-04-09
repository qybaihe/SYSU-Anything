# Career Apple 集成

Apple 入口：

```bash
node dist/apple-cli.js career ...
```

先做一次 macOS 预检查：

```bash
node dist/apple-cli.js apple doctor
```

## 当前支持的 career Apple 闭环

- `career teachin detail --calendar --reminders`
- `career teachin signup --confirm --calendar --reminders`
- `career jobfair detail --calendar --reminders`
- `career jobfair signup --confirm --calendar --reminders`

兼容别名同样可用：

- `view` 等同于 `detail`
- `apply` / `join` 等同于 `signup`

## 两种使用模式

### 1. 只做本地导入

直接用 `detail` / `view`：

```bash
node dist/apple-cli.js career teachin detail --id 174791 --calendar --reminders
node dist/apple-cli.js career jobfair detail --id 49326 --calendar --reminders
```

特点：

- 不触发远端报名
- 不依赖 career 登录
- 适合“先把近期宣讲会 / 招聘会塞进 Apple Calendar 和 Reminders”

### 2. 报名成功后顺手同步

用 `signup --confirm`：

```bash
node dist/apple-cli.js career teachin signup --id 174791 --confirm --calendar --reminders
node dist/apple-cli.js career jobfair signup --id 49326 --confirm --calendar --reminders
```

特点：

- 会先走 base CLI 的真实报名流程
- 只有 career 站点确认成功后，Apple 才会写入
- 如果没加 `--confirm`，依然只是预览，Apple sync 会跳过
- 预览模式下会提示用户改用 `detail` 做纯本地导入

## Apple 写入内容

每次成功同步通常会创建或更新：

- 1 个 Apple Calendar 事件
- 1 个“活动开始”提醒
- 1 个准备提醒

准备提醒文案：

- 线上活动：`检查链接/准备简历`
- 线下活动：`带简历/确认地点`

## 登录要求

- `detail/view`：不需要 SYSU 登录
- `signup --confirm`：如果还没播种 `career-session.json`，先执行：

```bash
node dist/cli.js auth workwechat
```

然后再重试 Apple 命令。

## 幂等行为

- Apple 侧使用稳定 `sourceKey`
- 同一个活动重复执行时，会更新已有事件 / 提醒，而不是无限重复创建

## 建议参数

- `--calendar`
  - 写入 Apple Calendar
- `--reminders`
  - 写入 Apple Reminders
- `--calendar-name <name>`
  - 指定日历名，默认 `SYSU Anything`
- `--reminders-list <name>`
  - 指定提醒列表名，默认 `SYSU Anything`
- `--alert-minutes <n>`
  - 活动提醒提前分钟数，默认 30
- `--prep-reminder-minutes <n>`
  - 准备提醒提前分钟数，默认 60
