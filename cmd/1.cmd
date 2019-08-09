rd /s /q %2
xcopy /y /i /e %1 %2
cd %2
for /R %%i in (*.xlsx) do ren "%%i" *.json
exit