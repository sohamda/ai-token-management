<#
.SYNOPSIS
  Render an HTML slide deck to a shareable PDF using Edge headless.

.DESCRIPTION
  Uses Microsoft Edge in headless mode to print the HTML deck (with ?print=1)
  to a PDF. Each slide becomes one A4 landscape page.
  Re-run any time the HTML changes to refresh the PDF.

.PARAMETER Html
  Path to the source HTML deck. Defaults to the enterprise deck.

.PARAMETER Output
  Path to write the PDF to. Defaults to <Html base name>.pdf next to the source.

.PARAMETER Open
  Open the PDF after generation.

.EXAMPLE
  .\export-pdf.ps1
  .\export-pdf.ps1 -Open
  .\export-pdf.ps1 -Html ..\presentations\token-presentation.html -Output .\deck.pdf
#>
[CmdletBinding()]
param(
  [string]$Html = (Join-Path $PSScriptRoot '..\..\presentations\token-presentation-enterprise.html'),
  [string]$Output,
  [switch]$Open
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $Html)) { throw "HTML not found: $Html" }
$Html = (Resolve-Path $Html).Path
if (-not $Output) { $Output = [IO.Path]::ChangeExtension($Html, '.pdf') }
$Output = [IO.Path]::GetFullPath($Output)

# Locate Edge (stable, then beta, then dev).
$edgeCandidates = @(
  "$Env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${Env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$Env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe",
  "$Env:ProgramFiles\Microsoft\Edge Beta\Application\msedge.exe",
  "$Env:ProgramFiles\Microsoft\Edge Dev\Application\msedge.exe"
) | Where-Object { $_ -and (Test-Path $_) }
$edge = $edgeCandidates | Select-Object -First 1
if (-not $edge) { throw "Microsoft Edge was not found. Install Edge or edit `$edgeCandidates." }

# Build a file:// URL with ?print=1 so the deck switches into PDF layout.
$uri = [Uri]("file:///" + ($Html -replace '\\','/'))
$url = "$($uri.AbsoluteUri)?print=1"

# Use a throw-away profile so we don't disturb the user's Edge state.
$profileDir = Join-Path ([IO.Path]::GetTempPath()) ("edge-pdf-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $profileDir | Out-Null

# Ensure output folder exists.
$outDir = Split-Path -Parent $Output
if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

Write-Host "Rendering deck -> PDF" -ForegroundColor Cyan
Write-Host "  Source : $Html"
Write-Host "  Output : $Output"

$edgeArgs = @(
  '--headless=new'
  '--disable-gpu'
  '--run-all-compositor-stages-before-draw'
  '--no-pdf-header-footer'
  '--hide-scrollbars'
  '--no-first-run'
  '--no-default-browser-check'
  "--user-data-dir=$profileDir"
  "--virtual-time-budget=60000"
  "--print-to-pdf=$Output"
  $url
)

try {
  & $edge @edgeArgs | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Edge exited with code $LASTEXITCODE" }
  if (-not (Test-Path $Output)) { throw "Edge ran but no PDF was produced." }
  $sizeKB = [math]::Round((Get-Item $Output).Length / 1KB, 1)
  Write-Host "[OK] Wrote $Output ($sizeKB KB)" -ForegroundColor Green
  if ($Open) { Start-Process $Output }
}
finally {
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue $profileDir
}
