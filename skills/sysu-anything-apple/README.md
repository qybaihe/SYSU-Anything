# sysu-anything-apple-skill

The macOS 12+ Apple-enhanced edition of `SYSU-Anything.skill`.

Recommended:

- macOS 12+ (Monterey+): install this together with `sysu-anything-cli`
- Non-macOS or macOS 11 and below: use `sysu-anything-cli` only

Capability boundary:

- This edition is the macOS enhancement on top of the standard campus layer
- It shares the same campus workflow coverage as the standard edition
- The only added capability is Apple Calendar / Apple Reminders integration

Compatibility:

- The repository build of the Apple native bridge now targets macOS 12+ on both Apple Silicon and Intel
- If your installed `sysu-anything` runtime still ships the older macOS 13+ bridge, wait for the next runtime release or build the local workspace yourself
- The one-click install scripts in the repo now auto-skip the Apple pack on unsupported systems

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
