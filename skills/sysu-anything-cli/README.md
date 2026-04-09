# sysu-anything-cli-skill

The standard cross-platform edition of `SYSU-Anything.skill`.

Recommended:

- Non-macOS: install this standard edition
- macOS: keep this as the base layer, then add `sysu-anything-apple`

Capability boundary:

- This is the baseline campus workflow layer
- The Apple edition keeps the same campus capability coverage
- The only extra layer in Apple edition is Apple Calendar / Apple Reminders integration

Install for OpenAI Codex / Codex Cloud:

```bash
npx -y sysu-anything-cli-skill@latest deploy --target codex
```

Build a portable AI IDE bundle:

```bash
npx -y sysu-anything-cli-skill@latest deploy --target ai-ide --dest ./SYSU-Anything.skill
```

Install from ClawHub / OpenClaw:

```bash
clawhub install sysu-anything-cli
npm i -g sysu-anything
```

Repo:

- [SYSU-Anything](https://github.com/qybaihe/SYSU-Anything)
