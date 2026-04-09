# Rain Classroom / 雨课堂

这个参考页对应本仓库里已经封装好的 YKT CLI：

```bash
sysu-anything ykt
```

如果用户明确要把作业 DDL 导入 Apple Reminders，则切到：

```bash
sysu-anything-apple ykt homework list --reminders
sysu-anything-apple ykt homework detail --reminders
```

## 先做什么

1. 先看帮助：
   - `sysu-anything ykt --help`
   - `sysu-anything ykt homework --help`
   - `sysu-anything-apple ykt homework list --help`
2. 先检查雨课堂登录态：
   - `sysu-anything ykt status`
3. 如果未登录，恢复登录：
   - `sysu-anything ykt login`
   - 再重新跑一次 `sysu-anything ykt status`

## 关键状态文件

- `~/.sysu-anything/ykt-session.json`
  - 雨课堂网页登录态
- `~/.sysu-anything/qr/ykt-login.png`
  - 最近一次生成的雨课堂二维码

YKT 这条链路不复用 SYSU CAS，会单独维护自己的网页会话。

## 常用命令

```bash
sysu-anything ykt qr
sysu-anything ykt login
sysu-anything ykt status
sysu-anything ykt courses
sysu-anything ykt classroom --classroom-id 29791794
sysu-anything ykt checkin list --classroom-id 29791794
sysu-anything ykt homework list --classroom-id 29791794
sysu-anything ykt homework detail --classroom-id 29791794 --leaf-id 80444748
sysu-anything ykt homework submit --classroom-id 29791794 --leaf-id 80444748 --answers-file ./answers.json
```

## 已封装能力

- 网页端二维码登录
- 当前账号课程列表
- 课堂详情
- 签到活动查询与详情
- 作业列表
- 作业详情
  - 会自动补 exam 站点登录态
  - 能拉到 `show_paper` 和缓存答案
  - 实验类作业可读到题目、附件要求等细节
- 作业提交
  - 支持本地文件自动上传
  - 支持 `start_paper`、`answer_problem`、`submit_paper`

## 作业答案文件

- `ykt homework submit` 支持 raw `results` / `allResults`
- 也支持结构化 `answers` 数组
- 结构化格式里可以直接写本地文件路径，CLI 会自动上传附件

示例：

```json
{
  "answers": [
    {
      "problem_id": 186290158,
      "content": "见附件",
      "files": ["./report.txt"]
    }
  ]
}
```

## Apple Reminders 导入

```bash
sysu-anything-apple ykt homework list --classroom-id 29791794 --reminders
sysu-anything-apple ykt homework detail --classroom-id 29791794 --leaf-id 80444748 --reminders
```

规则：

- 默认只导入未来 DDL
- 如需连过期作业一起导入，追加 `--include-past`
- 提醒事项的 `due` 会直接使用作业 DDL
- 重复执行会按 `classroom_id + leaf_id + deadline` 更新，不会无脑重复创建
