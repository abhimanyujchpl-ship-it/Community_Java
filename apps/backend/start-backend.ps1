$ErrorActionPreference = "Stop"

function Test-JavaCommand {
    param([string] $JavaPath)

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $JavaPath -version 2>&1 | Out-Null
    $exitCode = $LASTEXITCODE
    $ErrorActionPreference = $previousErrorActionPreference

    return $exitCode -eq 0
}

function Use-Java {
    $javaCommand = Get-Command java -ErrorAction SilentlyContinue
    if ($javaCommand) {
        if (Test-JavaCommand $javaCommand.Source) {
            return
        }
    }

    $jdkRoots = @(
        "C:\Program Files\Eclipse Adoptium",
        "C:\Program Files\Java",
        "C:\Program Files\Microsoft"
    )

    $jdkHome = $jdkRoots |
        Where-Object { Test-Path $_ } |
        ForEach-Object { Get-ChildItem $_ -Directory -Filter "jdk*" -ErrorAction SilentlyContinue } |
        Sort-Object Name -Descending |
        Select-Object -First 1

    if (!$jdkHome) {
        Write-Host "Java is not installed or not added to PATH. Install JDK 17 or 21."
        exit 1
    }

    $javaExe = Join-Path $jdkHome.FullName "bin\java.exe"
    if (!(Test-Path $javaExe)) {
        Write-Host "Java is not installed or not added to PATH. Install JDK 17 or 21."
        exit 1
    }

    $env:JAVA_HOME = $jdkHome.FullName
    $env:PATH = "$($jdkHome.FullName)\bin;$env:PATH"
    if (!(Test-JavaCommand $javaExe)) {
        Write-Host "Java is not installed or not added to PATH. Install JDK 17 or 21."
        exit 1
    }
}

Use-Java

try {
    $health = Invoke-RestMethod "http://localhost:8080/api/health" -TimeoutSec 3
    if ($health.success -eq $true) {
        Write-Host "Community Connect backend is already running on port 8080."
        Write-Host "Health: http://localhost:8080/api/health"
        exit 0
    }
} catch {
}

$portInUse = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Port 8080 is already in use by another process. Stop that process or change SERVER_PORT."
    exit 1
}

if (Test-Path ".\mvnw.cmd") {
    & ".\mvnw.cmd" spring-boot:run "-Dspring-boot.run.profiles=local"
    exit $LASTEXITCODE
}

Write-Host "Maven Wrapper is missing. Expected .\mvnw.cmd in apps/backend."
exit 1
