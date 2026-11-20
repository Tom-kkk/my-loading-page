@echo off
cd /d "%~dp0"
if not exist node_modules call npm install
start "Amico shelf" /min cmd /c "npm run dev"
powershell -NoProfile -Command "for($i=0;$i -lt 60;$i++){try{Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8090/ -TimeoutSec 1|Out-Null;break}catch{Start-Sleep -Milliseconds 500}}" >nul 2>&1
start "" http://127.0.0.1:8090/
echo 书架已经在 http://127.0.0.1:8090/ 打开。关掉最小化的窗口就会停掉。
pause
