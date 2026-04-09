---
name: sysu-anything-cli
description: Use when the user wants to operate SYSU campus services through the local sysu-anything CLI in this workspace, including offline Guangzhou shuttle lookup, Qiguan rides between Zhuhai and Guangzhou, Rain Classroom web login/check-in/homework submit flows, JWXT timetable and leave flows, campus chat, gym booking, libic seminar-room reservation, career teachin/jobfair/job workflows, explore seminar/research flows, xgxt work-study and holiday leave/return-school flows, and CAS-based login/session recovery.
---

# SYSU anything CLI

Use the local `sysu-anything` project in this workspace instead of re-deriving APIs when the user wants to use campus-service capabilities that are already wrapped by the CLI.

If the user explicitly wants Apple Calendar / Apple Reminders integration on macOS, switch to the separate Apple entrypoint described in `references/apple.md`.

## First step

1. Work from the repo root.
2. Prefer targeted help before composing a command:
   - `node dist/cli.js --help`
   - `node dist/cli.js <command> --help`
   - `node dist/cli.js <command> <subcommand> --help`
3. If `dist/` is missing or stale, run:
   - `npm run build`
4. Before any login-dependent feature, read `references/auth-and-state.md` and identify what session or token is required.
5. Check login state before the real action:
   - `bus`: no login check needed
   - `qg`: no login check needed; prefer `node dist/cli.js qg --help` or `node dist/cli.js qg list --today --available`
   - `ykt`: `node dist/cli.js ykt status`
   - `today` / `jwxt`: `node dist/cli.js jwxt status`
   - `chat`: `node dist/cli.js chat sources`
   - `gym`: `node dist/cli.js gym profile`
   - `libic`: `node dist/cli.js libic whoami`
   - `explore`: `node dist/cli.js explore whoami`
   - `career` list/detail: no login check needed
   - `career` teachin/jobfair signup or `career job apply`: no dedicated status endpoint; if the career write path may be stale, run `node dist/cli.js auth workwechat` first so the command can seed `career-session.json`
   - `xgxt`: `node dist/cli.js xgxt current-user`
6. If the check fails, restore login first, then rerun the check, and only after that run the user’s actual command.
7. If the user wants Apple Calendar / Reminders integration, read `references/apple.md` and run `node dist/apple-cli.js apple doctor` before the real sync command.
8. For `chat send`, prefer the campus-news scope first:
   - run `node dist/cli.js chat sources`
   - if the list contains `校园资讯` or `校内资讯`, prefer that exact returned title by default
   - only switch to another scope when the user explicitly asks for it or the source list shows a better match

## Routing

- If you are unsure where a capability lives, read `references/overview.md`.
- For login state and cached files, read `references/auth-and-state.md`.
- For career teachin/jobfair/job list/detail/signup/apply flows, read `references/career.md`.
- For offline Guangzhou shuttle lookup, read `references/bus.md`.
- For Qiguan rides between Zhuhai and Guangzhou, read `references/qiguan.md`.
- For Apple Calendar / Reminders integration, read `references/apple.md`.
- For Rain Classroom login, courses, classroom/check-in/homework flows, read `references/ykt.md`.
- For course timetable or leave flows, read `references/jwxt.md`.
- For campus chat login, scopes, or messaging, read `references/chat.md`.
- For gym availability or booking, read `references/gym.md`.
- For libic seminar-room refresh / availability / reservation flows, read `references/libic.md`.
- For explore seminar or research flows, read `references/explore.md`.
- For xgxt work-study or holiday leave/return-school flows, read `references/xgxt.md`.

## Safety

- Login-dependent features must not skip the login check step.
- Read `references/safety-and-confirm.md` before any write operation.
- Prefer preview/query commands before mutation commands.
- Do not add `--confirm` unless the user clearly wants the real submission.
- Prefer the existing CLI over browser automation unless the user explicitly asks for a lower-level path.
