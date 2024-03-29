# BAIFA

> 最後更新於 2024-01-16

## 部署流程

1. [環境準備](#環境準備)
2. [管理帳號設定](#管理帳號設定)
3. [SWAP 設定](#swap-設定)
4. [執行環境準備](#執行環境準備)
5. [原始碼下載與編譯](#原始碼下載與編譯)
6. [最終檢查](#最終檢查)

### 環境準備

請確保您的系統滿足以下最低要求：

- Ubuntu 22.04
- 1 Core CPU
- 2 GB Ram
- 20 GB Disk Space

### 管理帳號設定

```shell
# 建立 BAIFA 帳號
useradd -m -s /usr/bin/bash baifa
```

```shell
# 設定 BAIFA 登入密碼
passwd baifa
New password:
```

```shell
# 授權 BAIFA sudo 權限
sudo usermod -g sudo baifa
```

### SWAP 設定

```shell
# 建立 swap 檔案
sudo fallocate -l 4G /swapfile
```

```shell
# 設定 swap 與開機啟動程序
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab
```

### 執行環境準備

```shell
# 安裝必要函式庫
sudo apt-get update
sudo apt-get install openssl libtool autoconf automake uuid-dev build-essential gcc g++ software-properties-common unzip make git libcap2-bin -y
```

### Install Node

```shell
# 安裝 nodejs, pm2 並授予 80 443 port 權限
bash <(curl https://raw.githubusercontent.com/Luphia/SIMPLE/master/shell/install-env.sh -kL)
```

### 原始碼下載與編譯

```shell
# 資料夾建立與授權移轉
sudo mkdir /workspace
sudo chown baifa /workspace -R
```

```shell
# 下載原始碼
cd /workspace
git clone https://github.com/CAFECA-IO/BAIFA
```

```shell
# 安裝函式庫
cd /workspace/BAIFA
npm install
```

```shell
# 設定環境參數
cp example.local.env .env.local
vi .env.local
```

```shell
# 編譯
npm run build
```

### 最終檢查

```shell
# 啟動專案
pm2 start npm --name BAIFA -- run production
```

```shell
# 檢視 log
pm2 log BAIFA
```

```shell
# 出現以下資訊即表示起動成功
   ▲ Next.js 14.0.4
   - Local:        http://localhost:80
```

## 聯繫我們

如果您對 BAIFA 感興趣或有任何疑問，請隨時聯繫我們的客戶支持團隊。我們期待著與您一起開啟更加先進、高
效的財務管理體驗，讓您的企業在數字時代更上一層樓。
