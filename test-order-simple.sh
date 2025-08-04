#!/bin/bash
TOKEN=$(curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"(130Bpm)"}' -s | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

echo "Testing order update..."
curl -X PUT http://localhost:5001/api/content/articles/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"items":[{"id":"test1"},{"id":"test2"}]}' \
  -v 2>&1 | grep -E "< HTTP|error"