param(
  [string]$SourcePath = (Join-Path $PSScriptRoot '..\references\brand\loop-logo-guide-option-5.png'),
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\public\brand')
)

Add-Type -AssemblyName System.Drawing

$resolvedSource = (Resolve-Path -LiteralPath $SourcePath).Path
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
[System.IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

$crop = [System.Drawing.Rectangle]::new(1104, 215, 392, 72)
$source = [System.Drawing.Bitmap]::new($resolvedSource)
$fullColor = [System.Drawing.Bitmap]::new(
  $crop.Width,
  $crop.Height,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)
$white = [System.Drawing.Bitmap]::new(
  $crop.Width,
  $crop.Height,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)

$backgroundCutoff = 5
$symbolRightEdge = 140
$columnDifference = New-Object 'double[]' $crop.Width
$textDifference = 0.0

for ($sampleX = 0; $sampleX -lt $crop.Width; $sampleX++) {
  $columnMaximum = 0.0

  for ($neighborX = [Math]::Max(0, $sampleX - 3); $neighborX -le [Math]::Min($crop.Width - 1, $sampleX + 3); $neighborX++) {
    for ($sampleY = 0; $sampleY -lt $crop.Height; $sampleY++) {
      $sample = $source.GetPixel($crop.X + $neighborX, $crop.Y + $sampleY)
      $sampleDifference = [Math]::Max(
        255 - $sample.R,
        [Math]::Max(255 - $sample.G, 255 - $sample.B)
      )
      $columnMaximum = [Math]::Max($columnMaximum, $sampleDifference)
    }
  }

  $columnDifference[$sampleX] = $columnMaximum
  if ($sampleX -ge $symbolRightEdge) {
    $textDifference = [Math]::Max($textDifference, $columnMaximum)
  }
}

try {
  for ($y = 0; $y -lt $crop.Height; $y++) {
    for ($x = 0; $x -lt $crop.Width; $x++) {
      $pixel = $source.GetPixel($crop.X + $x, $crop.Y + $y)
      $difference = [Math]::Max(
        255 - $pixel.R,
        [Math]::Max(255 - $pixel.G, 255 - $pixel.B)
      )

      $foregroundDifference = if ($x -lt $symbolRightEdge) {
        $columnDifference[$x]
      } else {
        $textDifference
      }

      if ($difference -le $backgroundCutoff -or $foregroundDifference -le $backgroundCutoff) {
        $alpha = 0
      } else {
        $alpha = [Math]::Round(
          [Math]::Min(
            1,
            ($difference - $backgroundCutoff) / ($foregroundDifference - $backgroundCutoff)
          ) * 255
        )
      }

      if ($alpha -eq 0) {
        $fullColor.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        $white.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        continue
      }

      $normalizedAlpha = $alpha / 255
      $red = [Math]::Round([Math]::Max(0, [Math]::Min(255, ($pixel.R - (255 * (1 - $normalizedAlpha))) / $normalizedAlpha)))
      $green = [Math]::Round([Math]::Max(0, [Math]::Min(255, ($pixel.G - (255 * (1 - $normalizedAlpha))) / $normalizedAlpha)))
      $blue = [Math]::Round([Math]::Max(0, [Math]::Min(255, ($pixel.B - (255 * (1 - $normalizedAlpha))) / $normalizedAlpha)))

      $fullColor.SetPixel(
        $x,
        $y,
        [System.Drawing.Color]::FromArgb($alpha, $red, $green, $blue)
      )
      $white.SetPixel(
        $x,
        $y,
        [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255)
      )
    }
  }

  $fullColor.Save(
    (Join-Path $resolvedOutput 'loop-combination-full-color.png'),
    [System.Drawing.Imaging.ImageFormat]::Png
  )
  $white.Save(
    (Join-Path $resolvedOutput 'loop-combination-white.png'),
    [System.Drawing.Imaging.ImageFormat]::Png
  )
} finally {
  $source.Dispose()
  $fullColor.Dispose()
  $white.Dispose()
}
