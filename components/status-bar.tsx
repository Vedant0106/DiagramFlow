"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"

export function StatusBar() {
  const { elements, selectedElements, zoom } = useSelector((state: RootState) => state.diagram)
  const { activeTool } = useSelector((state: RootState) => state.ui)

  return (
    <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-xs text-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>Tool: {activeTool}</span>
          <span>Elements: {elements.length}</span>
          <span>Selected: {selectedElements.length}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  )
}
