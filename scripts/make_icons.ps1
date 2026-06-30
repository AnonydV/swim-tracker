Add-Type -AssemblyName System.Drawing

function Make-Icon($size, $outPath) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g   = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $bg = [System.Drawing.ColorTranslator]::FromHtml('#07090f')
  $g.Clear($bg)

  # Rounded corners
  $rad = [int]($size * 0.19)
  $gp  = New-Object System.Drawing.Drawing2D.GraphicsPath
  $gp.AddArc(0,          0,          $rad*2, $rad*2, 180, 90)
  $gp.AddArc($size-$rad*2, 0,          $rad*2, $rad*2, 270, 90)
  $gp.AddArc($size-$rad*2, $size-$rad*2, $rad*2, $rad*2, 0,   90)
  $gp.AddArc(0,          $size-$rad*2, $rad*2, $rad*2, 90,  90)
  $gp.CloseFigure()
  $g.SetClip($gp)
  $g.FillPath((New-Object System.Drawing.SolidBrush($bg)), $gp)

  # Swim wave — blue
  $blue = [System.Drawing.ColorTranslator]::FromHtml('#38bdf8')
  $sw   = [int]([Math]::Max(3, $size * 0.052))
  $pen  = New-Object System.Drawing.Pen($blue, $sw)
  $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round

  # Draw wave as bezier segments: up-down-up-down pattern
  $wy  = [float]($size * 0.40)
  $top = [float]($size * 0.29)
  $bot = [float]($size * 0.50)
  $x0  = [float]($size * 0.10)
  $x1  = [float]($size * 0.28)
  $x2  = [float]($size * 0.38)
  $x3  = [float]($size * 0.50)
  $x4  = [float]($size * 0.62)
  $x5  = [float]($size * 0.72)
  $x6  = [float]($size * 0.90)

  $g.DrawBezier($pen,
    [System.Drawing.PointF]::new($x0, $wy),
    [System.Drawing.PointF]::new($x1, $top),
    [System.Drawing.PointF]::new($x2, $bot),
    [System.Drawing.PointF]::new($x3, $wy))
  $g.DrawBezier($pen,
    [System.Drawing.PointF]::new($x3, $wy),
    [System.Drawing.PointF]::new($x4, $top),
    [System.Drawing.PointF]::new($x5, $bot),
    [System.Drawing.PointF]::new($x6, $wy))
  $pen.Dispose()

  # Bike — yellow
  $yellow = [System.Drawing.ColorTranslator]::FromHtml('#facc15')
  $sw2    = [int]([Math]::Max(2, $size * 0.042))
  $penB   = New-Object System.Drawing.Pen($yellow, $sw2)
  $penB.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $penB.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
  $penB.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

  $cy  = [float]($size * 0.70)
  $r   = [float]($size * 0.125)
  $cx1 = [float]($size * 0.31)
  $cx2 = [float]($size * 0.69)
  $mid = [float]($size * 0.50)
  $top2 = [float]($size * 0.545)

  $g.DrawEllipse($penB, $cx1-$r, $cy-$r, $r*2, $r*2)
  $g.DrawEllipse($penB, $cx2-$r, $cy-$r, $r*2, $r*2)
  $g.DrawLine($penB,
    [System.Drawing.PointF]::new($cx1, $cy),
    [System.Drawing.PointF]::new($mid,  $top2))
  $g.DrawLine($penB,
    [System.Drawing.PointF]::new($mid,  $top2),
    [System.Drawing.PointF]::new($cx2,  $cy))
  $g.DrawLine($penB,
    [System.Drawing.PointF]::new($mid, $top2),
    [System.Drawing.PointF]::new($mid, $cy))
  $penB.Dispose()

  $g.Dispose()
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "Created: $outPath"
}

$base = 'C:\Users\vicba\OneDrive\Documents\HIPLAN'
Make-Icon 192 "$base\icon-192.png"
Make-Icon 512 "$base\icon-512.png"
Write-Host "Done."
