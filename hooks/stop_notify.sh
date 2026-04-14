#!/bin/bash
payload=$(cat)
transcript=$(echo "$payload" | jq -r '.transcript_path // empty')
project=$(basename "$PWD")

task="(no task)"
if [ -n "$transcript" ] && [ -f "$transcript" ]; then
  task=$(jq -r 'select(.type=="user") | .message.content | if type=="array" then (.[] | select(.type=="text") | .text) else . end' "$transcript" 2>/dev/null \
    | grep -v '^\[' \
    | head -n 1 \
    | tr '\n' ' ' \
    | cut -c1-60)
  [ -z "$task" ] && task="(no task)"
fi

task=${task//\"/\\\"}
project=${project//\"/\\\"}

osascript -e "display notification \"$task\" with title \"Claude Code — $project\" sound name \"Glass\""