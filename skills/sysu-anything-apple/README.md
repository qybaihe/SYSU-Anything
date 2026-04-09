# sysu-anything-apple-skill

The macOS Apple-enhanced edition of `SYSU-Anything.skill`.

Recommended:

- macOS: install this together with `sysu-anything-cli`
- Non-macOS: use `sysu-anything-cli` only

Capability boundary:

- This edition is the macOS enhancement on top of the standard campus layer
- It shares the same campus workflow coverage as the standard edition
- The only added capability is Apple Calendar / Apple Reminders integration

Install for OpenAI Codex / Codex Cloud:

```bash
npx -y sysu-anything-apple-skill@latest deploy --target codex
```

Build a portable AI IDE bundle:

```bash
npx -y sysu-anything-apple-skill@latest deploy --target ai-ide --dest ./SYSU-Anything.skill
```

Install from ClawHub / OpenClaw:

```bash
clawhub install sysu-anything-cli
clawhub install sysu-anything-apple
npm i -g sysu-anything
```

Repo:

- [SYSU-Anything](https://github.com/qybaihe/SYSU-Anything)
