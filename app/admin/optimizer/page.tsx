"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Download, ImageIcon, Zap, ArrowRight, X, RotateCcw } from "lucide-react"

type Result = {
  optimizedBase64: string
  format: string
  originalSize: number
  optimizedSize: number
  savings: number
  originalWidth: number
  originalHeight: number
  optimizedWidth: number
  optimizedHeight: number
  originalFormat: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function OptimizerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [format, setFormat] = useState("webp")
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    setUploadedUrl(null)
    setError("")
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith("image/")) handleFile(f)
  }, [])

  const optimize = async () => {
    if (!file) return
    setLoading(true)
    setError("")
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("quality", String(quality))
    formData.append("maxWidth", String(maxWidth))
    formData.append("format", format)

    const res = await fetch("/api/admin/optimize", { method: "POST", body: formData })
    const data = await res.json()

    if (!res.ok) { setError(data.error || "შეცდომა"); setLoading(false); return }
    setResult(data)
    setLoading(false)
  }

  const download = () => {
    if (!result || !file) return
    const a = document.createElement("a")
    a.href = `data:image/${result.format};base64,${result.optimizedBase64}`
    a.download = file.name.replace(/\.[^.]+$/, "") + "." + result.format
    a.click()
  }

  const uploadToR2 = async () => {
    if (!result || !file) return
    setUploading(true)
    setError("")

    const blob = await (await fetch(`data:image/${result.format};base64,${result.optimizedBase64}`)).blob()
    const filename = file.name.replace(/\.[^.]+$/, "") + "-optimized." + result.format

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, contentType: `image/${result.format}`, folder: "optimized" }),
    })
    const { presignedUrl, publicUrl } = await res.json()

    await fetch(presignedUrl, { method: "PUT", body: blob, headers: { "Content-Type": `image/${result.format}` } })
    setUploadedUrl(publicUrl)
    setUploading(false)
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setUploadedUrl(null)
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">სურათის ოპტიმიზატორი</h1>
          <p className="text-muted-foreground mt-1">შეამცირე სურათის ზომა ხარისხის შენარჩუნებით</p>
        </div>
        {file && (
          <button onClick={reset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-4 h-4" /> თავიდან
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left — Upload + Settings */}
        <div className="space-y-4">
          {/* Drop zone */}
          {!file ? (
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
                dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <Upload className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="font-medium text-foreground mb-1">სურათი ჩამოაგდე ან დააჭირე</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, WebP, GIF</p>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-muted/20">
              <img src={preview!} alt="original" className="w-full h-64 object-contain bg-muted/30" />
              <div className="absolute top-3 right-3">
                <button onClick={reset} className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{formatBytes(file.size)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-5">
            <h3 className="font-medium text-foreground text-sm">პარამეტრები</h3>

            {/* Format */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">ფორმატი</label>
              <div className="flex gap-2">
                {["webp", "jpeg", "png"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      format === f ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
              {format === "webp" && <p className="text-xs text-muted-foreground mt-1.5">WebP — ყველაზე მცირე ზომა, თანამედროვე ბრაუზერები</p>}
            </div>

            {/* Quality */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">ხარისხი</label>
                <span className="text-sm font-semibold text-foreground">{quality}%</span>
              </div>
              <input
                type="range" min={20} max={100} step={5} value={quality}
                onChange={e => setQuality(+e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>მცირე ფაილი</span>
                <span>მაღალი ხარისხი</span>
              </div>
            </div>

            {/* Max Width */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wide">მაქს. სიგანე</label>
                <span className="text-sm font-semibold text-foreground">{maxWidth}px</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[800, 1200, 1920, 2560].map(w => (
                  <button
                    key={w}
                    onClick={() => setMaxWidth(w)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      maxWidth === w ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={optimize}
            disabled={!file || loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            {loading ? "მუშავდება..." : "ოპტიმიზება"}
          </button>
        </div>

        {/* Right — Result */}
        <div>
          {!result ? (
            <div className="h-full min-h-[400px] rounded-2xl border-2 border-dashed border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">შედეგი აქ გამოჩნდება</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">ორიგინალი</p>
                  <p className="text-lg font-bold text-foreground">{formatBytes(result.originalSize)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.originalWidth}×{result.originalHeight}</p>
                </div>
                <div className="bg-green-50 rounded-2xl border border-green-200 p-4 text-center">
                  <p className="text-xs text-green-600 mb-1">დაზოგვა</p>
                  <p className="text-2xl font-bold text-green-600">{result.savings}%</p>
                  <p className="text-xs text-green-500 mt-0.5">-{formatBytes(result.originalSize - result.optimizedSize)}</p>
                </div>
                <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">ოპტიმიზებული</p>
                  <p className="text-lg font-bold text-foreground">{formatBytes(result.optimizedSize)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.optimizedWidth}×{result.optimizedHeight}</p>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-2xl overflow-hidden border border-border/50">
                <img
                  src={`data:image/${result.format};base64,${result.optimizedBase64}`}
                  alt="optimized"
                  className="w-full h-64 object-contain bg-muted/30"
                />
              </div>

              {/* Savings bar */}
              <div className="bg-card rounded-2xl border border-border/50 p-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>ოპტიმიზებული</span>
                  <span>{100 - result.savings}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${100 - result.savings}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              {uploadedUrl ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-sm font-medium text-green-700 mb-2">R2-ზე ავტვირთა!</p>
                  <input
                    readOnly value={uploadedUrl}
                    onClick={e => (e.target as HTMLInputElement).select()}
                    className="w-full text-xs px-3 py-2 bg-white border border-green-200 rounded-lg text-green-800 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={download}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    ჩამოტვირთვა
                  </button>
                  <button
                    onClick={uploadToR2}
                    disabled={uploading}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {uploading ? "იტვირთება..." : "R2-ზე ატვირთვა"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
    </div>
  )
}
