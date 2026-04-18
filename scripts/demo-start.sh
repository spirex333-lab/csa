#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$HOME/.openclaw/workspace-ehs/ehs-portal}"
LOG_DIR="$ROOT/.run-logs"
mkdir -p "$LOG_DIR"

cd "$ROOT"

echo "[demo-start] stopping stale processes..."
pkill -f "nx run api:serve" || true
pkill -f "nx run webapp:dev" || true
pkill -f "target/debug/camera-sim-rs" || true
pkill -f "mediamtx" || true
pkill -f "ffmpeg.*8554/live" || true

sleep 1

echo "[demo-start] starting API :4000"
nohup pnpm exec nx run api:serve > "$LOG_DIR/api-dev.log" 2>&1 < /dev/null &

echo "[demo-start] starting mobile :4200"
nohup pnpm exec nx run webapp:dev --port=4200 > "$LOG_DIR/mobile-dev.log" 2>&1 < /dev/null &

echo "[demo-start] starting camera simulator (MediaMTX/ONVIF)"
nohup bash -lc "cd apps/camera-sim-rs && cargo run > ../../.run-logs/camera-sim.log 2>&1" < /dev/null &

sleep 10

echo "[demo-start] listeners"
lsof -nP -iTCP:4000 -sTCP:LISTEN || true
lsof -nP -iTCP:4200 -sTCP:LISTEN || true
lsof -nP -iTCP:8000 -sTCP:LISTEN || true
lsof -nP -iTCP:8554 -sTCP:LISTEN || true

echo "[demo-start] done. Run scripts/demo-healthcheck.sh next."
