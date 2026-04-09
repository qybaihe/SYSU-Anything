# Career 就业系统

`career` 对应：

```bash
node dist/cli.js career ...
```

站点基于：

- `https://career.sysu.edu.cn/teachin`
- `https://career.sysu.edu.cn/jobfair`
- `https://career.sysu.edu.cn/job/search/d_category[0]/0/d_category[1]/100/d_category[2]/101/d_category[3]/102`

## 能力拆分

### 宣讲会 `career teachin`

- `list`
  - 公开页列表
  - 支持按标题、线上/线下、日期范围筛选
- `detail` / `view`
  - 公开页详情
  - 可拿到结构化字段、正文、当前页面动作、线上 meeting link
- `signup` / `apply` / `join`
  - 默认只做报名预览
  - `--confirm` 后才真实提交

### 招聘会 `career jobfair`

- `list`
  - 公开页列表
  - 支持类型、标题、日期范围筛选
- `detail` / `view`
  - 公开页详情
  - 可拿到结构化字段、正文、当前页面动作
- `signup` / `apply` / `join`
  - 只有页面真的暴露动作时才可提交
  - 默认仍是预览，`--confirm` 才真实发请求

### 岗位 `career job`

- `list`
  - 默认抓取 `0/100/101/102` 合并分类搜索页
  - 支持标题、城市、页码、本地 limit 过滤
- `detail` / `view`
  - 岗位结构化字段、单位信息、工作地址、当前投递动作
- `apply` / `signup` / `deliver`
  - 先走 `/job/chooseResume` 预检查可投递简历
  - 再走 `/job/chooseResumeApply` 真实投递
  - 默认只预检查，`--confirm` 才真实投递

## 登录与状态

- `teachin/jobfair/job` 的 `list/detail` 是公开页，不依赖登录
- `teachin/jobfair signup`、`job apply` 需要登录
- 写操作会优先复用 `~/.sysu-anything/session.json` 里的 CAS 会话
- 成功进入 career 后，会把站点 cookie 持久化到 `~/.sysu-anything/career-session.json`
- 目前没有单独的 `career status` 命令；写操作前如果怀疑登录态过期，先跑：

```bash
node dist/cli.js auth workwechat
```

## 当前已知阻塞项

- `career job apply` 可能先被“请先填写就业意向”拦住
- 即使已有简历，也可能因为“简历完整度需达到 90% 以上”而无法投递
- CLI 现在会尽量打印：
  - 投递门槛
  - 简历管理页可见简历
  - 默认简历标记
  - 简历完整度
  - 最近更新时间

## 常用命令

```bash
node dist/cli.js career teachin list --limit 10
node dist/cli.js career teachin detail --id 174791
node dist/cli.js career teachin signup --id 174791

node dist/cli.js career jobfair list --limit 10
node dist/cli.js career jobfair detail --id 49326
node dist/cli.js career jobfair signup --id 49326

node dist/cli.js career job list --limit 10
node dist/cli.js career job detail --id 2370124
node dist/cli.js career job apply --id 2370124
```

## Apple 侧

如果用户明确要把宣讲会或招聘会导入 Apple Calendar / Reminders，切到：

```bash
node dist/apple-cli.js career teachin detail --id 174791 --calendar --reminders
node dist/apple-cli.js career jobfair detail --id 49326 --calendar --reminders
```

Apple 版本还支持在 `signup --confirm` 成功后顺手同步本地日历和提醒事项，详见 `references/apple.md` 或 Apple skill 里的 `references/career.md`。
