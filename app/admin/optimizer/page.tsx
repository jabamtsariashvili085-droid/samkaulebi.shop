"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Download, Zap, X, RotateCcw, CheckCircle2, Loader2, ArchiveIcon } from "lucide-react"
import JSZip from "jszip"

type FileItem = {
  id: string
  file: File
  preview: string
  status: "pending" | "processing" | "done" | "error"
  result?: {
    optimizedBase64: string
    format: string
    originalSize: number
    optimizedSize: number
    savings: number
    originalWidth: number
    originalHeight: number
    optimizedWidth: number
    optimizedHeight: number
  }
  error?: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function uid() { return Math.random().toString(36).slice(2) }

export default function OptimizerPage() {
  const [items, setItems] = useState<FileItem[]>([])
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [format, setFormat] = useState("webp")
  const [running, setRunning] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/"))
    const newItems: FileItem[] = imageFiles.map(file => ({
      id: uid(),
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }))
    setItems(prev => [...prev, ...newItems])
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }, [])

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const reset = () => setItems([])

  const optimizeAll = async () => {
    const pending = items.filter(i => i.status === "pending" || i.status === "error")
    if (!pending.length) return
    setRunning(true)

    for (const item of pending) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "processing" } : i))

      const formData = new FormData()
      formData.append("file", item.file)
      formData.append("quality", String(quality))
      formData.append("maxWidth", String(maxWidth))
      formData.append("format", format)

      const res = await fetch("/api/admin/optimize", { method: "POST", body: formData })
      const data = await res.json()

      setItems(prev => prev.map(i => i.id === item.id
        ? res.ok
          ? { ...i, status: "done", result: data }
          : { ...i, status: "error", error: data.error || "შეცდომა" }
        : i
      ))
    }

    setRunning(false)
  }

  const downloadOne = (item: FileItem) => {
    if (!item.result) return
    const a = document.createElement("a")
    a.href = `data:image/${item.result.format};base64,${item.result.optimizedBase64}`
    a.download = item.file.name.replace(/\.[^.]+$/, "") + "." + item.result.format
    a.click()
  }

  const downloadAll = async () => {
    const done = items.filter(i => i.status === "done" && i.result)
    if (!done.length) return
    const zip = new JSZip()
    for (const item of done) {
      const blob = await (await fetch(`data:image/${item.result!.format};base64,${item.result!.optimizedBase64}`)).blob()
      zip.file(item.file.name.replace(/\.[^.]+$/, "") + "." + item.result!.format, blob)
    }
    const zipBlob = await zip.generateAsync({ type: "blob" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(zipBlob)
    a.download = "optimized-images.zip"
    a.click()
  }

  const uploadAllToR2 = async () => {
    const done = items.filter(i => i.status === "done" && i.result)
    for (const item of done) {
      const blob = await (await fetch(`data:image/${item.result!.format};base64,${item.result!.optimizedBase64}`)).blob()
      const filename = item.file.name.replace(/\.[^.]+$/, "") + "-opt." + item.result!.format
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, contentType: `image/${item.result!.format}`, folder: "optimized" }),
      })
      const { presignedUrl } = await res.json()
      await fetch(presignedUrl, { method: "PUT", body: blob, headers: { "Content-Type": `image/${item.result!.format}` } })
    }
    alert(`${done.length} სურათი R2-ზე ავტვირთა!`)
  }

  const doneCount = items.filter(i => i.status === "done").length
  const totalSavings = items.filter(i => i.result).reduce((acc, i) => acc + (i.result!.originalSize - i.result!.optimizedSize), 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">სურათის ოპტიმიზატორი</h1>
          <p className="text-muted-foreground mt-1">ბევრი სურათი ერთდროულად — WebP კონვერტაცია და კომპრესია</p>
        </div>
        {items.length > 0 && (
          <button onClick={reset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-4 h-4" /> გასუფთავება
          </button>
        )}
      </div>

      {/* Settings bar */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6 flex flex-wrap items-end gap-6">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">ფორმატი</label>
          <div className="flex gap-2">
            {["webp", "jpeg", "png"].map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${format === f ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:text-foreground"}`}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[160px]">
          <div className="flex justify-between mb-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">ხარისხი</label>
            <span className="text-sm font-semibold text-foreground">{quality}%</span>
          </div>
          <input type="range" min={20} max={100} step={5} value={quality}
            onChange={e => setQuality(+e.target.value)} className="w-full accent-primary" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">მაქს. სიგანე</label>
          <div className="flex gap-2">
            {[800, 1200, 1920, 2560].map(w => (
              <button key={w} onClick={() => setMaxWidth(w)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${maxWidth === w ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground hover:text-foreground"}`}>
                {w}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all mb-6 ${
          dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mb-3" />
        <p className="font-medium text-foreground">სურათები ჩამოაგდე ან დააჭირე</p>
        <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WebP, GIF — რამდენიც გინდა</p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => addFiles(Array.from(e.target.files ?? []))} />
      </div>

      {/* Action buttons */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={optimizeAll} disabled={running || !items.some(i => i.status === "pending" || i.status === "error")}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {running ? "მუშავდება..." : `ოპტიმიზება (${items.filter(i => i.status === "pending").length})`}
          </button>

          {doneCount > 0 && (
            <>
              <button onClick={downloadAll}
                className="flex items-center gap-2 border border-border px-6 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <ArchiveIcon className="w-4 h-4" /> ZIP ჩამოტვირთვა ({doneCount})
              </button>
              <button onClick={uploadAllToR2}
                className="flex items-center gap-2 border border-border px-6 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Upload className="w-4 h-4" /> R2-ზე ატვირთვა ({doneCount})
              </button>
            </>
          )}

          {totalSavings > 0 && (
            <div className="ml-auto flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">სულ დაზოგა: {formatBytes(totalSavings)}</span>
            </div>
          )}
        </div>
      )}

      {/* Image list */}
      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {/* Preview */}
              <div className="relative h-40 bg-muted/30">
                <img src={item.preview} alt={item.file.name} className="w-full h-full object-cover" />
                <button onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 p-1 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {/* Status badge */}
                {item.status === "processing" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
                {item.status === "done" && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    -{item.result!.savings}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-medium text-foreground truncate mb-2">{item.file.name}</p>

                {item.status === "pending" && (
                  <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
                )}
                {item.status === "processing" && (
                  <p className="text-xs text-primary animate-pulse">მუშავდება...</p>
                )}
                {item.status === "error" && (
                  <p className="text-xs text-red-500">{item.error}</p>
                )}
                {item.status === "done" && item.result && (
                  <>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground line-through">{formatBytes(item.result.originalSize)}</span>
                      <span className="font-semibold text-green-600">{formatBytes(item.result.optimizedSize)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${100 - item.result.savings}%` }} />
                    </div>
                    <button onClick={() => downloadOne(item)}
                      className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Download className="w-3 h-3" /> ჩამოტვირთვა
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
