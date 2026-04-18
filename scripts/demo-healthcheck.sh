#!/usr/bin/env bash
set -euo pipefail

HOST_IP="${1:-192.168.1.2}"
API="http://$HOST_IP:4000"
MOBILE="http://$HOST_IP:4200"
SIM="http://$HOST_IP:8000"

pass(){ echo "✅ $1"; }
warn(){ echo "⚠️  $1"; }
fail(){ echo "❌ $1"; }

code_api=$(curl -s -o /tmp/ehs_api.out -w "%{http_code}" "$API/api" || true)
if [[ "$code_api" =~ ^2|3|4 ]]; then pass "API reachable ($code_api)"; else fail "API not reachable"; fi

code_mobile=$(curl -s -o /tmp/ehs_mobile.out -w "%{http_code}" "$MOBILE" || true)
if [[ "$code_mobile" =~ ^2|3 ]]; then pass "Mobile reachable ($code_mobile)"; else fail "Mobile not reachable"; fi

sim_health=$(curl -s "$SIM/health" || true)
if [[ "$sim_health" == "ok" ]]; then pass "Camera sim health ok"; else fail "Camera sim health failed"; fi

sim_status=$(curl -s "$SIM/status" || true)
if echo "$sim_status" | grep -q 'publisher_alive":true'; then
  pass "MediaMTX publisher alive"
else
  warn "Publisher not alive (fallback may be needed)"
fi

rtsp="rtsp://$HOST_IP:8554/live"
echo "ℹ️  Expected RTSP demo URL: $rtsp"

echo "--- camera status ---"
echo "$sim_status" | head -c 400; echo
