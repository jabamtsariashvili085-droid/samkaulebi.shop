"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"

/**
 * Single-image upload to Cloudflare R2 via /api/admin/upload (presigned PUT).
 * Stores the returned public URL through onChange.
 */
export function ImageUpload({
  value,
  onChange,
  folder = "categories",
  size = 64,
}: {
  value: string
  onChange: (url: string) => void
  folder?: string
  size?: number
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder }),
      })
      if (!res.ok) throw new Error("upload init failed")
      const { presignedUrl, publicUrl } = await res.json()
      await fetch(presignedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } })
      onChange(publicUrl)
    } catch {
      /* swallow — caller UI stays usable */
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center gap-2" style={{ minHeight: size }}>
      {value ? (
        <div className="relative rounded-lg overflow-hidden group shrink-0" style={{ width: size, height: size }}>
          <Image src={value} alt="" fill className="object-cover" sizes="64px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="სურათის წაშლა"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <label
          className={`rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors shrink-0 ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{ width: size, height: size }}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-muted-foreground" />
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}
