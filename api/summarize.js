curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: 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" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{"model": "claude-sonnet-4-6", "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello, world"}]}'
