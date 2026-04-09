# Apple integration

Use the separate macOS entrypoint when the user explicitly wants Apple Calendar or Apple Reminders:

```bash
node dist/apple-cli.js ...
```

Equivalent installed binary:

```bash
sysu-anything-apple ...
```

## First step on a new Mac

Run:

```bash
node dist/apple-cli.js apple doctor
```

Optional write test:

```bash
node dist/apple-cli.js apple doctor --write-test
```

Only continue with Apple-sync workflows after `doctor` shows the required permissions are granted.

## Login requirements

- `apple doctor`: no SYSU login needed
- `qg link --calendar --reminders`: no SYSU login needed
- `ykt homework list --reminders`: needs Rain Classroom web login; check with `node dist/cli.js ykt status`
- `ykt homework detail --reminders`: needs Rain Classroom web login; check with `node dist/cli.js ykt status`
- `today --calendar`: needs JWXT login; check with `node dist/cli.js jwxt status`
- `career teachin detail --calendar --reminders`: no SYSU login needed
- `career jobfair detail --calendar --reminders`: no SYSU login needed
- `career teachin signup --confirm --calendar --reminders`: needs a live CAS session if the command still has to seed `career-session.json`; usually prime with `node dist/cli.js auth workwechat`
- `career jobfair signup --confirm --calendar --reminders`: needs a live CAS session if the command still has to seed `career-session.json`; usually prime with `node dist/cli.js auth workwechat`
- `gym book --confirm --calendar --reminders`: needs gym login; check with `node dist/cli.js gym profile`
- `explore seminar reserve --confirm --calendar --reminders`: needs explore login; check with `node dist/cli.js explore whoami`
- `jwxt leave apply --confirm --calendar-block --reminders`: needs JWXT login; check with `node dist/cli.js jwxt status`
- `xgxt workstudy apply --confirm --calendar`: needs xgxt auth; check with `node dist/cli.js xgxt current-user`

The Apple entrypoint still reuses the same state directory:

```bash
~/.sysu-anything/
```

## Current Apple closed loops

### Qiguan trip to calendar and reminders

```bash
node dist/apple-cli.js qg link 1 --calendar --reminders
node dist/apple-cli.js qg link --start zhuhai --to south --station zhuhai --time 16:00 --calendar --reminders
```

Notes:

- `qg link` currently generates a WeChat order-entry link, not a confirmed ticket
- Apple sync treats it as a planned trip
- reminders currently create two follow-ups: departure to station + bus departure

### Today to calendar

```bash
node dist/apple-cli.js today --calendar
node dist/apple-cli.js today --calendar --calendar-name SYSU --alert-minutes 10
```

### Career teachin to calendar and reminders

```bash
node dist/apple-cli.js career teachin detail --id 174791 --calendar --reminders
node dist/apple-cli.js career teachin signup --id 174791 --confirm --calendar --reminders
```

Notes:

- `detail --calendar --reminders` 只做本地导入，不依赖 career 登录
- `signup --confirm --calendar --reminders` 只有在 career 确认报名成功后才会写入 Apple
- 不加 `--confirm` 时仍然是报名预览，Apple sync 会跳过，并提示改用 `detail`
- 线上宣讲会会把 meeting link 一起写进 Calendar notes / Reminders notes

### Career jobfair to calendar and reminders

```bash
node dist/apple-cli.js career jobfair detail --id 49326 --calendar --reminders
node dist/apple-cli.js career jobfair signup --id 49326 --confirm --calendar --reminders
```

Notes:

- `detail --calendar --reminders` 适合只导入招聘会行程
- `signup --confirm --calendar --reminders` 只有在详情页真的暴露动作且提交成功后才会写入 Apple
- 招聘会详情通常提供完整时间区间，Apple 侧会按解析出的起止时间建事件
- 每次同步都按稳定 `sourceKey` upsert，重复执行会更新而不是重复创建

### Rain Classroom homework DDL to reminders

```bash
node dist/apple-cli.js ykt homework list --classroom-id 29791794 --reminders
node dist/apple-cli.js ykt homework detail --classroom-id 29791794 --leaf-id 80444748 --reminders
```

Notes:

- default behavior only imports future homework deadlines
- add `--include-past` if you also want overdue homework imported
- reminders use the homework DDL as the due time and upsert by `classroom_id + leaf_id + deadline`

### JWXT timetable to calendar

```bash
node dist/apple-cli.js jwxt timetable --calendar
node dist/apple-cli.js jwxt timetable --weekly 5 --calendar
node dist/apple-cli.js jwxt timetable --calendar --calendar-scope term
```

Notes:

- `--calendar` on `jwxt timetable` defaults to current week
- `--calendar-scope term` expands `timeDetail` into concrete semester dates
- for non-current terms, pass `--week1-date <YYYY-MM-DD>`

### Gym booking to calendar and reminders

```bash
node dist/apple-cli.js gym book --venue-type "珠海校区健身房" --date 2026-04-09 --start 09:00 --end 10:00 --confirm --calendar --reminders
```

Notes:

- without `--confirm`, gym booking remains preview-only and Apple sync is skipped
- reminders currently create two follow-ups: departure + carry campus card / water bottle

### Explore seminar reservation to calendar and reminders

```bash
node dist/apple-cli.js explore seminar reserve --id fd08b0fed61d120c5d12bb45add1e929 --confirm --calendar --reminders
```

Notes:

- without `--confirm`, seminar reserve remains preview-only and Apple sync is skipped
- the Calendar event includes title, time, location, teacher, tags, check-in time, and check-in link when available
- reminders currently create two follow-ups: seminar check-in + bring name tag / print paper

### JWXT leave to calendar block and reminders

```bash
node dist/apple-cli.js jwxt leave apply --reason 病假 --start-date 2026-04-09 --start-part 上午 --end-date 2026-04-09 --end-part 下午 --explanation "发烧去校医院" --attachment ./proof.png --confirm --calendar-block --reminders
```

Notes:

- without `--confirm`, leave apply remains preview-only and Apple sync is skipped
- reminders currently create two follow-ups: supplementary materials + approval check

### XGXT work-study slot sync to calendar

```bash
node dist/apple-cli.js xgxt workstudy apply --id 2b3c720f-6b1a-4800-a6be-3650a506ac39 --year 2026 --slots-json '[{"gwgzsjId":"2d299aaa-ef8a-47ca-b2b9-648f963dea47","xsgzkssj":"08:00","xsgzjssj":"12:00","xsgzxq":4}]' --confirm --calendar
node dist/apple-cli.js xgxt workstudy apply --id 2b3c720f-6b1a-4800-a6be-3650a506ac39 --year 2026 --slots-json '[{"gwgzsjId":"2d299aaa-ef8a-47ca-b2b9-648f963dea47","xsgzkssj":"08:00","xsgzjssj":"12:00","xsgzxq":4}]' --confirm --calendar --calendar-start-date 2026-04-13 --calendar-weeks 8
```

Notes:

- without `--confirm`, xgxt apply remains preview-only and Apple sync is skipped
- xgxt apply payloads only carry weekday + time, so the Apple layer expands them from `--calendar-start-date` or today
- default expansion is 1 week; pass `--calendar-weeks <n>` for a longer calendar plan
