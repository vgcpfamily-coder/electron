#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$HOME/bin/electron"
mkdir -p "$(dirname "$TARGET")"
sed -E "s~^PROJECT_DIR=\"__PROJECT_DIR__\"$~PROJECT_DIR=\"$SCRIPT_DIR\"~" "$SCRIPT_DIR/electron" > "$TARGET"
chmod +x "$TARGET"
npm install

echo "Installed $TARGET pointing to $SCRIPT_DIR"

