# Mejora la logica de posicionamiento para minimizar solapamiento sin ocultar ningun dato
$files = Get-ChildItem -Path "src\app\components" -Recurse -Filter "*.ts" | Where-Object { (Get-Content $_.FullName -Raw) -match "align: \(context: any\) => context\.datasetIndex % 2 === 0 \? 'end' : 'start'," }
Write-Host ("Archivos a actualizar: " + $files.Count)
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # 1. Actualizar align a 4 direcciones y reducir tamaño
    $oldAlign = "              align: (context: any) => context.datasetIndex % 2 === 0 ? 'end' : 'start',"
    $newAlign = "              align: (context: any) => {`r`n                const idx = context.datasetIndex % 4;`r`n                if (idx === 0) return 'end';`r`n                if (idx === 1) return 'start';`r`n                if (idx === 2) return 'right';`r`n                return 'left';`r`n              },`r`n              offset: 8,"
    
    # 2. Reducir padding y font size
    $oldPadding = "              padding: 4,"
    $newPadding = "              padding: 2,"
    
    $oldFont = "              font: {`r`n                weight: 'bold'`r`n              },"
    $newFont = "              font: {`r`n                weight: 'bold',`r`n                size: 10`r`n              },"

    $content = $content.Replace($oldAlign, $newAlign)
    $content = $content.Replace($oldPadding, $newPadding)
    $content = $content.Replace($oldFont, $newFont)
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host ("OK: " + $file.Name)
}
Write-Host "Listo."
