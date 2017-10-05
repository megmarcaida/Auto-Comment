if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off

cd "\\192.168.6.129\Automated-Messaging"

start /min cmd /C "rs"
goto :EOF
:minimized