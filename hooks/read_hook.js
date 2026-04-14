async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  // readPath is the path to the file that Claude is trying to read
  const readPath =
    toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || "";

  if (readPath.includes(".env")) {
    console.error("Claude is trying to read the .env file, which is not allowed.");
    process.exit(2);
  }
}

main();

// {
//   "session_id": "2d6a1e4d-6...",
//   "transcript_path": "/Users/sg/...",
//   "hook_event_name": "PreToolUse",
//   "tool_name": "Read",
//   "tool_input": {
//   "file_path": "/code/queries/.env"
// }
// }
