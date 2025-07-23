#!/bin/bash
# Simple hook test runner
# Usage: ./test_hook_runner.sh [hook-type] [test-data-file]

HOOK_TYPE=${1:-"post-tool-use"}
TEST_DATA=${2:-"{}"}

# Enable debug mode
export CLAUDE_HOOKS_DEBUG=true

# Run the hook
echo "Testing $HOOK_TYPE hook..."
echo "$TEST_DATA" | python3 scripts/hooks/${HOOK_TYPE}.py

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ Hook executed successfully"
else
    echo "❌ Hook failed"
fi