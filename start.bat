@echo off
echo Running npm install...
call npm install
if %errorlevel% neq 0 (
    echo npm install failed!
    pause
    exit /b %errorlevel%
)

echo Running...
call node main.js
if %errorlevel% neq 0 (
    echo run failed!
    pause
    exit /b %errorlevel%
)

pause