#!/usr/bin/env bash
set -euo pipefail

npx -y sysu-anything-cli-skill@latest deploy --target codex
npx -y sysu-anything-apple-skill@latest deploy --target codex

echo
echo "SYSU-Anything.skill has been deployed to your Codex skills directory."
echo "Restart Codex or your agent runtime to load the new skills."
