import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface DiagramElement {
  id: string
  type: "rectangle" | "circle" | "diamond" | "arrow" | "text" | "line" | "connector"
  x: number
  y: number
  width: number
  height: number
  text?: string
  style: {
    fill: string
    stroke: string
    strokeWidth: number
    fontSize?: number
    fontFamily?: string
    opacity: number
  }
  connections?: {
    from?: string
    to?: string
    points?: { x: number; y: number }[]
  }
  rotation?: number
  locked?: boolean
  grouped?: string[]
  direction?: "right" | "left" | "up" | "down" // Add direction for arrows
}

export interface DiagramState {
  elements: DiagramElement[]
  selectedElements: string[]
  clipboard: DiagramElement[]
  zoom: number
  panX: number
  panY: number
  gridSize: number
  snapToGrid: boolean
  showGrid: boolean
  canvasWidth: number
  canvasHeight: number
  fileName: string
  isDirty: boolean
}

const initialState: DiagramState = {
  elements: [],
  selectedElements: [],
  clipboard: [],
  zoom: 1,
  panX: 0,
  panY: 0,
  gridSize: 20,
  snapToGrid: true,
  showGrid: true,
  canvasWidth: 2000,
  canvasHeight: 2000,
  fileName: "Untitled Diagram",
  isDirty: false,
}

const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<DiagramElement>) => {
      state.elements.push(action.payload)
      state.isDirty = true
    },
    updateElement: (state, action: PayloadAction<{ id: string; updates: Partial<DiagramElement> }>) => {
      const element = state.elements.find((el) => el.id === action.payload.id)
      if (element) {
        Object.assign(element, action.payload.updates)
        state.isDirty = true
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      state.elements = state.elements.filter((el) => el.id !== action.payload)
      state.selectedElements = state.selectedElements.filter((id) => id !== action.payload)
      state.isDirty = true
    },
    selectElement: (state, action: PayloadAction<string>) => {
      if (!state.selectedElements.includes(action.payload)) {
        state.selectedElements.push(action.payload)
      }
    },
    deselectElement: (state, action: PayloadAction<string>) => {
      state.selectedElements = state.selectedElements.filter((id) => id !== action.payload)
    },
    clearSelection: (state) => {
      state.selectedElements = []
    },
    selectMultiple: (state, action: PayloadAction<string[]>) => {
      state.selectedElements = action.payload
    },
    moveElements: (state, action: PayloadAction<{ ids: string[]; deltaX: number; deltaY: number }>) => {
      const { ids, deltaX, deltaY } = action.payload
      ids.forEach((id) => {
        const element = state.elements.find((el) => el.id === id)
        if (element) {
          element.x += deltaX
          element.y += deltaY
        }
      })
      state.isDirty = true
    },
    resizeElement: (state, action: PayloadAction<{ id: string; width: number; height: number }>) => {
      const element = state.elements.find((el) => el.id === action.payload.id)
      if (element) {
        element.width = action.payload.width
        element.height = action.payload.height
        state.isDirty = true
      }
    },
    copyElements: (state, action: PayloadAction<string[]>) => {
      state.clipboard = state.elements.filter((el) => action.payload.includes(el.id))
    },
    pasteElements: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload
      const newElements = state.clipboard.map((el, index) => ({
        ...el,
        id: `${el.id}_copy_${Date.now()}_${index}`,
        x: x + index * 20,
        y: y + index * 20,
      }))
      state.elements.push(...newElements)
      state.selectedElements = newElements.map((el) => el.id)
      state.isDirty = true
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(5, action.payload))
    },
    setPan: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.panX = action.payload.x
      state.panY = action.payload.y
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid
    },
    toggleSnapToGrid: (state) => {
      state.snapToGrid = !state.snapToGrid
    },
    setGridSize: (state, action: PayloadAction<number>) => {
      state.gridSize = action.payload
    },
    setFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload
    },
    clearDiagram: (state) => {
      state.elements = []
      state.selectedElements = []
      state.isDirty = false
    },
    loadDiagram: (state, action: PayloadAction<DiagramElement[]>) => {
      state.elements = action.payload
      state.selectedElements = []
      state.isDirty = false
    },
    // Add action to restore state from history
    restoreState: (state, action: PayloadAction<DiagramElement[]>) => {
      state.elements = action.payload
      state.selectedElements = []
    },
    // Add action to mark diagram as not dirty after saving
    markSaved: (state) => {
      state.isDirty = false
    },
  },
})

export const {
  addElement,
  updateElement,
  deleteElement,
  selectElement,
  deselectElement,
  clearSelection,
  selectMultiple,
  moveElements,
  resizeElement,
  copyElements,
  pasteElements,
  setZoom,
  setPan,
  toggleGrid,
  toggleSnapToGrid,
  setGridSize,
  setFileName,
  clearDiagram,
  loadDiagram,
  restoreState,
  markSaved,
} = diagramSlice.actions

export default diagramSlice.reducer
