"use client"

import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import {
  setActiveTool,
  toggleShapeLibrary,
  togglePropertyPanel,
  showExportDialog,
  showImportDialog,
} from "@/lib/slices/ui-slice"
import { clearDiagram, setZoom, restoreState, loadDiagram } from "@/lib/slices/diagram-slice"
import { undo, redo } from "@/lib/slices/history-slice"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MousePointer2,
  Square,
  Circle,
  Diamond,
  ArrowRight,
  Type,
  Minus,
  LinkIcon,
  Hand,
  FileText,
  FolderOpen,
  Save,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Settings,
  Menu,
  Home,
} from "lucide-react"

export function Toolbar() {
  const dispatch = useDispatch()
  const { activeTool } = useSelector((state: RootState) => state.ui)
  const { zoom, fileName, isDirty } = useSelector((state: RootState) => state.diagram)
  const { past, future } = useSelector((state: RootState) => state.history)

  const tools = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "diamond", icon: Diamond, label: "Diamond" },
    { id: "arrow", icon: ArrowRight, label: "Arrow" },
    { id: "text", icon: Type, label: "Text" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "connector", icon: LinkIcon, label: "Connector" },
    { id: "pan", icon: Hand, label: "Pan" },
  ]

  const handleUndo = () => {
    dispatch(undo())
    // Get the updated state after undo
    setTimeout(() => {
      const state = (dispatch as any).getState()
      dispatch(restoreState(state.history.present))
    }, 0)
  }

  const handleRedo = () => {
    dispatch(redo())
    // Get the updated state after redo
    setTimeout(() => {
      const state = (dispatch as any).getState()
      dispatch(restoreState(state.history.present))
    }, 0)
  }

  const handleSave = () => {
    try {
      const diagramData = {
        fileName,
        elements: (dispatch as any).getState().diagram.elements,
        timestamp: new Date().toISOString(),
        version: "1.0",
      }

      // Save to localStorage
      const savedDiagrams = JSON.parse(localStorage.getItem("diagramflow_diagrams") || "[]")
      const existingIndex = savedDiagrams.findIndex((d: any) => d.fileName === fileName)

      if (existingIndex >= 0) {
        savedDiagrams[existingIndex] = diagramData
      } else {
        savedDiagrams.push(diagramData)
      }

      localStorage.setItem("diagramflow_diagrams", JSON.stringify(savedDiagrams))

      // Also save as downloadable file
      const blob = new Blob([JSON.stringify(diagramData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName}.json`
      a.click()
      URL.revokeObjectURL(url)

      // Mark as saved
      dispatch(clearDiagram())
      dispatch(loadDiagram(diagramData.elements))

      alert("Diagram saved successfully!")
    } catch (error) {
      console.error("Save failed:", error)
      alert("Failed to save diagram. Please try again.")
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section - File Operations */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" onClick={() => dispatch(clearDiagram())}>
            <FileText className="w-4 h-4 mr-2" />
            New
          </Button>
          <Button variant="ghost" size="sm" onClick={() => dispatch(showImportDialog())}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Open
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleSave()}>
            <Save className="w-4 h-4 mr-2" />
            Save{isDirty && "*"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => dispatch(showExportDialog())}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <Button variant="ghost" size="sm" onClick={handleUndo} disabled={past.length === 0}>
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRedo} disabled={future.length === 0}>
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Center Section - Tools */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => dispatch(setActiveTool(tool.id as any))}
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        {/* Right Section - View and Settings */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => dispatch(setZoom(zoom - 0.1))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={() => dispatch(setZoom(zoom + 0.1))}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="sm" onClick={() => dispatch(toggleShapeLibrary())}>
            <Menu className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => dispatch(togglePropertyPanel())}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* File Name */}
      <div className="text-center text-sm text-gray-600 mt-1">
        {fileName}
        {isDirty && " (unsaved changes)"}
      </div>
    </div>
  )
}
