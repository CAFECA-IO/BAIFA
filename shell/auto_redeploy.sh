#!/bin/bash

# 設定工作目錄
cd /workspace/BAIFA/

# 檢查是否有更新
git fetch

# 比較本地和遠端分支
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "New commits detected. Pulling latest changes..."
  git pull
  echo "Running build..."
  npm run build
  echo "Restarting application..."
  pm2 delete BAIFA
  pm2 start npm --name BAIFA -- run production
else
  echo "No new commits."
fi
