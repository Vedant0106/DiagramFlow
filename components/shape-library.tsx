"use client"

import { useDispatch } from "react-redux"
import { addElement } from "@/lib/slices/diagram-slice"
import type { DiagramElement } from "@/lib/slices/diagram-slice"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Square, Circle, Diamond, ArrowRight, ArrowDown, ArrowUp, ArrowLeft, Type, Minus } from "lucide-react"

export function ShapeLibrary() {
  const dispatch = useDispatch()

  const createShape = (type: DiagramElement["type"], x = 100, y = 100, direction?: string) => {
    const baseElement: DiagramElement = {
      id: `${type}_${Date.now()}`,
      type,
      x,
      y,
      width: type === "line" ? 100 : 80,
      height: type === "line" ? 2 : 60,
      style: {
        fill: type === "line" ? "transparent" : "#ffffff",
        stroke: "#000000",
        strokeWidth: 2,
        opacity: 1,
        fontSize: 14,
        fontFamily: "Arial",
      },
      text: type === "text" ? "Text" : "",
      direction: direction as any,
    }

    dispatch(addElement(baseElement))
  }

  const shapeCategories = [
    {
      title: "Basic Shapes",
      shapes: [
        { type: "rectangle", icon: Square, label: "Rectangle" },
        { type: "circle", icon: Circle, label: "Circle" },
        { type: "diamond", icon: Diamond, label: "Diamond" },
        { type: "text", icon: Type, label: "Text" },
        { type: "line", icon: Minus, label: "Line" },
      ],
    },
    {
      title: "Arrows",
      shapes: [
        { type: "arrow", icon: ArrowRight, label: "Right Arrow", direction: "right" },
        { type: "arrow", icon: ArrowLeft, label: "Left Arrow", direction: "left" },
        { type: "arrow", icon: ArrowUp, label: "Up Arrow", direction: "up" },
        { type: "arrow", icon: ArrowDown, label: "Down Arrow", direction: "down" },
      ],
    },
    {
      title: "Flowchart",
      shapes: [
        { type: "rectangle", icon: Square, label: "Process" },
        { type: "diamond", icon: Diamond, label: "Decision" },
        { type: "circle", icon: Circle, label: "Start/End" },
      ],
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-sm">Shape Library</h2>
      </div>

      <ScrollArea className="flex-1 max-h-[calc(100vh-120px)]">
        <div className="p-4 space-y-6">
          {shapeCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{category.title}</h3>
              <div className="grid grid-cols-2 gap-2">
                {category.shapes.map((shape, shapeIndex) => (
                  <Button
                    key={shapeIndex}
                    variant="outline"
                    className="h-16 flex flex-col items-center justify-center text-xs hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                    onClick={() => createShape(shape.type as DiagramElement["type"], 100, 100, shape.direction)}
                  >
                    <shape.icon className="w-6 h-6 mb-1" />
                    <span>{shape.label}</span>
                  </Button>
                ))}
              </div>
              {categoryIndex < shapeCategories.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
