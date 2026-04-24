# SYSU anything Apple overview

Use this skill only for macOS 12+ (Monterey+) workflows that need Apple Calendar or Apple Reminders. Prefer the installed `sysu-anything-apple` binary from the published `sysu-anything` npm package. On non-macOS or macOS 11 and below, stay on `sysu-anything` and skip the Apple sync layer.

Primary entrypoint:

```bash
sysu-anything-apple
```

## Mandatory preflight

```bash
sysu-anything-apple apple doctor
```

If `doctor` fails, do not continue with Apple sync commands.

The published Apple bridge binaries support both Apple Silicon and Intel on macOS 12+. If the user previously installed an older npm runtime with the macOS 13+ bridge, have them upgrade `sysu-anything` first.

## Login checks

- `qg link --calendar --reminders`
  - no SYSU login required
- `ykt homework list --reminders`
  - `sysu-anything ykt status`
- `ykt homework detail --reminders`
  - `sysu-anything ykt status`
- `today --calendar`
  - `sysu-anything jwxt status`
- `jwxt timetable --calendar`
  - `sysu-anything jwxt status`
- `career teachin detail --calendar --reminders`
  - no SYSU login required
- `career jobfair detail --calendar --reminders`
  - no SYSU login required
- `career teachin signup --confirm --calendar --reminders`
  - `sysu-anything auth workwechat` when `career-session.json` still needs to be seeded
- `career jobfair signup --confirm --calendar --reminders`
  - `sysu-anything auth workwechat` when `career-session.json` still needs to be seeded
- `gym book --confirm --calendar --reminders`
  - `sysu-anything gym profile`
- `libic reserve --confirm --calendar --reminders`
  - `sysu-anything libic whoami`
- `usc classroom submit --confirm --calendar --reminders`
  - `sysu-anything usc whoami --json`
- `explore seminar reserve --confirm --calendar --reminders`
  - `sysu-anything explore whoami`
- `jwxt leave apply --confirm --calendar-block --reminders`
  - `sysu-anything jwxt status`
- `xgxt workstudy apply --confirm --calendar`
  - `sysu-anything xgxt current-user`

## Command patterns

### Today

```bash
sysu-anything-apple today --calendar
```

### Timetable

```bash
sysu-anything-apple jwxt timetable --calendar
sysu-anything-apple jwxt timetable --calendar --calendar-scope term
sysu-anything-apple jwxt timetable --calendar --calendar-scope term --week1-date 2026-02-23 --term-weeks 18
```

### Qiguan

```bash
sysu-anything-apple qg link 1 --calendar --reminders
sysu-anything-apple qg link --start zhuhai --to south --station zhuhai --time 16:00 --calendar --reminders
```

Semantics:

- this writes a trip plan plus reminders
- it does not create a real Qiguan order

### Career teachin

```bash
sysu-anything-apple career teachin detail --id 174791 --calendar --reminders
sysu-anything-apple career teachin signup --id 174791 --confirm --calendar --reminders
```

This creates:

- one Apple Calendar event for the teachin
- one “活动开始” reminder
- one preparation reminder that varies by online/offline format

Notes:

- `detail` is the local-import path and does not submit remote signup
- `signup` only syncs to Apple after career confirms the signup
- preview mode still skips Apple sync and points the user back to `detail`

### Career jobfair

```bash
sysu-anything-apple career jobfair detail --id 49326 --calendar --reminders
sysu-anything-apple career jobfair signup --id 49326 --confirm --calendar --reminders
```

This creates:

- one Apple Calendar event for the jobfair
- one “活动开始” reminder
- one preparation reminder

Notes:

- `detail` is the local-import path and does not submit remote signup
- `signup` only syncs to Apple after career confirms the action
- repeated syncs upsert by stable `sourceKey`, so they update instead of duplicating

### Rain Classroom homework reminders

```bash
sysu-anything-apple ykt homework list --classroom-id 29791794 --reminders
sysu-anything-apple ykt homework detail --classroom-id 29791794 --leaf-id 80444748 --reminders
```

This creates:

- one reminder per homework deadline
- `due` directly equals the Rain Classroom DDL
- repeated runs update the same reminder instead of duplicating it

Notes:

- default behavior skips overdue homework
- add `--include-past` only when the user explicitly wants old deadlines imported

### Gym

```bash
sysu-anything-apple gym book --venue-type "珠海校区健身房" --date 2026-04-09 --start 09:00 --end 10:00 --confirm --calendar --reminders
```

### Libic seminar room

```bash
sysu-anything-apple libic reserve --kind 15 --room 401 --date 2026-04-10 --start 10:00 --end 11:00 --confirm --calendar --reminders
```

This creates:

- one Calendar event for the reserved room slot
- one “预约开始” reminder
- one “提前到场/带电脑” reminder

Notes:

- preview mode still skips Apple sync
- Apple sync only runs after libic confirms the reservation
- repeated syncs update the same event/reminders instead of duplicating them

### USC classroom reservation

```bash
sysu-anything-apple usc classroom submit --sess-id <id> --confirm --calendar --reminders
sysu-anything-apple usc classroom sync --sess-id <id> --calendar --reminders
```

This creates after BPM confirms `/site/app/start`:

- one Calendar event for the requested classroom-use time
- one “课室预约已提交” reminder before the activity
- one “课室使用开始” reminder at the requested start time

Notes:

- without `--confirm`, USC classroom submit remains preview-only and Apple sync is skipped
- `sync` backfills Apple Calendar / Reminders for an already-existing BPM session and does not call `/site/app/start`
- the Apple layer reads `examine-data` and `session-detail` after submit, so the event/reminder notes include the activity content, campus, time, people count, applicant info, and requirements
- app_id=197 initial application usually has no concrete classroom yet; notes must mark the room as pending later allocation instead of pretending a room was selected

### Explore seminar

```bash
sysu-anything-apple explore seminar reserve --id <seminarId> --confirm --calendar --reminders
```

This creates:

- one Calendar event for the seminar
- one check-in reminder
- one preparation reminder

### JWXT leave

```bash
sysu-anything-apple jwxt leave apply --reason 病假 --start-date 2026-04-09 --start-part 上午 --end-date 2026-04-09 --end-part 下午 --explanation "发烧去校医院" --attachment ./proof.png --confirm --calendar-block --reminders
```

### XGXT work-study

```bash
sysu-anything-apple xgxt workstudy apply --id 2b3c720f-6b1a-4800-a6be-3650a506ac39 --year 2026 --slots-json '[{"gwgzsjId":"2d299aaa-ef8a-47ca-b2b9-648f963dea47","xsgzkssj":"08:00","xsgzjssj":"12:00","xsgzxq":4}]' --confirm --calendar
sysu-anything-apple xgxt workstudy apply --id 2b3c720f-6b1a-4800-a6be-3650a506ac39 --year 2026 --slots-json '[{"gwgzsjId":"2d299aaa-ef8a-47ca-b2b9-648f963dea47","xsgzkssj":"08:00","xsgzjssj":"12:00","xsgzxq":4}]' --confirm --calendar --calendar-start-date 2026-04-13 --calendar-weeks 8
```

This creates:

- one Apple Calendar event per expanded work-study slot occurrence
- event notes that clearly mark the slot as coming from the submitted xgxt application template

Notes:

- xgxt payloads only carry weekday + time; they do not provide a full semester date range
- Apple sync therefore defaults to expanding 1 week from `--calendar-start-date` or today
- pass `--calendar-weeks <n>` when you want to expand multiple weeks

## Output guidance

- When `--json` is available, prefer it for machine-readable automation.
- When a write command is still in preview mode, say clearly that Apple sync was skipped.
