"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Toolbar } from "./toolbar"
import { ShapeLibrary } from "./shape-library"
import { Canvas } from "./canvas"
import { PropertyPanel } from "./property-panel"
import { StatusBar } from "./status-bar"
import { ContextMenu } from "./context-menu"
import { ExportDialog } from "./export-dialog"
import { ImportDialog } from "./import-dialog"
import { TemplateDialog } from "./template-dialog"

export default function DiagramEditor() {
  const { showShapeLibrary, showPropertyPanel, sidebarWidth, propertyPanelWidth } = useSelector(
    (state: RootState) => state.ui,
  )

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Shape Library Sidebar */}
        {showShapeLibrary && (
          <div className="bg-white border-r border-gray-200 flex-shrink-0" style={{ width: sidebarWidth }}>
            <ShapeLibrary />
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Canvas />
        </div>

        {/* Property Panel */}
        {showPropertyPanel && (
          <div className="bg-white border-l border-gray-200 flex-shrink-0" style={{ width: propertyPanelWidth }}>
            <PropertyPanel />
          </div>
        )}
      </div>

      <StatusBar />

      {/* Dialogs and Overlays */}
      <ContextMenu />
      <ExportDialog />
      <ImportDialog />
      <TemplateDialog />
    </div>
  )
}
