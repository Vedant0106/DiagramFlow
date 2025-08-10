"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/lib/store"
import { hideImportDialog } from "@/lib/slices/ui-slice"
import { loadDiagram, setFileName } from "@/lib/slices/diagram-slice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { FileText, Upload, Trash2 } from "lucide-react"

export function ImportDialog() {
  const dispatch = useDispatch()
  const { showImportDialog } = useSelector((state: RootState) => state.ui)
  const [file, setFile] = useState<File | null>(null)
  const [savedDiagrams, setSavedDiagrams] = useState<any[]>([])

  useEffect(() => {
    if (showImportDialog) {
      // Load saved diagrams from localStorage
      try {
        const saved = JSON.parse(localStorage.getItem("diagramflow_diagrams") || "[]")
        setSavedDiagrams(saved)
      } catch (error) {
        console.error("Failed to load saved diagrams:", error)
        setSavedDiagrams([])
      }
    }
  }, [showImportDialog])

  const handleFileImport = () => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          if (data.elements && Array.isArray(data.elements)) {
            dispatch(loadDiagram(data.elements))
            if (data.fileName) {
              dispatch(setFileName(data.fileName))
            }
            dispatch(hideImportDialog())
            alert("Diagram imported successfully!")
          } else {
            alert("Invalid file format. Please select a valid diagram file.")
          }
        } catch (error) {
          console.error("Failed to import file:", error)
          alert("Failed to import file. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleLoadSaved = (diagram: any) => {
    try {
      dispatch(loadDiagram(diagram.elements))
      dispatch(setFileName(diagram.fileName))
      dispatch(hideImportDialog())
      alert("Diagram loaded successfully!")
    } catch (error) {
      console.error("Failed to load diagram:", error)
      alert("Failed to load diagram.")
    }
  }

  const handleDeleteSaved = (index: number) => {
    if (confirm("Are you sure you want to delete this saved diagram?")) {
      try {
        const updated = savedDiagrams.filter((_, i) => i !== index)
        localStorage.setItem("diagramflow_diagrams", JSON.stringify(updated))
        setSavedDiagrams(updated)
      } catch (error) {
        console.error("Failed to delete diagram:", error)
        alert("Failed to delete diagram.")
      }
    }
  }

  return (
    <Dialog open={showImportDialog} onOpenChange={() => dispatch(hideImportDialog())}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Diagram</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Import Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Import from File</h3>
            <div>
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".json,.xml,.drawio"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button onClick={handleFileImport} disabled={!file} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Import File
            </Button>
          </div>

          {/* Saved Diagrams Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Saved Diagrams ({savedDiagrams.length})</h3>

            {savedDiagrams.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No saved diagrams found</p>
              </div>
            ) : (
              <ScrollArea className="max-h-60">
                <div className="space-y-2">
                  {savedDiagrams.map((diagram, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{diagram.fileName}</h4>
                            <p className="text-xs text-gray-500">
                              {diagram.elements?.length || 0} elements •
                              {new Date(diagram.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleLoadSaved(diagram)}>
                              Load
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteSaved(index)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => dispatch(hideImportDialog())}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
