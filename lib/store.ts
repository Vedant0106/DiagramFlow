import { configureStore } from "@reduxjs/toolkit"
import diagramReducer from "./slices/diagram-slice"
import uiReducer from "./slices/ui-slice"
import historyReducer from "./slices/history-slice"

export const store = configureStore({
  reducer: {
    diagram: diagramReducer,
    ui: uiReducer,
    history: historyReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
