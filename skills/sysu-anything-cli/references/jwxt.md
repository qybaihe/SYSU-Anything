# JWXT

JWXT 相关能力包括：

- 今日课表
- 登录状态
- 节次时间
- 指定周次课表
- 请假原因、汇总、列表、审批记录
- 请假预览与提交

## 快速入口

```bash
node dist/cli.js today
node dist/cli.js jwxt status
node dist/cli.js jwxt timetable --help
node dist/cli.js jwxt leave apply --help
```

## 读操作

```bash
node dist/cli.js today
node dist/cli.js jwxt status
node dist/cli.js jwxt section-times
node dist/cli.js jwxt timetable
node dist/cli.js jwxt timetable --weekly 4
node dist/cli.js jwxt timetable --scan-from 1 --scan-to 25
node dist/cli.js jwxt leave reasons
node dist/cli.js jwxt leave summary
node dist/cli.js jwxt leave list
node dist/cli.js jwxt leave audit --id "<askLeaveId>"
```

## 写操作

```bash
node dist/cli.js jwxt leave apply --reason 病假 --start-date 2026-04-09 --start-part 上午 --end-date 2026-04-09 --end-part 下午 --explanation "发烧去校医院"
node dist/cli.js jwxt leave apply --reason 病假 --start-date 2026-04-09 --start-part 上午 --end-date 2026-04-09 --end-part 下午 --explanation "发烧去校医院" --confirm
```

## 重要行为

- `today`
  - 会自动结合上海时间、当前学期和当前周次判断今天课程
- `jwxt timetable`
  - 支持学年、学期、周次和扫描模式
  - 当前周课表会自动换算成 JWXT 前端课表接口实际需要的 `acadYear=起始年份-学期号`
  - 课表主接口要按 `acadYear + week + submitFlag + nothroughCourseFlag` 这套参数调用
- `jwxt leave apply`
  - 默认只预览
  - 只有加 `--confirm` 才会真正提交
- 请假如需附件，先看 `jwxt leave apply --help`

## 建议顺序

1. 先 `jwxt status`
2. 再跑读命令确认学期、周次、课程或请假项
3. 真正请假前，先不带 `--confirm` 跑一次预览
