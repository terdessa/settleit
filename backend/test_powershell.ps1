# PowerShell test script for SettleIt SpoonOS Backend API
# Run this script to test the API endpoints

$BaseUrl = "http://localhost:8000"

Write-Host "=== Testing SettleIt SpoonOS Backend API ===" -ForegroundColor Cyan
Write-Host ""

# 1. Status Check
Write-Host "1. Checking agent status..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/spoon/status" -Method Get -ContentType "application/json"
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# 2. Basic Dispute Analysis
Write-Host "2. Testing basic dispute analysis..." -ForegroundColor Yellow
$body = @{
    dispute_id = "dispute_test_001"
    title = "Delivery Delay Dispute"
    description = "The creator claims the delivery was delayed by 2 weeks, while the opponent states it was delivered on time according to the tracking information."
    creator_evidence = @(
        @{
            id = "evid_001"
            type = "text"
            content = "I ordered the package on January 1st with promised delivery on January 5th, but it did not arrive until January 19th."
            submitted_by = "creator"
        }
    )
    opponent_evidence = @(
        @{
            id = "evid_002"
            type = "link"
            content = "https://tracking.example.com/package/12345"
            submitted_by = "opponent"
        }
    )
    stake_amount = 100.0
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/spoon/analyze" -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# 3. Quick Analysis
Write-Host "3. Testing quick analysis..." -ForegroundColor Yellow
$quickBody = @{
    dispute_id = "dispute_test_004"
    title = "Contract Breach Dispute"
    description = "Disagreement over whether contract terms were violated."
    creator_evidence = @(
        @{
            id = "evid_008"
            type = "text"
            content = "Contract violation evidence 1"
            submitted_by = "creator"
        },
        @{
            id = "evid_009"
            type = "text"
            content = "Contract violation evidence 2"
            submitted_by = "creator"
        }
    )
    opponent_evidence = @(
        @{
            id = "evid_010"
            type = "text"
            content = "Contract compliance evidence"
            submitted_by = "opponent"
        }
    )
    stake_amount = 1000.0
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/spoon/quick-analysis" -Method Post -Body $quickBody -ContentType "application/json"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# 4. Complex Dispute Analysis
Write-Host "4. Testing complex dispute analysis..." -ForegroundColor Yellow
$complexBody = @{
    dispute_id = "dispute_test_002"
    title = "Service Quality Dispute"
    description = "The creator paid for premium service but claims the quality was substandard."
    creator_evidence = @(
        @{
            id = "evid_003"
            type = "text"
            content = "The service contract clearly states premium quality but the delivered work shows basic quality standards."
            submitted_by = "creator"
        },
        @{
            id = "evid_004"
            type = "image"
            content = "https://example.com/images/service-quality-comparison.jpg"
            submitted_by = "creator"
        }
    )
    opponent_evidence = @(
        @{
            id = "evid_006"
            type = "text"
            content = "The service was delivered according to the specifications in section 3.2 of the contract."
            submitted_by = "opponent"
        }
    )
    stake_amount = 500.0
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/spoon/analyze" -Method Post -Body $complexBody -ContentType "application/json"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""
Write-Host "=== Tests Complete ===" -ForegroundColor Green

