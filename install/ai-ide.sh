#!/usr/bin/env bash
set -euo pipefail

DEST="${1:-${SYSU_ANYTHING_SKILL_HOME:-$PWD/SYSU-Anything.skill}}"

npx -y sysu-anything-cli-skill@latest deploy --target ai-ide --dest "$DEST"
npx -y sysu-anything-apple-skill@latest deploy --target ai-ide --dest "$DEST"

echo
echo "SYSU-Anything.skill portable bundle is ready at: $DEST"
echo "Import or point your AI IDE to this folder to use the campus skill pack."
