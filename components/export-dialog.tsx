"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { hideExportDialog } from "@/lib/slices/ui-slice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef } from "react"

export function ExportDialog() {
  const dispatch = useDispatch()
  const { showExportDialog } = useSelector((state: RootState) => state.ui)
  const { elements, fileName, zoom, panX, panY } = useSelector((state: RootState) => state.diagram)
  const [format, setFormat] = useState("png")
  const [quality, setQuality] = useState("high")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawElement = (ctx: CanvasRenderingContext2D, element: any, scale = 1) => {
    const x = element.x * scale
    const y = element.y * scale
    const width = element.width * scale
    const height = element.height * scale

    ctx.save()
    ctx.fillStyle = element.style.fill
    ctx.strokeStyle = element.style.stroke
    ctx.lineWidth = element.style.strokeWidth * scale
    ctx.globalAlpha = element.style.opacity

    switch (element.type) {
      case "rectangle":
        ctx.fillRect(x, y, width, height)
        ctx.strokeRect(x, y, width, height)
        break

      case "circle":
        const centerX = x + width / 2
        const centerY = y + height / 2
        const radius = Math.min(width, height) / 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        break

      case "diamond":
        ctx.beginPath()
        ctx.moveTo(x + width / 2, y)
        ctx.lineTo(x + width, y + height / 2)
        ctx.lineTo(x + width / 2, y + height)
        ctx.lineTo(x, y + height / 2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        break

      case "line":
        ctx.beginPath()
        ctx.moveTo(x, y + height / 2)
        ctx.lineTo(x + width, y + height / 2)
        ctx.stroke()
        break

      case "arrow":
        const direction = element.direction || "right"
        const arrowHeadSize = 15 * scale

        ctx.beginPath()
        switch (direction) {
          case "right":
            ctx.moveTo(x, y + height / 2)
            ctx.lineTo(x + width - arrowHeadSize, y + height / 2)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x + width - arrowHeadSize, y + height / 4)
            ctx.lineTo(x + width, y + height / 2)
            ctx.lineTo(x + width - arrowHeadSize, y + (3 * height) / 4)
            ctx.stroke()
            break
          case "left":
            ctx.moveTo(x + arrowHeadSize, y + height / 2)
            ctx.lineTo(x + width, y + height / 2)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x + arrowHeadSize, y + height / 4)
            ctx.lineTo(x, y + height / 2)
            ctx.lineTo(x + arrowHeadSize, y + (3 * height) / 4)
            ctx.stroke()
            break
          case "up":
            ctx.moveTo(x + width / 2, y + arrowHeadSize)
            ctx.lineTo(x + width / 2, y + height)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x + width / 4, y + arrowHeadSize)
            ctx.lineTo(x + width / 2, y)
            ctx.lineTo(x + (3 * width) / 4, y + arrowHeadSize)
            ctx.stroke()
            break
          case "down":
            ctx.moveTo(x + width / 2, y)
            ctx.lineTo(x + width / 2, y + height - arrowHeadSize)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x + width / 4, y + height - arrowHeadSize)
            ctx.lineTo(x + width / 2, y + height)
            ctx.lineTo(x + (3 * width) / 4, y + height - arrowHeadSize)
            ctx.stroke()
            break
        }
        break
    }

    // Draw text
    if (element.text && element.type !== "line") {
      ctx.fillStyle = "#000000"
      ctx.font = `${(element.style.fontSize || 14) * scale}px ${element.style.fontFamily || "Arial"}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(element.text, x + width / 2, y + height / 2)
    }

    ctx.restore()
  }

  const handleExport = async () => {
    if (elements.length === 0) {
      alert("No elements to export!")
      return
    }

    try {
      // Calculate bounds
      let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY

      elements.forEach((element) => {
        minX = Math.min(minX, element.x)
        minY = Math.min(minY, element.y)
        maxX = Math.max(maxX, element.x + element.width)
        maxY = Math.max(maxY, element.y + element.height)
      })

      const padding = 20
      const canvasWidth = maxX - minX + padding * 2
      const canvasHeight = maxY - minY + padding * 2

      if (format === "svg") {
        // SVG Export
        let svgContent = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg">`

        elements.forEach((element) => {
          const x = element.x - minX + padding
          const y = element.y - minY + padding

          switch (element.type) {
            case "rectangle":
              svgContent += `<rect x="${x}" y="${y}" width="${element.width}" height="${element.height}" fill="${element.style.fill}" stroke="${element.style.stroke}" strokeWidth="${element.style.strokeWidth}"/>`
              break
            case "circle":
              const cx = x + element.width / 2
              const cy = y + element.height / 2
              const r = Math.min(element.width, element.height) / 2
              svgContent += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${element.style.fill}" stroke="${element.style.stroke}" strokeWidth="${element.style.strokeWidth}"/>`
              break
            // Add other shapes as needed
          }

          if (element.text) {
            svgContent += `<text x="${x + element.width / 2}" y="${y + element.height / 2}" textAnchor="middle" dominantBaseline="middle" fontSize="${element.style.fontSize || 14}" fontFamily="${element.style.fontFamily || "Arial"}">${element.text}</text>`
          }
        })

        svgContent += "</svg>"

        const blob = new Blob([svgContent], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${fileName}.svg`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        // Canvas-based export (PNG, JPEG, PDF)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        const scale = quality === "high" ? 2 : quality === "medium" ? 1.5 : 1
        canvas.width = canvasWidth * scale
        canvas.height = canvasHeight * scale

        // White background
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw elements
        elements.forEach((element) => {
          const adjustedElement = {
            ...element,
            x: (element.x - minX + padding) * scale,
            y: (element.y - minY + padding) * scale,
            width: element.width * scale,
            height: element.height * scale,
          }
          drawElement(ctx, adjustedElement, 1)
        })

        // Export
        const mimeType = format === "jpeg" ? "image/jpeg" : "image/png"
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `${fileName}.${format}`
              a.click()
              URL.revokeObjectURL(url)
            }
          },
          mimeType,
          0.9,
        )
      }

      dispatch(hideExportDialog())
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    }
  }

  return (
    <Dialog open={showExportDialog} onOpenChange={() => dispatch(hideExportDialog())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Diagram</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="format">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="svg">SVG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quality">Quality</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (1x)</SelectItem>
                <SelectItem value="medium">Medium (1.5x)</SelectItem>
                <SelectItem value="high">High (2x)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => dispatch(hideExportDialog())}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
