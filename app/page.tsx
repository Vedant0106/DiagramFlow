"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Upload,
  Zap,
  Users,
  Shield,
  Globe,
  ArrowRight,
  Play,
  Star,
  Layers,
  Share2,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    { id: "flowchart", name: "Flowchart", category: "Process", preview: "/flowchart-diagram.png" },
    { id: "org-chart", name: "Org Chart", category: "Business", preview: "/organizational-chart.png" },
    { id: "network", name: "Network Diagram", category: "Technical", preview: "/network-topology-diagram.png" },
    { id: "uml", name: "UML Diagram", category: "Software", preview: "/uml-class-diagram.png" },
    { id: "wireframe", name: "Wireframe", category: "Design", preview: "/website-wireframe.png" },
    { id: "mindmap", name: "Mind Map", category: "Planning", preview: "/mind-map-diagram.png" },
  ]

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Instant loading and real-time collaboration with optimized performance",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Work together in real-time with your team members on any diagram",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and stored securely with enterprise-grade security",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Works Everywhere",
      description: "Access your diagrams from any device, anywhere in the world",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DiagramFlow
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#templates" className="text-gray-600 hover:text-gray-900 transition-colors">
                Templates
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Professional Diagram Maker & Flowchart Software
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create stunning flowcharts, network diagrams, UML diagrams, wireframes, and more. Collaborate in real-time
            with your team and export to any format you need.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Drawing Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Upload className="w-5 h-5 mr-2" />
              Import Existing File
            </Button>
          </div>

          {/* File Format Support */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["PNG", "SVG", "PDF", "JPEG", "XML", "VSDX", "Lucidchart"].map((format) => (
              <Badge key={format} variant="outline" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Options */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Create New Diagram</CardTitle>
              <CardDescription>Start with a blank canvas or choose from templates</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/editor">
                <Button className="w-full">
                  Create New
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-200">
            <CardHeader className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Open Existing File</CardTitle>
              <CardDescription>Import from your device or cloud storage</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Import File
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200">
            <CardHeader className="text-center">
              <Share2 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Collaborate</CardTitle>
              <CardDescription>Work together with your team in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Start Collaborating
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose from Professional Templates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started quickly with our extensive library of professionally designed templates
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedTemplate(template.id)}
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

          <div className="text-center mt-8">
            <Button variant="outline">
              View All Templates
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Every Need</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to create professional diagrams and collaborate effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">{feature.icon}</div>
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of users who trust DiagramFlow for their diagramming needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/editor">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                <Play className="w-5 h-5 mr-2" />
                Start Drawing Free
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Desktop App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DiagramFlow</span>
              </div>
              <p className="text-gray-400 text-sm">Professional diagram maker trusted by millions worldwide.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 DiagramFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
