#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
echo "🔎 Smoke test against $BASE_URL"

check() {
  local method="$1"; shift
  local path="$1"; shift
  local data="${1:-}"

  local code
  if [[ -n "$data" ]]; then
    code=$(curl -sS -m 10 --connect-timeout 3 -o /dev/null -w "%{http_code}" \
      -X "$method" -H "Content-Type: application/json" "$BASE_URL$path" \
      --data "$data")
  else
    code=$(curl -sS -m 10 --connect-timeout 3 -o /dev/null -w "%{http_code}" \
      -X "$method" "$BASE_URL$path")
  fi

  if [[ "$code" == "200" || "$code" == "201" || "$code" == "204" ]]; then
    echo "✅ $method $path -> HTTP $code"
  else
    echo "❌ $method $path -> HTTP $code"
    exit 1
  fi
}

# ---------- payloads ----------
login_payload='{"email":"student@uni.edu","password":"pass1234"}'
reserve_payload='{"userId":"usr_001","itemId":"itm_1234","facility":"IM Lab","date":"2025-10-16","timeSlot":"14:00-16:00"}'
waitlist_payload='{"userId":"usr_001","itemId":"itm_9999"}'
pay_payload='{"method":"card","last4":"1234","name":"Ada Student","email":"student@uni.edu"}'
prefs_payload='{"userId":"usr_001","email":true,"sms":false,"inApp":true,"reminder":{"startDaysBefore":5,"frequency":"daily"}}'
staff_add_item='{"name":"Mirrorless Camera","category":"Electronics","facility":"IM Lab","status":"available"}'
checkout_payload='{"userId":"usr_001","itemId":"itm_1234"}'
checkin_payload='{"itemId":"itm_1234"}'

# ---------- tests ----------
# health/root
check GET /api/health
# check GET /  # uncomment if you serve root

# catalog & search
check GET /api/items
check GET "/api/items?q=canon&category=Electronics&facility=IM%20Lab"

# facilities
check GET /api/facilities
check GET /api/facilities/im-lab/items

# auth
check POST /api/auth/student/login "$login_payload"

# reservations & borrowals
check POST /api/reservations "$reserve_payload"
check GET "/api/reservations?userId=usr_001"
check POST /api/waitlist "$waitlist_payload"
check GET "/api/borrowals?userId=usr_001"

# fines & payments
check GET "/api/fines?userId=usr_001"
check POST /api/payments/fin_202/pay "$pay_payload"
check GET "/api/payments/history?userId=usr_001"

# notifications & policies
check GET "/api/notifications/preferences?userId=usr_001"
check PUT /api/notifications/preferences "$prefs_payload"
check GET /api/policies

# staff/admin
check GET /api/staff/inventory
check POST /api/staff/items "$staff_add_item"
check POST /api/staff/checkout "$checkout_payload"
check POST /api/staff/checkin "$checkin_payload"
check GET /api/staff/reservations
check GET /api/staff/overdue
check GET /api/staff/alerts
check GET /api/staff/fines

echo "🎉 All smoke tests passed!"
