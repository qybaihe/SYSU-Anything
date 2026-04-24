---
name: sysu-anything-apple
description: Use when the user wants the macOS 12+ Apple-enhanced SYSU workflow layer, especially natural-language requests such as 把课表同步到日历、把雨课堂 ddl 加到提醒事项、把宣讲会或招聘会写进日历、把岐关行程加提醒、预约健身房并同步日历、预约图书馆研讨室并提醒我、USC课室预约提交后写入日历和提醒事项、请假后写入日历、勤工助学时间同步到日历, or any fuzzy request about Apple Calendar or Apple Reminders integration for SYSU campus tasks.
metadata:
  {
    "openclaw":
      {
        "emoji": "🍎",
        "os": ["darwin"],
        "requires": { "bins": ["sysu-anything-apple"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "sysu-anything",
              "bins": ["sysu-anything", "sysu-anything-apple"],
              "label": "Install SYSU Anything Apple runtime (npm)",
            },
          ],
      },
  }
---

# SYSU anything Apple

Use the published macOS Apple entrypoint instead of re-deriving EventKit flows. Prefer the installed `sysu-anything-apple` binary. If it is missing, install the compiled package with `npm i -g sysu-anything`. If the user is actively developing the local repo, the checked-out workspace build is also acceptable.

This skill is for macOS 12+ (Monterey+) only. The published Apple native bridge supports both Apple Silicon and Intel. On non-macOS or macOS 11 and below, keep using `sysu-anything-cli`; only the Apple Calendar / Apple Reminders layer is unavailable.

```bash
sysu-anything-apple
```

## First step

1. Confirm the runtime path:
   - preferred: `sysu-anything-apple`
   - install if missing: `npm i -g sysu-anything`
   - local-dev fallback inside the repo: `npm run build`
   - supported host: macOS 12+ only
   - unsupported host fallback: use `sysu-anything` without Apple sync
   - if the user previously installed an older npm runtime, ask them to upgrade `sysu-anything` before retrying Apple sync
2. Prefer targeted help before composing a command:
   - `sysu-anything-apple --help`
   - `sysu-anything-apple <command> --help`
   - `sysu-anything-apple <command> <subcommand> --help`
3. Always verify the Mac-side bridge first:
   - `sysu-anything-apple apple doctor`
4. Check the SYSU-side login state before the real action:
   - `qg`: no login check needed
   - `ykt homework list/detail --reminders`: `sysu-anything ykt status`
   - `today` / `jwxt timetable` / `jwxt leave apply`: `sysu-anything jwxt status`
   - `career teachin detail/jobfair detail --calendar --reminders`: no SYSU login check needed
   - `career teachin signup/jobfair signup --confirm --calendar --reminders`: if the command still needs to seed `career-session.json`, run `sysu-anything auth workwechat` first
   - `gym book`: `sysu-anything gym profile`
   - `libic reserve`: `sysu-anything libic whoami`
   - `usc classroom submit --confirm --calendar --reminders`: `sysu-anything usc whoami --json`
   - `explore seminar reserve`: `sysu-anything explore whoami`
   - `xgxt workstudy apply --calendar`: `sysu-anything xgxt current-user`
5. If the check fails, restore login first, rerun the check, then run the Apple sync command.

The Apple entrypoint reuses the same state directory:

```bash
~/.sysu-anything/
```

## Routing

- If you need the command map or examples, read `references/overview.md`.
- For Apple-specific career teachin/jobfair import and signup-sync behavior, read `references/career.md`.
- For Apple-specific libic reservation sync behavior, read `references/libic.md`.
- Prefer `--json` when another agent or script needs structured output.

## Closed Loops

- `today --calendar`
- `jwxt timetable --calendar [--calendar-scope week|term]`
- `qg link --calendar --reminders`
- `career teachin detail --calendar --reminders`
- `career teachin signup --confirm --calendar --reminders`
- `career jobfair detail --calendar --reminders`
- `career jobfair signup --confirm --calendar --reminders`
- `ykt homework list --reminders`
- `ykt homework detail --reminders`
- `gym book --confirm --calendar --reminders`
- `libic reserve --confirm --calendar --reminders`
- `usc classroom submit --confirm --calendar --reminders`
- `usc classroom sync --calendar --reminders`
- `explore seminar reserve --confirm --calendar --reminders`
- `jwxt leave apply --confirm --calendar-block --reminders`
- `xgxt workstudy apply --confirm --calendar [--calendar-start-date <YYYY-MM-DD>] [--calendar-weeks <n>]`

## Safety

- `qg link --calendar --reminders` creates a planned trip in Apple apps; it does not mean the ticket is confirmed.
- `career teachin/jobfair detail --calendar --reminders` is local import only; it does not touch the remote signup state.
- `career teachin/jobfair signup` without `--confirm` stays in preview mode and skips Apple sync; use the corresponding `detail` command if the user only wants local Calendar / Reminders import.
- `gym book`, `libic reserve`, `usc classroom submit`, `explore seminar reserve`, `jwxt leave apply`, and `xgxt workstudy apply` only perform real writes with `--confirm`.
- `usc classroom submit --calendar --reminders` writes Apple items only after BPM `/site/app/start` returns OK. The initial app_id=197 application usually has no concrete classroom yet; Apple notes should say the room is pending later allocation.
- `usc classroom sync --calendar --reminders` only backfills local Apple items from an already-existing BPM session. It does not call `/site/app/start`.
- `ykt homework list/detail --reminders` defaults to future deadlines only; add `--include-past` when the user explicitly wants overdue items imported too.
- `xgxt workstudy apply --calendar` writes the submitted work-study time template into Apple Calendar; because xgxt payloads only contain weekday + time, the Apple layer defaults to expanding 1 week unless `--calendar-weeks` is provided.
- Run `apple doctor` before the first sync on a new Mac or after macOS permission changes.
