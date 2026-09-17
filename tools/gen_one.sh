#!/usr/bin/env bash
# Usage: tools/gen_one.sh <name> <size WxH> <prompt>
# Generates one image via Codex CLI's built-in image_gen tool and saves art/raw/<name>.png.
# Codex saves images under ~/.codex/generated_images/<its own thread id>/, so we tell it to copy
# from its own thread directory (parallel runs must not grab each other's "newest" file).
set -euo pipefail
NAME="$1"; SIZE="$2"; PROMPT="$3"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/art/raw/$NAME.png"
mkdir -p "$ROOT/art/raw" "$ROOT/art/logs"
case "$SIZE" in
  1536x1024) ORIENT="Wide landscape orientation (3:2).";;
  1024x1536) ORIENT="Tall portrait orientation (2:3).";;
  *) ORIENT="Square orientation (1:1).";;
esac
codex exec --skip-git-repo-check -s workspace-write -C "$ROOT" \
  "Call the image_gen tool exactly once (if it accepts a size parameter use $SIZE, otherwise omit it) with this exact prompt: \"$PROMPT $ORIENT\". The tool saves the PNG under ~/.codex/generated_images/<thread-id>/ ; use the exact file path the image_gen tool result reports (the one for THIS thread, not the newest file globally) and cp it to $DEST. Do not edit any other files. Reply with only the final path." \
  > "$ROOT/art/logs/$NAME.log" 2>&1
test -f "$DEST" && echo "OK $DEST" || { echo "FAIL $NAME"; tail -20 "$ROOT/art/logs/$NAME.log"; exit 1; }
