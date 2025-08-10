import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface UIState {
  activeTool: "select" | "rectangle" | "circle" | "diamond" | "arrow" | "text" | "line" | "connector" | "pan"
  showShapeLibrary: boolean
  showPropertyPanel: boolean
  showLayersPanel: boolean
  showRulers: boolean
  theme: "light" | "dark"
  sidebarWidth: number
  propertyPanelWidth: number
  isDrawing: boolean
  drawingStart: { x: number; y: number } | null
  showContextMenu: boolean
  contextMenuPosition: { x: number; y: number }
  showExportDialog: boolean
  showImportDialog: boolean
  showTemplateDialog: boolean
}

const initialState: UIState = {
  activeTool: "select",
  showShapeLibrary: true,
  showPropertyPanel: true,
  showLayersPanel: false,
  showRulers: true,
  theme: "light",
  sidebarWidth: 280,
  propertyPanelWidth: 300,
  isDrawing: false,
  drawingStart: null,
  showContextMenu: false,
  contextMenuPosition: { x: 0, y: 0 },
  showExportDialog: false,
  showImportDialog: false,
  showTemplateDialog: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTool: (state, action: PayloadAction<UIState["activeTool"]>) => {
      state.activeTool = action.payload
      state.isDrawing = false
      state.drawingStart = null
    },
    toggleShapeLibrary: (state) => {
      state.showShapeLibrary = !state.showShapeLibrary
    },
    togglePropertyPanel: (state) => {
      state.showPropertyPanel = !state.showPropertyPanel
    },
    toggleLayersPanel: (state) => {
      state.showLayersPanel = !state.showLayersPanel
    },
    toggleRulers: (state) => {
      state.showRulers = !state.showRulers
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload
    },
    setPropertyPanelWidth: (state, action: PayloadAction<number>) => {
      state.propertyPanelWidth = action.payload
    },
    startDrawing: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.isDrawing = true
      state.drawingStart = action.payload
    },
    stopDrawing: (state) => {
      state.isDrawing = false
      state.drawingStart = null
    },
    showContextMenu: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.showContextMenu = true
      state.contextMenuPosition = action.payload
    },
    hideContextMenu: (state) => {
      state.showContextMenu = false
    },
    showExportDialog: (state) => {
      state.showExportDialog = true
    },
    hideExportDialog: (state) => {
      state.showExportDialog = false
    },
    showImportDialog: (state) => {
      state.showImportDialog = true
    },
    hideImportDialog: (state) => {
      state.showImportDialog = false
    },
    showTemplateDialog: (state) => {
      state.showTemplateDialog = true
    },
    hideTemplateDialog: (state) => {
      state.showTemplateDialog = false
    },
  },
})

export const {
  setActiveTool,
  toggleShapeLibrary,
  togglePropertyPanel,
  toggleLayersPanel,
  toggleRulers,
  setTheme,
  setSidebarWidth,
  setPropertyPanelWidth,
  startDrawing,
  stopDrawing,
  showContextMenu,
  hideContextMenu,
  showExportDialog,
  hideExportDialog,
  showImportDialog,
  hideImportDialog,
  showTemplateDialog,
  hideTemplateDialog,
} = uiSlice.actions

export default uiSlice.reducer
