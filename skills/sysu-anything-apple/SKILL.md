---
name: sysu-anything-apple
description: Use when the user wants SYSU Anything on macOS with Apple Calendar or Apple Reminders integration, including Apple permission checks, today/timetable calendar sync, Qiguan trip reminders, Rain Classroom homework deadline reminders, career teachin/jobfair imports, gym booking sync, libic seminar-room reservation sync, explore seminar reservation sync, JWXT leave calendar blocks, and xgxt work-study slot calendar sync.
---

# SYSU anything Apple

Use the local Apple-enhanced entrypoint instead of re-deriving EventKit flows:

```bash
node dist/apple-cli.js
```

Equivalent installed binary:

```bash
sysu-anything-apple
```

## First step

1. Work from the repo root.
2. Prefer targeted help before composing a command:
   - `node dist/apple-cli.js --help`
   - `node dist/apple-cli.js <command> --help`
   - `node dist/apple-cli.js <command> <subcommand> --help`
3. If `dist/` is missing or stale, run:
   - `npm run build`
4. Always verify the Mac-side bridge first:
   - `node dist/apple-cli.js apple doctor`
5. Check the SYSU-side login state before the real action:
   - `qg`: no login check needed
   - `ykt homework list/detail --reminders`: `node dist/cli.js ykt status`
   - `today` / `jwxt timetable` / `jwxt leave apply`: `node dist/cli.js jwxt status`
   - `career teachin detail/jobfair detail --calendar --reminders`: no SYSU login check needed
   - `career teachin signup/jobfair signup --confirm --calendar --reminders`: if the command still needs to seed `career-session.json`, run `node dist/cli.js auth workwechat` first
   - `gym book`: `node dist/cli.js gym profile`
   - `libic reserve`: `node dist/cli.js libic whoami`
   - `explore seminar reserve`: `node dist/cli.js explore whoami`
   - `xgxt workstudy apply --calendar`: `node dist/cli.js xgxt current-user`
6. If the check fails, restore login first, rerun the check, then run the Apple sync command.

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
- `explore seminar reserve --confirm --calendar --reminders`
- `jwxt leave apply --confirm --calendar-block --reminders`
- `xgxt workstudy apply --confirm --calendar [--calendar-start-date <YYYY-MM-DD>] [--calendar-weeks <n>]`

## Safety

- `qg link --calendar --reminders` creates a planned trip in Apple apps; it does not mean the ticket is confirmed.
- `career teachin/jobfair detail --calendar --reminders` is local import only; it does not touch the remote signup state.
- `career teachin/jobfair signup` without `--confirm` stays in preview mode and skips Apple sync; use the corresponding `detail` command if the user only wants local Calendar / Reminders import.
- `gym book`, `libic reserve`, `explore seminar reserve`, `jwxt leave apply`, and `xgxt workstudy apply` only perform real writes with `--confirm`.
- `ykt homework list/detail --reminders` defaults to future deadlines only; add `--include-past` when the user explicitly wants overdue items imported too.
- `xgxt workstudy apply --calendar` writes the submitted work-study time template into Apple Calendar; because xgxt payloads only contain weekday + time, the Apple layer defaults to expanding 1 week unless `--calendar-weeks` is provided.
- Run `apple doctor` before the first sync on a new Mac or after macOS permission changes.
