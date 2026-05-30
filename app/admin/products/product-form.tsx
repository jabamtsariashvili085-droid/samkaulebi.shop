"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, Loader2, Sparkles } from "lucide-react"

type Category = { id: string; name: string; subcategories: { id: string; name: string }[] }
type ProductData = {
  id?: string; name?: string; name_en?: string; description?: string
  price?: number; original_price?: number; category_id?: string; subcategory_id?: string
  badge?: string; stock?: number; sku?: string; featured?: boolean; images?: string[]
  specifications?: Record<string, string>; tags?: string[]; image_alt?: string
}

export default function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductData }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    id:             initial?.id ?? "",
    name:           initial?.name ?? "",
    name_en:        initial?.name_en ?? "",
    description:    initial?.description ?? "",
    price:          initial?.price?.toString() ?? "",
    original_price: initial?.original_price?.toString() ?? "",
    category_id:    initial?.category_id ?? "",
    subcategory_id: initial?.subcategory_id ?? "",
    badge:          initial?.badge ?? "",
    stock:          initial?.stock?.toString() ?? "0",
    sku:            initial?.sku ?? "",
    featured:       initial?.featured ?? false,
  })

  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [tagInput, setTagInput] = useState("")
  const [imageAlt, setImageAlt] = useState(initial?.image_alt ?? "")
  const [aiLoading, setAiLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const addTag = (t: string) => {
    const v = t.trim()
    if (v && !tags.includes(v)) setTags(prev => [...prev, v])
    setTagInput("")
  }

  const generateAi = async () => {
    if (!images[0]) { setError("ჯერ ატვირთე სურათი"); return }
    setAiLoading(true)
    setError("")
    try {
      const res = await fetch('/api/admin/ai/describe-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: images[0], name: form.name }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'AI ვერ მუშაობს'); return }
      if (data.altText) setImageAlt(data.altText)
      if (Array.isArray(data.tags)) setTags(prev => Array.from(new Set([...prev, ...data.tags])))
      // აღწერას ვავსებთ მხოლოდ თუ ცარიელია — ხელით დაწერილს არ გადავაწერთ
      if (data.description) setForm(prev => prev.description.trim() ? prev : { ...prev, description: data.description })
    } catch {
      setError('AI მოთხოვნა ვერ შესრულდა')
    } finally {
      setAiLoading(false)
    }
  }

  const subcategories = categories.find(c => c.id === form.category_id)?.subcategories ?? []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)

    for (const file of files) {
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'products' }),
        })
        const { presignedUrl, publicUrl } = await res.json()
        await fetch(presignedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
        setImages(prev => [...prev, publicUrl])
      } catch {
        setError('სურათის ატვირთვა ვერ მოხერხდა')
      }
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (url: string) => setImages(prev => prev.filter(i => i !== url))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      id:             form.id || undefined,
      name:           form.name,
      name_en:        form.name_en || null,
      description:    form.description || null,
      price:          parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      category_id:    form.category_id || null,
      subcategory_id: form.subcategory_id || null,
      badge:          form.badge || null,
      stock:          parseInt(form.stock),
      sku:            form.sku || null,
      featured:       form.featured,
      images,
      tags,
      image_alt:      imageAlt || null,
    }

    const url = initial?.id ? `/api/admin/products/${initial.id}` : '/api/admin/products'
    const method = initial?.id ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg ?? 'შეცდომა')
      setSaving(false)
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Images */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h2 className="font-medium text-foreground mb-4">სურათები</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {images.map(url => (
            <div key={url} className="relative w-24 h-24 rounded-xl overflow-hidden group">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          <label className={`w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground mt-1">{uploading ? 'იტვირთება...' : 'ატვირთვა'}</span>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP — პირველი სურათი მთავარია</p>
      </div>

      {/* SEO & AI tags */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium text-foreground">SEO და ტეგები</h2>
            <p className="text-xs text-muted-foreground mt-0.5">AI ამოიცნობს პროდუქტს, მოიძიებს ინტერნეტში და შეავსებს აღწერას, alt-text-ს და ტეგებს — შემდეგ შეგიძლია ჩაასწორო</p>
          </div>
          <button
            type="button"
            onClick={generateAi}
            disabled={aiLoading || !images.length}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50 shrink-0"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiLoading ? 'AI ფიქრობს...' : 'AI-ით შევსება'}
          </button>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">სურათის აღწერა (alt-text)</label>
          <input
            value={imageAlt}
            onChange={e => setImageAlt(e.target.value)}
            placeholder="მაგ. ოქროს საქორწინო ბეჭედი თეთრ ფონზე"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">ტეგები</label>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full text-foreground">
                  {t}
                  <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))} className="text-muted-foreground hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) } }}
            placeholder="დაამატე ტეგი + Enter"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
        <h2 className="font-medium text-foreground">ძირითადი ინფო</h2>
        {!initial?.id && (
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">ID (slug) *</label>
            <input name="id" value={form.id} onChange={handleChange} required placeholder="ring-gold-classic" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">სახელი (ქართ.) *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">სახელი (ინგლ.)</label>
            <input name="name_en" value={form.name_en} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">აღწერა</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h2 className="font-medium text-foreground mb-4">ფასი და მარაგი</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">ფასი (₾) *</label>
            <input name="price" value={form.price} onChange={handleChange} required type="number" min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">ძველი ფასი (₾)</label>
            <input name="original_price" value={form.original_price} onChange={handleChange} type="number" min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">მარაგი *</label>
            <input name="stock" value={form.stock} onChange={handleChange} required type="number" min="0" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} placeholder="JW-RNG-001" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Badge</label>
            <select name="badge" value={form.badge} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">— არცერთი —</option>
              <option value="new">new</option>
              <option value="bestseller">bestseller</option>
              <option value="sale">sale</option>
            </select>
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="w-4 h-4 rounded" />
              <span className="text-sm text-foreground">Featured პროდუქტი</span>
            </label>
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="bg-card rounded-2xl p-6 border border-border/50">
        <h2 className="font-medium text-foreground mb-4">კატეგორია</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">კატეგორია</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">— ავირჩიოთ —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">ქვეკატეგორია</label>
            <select name="subcategory_id" value={form.subcategory_id} onChange={handleChange} disabled={!subcategories.length} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
              <option value="">— ავირჩიოთ —</option>
              {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm">
          {saving ? 'ინახება...' : initial?.id ? 'შენახვა' : 'პროდუქტის დამატება'}
        </button>
        <a href="/admin/products" className="px-8 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors text-sm">
          გაუქმება
        </a>
      </div>
    </form>
  )
}
