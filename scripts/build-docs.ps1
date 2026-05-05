# Build Docs Script for InheronMUD

# 1. Generate API Reference
pnpm run docs:api

# 2. Sync Markdown docs to Starlight
$dest = "apps/docs/src/content/docs/project"
$apiDest = "apps/docs/src/content/docs/api"

if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Force -Path $dest

function Get-Slug {
    param([string]$name)
    $slug = $name.ToLower()
    $slug = $slug -replace '[^a-z0-9\.]', '-'
    $slug = $slug -replace '-+', '-'
    $slug = $slug -replace '^-|-$', ''
    return $slug
}

function Add-Frontmatter {
    param([string]$filePath, [string]$defaultTitle)
    $content = Get-Content -Path $filePath -Raw -Encoding utf8
    
    # Check if it already has frontmatter
    if ($content -match "^---") {
        return
    }

    # Try to find the first H1 header for the title
    $title = $defaultTitle
    if ($content -match "^#\s+(.+)$") {
        $title = $Matches[1].Trim()
    }

    $frontmatter = "---`ntitle: $title`n---`n`n"
    Set-Content -Path $filePath -Value ($frontmatter + $content) -Encoding utf8
}

# Process Directories
Get-ChildItem -Path "docs" -Directory -Exclude "api-reference" | ForEach-Object {
    $folderSlug = Get-Slug $_.Name
    $target = Join-Path $dest $folderSlug
    New-Item -ItemType Directory -Force -Path $target
    
    Get-ChildItem -Path $_.FullName -File -Recurse | ForEach-Object {
        $fileSlug = Get-Slug $_.BaseName
        $ext = $_.Extension
        $targetFile = Join-Path $target "$fileSlug$ext"
        Copy-Item -Path $_.FullName -Destination $targetFile -Force
        if ($ext -eq ".md" -or $ext -eq ".mdx") {
            Add-Frontmatter $targetFile $fileSlug
        }
    }
}

# Process Root MDs
Get-ChildItem -Path "docs\*.md" | ForEach-Object {
    $fileSlug = Get-Slug $_.BaseName
    $targetFile = Join-Path $dest "$fileSlug.md"
    Copy-Item -Path $_.FullName -Destination $targetFile -Force
    Add-Frontmatter $targetFile $fileSlug
}

# Process API Docs (Add frontmatter to all)
Get-ChildItem -Path $apiDest -Filter "*.md" -Recurse | ForEach-Object {
    Add-Frontmatter $_.FullName $_.BaseName
}

Write-Host "Docs synced, slugified and frontmatter added."
