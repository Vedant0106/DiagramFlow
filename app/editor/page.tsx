"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import DiagramEditor from "@/components/diagram-editor"

export default function EditorPage() {
  return (
    <Provider store={store}>
      <DiagramEditor />
    </Provider>
  )
}
