#!/usr/bin/env bash
set -euo pipefail

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

npx -y sysu-anything-cli-skill@latest deploy --target codex

if should_install_apple_skill; then
  npx -y sysu-anything-apple-skill@latest deploy --target codex
  APPLE_NOTE="Apple skill deployed (macOS 12+ detected)."
else
  APPLE_NOTE="Apple skill skipped. It currently requires macOS 12+; the standard CLI skill is already deployed."
fi

echo
echo "SYSU-Anything.skill has been deployed to your Codex skills directory."
echo "$APPLE_NOTE"
echo "Restart Codex or your agent runtime to load the new skills."
