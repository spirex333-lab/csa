#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Deploy the built api app to a DigitalOcean droplet via SSH.

Usage:
  tools/deploy-api.sh --host <droplet-host> --user <ssh-user> --path <remote-path> [options]

Required arguments:
  --host       Droplet hostname or IP address.
  --user       SSH user to connect as.
  --path       Absolute path on the droplet where the api should live.

Optional arguments:
  --port       SSH port (default: 22).
  --identity   Path to SSH identity file.
  --service    Systemd/PM2 service name to restart after deployment.
  --skip-build Skip running nx build (assumes dist/apps/api already exists).
  --help       Show this help message.

Example:
  tools/deploy-api.sh --host 203.0.113.10 --user deploy --path /var/www/api \\
    --service api.service --identity ~/.ssh/id_ed25519
EOF
}

HOST=""
USER=""
REMOTE_PATH=""
SSH_PORT="22"
IDENTITY=""
SERVICE_NAME=""
SKIP_BUILD="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)
      HOST="${2-}"
      shift 2
      ;;
    --user)
      USER="${2-}"
      shift 2
      ;;
    --path)
      REMOTE_PATH="${2-}"
      shift 2
      ;;
    --port)
      SSH_PORT="${2-}"
      shift 2
      ;;
    --identity)
      IDENTITY="${2-}"
      shift 2
      ;;
    --service)
      SERVICE_NAME="${2-}"
      shift 2
      ;;
    --skip-build)
      SKIP_BUILD="true"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$HOST" || -z "$USER" || -z "$REMOTE_PATH" ]]; then
  echo "Missing required arguments." >&2
  usage
  exit 1
fi

if [[ ! -d dist/apps/api || "$SKIP_BUILD" != "true" ]]; then
  echo "Building api app for production..."
  nx build api --configuration=production
fi

BUILD_DIR="dist/apps/api"

if [[ ! -d "$BUILD_DIR" ]]; then
  echo "Build output not found at $BUILD_DIR" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
ARCHIVE="$TMP_DIR/api-dist.tgz"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

tar -czf "$ARCHIVE" -C "$BUILD_DIR" .

SSH_TARGET="${USER}@${HOST}"
SSH_OPTS=(-p "$SSH_PORT")
SCP_OPTS=(-P "$SSH_PORT")

if [[ -n "$IDENTITY" ]]; then
  SSH_OPTS+=(-i "$IDENTITY")
  SCP_OPTS+=(-i "$IDENTITY")
fi

echo "Uploading archive to $SSH_TARGET..."
REMOTE_ARCHIVE="$(printf "%s" "$REMOTE_PATH" | sed 's:/*$::')/api-dist.tgz"
scp "${SCP_OPTS[@]}" "$ARCHIVE" "${SSH_TARGET}:${REMOTE_ARCHIVE}"

echo "Extracting and installing on remote host..."
ssh "${SSH_OPTS[@]}" "$SSH_TARGET" "bash -s" "$REMOTE_PATH" "$REMOTE_ARCHIVE" "$SERVICE_NAME" <<'EOF'
set -euo pipefail

REMOTE_DIR="$1"
ARCHIVE_PATH="$2"
SERVICE_NAME="${3-}"

mkdir -p "$REMOTE_DIR"
tar -xzf "$ARCHIVE_PATH" -C "$REMOTE_DIR"
rm "$ARCHIVE_PATH"

cd "$REMOTE_DIR"
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --prod --frozen-lockfile
elif command -v npm >/dev/null 2>&1; then
  npm install --omit=dev
else
  echo "No package manager (pnpm/npm) found on the droplet. Skipping dependency installation." >&2
fi

if [[ -n "$SERVICE_NAME" ]]; then
  if command -v systemctl >/dev/null 2>&1; then
    sudo systemctl restart "$SERVICE_NAME"
  elif command -v pm2 >/dev/null 2>&1; then
    pm2 restart "$SERVICE_NAME"
  else
    echo "No supported process manager found to restart $SERVICE_NAME. Skipping." >&2
  fi
fi
EOF

echo "Deployment complete."
