import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DiagramElement } from "./diagram-slice"

interface HistoryState {
  past: DiagramElement[][]
  present: DiagramElement[]
  future: DiagramElement[][]
  maxHistorySize: number
}

const initialState: HistoryState = {
  past: [],
  present: [],
  future: [],
  maxHistorySize: 50,
}

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    saveState: (state, action: PayloadAction<DiagramElement[]>) => {
      // Add current state to past
      state.past.push([...state.present])

      // Limit history size
      if (state.past.length > state.maxHistorySize) {
        state.past.shift()
      }

      // Update present state
      state.present = [...action.payload]

      // Clear future (new action invalidates redo history)
      state.future = []
    },
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past.pop()!
        state.future.unshift([...state.present])
        state.present = previous
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.shift()!
        state.past.push([...state.present])
        state.present = next
      }
    },
    clearHistory: (state) => {
      state.past = []
      state.future = []
    },
  },
})

export const { saveState, undo, redo, clearHistory } = historySlice.actions
export default historySlice.reducer
