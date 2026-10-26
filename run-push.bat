@echo off
start "" cmd /c "timeout /t 2 >nul & cd /d S:\tedx - Copy & git add . & git commit -m \"feat: add optional reference input to registration form and admin dashboard\" & git push origin main > S:\tedx - Copy\push.log 2>&1"
exit 0
