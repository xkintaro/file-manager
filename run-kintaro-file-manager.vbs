Set WshShell = CreateObject("WScript.Shell")

WshShell.Run "cmd /c cd C:\kintaro-file-manager\backend && node src/server.js", 0, False

WshShell.Run "cmd /c cd C:\kintaro-file-manager\frontend && npm run dev", 0, False
