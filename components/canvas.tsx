"use client"

import type React from "react"
import { useRef, useEffect, useCallback, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import {
  addElement,
  selectElement,
  clearSelection,
  moveElements,
  setPan,
  setZoom,
  resizeElement,
} from "@/lib/slices/diagram-slice"
import { startDrawing, stopDrawing, showContextMenu } from "@/lib/slices/ui-slice"
import { saveState } from "@/lib/slices/history-slice"
import type { DiagramElement } from "@/lib/slices/diagram-slice"

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const { elements, selectedElements, zoom, panX, panY, showGrid, snapToGrid, gridSize } = useSelector(
    (state: RootState) => state.diagram,
  )
  const { activeTool, isDrawing, drawingStart } = useSelector((state: RootState) => state.ui)

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null)

  // Save state to history before making changes
  const saveToHistory = useCallback(() => {
    dispatch(saveState(elements))
  }, [dispatch, elements])

  // Canvas drawing functions
  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      if (!showGrid) return

      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1

      const scaledGridSize = gridSize * zoom
      const offsetX = panX % scaledGridSize
      const offsetY = panY % scaledGridSize

      // Vertical lines
      for (let x = offsetX; x < width; x += scaledGridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = offsetY; y < height; y += scaledGridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    },
    [showGrid, gridSize, zoom, panX, panY],
  )

  const drawElement = useCallback(
    (ctx: CanvasRenderingContext2D, element: DiagramElement) => {
      const x = (element.x + panX) * zoom
      const y = (element.y + panY) * zoom
      const width = element.width * zoom
      const height = element.height * zoom

      ctx.save()

      // Apply styles
      ctx.fillStyle = element.style.fill
      ctx.strokeStyle = element.style.stroke
      ctx.lineWidth = element.style.strokeWidth
      ctx.globalAlpha = element.style.opacity

      // Draw based on type
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
          // Draw arrow based on direction
          const direction = element.direction || "right"
          const arrowHeadSize = 15 * zoom

          ctx.beginPath()

          switch (direction) {
            case "right":
              // Arrow body
              ctx.moveTo(x, y + height / 2)
              ctx.lineTo(x + width - arrowHeadSize, y + height / 2)
              ctx.stroke()

              // Arrow head
              ctx.beginPath()
              ctx.moveTo(x + width - arrowHeadSize, y + height / 4)
              ctx.lineTo(x + width, y + height / 2)
              ctx.lineTo(x + width - arrowHeadSize, y + (3 * height) / 4)
              ctx.stroke()
              break

            case "left":
              // Arrow body
              ctx.moveTo(x + arrowHeadSize, y + height / 2)
              ctx.lineTo(x + width, y + height / 2)
              ctx.stroke()

              // Arrow head
              ctx.beginPath()
              ctx.moveTo(x + arrowHeadSize, y + height / 4)
              ctx.lineTo(x, y + height / 2)
              ctx.lineTo(x + arrowHeadSize, y + (3 * height) / 4)
              ctx.stroke()
              break

            case "up":
              // Arrow body
              ctx.moveTo(x + width / 2, y + arrowHeadSize)
              ctx.lineTo(x + width / 2, y + height)
              ctx.stroke()

              // Arrow head
              ctx.beginPath()
              ctx.moveTo(x + width / 4, y + arrowHeadSize)
              ctx.lineTo(x + width / 2, y)
              ctx.lineTo(x + (3 * width) / 4, y + arrowHeadSize)
              ctx.stroke()
              break

            case "down":
              // Arrow body
              ctx.moveTo(x + width / 2, y)
              ctx.lineTo(x + width / 2, y + height - arrowHeadSize)
              ctx.stroke()

              // Arrow head
              ctx.beginPath()
              ctx.moveTo(x + width / 4, y + height - arrowHeadSize)
              ctx.lineTo(x + width / 2, y + height)
              ctx.lineTo(x + (3 * width) / 4, y + height - arrowHeadSize)
              ctx.stroke()
              break
          }
          break
      }

      // Draw text if present
      if (element.text && element.type !== "line") {
        ctx.fillStyle = "#000000"
        ctx.font = `${(element.style.fontSize || 14) * zoom}px ${element.style.fontFamily || "Arial"}`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(element.text, x + width / 2, y + height / 2)
      }

      // Draw selection outline and resize handles
      if (selectedElements.includes(element.id)) {
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(x - 2, y - 2, width + 4, height + 4)
        ctx.setLineDash([])

        // Draw resize handles
        const handleSize = 8
        const handles = [
          { id: "nw", x: x - handleSize / 2, y: y - handleSize / 2 }, // top-left
          { id: "ne", x: x + width - handleSize / 2, y: y - handleSize / 2 }, // top-right
          { id: "sw", x: x - handleSize / 2, y: y + height - handleSize / 2 }, // bottom-left
          { id: "se", x: x + width - handleSize / 2, y: y + height - handleSize / 2 }, // bottom-right
          { id: "n", x: x + width / 2 - handleSize / 2, y: y - handleSize / 2 }, // top-center
          { id: "s", x: x + width / 2 - handleSize / 2, y: y + height - handleSize / 2 }, // bottom-center
          { id: "w", x: x - handleSize / 2, y: y + height / 2 - handleSize / 2 }, // left-center
          { id: "e", x: x + width - handleSize / 2, y: y + height / 2 - handleSize / 2 }, // right-center
        ]

        ctx.fillStyle = "#3b82f6"
        handles.forEach((handle) => {
          ctx.fillRect(handle.x, handle.y, handleSize, handleSize)
        })
      }

      ctx.restore()
    },
    [selectedElements, zoom, panX, panY],
  )

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height)

    // Draw elements
    elements.forEach((element) => drawElement(ctx, element))

    // Draw current drawing preview
    if (isDrawing && drawingStart && lastMousePos && activeTool !== "select") {
      ctx.save()
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      const startX = (drawingStart.x + panX) * zoom
      const startY = (drawingStart.y + panY) * zoom
      const endX = (lastMousePos.x + panX) * zoom
      const endY = (lastMousePos.y + panY) * zoom

      switch (activeTool) {
        case "rectangle":
          ctx.strokeRect(startX, startY, endX - startX, endY - startY)
          break
        case "circle":
          const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / 2
          ctx.beginPath()
          ctx.arc(startX + (endX - startX) / 2, startY + (endY - startY) / 2, radius, 0, 2 * Math.PI)
          ctx.stroke()
          break
        case "line":
          ctx.beginPath()
          ctx.moveTo(startX, startY)
          ctx.lineTo(endX, endY)
          ctx.stroke()
          break
      }

      ctx.restore()
    }
  }, [elements, drawGrid, drawElement, isDrawing, drawingStart, lastMousePos, activeTool, zoom, panX, panY])

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resizeCanvas = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      redraw()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [redraw])

  // Redraw when state changes
  useEffect(() => {
    redraw()
  }, [redraw])

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number) => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()
      const x = (screenX - rect.left) / zoom - panX
      const y = (screenY - rect.top) / zoom - panY

      return { x, y }
    },
    [zoom, panX, panY],
  )

  // Find element at position
  const getElementAtPosition = useCallback(
    (x: number, y: number): DiagramElement | null => {
      // Check in reverse order (top to bottom)
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i]
        if (x >= element.x && x <= element.x + element.width && y >= element.y && y <= element.y + element.height) {
          return element
        }
      }
      return null
    },
    [elements],
  )

  // Check if mouse is over resize handle
  const getResizeHandle = useCallback(
    (x: number, y: number, element: DiagramElement): string | null => {
      const handleSize = 8 / zoom
      const handles = [
        { id: "nw", x: element.x - handleSize / 2, y: element.y - handleSize / 2 },
        { id: "ne", x: element.x + element.width - handleSize / 2, y: element.y - handleSize / 2 },
        { id: "sw", x: element.x - handleSize / 2, y: element.y + element.height - handleSize / 2 },
        { id: "se", x: element.x + element.width - handleSize / 2, y: element.y + element.height - handleSize / 2 },
        { id: "n", x: element.x + element.width / 2 - handleSize / 2, y: element.y - handleSize / 2 },
        { id: "s", x: element.x + element.width / 2 - handleSize / 2, y: element.y + element.height - handleSize / 2 },
        { id: "w", x: element.x - handleSize / 2, y: element.y + element.height / 2 - handleSize / 2 },
        { id: "e", x: element.x + element.width - handleSize / 2, y: element.y + element.height / 2 - handleSize / 2 },
      ]

      for (const handle of handles) {
        if (x >= handle.x && x <= handle.x + handleSize && y >= handle.y && y <= handle.y + handleSize) {
          return handle.id
        }
      }
      return null
    },
    [zoom],
  )

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const canvasPos = screenToCanvas(e.clientX, e.clientY)

      if (activeTool === "select") {
        const element = getElementAtPosition(canvasPos.x, canvasPos.y)

        if (element && selectedElements.includes(element.id)) {
          // Check for resize handle
          const handle = getResizeHandle(canvasPos.x, canvasPos.y, element)
          if (handle) {
            setIsResizing(true)
            setResizeHandle(handle)
            setDragStart(canvasPos)
            saveToHistory()
            return
          }
        }

        if (element) {
          if (!selectedElements.includes(element.id)) {
            if (e.ctrlKey || e.metaKey) {
              dispatch(selectElement(element.id))
            } else {
              dispatch(clearSelection())
              dispatch(selectElement(element.id))
            }
          }
          setIsDragging(true)
          setDragStart(canvasPos)
          saveToHistory()
        } else {
          dispatch(clearSelection())
        }
      } else if (activeTool === "pan") {
        setIsDragging(true)
        setDragStart({ x: e.clientX, y: e.clientY })
      } else {
        // Drawing tools
        dispatch(startDrawing(canvasPos))
        setLastMousePos(canvasPos)
        saveToHistory()
      }
    },
    [activeTool, screenToCanvas, getElementAtPosition, selectedElements, getResizeHandle, dispatch, saveToHistory],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvasPos = screenToCanvas(e.clientX, e.clientY)
      setLastMousePos(canvasPos)

      // Update cursor based on what's under the mouse
      const canvas = canvasRef.current
      if (canvas && activeTool === "select") {
        const element = getElementAtPosition(canvasPos.x, canvasPos.y)
        if (element && selectedElements.includes(element.id)) {
          const handle = getResizeHandle(canvasPos.x, canvasPos.y, element)
          if (handle) {
            const cursors: { [key: string]: string } = {
              nw: "nw-resize",
              ne: "ne-resize",
              sw: "sw-resize",
              se: "se-resize",
              n: "n-resize",
              s: "s-resize",
              w: "w-resize",
              e: "e-resize",
            }
            canvas.style.cursor = cursors[handle] || "default"
          } else {
            canvas.style.cursor = "move"
          }
        } else {
          canvas.style.cursor = "default"
        }
      }

      if (isResizing && dragStart && resizeHandle && selectedElements.length === 1) {
        const element = elements.find((el) => el.id === selectedElements[0])
        if (element) {
          const deltaX = canvasPos.x - dragStart.x
          const deltaY = canvasPos.y - dragStart.y

          let newWidth = element.width
          let newHeight = element.height
          let newX = element.x
          let newY = element.y

          switch (resizeHandle) {
            case "se": // bottom-right
              newWidth = Math.max(10, element.width + deltaX)
              newHeight = Math.max(10, element.height + deltaY)
              break
            case "sw": // bottom-left
              newWidth = Math.max(10, element.width - deltaX)
              newHeight = Math.max(10, element.height + deltaY)
              newX = element.x + deltaX
              break
            case "ne": // top-right
              newWidth = Math.max(10, element.width + deltaX)
              newHeight = Math.max(10, element.height - deltaY)
              newY = element.y + deltaY
              break
            case "nw": // top-left
              newWidth = Math.max(10, element.width - deltaX)
              newHeight = Math.max(10, element.height - deltaY)
              newX = element.x + deltaX
              newY = element.y + deltaY
              break
            case "e": // right
              newWidth = Math.max(10, element.width + deltaX)
              break
            case "w": // left
              newWidth = Math.max(10, element.width - deltaX)
              newX = element.x + deltaX
              break
            case "s": // bottom
              newHeight = Math.max(10, element.height + deltaY)
              break
            case "n": // top
              newHeight = Math.max(10, element.height - deltaY)
              newY = element.y + deltaY
              break
          }

          dispatch(resizeElement({ id: element.id, width: newWidth, height: newHeight }))
          if (newX !== element.x || newY !== element.y) {
            dispatch(moveElements({ ids: [element.id], deltaX: newX - element.x, deltaY: newY - element.y }))
          }
        }
      } else if (isDragging && dragStart) {
        if (activeTool === "select" && selectedElements.length > 0) {
          // Move selected elements
          const deltaX = canvasPos.x - dragStart.x
          const deltaY = canvasPos.y - dragStart.y

          if (snapToGrid) {
            const snappedDeltaX = Math.round(deltaX / gridSize) * gridSize
            const snappedDeltaY = Math.round(deltaY / gridSize) * gridSize
            dispatch(moveElements({ ids: selectedElements, deltaX: snappedDeltaX, deltaY: snappedDeltaY }))
            setDragStart({ x: dragStart.x + snappedDeltaX, y: dragStart.y + snappedDeltaY })
          } else {
            dispatch(moveElements({ ids: selectedElements, deltaX, deltaY }))
            setDragStart(canvasPos)
          }
        } else if (activeTool === "pan") {
          // Pan canvas
          const deltaX = e.clientX - dragStart.x
          const deltaY = e.clientY - dragStart.y
          dispatch(setPan({ x: panX + deltaX / zoom, y: panY + deltaY / zoom }))
          setDragStart({ x: e.clientX, y: e.clientY })
        }
      }

      redraw()
    },
    [
      isDragging,
      isResizing,
      dragStart,
      resizeHandle,
      activeTool,
      selectedElements,
      elements,
      screenToCanvas,
      getElementAtPosition,
      getResizeHandle,
      snapToGrid,
      gridSize,
      dispatch,
      panX,
      panY,
      zoom,
      redraw,
    ],
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (isDrawing && drawingStart && lastMousePos && activeTool !== "select" && activeTool !== "pan") {
        // Create new element
        const width = Math.abs(lastMousePos.x - drawingStart.x)
        const height = Math.abs(lastMousePos.y - drawingStart.y)

        if (width > 5 && height > 5) {
          // Minimum size threshold
          const newElement: DiagramElement = {
            id: `${activeTool}_${Date.now()}`,
            type: activeTool as DiagramElement["type"],
            x: Math.min(drawingStart.x, lastMousePos.x),
            y: Math.min(drawingStart.y, lastMousePos.y),
            width,
            height,
            style: {
              fill: activeTool === "line" ? "transparent" : "#ffffff",
              stroke: "#000000",
              strokeWidth: 2,
              opacity: 1,
              fontSize: 14,
              fontFamily: "Arial",
            },
            text: activeTool === "text" ? "Text" : "",
            direction: "right", // Default direction for arrows
          }

          dispatch(addElement(newElement))
        }

        dispatch(stopDrawing())
      }

      setIsDragging(false)
      setIsResizing(false)
      setResizeHandle(null)
      setDragStart(null)
    },
    [isDrawing, drawingStart, lastMousePos, activeTool, dispatch],
  )

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dispatch(showContextMenu({ x: e.clientX, y: e.clientY }))
    },
    [dispatch],
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()

      if (e.ctrlKey || e.metaKey) {
        // Zoom
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor))
        dispatch(setZoom(newZoom))
      } else {
        // Pan
        dispatch(
          setPan({
            x: panX - e.deltaX / zoom,
            y: panY - e.deltaY / zoom,
          }),
        )
      }
    },
    [zoom, panX, panY, dispatch],
  )

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden bg-white relative"
      style={{ cursor: activeTool === "pan" ? "grab" : activeTool === "select" ? "default" : "crosshair" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        onWheel={handleWheel}
      />
    </div>
  )
}
