"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { hideTemplateDialog } from "@/lib/slices/ui-slice"
import { loadDiagram } from "@/lib/slices/diagram-slice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TemplateDialog() {
  const dispatch = useDispatch()
  const { showTemplateDialog } = useSelector((state: RootState) => state.ui)

  const templates = [
    {
      id: "flowchart",
      name: "Basic Flowchart",
      category: "Process",
      preview: "/flowchart-template.png",
      elements: [
        {
          id: "start",
          type: "circle" as const,
          x: 100,
          y: 50,
          width: 80,
          height: 60,
          text: "Start",
          style: { fill: "#e3f2fd", stroke: "#1976d2", strokeWidth: 2, opacity: 1 },
        },
        {
          id: "process",
          type: "rectangle" as const,
          x: 100,
          y: 150,
          width: 120,
          height: 60,
          text: "Process",
          style: { fill: "#f3e5f5", stroke: "#7b1fa2", strokeWidth: 2, opacity: 1 },
        },
      ],
    },
    {
      id: "org-chart",
      name: "Organization Chart",
      category: "Business",
      preview: "/org-chart-template.png",
      elements: [
        {
          id: "ceo",
          type: "rectangle" as const,
          x: 150,
          y: 50,
          width: 100,
          height: 60,
          text: "CEO",
          style: { fill: "#fff3e0", stroke: "#f57c00", strokeWidth: 2, opacity: 1 },
        },
      ],
    },
  ]

  const handleSelectTemplate = (template: (typeof templates)[0]) => {
    dispatch(loadDiagram(template.elements))
    dispatch(hideTemplateDialog())
  }

  return (
    <Dialog open={showTemplateDialog} onOpenChange={() => dispatch(hideTemplateDialog())}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose Template</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectTemplate(template)}
            >
              <CardContent className="p-4">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {template.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => dispatch(hideTemplateDialog())}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
