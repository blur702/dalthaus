#!/bin/bash

# Get auth token
TOKEN=$(curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"(130Bpm)"}' -s | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

echo "Creating sample content for ordering test..."

# Create 3 sample articles
for i in 1 2 3; do
  curl -X POST http://localhost:5001/api/content/articles \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"title\": \"Sample Article $i for Ordering\",
      \"body\": \"<p>This is sample article number $i created to test the ordering functionality.</p>\",
      \"status\": \"published\",
      \"slug\": \"sample-article-$i\",
      \"summary\": \"Sample article $i for testing drag and drop ordering\"
    }" -s > /dev/null
  echo "✓ Created Article $i"
done

# Create 3 sample photo books
for i in 1 2 3; do
  curl -X POST http://localhost:5001/api/content/photo-books \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"title\": \"Sample Photo Book $i\",
      \"body\": \"<p>This is sample photo book number $i created to test the ordering functionality.</p>\",
      \"status\": \"published\",
      \"slug\": \"sample-photo-book-$i\",
      \"summary\": \"Sample photo book $i for testing\"
    }" -s > /dev/null
  echo "✓ Created Photo Book $i"
done

echo ""
echo "✅ Sample content created successfully!"
echo ""
echo "Now you can:"
echo "1. Go to http://localhost:5001/admin/content/articles"
echo "2. Click 'Reorder Articles' button"
echo "3. Drag and drop the articles to reorder them"
echo "4. Click 'Save Order' to save the new order"