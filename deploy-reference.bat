@echo off
echo ==============================================
echo Switching to TEDxKLH project...
echo ==============================================
cd /d "S:\tedx - Copy"
echo Current folder: %CD%
echo.
echo Staging and committing changes...
git add .
git commit -m "feat: add optional reference input to registration form and admin dashboard"
echo.
echo Pushing to GitHub (origin main)...
git push origin main
echo.
echo ==============================================
echo SUCCESS! Pushed to GitHub.
echo Vercel is now deploying to:
echo https://tedxklhbowrampet.in/apply
echo ==============================================
pause
