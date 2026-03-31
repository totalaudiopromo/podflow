#!/bin/bash
# Daily podflow digest via LaunchAgent
# Runs at 07:00 daily. Processes up to 20 new episodes.

set -euo pipefail

echo "$(date '+%Y-%m-%d %H:%M:%S') Podflow digest starting..."

# Load API keys
if [ -f "$HOME/.secrets.env" ]; then
  source "$HOME/.secrets.env"
fi

# Ensure podflow (npm global) is on PATH
export PATH="$HOME/.npm-global/bin:$HOME/.local/share/pnpm:/opt/homebrew/bin:/usr/local/bin:$PATH"

podflow digest --quiet --max-episodes 20

echo "$(date '+%Y-%m-%d %H:%M:%S') Podflow digest complete."
