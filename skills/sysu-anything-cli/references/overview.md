# SYSU anything CLI 概览

这个 skill 对应当前仓库里的本地 CLI：

```bash
node dist/cli.js
```

如果用户明确要 Apple Calendar / Reminders 集成，则切到单独的 macOS 入口：

```bash
node dist/apple-cli.js
```

如果 `dist/` 还没更新，先执行：

```bash
npm run build
```

推荐始终先走逐级发现：

```bash
node dist/cli.js --help
node dist/cli.js <command> --help
node dist/cli.js <command> <subcommand> --help
```

启动时的默认原则：

- 先判断用户要用哪个子系统
- 先检查该子系统的登录状态
- 登录没补齐前，不要直接执行真实动作
- 具体登录要求见 `references/auth-and-state.md`

## 能力分区

- `bus`
  - 广州校区班车离线查询
  - 不依赖登录态
- `qg`
  - 广州与珠海之间的岐关车查询
  - 生成微信下单入口链接
  - 不依赖登录态
- `ykt`
  - 雨课堂网页二维码登录
  - 课程、课堂、签到、作业查询
  - 作业详情、实验作业题目、附件上传与提交
- `today`
  - 直接输出今天的 JWXT 课程
- `jwxt`
  - 登录状态、学期课表、节次时间、请假查询与请假提交
- `chat`
  - 校内 chat 探测、登录回放、知识库范围查询、对话发送
- `gym`
  - 体育场馆认证、查询、预约
- `libic`
  - 图书馆空间 / 研讨室登录、空档查询与预约
- `explore`
  - 交叉探索平台组会、课题查询与提交
- `career`
  - 就业系统宣讲会、招聘会、岗位列表与详情
  - 宣讲会 / 招聘会报名预览与提交
  - 岗位投递预检查与简历投递
  - 岗位列表默认覆盖 `0/100/101/102` 合并分类页
- `xgxt`
  - 学工系统认证探测
  - 勤工助学岗位筛选、列表、详情、报名预览与提交
  - 长假离返校任务、详情、预览与提交
- `auth workwechat`
  - 企业微信扫码登录，播种 CAS 会话
- `apple`
  - Apple Calendar / Reminders 环境检查
  - 当前闭环：`today --calendar`、`jwxt timetable --calendar [--calendar-scope week|term]`、`qg link --calendar --reminders`、`career teachin detail/signup --calendar --reminders`、`career jobfair detail/signup --calendar --reminders`、`ykt homework list/detail --reminders`、`gym book --confirm --calendar --reminders`、`libic reserve --confirm --calendar --reminders`、`explore seminar reserve --confirm --calendar --reminders`、`jwxt leave apply --confirm --calendar-block --reminders`、`xgxt workstudy apply --confirm --calendar`

## 常见调用入口

```bash
node dist/cli.js bus --help
node dist/cli.js qg --help
node dist/cli.js today --help
node dist/cli.js jwxt timetable --help
node dist/cli.js chat send --help
node dist/cli.js gym book --help
node dist/cli.js libic reserve --help
node dist/cli.js career teachin list --help
node dist/cli.js career jobfair detail --help
node dist/cli.js career job apply --help
node dist/cli.js explore research apply --help
node dist/cli.js xgxt workstudy list --help
node dist/cli.js xgxt holiday list --help
node dist/apple-cli.js apple doctor
node dist/apple-cli.js career teachin detail --id 174791 --calendar --reminders
node dist/apple-cli.js career jobfair detail --id 49326 --calendar --reminders
```

## 选择策略

- 只是查广州班车：直接用 `bus`
- 需要珠海和广州之间的岐关车：用 `qg`
- 只是查今天课程：优先用 `today`
- 需要课表全量、周次或请假：用 `jwxt`
- 需要校园智能问答或知识库范围：用 `chat`
- 需要体育场馆时段或预约：用 `gym`
- 需要图书馆空间 / 研讨室空档或预约：用 `libic`
- 需要就业系统宣讲会、招聘会、岗位或简历投递：用 `career`
- 需要组会预约或课题报名：用 `explore`
- 需要勤工助学岗位、简历、报名，或长假离返校登记：用 `xgxt`
- 需要 Apple 日历 / 提醒事项闭环：先读 `references/apple.md`，再用 `node dist/apple-cli.js`
- 需要雨课堂二维码登录、课程/签到/作业详情或提交：读 `references/ykt.md`

## 启动检查速查

- `bus`
  - 无需登录检查
- `qg`
  - 无需登录检查
- `ykt`
  - 先跑 `node dist/cli.js ykt status`
- `today` / `jwxt`
  - 先跑 `node dist/cli.js jwxt status`
- `chat`
  - 先跑 `node dist/cli.js chat sources`
- `gym`
  - 先跑 `node dist/cli.js gym profile`
- `libic`
  - 先跑 `node dist/cli.js libic whoami`
- `explore`
  - 先跑 `node dist/cli.js explore whoami`
- `career`
  - `list` / `detail`：无需登录检查
  - `teachin/jobfair signup`、`job apply`：无单独 `status`；如果怀疑登录态过期，先跑 `node dist/cli.js auth workwechat`，后续写命令会自动播种 `career-session.json`
- `xgxt`
  - 先跑 `node dist/cli.js xgxt current-user`
- `apple`
  - 先跑 `node dist/apple-cli.js apple doctor`
  - 再按目标功能补对应的 `jwxt status`、`gym profile`、`explore whoami`、`auth workwechat` 或 career 写命令预检查

## Agent 实用建议

- 能用 `--json` 就优先用 `--json`，便于后续整理结果
- 如果命令已经覆盖能力，不要再回退到手写 HTTP
- 就业系统相关请求优先读 `references/career.md`，里面区分了公开页、写操作、Apple 导入和当前已知阻塞项
- 写操作前先读 `references/safety-and-confirm.md`
- 登录相关动作前先读 `references/auth-and-state.md`
- `xgxt current-user` 现在会在 token 过期但 CAS 仍可用时自动刷新
