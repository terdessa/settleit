"""
Python test script for SettleIt SpoonOS Backend API
Run with: python test_api.py
"""
import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:8000"


def print_response(title: str, response: requests.Response):
    """Print formatted response."""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response:\n{json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")


def test_status():
    """Test the status endpoint."""
    print("\n[1] Testing GET /api/spoon/status")
    try:
        response = requests.get(f"{BASE_URL}/api/spoon/status")
        print_response("Status Check", response)
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_quick_analysis():
    """Test the quick analysis endpoint."""
    print("\n[2] Testing POST /api/spoon/quick-analysis")
    payload = {
        "dispute_id": "test_quick_001",
        "title": "Quick Test Dispute",
        "description": "Testing quick analysis endpoint",
        "creator_evidence": [
            {
                "id": "evid_1",
                "type": "text",
                "content": "Creator evidence 1",
                "submitted_by": "creator"
            },
            {
                "id": "evid_2",
                "type": "text",
                "content": "Creator evidence 2",
                "submitted_by": "creator"
            }
        ],
        "opponent_evidence": [
            {
                "id": "evid_3",
                "type": "text",
                "content": "Opponent evidence",
                "submitted_by": "opponent"
            }
        ],
        "stake_amount": 100.0
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/spoon/quick-analysis",
            json=payload
        )
        print_response("Quick Analysis", response)
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_analyze_basic():
    """Test basic dispute analysis."""
    print("\n[3] Testing POST /api/spoon/analyze (Basic)")
    payload = {
        "dispute_id": "test_analyze_001",
        "title": "Delivery Delay Dispute",
        "description": "The creator claims the delivery was delayed by 2 weeks.",
        "creator_evidence": [
            {
                "id": "evid_001",
                "type": "text",
                "content": "Ordered on Jan 1st, promised delivery Jan 5th, arrived Jan 19th.",
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
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/spoon/analyze",
            json=payload
        )
        print_response("Basic Analysis", response)
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return False


def test_analyze_complex():
    """Test complex dispute analysis with multiple evidence types."""
    print("\n[4] Testing POST /api/spoon/analyze (Complex)")
    payload = {
        "dispute_id": "test_analyze_002",
        "title": "Service Quality Dispute",
        "description": "The creator paid for premium service but claims the quality was substandard.",
        "creator_evidence": [
            {
                "id": "evid_003",
                "type": "text",
                "content": "Contract states premium quality but delivered work shows basic standards.",
                "submitted_by": "creator"
            },
            {
                "id": "evid_004",
                "type": "image",
                "content": "https://example.com/images/comparison.jpg",
                "submitted_by": "creator"
            },
            {
                "id": "evid_005",
                "type": "document",
                "content": "https://example.com/documents/contract.pdf",
                "submitted_by": "creator"
            }
        ],
        "opponent_evidence": [
            {
                "id": "evid_006",
                "type": "text",
                "content": "Service delivered according to specifications in section 3.2.",
                "submitted_by": "opponent"
            },
            {
                "id": "evid_007",
                "type": "document",
                "content": "https://example.com/documents/checklist.pdf",
                "submitted_by": "opponent"
            }
        ],
        "stake_amount": 500.0
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/spoon/analyze",
            json=payload
        )
        print_response("Complex Analysis", response)
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def test_analyze_no_evidence():
    """Test analysis with no evidence."""
    print("\n[5] Testing POST /api/spoon/analyze (No Evidence)")
    payload = {
        "dispute_id": "test_analyze_003",
        "title": "Payment Dispute",
        "description": "The creator claims payment was not received.",
        "creator_evidence": [],
        "opponent_evidence": [],
        "stake_amount": 250.0
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/spoon/analyze",
            json=payload
        )
        print_response("No Evidence Analysis", response)
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False


def main():
    """Run all tests."""
    print("="*60)
    print("SettleIt SpoonOS Backend API Tests")
    print("="*60)
    
    results = []
    
    # Run tests
    results.append(("Status Check", test_status()))
    results.append(("Quick Analysis", test_quick_analysis()))
    results.append(("Basic Analysis", test_analyze_basic()))
    results.append(("Complex Analysis", test_analyze_complex()))
    results.append(("No Evidence Analysis", test_analyze_no_evidence()))
    
    # Print summary
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    for test_name, passed in results:
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name:.<40} {status}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")


if __name__ == "__main__":
    main()

