"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import {
  updateElement,
  addElement,
  deleteElement,
  clearSelection,
  selectElement,
  loadDiagram,
} from "@/lib/slices/diagram-slice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PropertyPanel() {
  const dispatch = useDispatch()
  const { elements, selectedElements } = useSelector((state: RootState) => state.diagram)

  const selectedElement = selectedElements.length === 1 ? elements.find((el) => el.id === selectedElements[0]) : null

  const handleDuplicate = () => {
    if (!selectedElement) return

    const duplicatedElement = {
      ...selectedElement,
      id: `${selectedElement.type}_${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
    }

    dispatch(addElement(duplicatedElement))
    dispatch(clearSelection())
    dispatch(selectElement(duplicatedElement.id))
  }

  const handleBringToFront = () => {
    if (!selectedElement) return

    // Remove element from current position and add to end (front)
    const otherElements = elements.filter((el) => el.id !== selectedElement.id)
    const newElements = [...otherElements, selectedElement]

    // Update the entire elements array
    dispatch(loadDiagram(newElements))
  }

  const handleSendToBack = () => {
    if (!selectedElement) return

    // Remove element from current position and add to beginning (back)
    const otherElements = elements.filter((el) => el.id !== selectedElement.id)
    const newElements = [selectedElement, ...otherElements]

    // Update the entire elements array
    dispatch(loadDiagram(newElements))
  }

  const handleDelete = () => {
    if (!selectedElement) return
    dispatch(deleteElement(selectedElement.id))
  }

  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedElement) return

    if (property.startsWith("style.")) {
      const styleProp = property.replace("style.", "")
      dispatch(
        updateElement({
          id: selectedElement.id,
          updates: {
            style: {
              ...selectedElement.style,
              [styleProp]: value,
            },
          },
        }),
      )
    } else {
      dispatch(
        updateElement({
          id: selectedElement.id,
          updates: { [property]: value },
        }),
      )
    }
  }

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-sm">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Select an element to edit properties
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-sm">Properties</h2>
        <p className="text-xs text-gray-500 mt-1">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
        </p>
      </div>

      <ScrollArea className="flex-1 max-h-[calc(100vh-120px)]">
        <div className="p-4 space-y-6 pb-8">
          {/* Position & Size */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Position & Size</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="x" className="text-xs">
                    X
                  </Label>
                  <Input
                    id="x"
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => handlePropertyChange("x", Number.parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="y" className="text-xs">
                    Y
                  </Label>
                  <Input
                    id="y"
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => handlePropertyChange("y", Number.parseInt(e.target.value) || 0)}
                    className="h-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="width" className="text-xs">
                    Width
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    value={Math.round(selectedElement.width)}
                    onChange={(e) => handlePropertyChange("width", Number.parseInt(e.target.value) || 1)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">
                    Height
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={Math.round(selectedElement.height)}
                    onChange={(e) => handlePropertyChange("height", Number.parseInt(e.target.value) || 1)}
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Text */}
          {(selectedElement.type === "text" ||
            selectedElement.type === "rectangle" ||
            selectedElement.type === "circle" ||
            selectedElement.type === "diamond") && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="text" className="text-xs">
                    Content
                  </Label>
                  <Input
                    id="text"
                    value={selectedElement.text || ""}
                    onChange={(e) => handlePropertyChange("text", e.target.value)}
                    className="h-8"
                    placeholder="Enter text..."
                  />
                </div>
                <div>
                  <Label htmlFor="fontSize" className="text-xs">
                    Font Size
                  </Label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={selectedElement.style.fontSize || 14}
                    onChange={(e) => handlePropertyChange("style.fontSize", Number.parseInt(e.target.value) || 14)}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="fontFamily" className="text-xs">
                    Font Family
                  </Label>
                  <Input
                    id="fontFamily"
                    value={selectedElement.style.fontFamily || "Arial"}
                    onChange={(e) => handlePropertyChange("style.fontFamily", e.target.value)}
                    className="h-8"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fill" className="text-xs">
                  Fill Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="fill"
                    type="color"
                    value={selectedElement.style.fill}
                    onChange={(e) => handlePropertyChange("style.fill", e.target.value)}
                    className="h-8 w-16"
                  />
                  <Input
                    value={selectedElement.style.fill}
                    onChange={(e) => handlePropertyChange("style.fill", e.target.value)}
                    className="h-8 flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="stroke" className="text-xs">
                  Stroke Color
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="stroke"
                    type="color"
                    value={selectedElement.style.stroke}
                    onChange={(e) => handlePropertyChange("style.stroke", e.target.value)}
                    className="h-8 w-16"
                  />
                  <Input
                    value={selectedElement.style.stroke}
                    onChange={(e) => handlePropertyChange("style.stroke", e.target.value)}
                    className="h-8 flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="strokeWidth" className="text-xs">
                  Stroke Width
                </Label>
                <Input
                  id="strokeWidth"
                  type="number"
                  value={selectedElement.style.strokeWidth}
                  onChange={(e) => handlePropertyChange("style.strokeWidth", Number.parseInt(e.target.value) || 1)}
                  className="h-8"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <Label htmlFor="opacity" className="text-xs">
                  Opacity
                </Label>
                <div className="px-2">
                  <Slider
                    id="opacity"
                    value={[selectedElement.style.opacity * 100]}
                    onValueChange={(value) => handlePropertyChange("style.opacity", value[0] / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {Math.round(selectedElement.style.opacity * 100)}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => handleDuplicate()}>
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => handleBringToFront()}
              >
                Bring to Front
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => handleSendToBack()}>
                Send to Back
              </Button>
              <Separator />
              <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete()}>
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
