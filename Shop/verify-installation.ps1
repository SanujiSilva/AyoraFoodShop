# Ayora Foods - Installation Verification Script
# Run this script to verify all dependencies are installed correctly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ayora Foods - Installation Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js v16 or higher." -ForegroundColor Red
    $errors++
}

Write-Host ""

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found." -ForegroundColor Red
    $errors++
}

Write-Host ""

# Check backend dependencies
Write-Host "Checking backend dependencies..." -ForegroundColor Yellow
if (Test-Path "backend/node_modules") {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend dependencies not installed. Run: cd backend; npm install" -ForegroundColor Yellow
}

Write-Host ""

# Check frontend dependencies
Write-Host "Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules") {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend dependencies not installed. Run: cd frontend; npm install" -ForegroundColor Yellow
}

Write-Host ""

# Check .env file
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env file not found. Copy .env.example to .env and configure it" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($errors -eq 0) {
    Write-Host "✅ All checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Configure backend/.env file with your MongoDB URI" -ForegroundColor White
    Write-Host "2. Run 'cd backend; npm run seed' to add sample data" -ForegroundColor White
    Write-Host "3. Run 'cd backend; npm start' to start backend" -ForegroundColor White
    Write-Host "4. Run 'cd frontend; npm run dev' to start frontend" -ForegroundColor White
} else {
    Write-Host "❌ Please fix the errors above before proceeding" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
