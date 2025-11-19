# Step 12: Testing Server Setup - Guide

## Prerequisites Check

Before testing, ensure:
1. ✅ MongoDB is running
2. ✅ Server port is available (or changed)
3. ✅ Environment variables are set

---

## Issue 1: Port 5000 Conflict

**Problem:** Port 5000 is being used by macOS AirPlay service.

**Solution:** Change the server port to 5001 (or another available port).

### Update Server Port

1. Edit `server/.env`:
```env
PORT=5001
```

2. Update `client/.env` (if it exists):
```env
VITE_API_URL=http://localhost:5001/api
```

---

## Issue 2: MongoDB Not Running

**Problem:** MongoDB process is not running.

### Start MongoDB

**Option A: If installed via Homebrew**
```bash
brew services start mongodb-community
# or
mongod --config /opt/homebrew/etc/mongod.conf
```

**Option B: If installed manually**
```bash
mongod
```

**Option C: If using MongoDB Atlas (Cloud)**
- Update `MONGODB_URI` in `server/.env` with your Atlas connection string
- No local MongoDB needed

**Verify MongoDB is running:**
```bash
# Check if MongoDB is listening on port 27017
lsof -i :27017

# Or try connecting
mongosh
```

---

## Step-by-Step Testing

### Step 1: Start MongoDB

```bash
# Start MongoDB (choose the method that works for your setup)
mongod
# OR
brew services start mongodb-community
```

**Expected output:**
```
waiting for connections on port 27017
```

### Step 2: Update Port (if needed)

If port 5000 is in use, update `server/.env`:
```env
PORT=5001
```

### Step 3: Start the Server

```bash
cd server
npm run dev
```

**Expected output:**
```
MongoDB Connected: 127.0.0.1
Server running on port 5001
```

### Step 4: Test Health Endpoint

Open a **new terminal** (keep server running) and run:

```bash
# If using port 5001
curl http://localhost:5001/api/health

# Expected response:
# {"status":"OK","message":"Server is running"}
```

**Or test in browser:**
- Navigate to: `http://localhost:5001/api/health`

### Step 5: Test Signup Endpoint

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Save the token** from the response for the next test!

### Step 6: Test Login Endpoint

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Step 7: Test Protected Route

Replace `YOUR_TOKEN` with the token from signup/login:

```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected response:**
```json
{
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Test without token (should fail):**
```bash
curl http://localhost:5001/api/auth/me
```

**Expected response:**
```json
{
  "message": "Not authorized, no token provided"
}
```

---

## Troubleshooting

### Server won't start

**Error: "Port already in use"**
- Change `PORT` in `server/.env` to a different port (e.g., 5001, 3001)
- Kill the process using the port: `lsof -ti:5000 | xargs kill -9`

**Error: "MongoDB connection failed"**
- Ensure MongoDB is running: `mongosh` should connect
- Check `MONGODB_URI` in `server/.env`
- Verify MongoDB is listening: `lsof -i :27017`

### Endpoints return errors

**Error: "Cannot GET /api/health"**
- Check server is running: `lsof -i :5001` (or your port)
- Verify route is registered in `app.ts`

**Error: "Validation failed"**
- Check request body format (must be valid JSON)
- Verify required fields are present
- Check validation schema in `validators.ts`

**Error: "Not authorized"**
- Verify token is included in Authorization header
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

---

## Testing Checklist

- [ ] MongoDB is running
- [ ] Server starts without errors
- [ ] Health endpoint returns OK
- [ ] Signup creates user and returns token
- [ ] Login with valid credentials returns token
- [ ] Login with invalid credentials returns error
- [ ] Protected route requires valid token
- [ ] Protected route returns user info
- [ ] Protected route without token returns 401

---

## Next Steps

Once all tests pass:
1. ✅ Server setup is complete
2. ✅ Authentication endpoints are working
3. ✅ Ready to move to client-side implementation (Steps 13-15)

---

## Quick Test Script

Save this as `test-endpoints.sh`:

```bash
#!/bin/bash

PORT=${1:-5001}
BASE_URL="http://localhost:$PORT"

echo "Testing Health Endpoint..."
curl -s "$BASE_URL/api/health" | python3 -m json.tool
echo -e "\n"

echo "Testing Signup..."
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}')
echo "$SIGNUP_RESPONSE" | python3 -m json.tool

TOKEN=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
echo -e "\nToken: $TOKEN\n"

echo "Testing Protected Route..."
curl -s "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
echo -e "\n"

echo "Testing Login..."
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' | python3 -m json.tool
```

**Usage:**
```bash
chmod +x test-endpoints.sh
./test-endpoints.sh 5001
```

