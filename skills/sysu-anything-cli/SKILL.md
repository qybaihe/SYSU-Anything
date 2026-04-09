---
name: sysu-anything-cli
description: Use when the user wants to operate SYSU campus services through the SYSU Anything CLI, including offline Guangzhou shuttle lookup, Qiguan rides between Zhuhai and Guangzhou, Rain Classroom web login/check-in/homework submit flows, JWXT timetable and leave flows, campus chat, gym booking, libic seminar-room reservation, career teachin/jobfair/job workflows, explore seminar/research flows, xgxt work-study and holiday leave/return-school flows, and CAS-based login/session recovery.
metadata:
  {
    "openclaw":
      {
        "emoji": "🎓",
        "requires": { "bins": ["sysu-anything"] },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "sysu-anything",
              "bins": ["sysu-anything", "sysu-anything-apple"],
              "label": "Install SYSU Anything CLI (npm)",
            },
          ],
      },
  }
---

# SYSU anything CLI

Use the published `sysu-anything` CLI instead of re-deriving campus APIs. Prefer the installed binary. If `sysu-anything` is missing, install the compiled package with `npm i -g sysu-anything` or use one-off calls via `npx -y sysu-anything@latest ...`. If the user is actively developing the local repo, the checked-out workspace build is also acceptable.

If the user explicitly wants Apple Calendar / Apple Reminders integration on macOS, switch to the separate Apple entrypoint described in `references/apple.md`.

## First step

1. Confirm the runtime path:
   - preferred: `sysu-anything`
   - one-off fallback: `npx -y sysu-anything@latest`
   - local-dev fallback inside the repo: `npm run build`
2. Prefer targeted help before composing a command:
   - `sysu-anything --help`
   - `sysu-anything <command> --help`
   - `sysu-anything <command> <subcommand> --help`
3. Before any login-dependent feature, read `references/auth-and-state.md` and identify what session or token is required.
4. Check login state before the real action:
   - `bus`: no login check needed
   - `qg`: no login check needed; prefer `sysu-anything qg --help` or `sysu-anything qg list --today --available`
   - `ykt`: `sysu-anything ykt status`
   - `today` / `jwxt`: `sysu-anything jwxt status`
   - `chat`: `sysu-anything chat sources`
   - `gym`: `sysu-anything gym profile`
   - `libic`: `sysu-anything libic whoami`
   - `explore`: `sysu-anything explore whoami`
   - `career` list/detail: no login check needed
   - `career` teachin/jobfair signup or `career job apply`: no dedicated status endpoint; if the career write path may be stale, run `sysu-anything auth workwechat` first so the command can seed `career-session.json`
   - `xgxt`: `sysu-anything xgxt current-user`
5. If the check fails, restore login first, then rerun the check, and only after that run the user’s actual command.
6. If the user wants Apple Calendar / Reminders integration, read `references/apple.md` and run `sysu-anything-apple apple doctor` before the real sync command.
7. For `chat send`, prefer the campus-news scope first:
   - run `sysu-anything chat sources`
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
