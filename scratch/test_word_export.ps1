$ErrorActionPreference = "Stop"

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    Write-Host "Word application created successfully. Version: $($word.Version)"
    
    $docPath = Join-Path (Get-Location) "Insurance-Template.docx"
    $pdfPath = Join-Path (Get-Location) "scratch\test_output.pdf"
    
    if (Test-Path $docPath) {
        $doc = $word.Documents.Open($docPath)
        # wdExportFormatPDF = 17
        $doc.ExportAsFixedFormat($pdfPath, 17)
        $doc.Close($false)
        Write-Host "Exported PDF successfully to: $pdfPath"
    } else {
        Write-Host "Template docx not found at $docPath"
    }
    
    $word.Quit()
} catch {
    Write-Host "Word COM error: $_"
}
