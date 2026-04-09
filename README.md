# SYSU-Anything.skill

> 让 Agent 打通你的校园所有场景。

`SYSU-Anything.skill` 不是一个普通的校园工具集合，而是一层面向 AI Agent 的校园操作系统。

它的目标很直接：

- 打通中山大学分散在不同域名、不同登录体系、不同交互逻辑里的校园系统
- 把这些能力沉淀成 Agent 可以直接调用的 skill layer
- 让 Agent 真正渗透你的校园生活，从查信息到办事情，从提醒到日历闭环，从课表到求职，把效率抬到新的量级

这是一个有野心的项目。它想做的不是“再做一个校园脚本”，而是把 SYSU 的校园服务升级成 AI Native 的基础设施。

## 为什么是它

`SYSU-Anything.skill` 现在已经覆盖并统一了大量高频校园场景：

- 广州校区班车
- 珠海-广州岐关车
- JWXT 今日课表、全量课表、请假
- 雨课堂登录、签到、作业、DDL 提醒
- 校内 Chat / 知识库问答
- 体育场馆查询与预约
- libic 图书馆空间 / 研讨室
- 交叉探索平台组会 / 课题
- 就业系统宣讲会 / 招聘会 / 岗位投递
- xgxt 勤工助学 / 长假离返校
- Apple Calendar / Apple Reminders 校园闭环

换句话说，这个 skill pack 的目标不是做一个点工具，而是把“查课表、看班车、报讲座、约场馆、投简历、同步提醒”这种分散动作，收束成一个 Agent 可以持续理解、持续执行、持续协作的统一能力层。

## Skill 形态

这个项目当前公开分发的是两个 skill：

- `sysu-anything-cli-skill`
  负责校园主操作层，覆盖班车、岐关、JWXT、YKT、chat、gym、libic、explore、career、xgxt 等系统
- `sysu-anything-apple-skill`
  负责 macOS Apple Calendar / Reminders 闭环，把高价值校园动作写进你的时间系统

这两个 npm 包只分发 skill payload 和部署器：

- `SKILL.md`
- `agents/`
- `references/`
- 部署脚本

它们不会通过 npm 分发校园运行时代码或高风险自动化源码，这样既方便安装，也更适合开源传播。

## 支持的两种版本

### 1. OpenAI Codex / Codex Cloud 版本

适合已经在用 Codex、Codex Cloud、或兼容 `~/.codex/skills` 的 Agent 运行时。

安装两个 skill：

```bash
npx -y sysu-anything-cli-skill@latest deploy --target codex
npx -y sysu-anything-apple-skill@latest deploy --target codex
```

一键部署：

```bash
curl -fsSL https://raw.githubusercontent.com/qybaihe/SYSU-Anything/main/install/codex.sh | bash
```

部署完成后，重启你的 Agent / Codex 运行时即可生效。

### 2. AI IDE 版本

适合 Cursor、Windsurf、Cline、Trae、Copilot Workspace、以及任何支持本地 prompt pack / skill bundle / AGENTS.md 的 AI IDE。

它会把 skill 打包成一个可移植目录，默认输出到当前目录下的 `SYSU-Anything.skill/`。

安装两个 skill：

```bash
npx -y sysu-anything-cli-skill@latest deploy --target ai-ide --dest ./SYSU-Anything.skill
npx -y sysu-anything-apple-skill@latest deploy --target ai-ide --dest ./SYSU-Anything.skill
```

一键部署：

```bash
curl -fsSL https://raw.githubusercontent.com/qybaihe/SYSU-Anything/main/install/ai-ide.sh | bash
```

部署完成后，把 `SYSU-Anything.skill/` 目录作为你的 AI IDE 本地 skill / prompt bundle 即可使用。

## npm 包

- [sysu-anything-cli-skill](https://www.npmjs.com/package/sysu-anything-cli-skill)
- [sysu-anything-apple-skill](https://www.npmjs.com/package/sysu-anything-apple-skill)

## 用它你能做什么

有了这两个 skill，你的 Agent 可以自然接管大量校园动作，例如：

- “帮我看今天在珠海校区有什么课，顺手同步进日历”
- “查一下明天岐关车有没有票，生成下单入口，并提醒我提前出发”
- “看一下最近校内新闻，优先走校内资讯源”
- “帮我查一下 gym 某个场地今天晚上还有没有空位”
- “把这场宣讲会导入我的日历，并提醒我带简历”
- “把雨课堂这门课所有有 DDL 的作业写进提醒事项”
- “查一下 libic 明天下午有没有空研讨室，能约的话帮我准备好预约参数”
- “看看勤工助学有没有新岗位，把报名时段同步成未来几周的固定日历块”

这不是 demo。这是一个真的可以进入你校园日常工作流的 Agent skill stack。

## 项目方向

`SYSU-Anything.skill` 会继续沿着一个非常明确的方向演进：

- 更完整地打通中大校园平台
- 更彻底地把碎片化校园服务收束为统一 skill
- 让 Agent 从“会回答问题”走向“会真正替你完成校园事务”
- 让你的时间、提醒、任务、课表、出行、求职、活动形成闭环

如果说传统校园工具解决的是“你能不能自己找到入口”，
那 `SYSU-Anything.skill` 想解决的是：

你的 Agent 能不能直接替你理解场景、调用系统、组织行动，并持续提升你的生活效率。

这就是它的野心。
