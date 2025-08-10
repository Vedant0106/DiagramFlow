"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { hideContextMenu } from "@/lib/slices/ui-slice"
import { deleteElement, copyElements, pasteElements } from "@/lib/slices/diagram-slice"
import { useEffect } from "react"

export function ContextMenu() {
  const dispatch = useDispatch()
  const { showContextMenu, contextMenuPosition } = useSelector((state: RootState) => state.ui)
  const { selectedElements } = useSelector((state: RootState) => state.diagram)

  useEffect(() => {
    const handleClickOutside = () => {
      if (showContextMenu) {
        dispatch(hideContextMenu())
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [showContextMenu, dispatch])

  if (!showContextMenu) return null

  const handleCopy = () => {
    dispatch(copyElements(selectedElements))
    dispatch(hideContextMenu())
  }

  const handlePaste = () => {
    dispatch(pasteElements({ x: contextMenuPosition.x, y: contextMenuPosition.y }))
    dispatch(hideContextMenu())
  }

  const handleDelete = () => {
    selectedElements.forEach((id) => dispatch(deleteElement(id)))
    dispatch(hideContextMenu())
  }

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
      style={{
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
      }}
    >
      <button
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
        onClick={handleCopy}
        disabled={selectedElements.length === 0}
      >
        Copy
      </button>
      <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100" onClick={handlePaste}>
        Paste
      </button>
      <hr className="my-1" />
      <button
        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600"
        onClick={handleDelete}
        disabled={selectedElements.length === 0}
      >
        Delete
      </button>
    </div>
  )
}
