#!/bin/bash
# Test commands for SettleIt SpoonOS Backend API
# Run these commands to test the API endpoints

BASE_URL="http://localhost:8000"

echo "=== Testing SettleIt SpoonOS Backend API ==="
echo ""

# 1. Status Check
echo "1. Checking agent status..."
curl -X GET "${BASE_URL}/api/spoon/status" \
  -H "Content-Type: application/json" \
  | jq '.'
echo ""
echo "---"
echo ""

# 2. Basic Dispute Analysis
echo "2. Testing basic dispute analysis..."
curl -X POST "${BASE_URL}/api/spoon/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "dispute_id": "dispute_test_001",
    "title": "Delivery Delay Dispute",
    "description": "The creator claims the delivery was delayed by 2 weeks, while the opponent states it was delivered on time according to the tracking information.",
    "creator_evidence": [
      {
        "id": "evid_001",
        "type": "text",
        "content": "I ordered the package on January 1st with promised delivery on January 5th, but it did not arrive until January 19th.",
        "submitted_by": "creator"
      }
    ],
    "opponent_evidence": [
      {
        "id": "evid_002",
        "type": "link",
        "content": "https://tracking.example.com/package/12345",
        "submitted_by": "opponent"
      }
    ],
    "stake_amount": 100.0
  }' | jq '.'
echo ""
echo "---"
echo ""

# 3. Quick Analysis
echo "3. Testing quick analysis..."
curl -X POST "${BASE_URL}/api/spoon/quick-analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "dispute_id": "dispute_test_004",
    "title": "Contract Breach Dispute",
    "description": "Disagreement over whether contract terms were violated.",
    "creator_evidence": [
      {
        "id": "evid_008",
        "type": "text",
        "content": "Contract violation evidence 1",
        "submitted_by": "creator"
      },
      {
        "id": "evid_009",
        "type": "text",
        "content": "Contract violation evidence 2",
        "submitted_by": "creator"
      }
    ],
    "opponent_evidence": [
      {
        "id": "evid_010",
        "type": "text",
        "content": "Contract compliance evidence",
        "submitted_by": "opponent"
      }
    ],
    "stake_amount": 1000.0
  }' | jq '.'
echo ""
echo "---"
echo ""

# 4. Complex Dispute Analysis
echo "4. Testing complex dispute analysis..."
curl -X POST "${BASE_URL}/api/spoon/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "dispute_id": "dispute_test_002",
    "title": "Service Quality Dispute",
    "description": "The creator paid for premium service but claims the quality was substandard.",
    "creator_evidence": [
      {
        "id": "evid_003",
        "type": "text",
        "content": "The service contract clearly states premium quality but the delivered work shows basic quality standards.",
        "submitted_by": "creator"
      },
      {
        "id": "evid_004",
        "type": "image",
        "content": "https://example.com/images/service-quality-comparison.jpg",
        "submitted_by": "creator"
      }
    ],
    "opponent_evidence": [
      {
        "id": "evid_006",
        "type": "text",
        "content": "The service was delivered according to the specifications in section 3.2 of the contract.",
        "submitted_by": "opponent"
      }
    ],
    "stake_amount": 500.0
  }' | jq '.'
echo ""
echo "=== Tests Complete ==="

