# Pre-publish scan: secrets, contact data, and employer-identifying strings in public repo files.
param([string[]]$Roots = @("$PSScriptRoot\..", "$PSScriptRoot\..\..\profile-repo"))
$patterns = @(
  'sk-[A-Za-z0-9]{20,}', 'ghp_[A-Za-z0-9]{20,}', 'AKIA[0-9A-Z]{16}', 'Bearer\s+[A-Za-z0-9._-]{20,}', 'apify_api_\w+',
  '\b\d{3}[-. ]?\d{3}[-. ]?\d{4}\b', '[\w.+-]+@[\w-]+\.[\w.]+',
  '192\.168\.\d+\.\d+', 'coreopsfs', 'AKfycb', 'docs\.google\.com', '\bAWL\b', 'Script ID'
)
$hits = 0
foreach ($r in $Roots) {
  Get-ChildItem $r -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\\.git\\|scan-public\.ps1' } | ForEach-Object {
      $f = $_
      foreach ($p in $patterns) {
        Select-String -Path $f.FullName -Pattern $p -ErrorAction SilentlyContinue | ForEach-Object { $hits++; "{0}:{1}: matches /{2}/" -f $f.Name, $_.LineNumber, $p }
      }
    }
}
if ($hits -eq 0) { "CLEAN: no flagged patterns" } else { "$hits flagged line(s). Review each." }
