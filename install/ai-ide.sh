#!/usr/bin/env bash
set -euo pipefail

DEST="${1:-${SYSU_ANYTHING_SKILL_HOME:-$PWD/SYSU-Anything.skill}}"

should_install_apple_skill() {
  if [[ "$(uname -s)" != "Darwin" ]]; then
    return 1
  fi

  local version major
  version="$(sw_vers -productVersion 2>/dev/null || true)"
  major="${version%%.*}"

  if [[ -z "$major" ]]; then
    return 1
  fi

  (( major >= 12 ))
}

npx -y sysu-anything-cli-skill@latest deploy --target ai-ide --dest "$DEST"

if should_install_apple_skill; then
  npx -y sysu-anything-apple-skill@latest deploy --target ai-ide --dest "$DEST"
  APPLE_NOTE="Apple skill deployed into the bundle (macOS 12+ detected)."
else
  APPLE_NOTE="Apple skill skipped. It currently requires macOS 12+; the bundle still contains the standard CLI skill."
fi

echo
echo "SYSU-Anything.skill portable bundle is ready at: $DEST"
echo "$APPLE_NOTE"
echo "Import or point your AI IDE to this folder to use the campus skill pack."
