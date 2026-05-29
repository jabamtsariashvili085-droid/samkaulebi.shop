"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash2, ChevronDown, ChevronUp, X, Pencil, ImageIcon } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

type Subcategory = { id: string; name: string; name_en: string; slug: string; image?: string | null }
type Category = {
  id: string; name: string; name_en: string; slug: string
  description: string; image?: string | null; subcategories: Subcategory[]
}

const inputCls =
  "px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"

function Thumb({ src, size = 40 }: { src?: string | null; size?: number }) {
  if (src) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-muted shrink-0" style={{ width: size, height: size }}>
        <Image src={src} alt="" fill className="object-cover" sizes="40px" />
      </div>
    )
  }
  return (
    <div className="rounded-lg bg-muted flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <ImageIcon className="w-4 h-4 text-muted-foreground" />
    </div>
  )
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [newCat, setNewCat] = useState({ name: "", name_en: "", slug: "", description: "", image: "" })
  const [showNewCat, setShowNewCat] = useState(false)

  const [editCatId, setEditCatId] = useState<string | null>(null)
  const [editCat, setEditCat] = useState({ name: "", name_en: "", description: "", image: "" })

  const [newSub, setNewSub] = useState<Record<string, { name: string; name_en: string; slug: string; image: string }>>({})
  const [showNewSub, setShowNewSub] = useState<string | null>(null)

  const [editSubId, setEditSubId] = useState<string | null>(null)
  const [editSub, setEditSub] = useState({ name: "", name_en: "", image: "" })

  // ---- Category CRUD ----
  const addCategory = async () => {
    if (!newCat.name || !newCat.slug) return
    setLoading(true)
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    })
    if (res.ok) {
      const created = await res.json()
      setCategories(prev => [...prev, { ...created, subcategories: [] }])
      setNewCat({ name: "", name_en: "", slug: "", description: "", image: "" })
      setShowNewCat(false)
    }
    setLoading(false)
  }

  const startEditCat = (cat: Category) => {
    setEditCatId(cat.id)
    setEditCat({ name: cat.name, name_en: cat.name_en ?? "", description: cat.description ?? "", image: cat.image ?? "" })
  }

  const saveEditCat = async (id: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editCat),
    })
    if (res.ok) {
      const updated = await res.json()
      setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)))
      setEditCatId(null)
      router.refresh()
    }
    setLoading(false)
  }

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`კატეგორიის "${name}" წაშლა? ყველა ქვეკატეგორიაც წაიშლება.`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    if (res.ok) setCategories(prev => prev.filter(c => c.id !== id))
    setLoading(false)
  }

  // ---- Subcategory CRUD ----
  const addSubcategory = async (categoryId: string) => {
    const sub = newSub[categoryId]
    if (!sub?.name || !sub?.slug) return
    setLoading(true)
    const res = await fetch("/api/admin/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_id: categoryId, ...sub }),
    })
    if (res.ok) {
      const created = await res.json()
      setCategories(prev => prev.map(c =>
        c.id === categoryId ? { ...c, subcategories: [...c.subcategories, created] } : c
      ))
      setNewSub(prev => ({ ...prev, [categoryId]: { name: "", name_en: "", slug: "", image: "" } }))
      setShowNewSub(null)
    }
    setLoading(false)
  }

  const startEditSub = (sub: Subcategory) => {
    setEditSubId(sub.id)
    setEditSub({ name: sub.name, name_en: sub.name_en ?? "", image: sub.image ?? "" })
  }

  const saveEditSub = async (catId: string, subId: string) => {
    setLoading(true)
    const res = await fetch(`/api/admin/subcategories/${subId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSub),
    })
    if (res.ok) {
      const updated = await res.json()
      setCategories(prev => prev.map(c =>
        c.id === catId
          ? { ...c, subcategories: c.subcategories.map(s => (s.id === subId ? { ...s, ...updated } : s)) }
          : c
      ))
      setEditSubId(null)
      router.refresh()
    }
    setLoading(false)
  }

  const deleteSubcategory = async (catId: string, subId: string, name: string) => {
    if (!confirm(`ქვეკატეგორიის "${name}" წაშლა?`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/subcategories/${subId}`, { method: "DELETE" })
    if (res.ok) {
      setCategories(prev => prev.map(c =>
        c.id === catId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c
      ))
    }
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">კატეგორიები</h1>
          <p className="text-muted-foreground mt-1">{categories.length} კატეგორია</p>
        </div>
        <button
          onClick={() => setShowNewCat(v => !v)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          ახალი კატეგორია
        </button>
      </div>

      {/* New Category Form */}
      {showNewCat && (
        <div className="bg-card rounded-2xl border border-primary/30 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-foreground">ახალი კატეგორია</h2>
            <button onClick={() => setShowNewCat(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="flex gap-4">
            <div className="shrink-0">
              <label className="text-xs text-muted-foreground mb-1.5 block">ფოტო</label>
              <ImageUpload value={newCat.image} onChange={url => setNewCat(p => ({ ...p, image: url }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3 flex-1">
              <input
                placeholder="სახელი (ქართ.) *"
                value={newCat.name}
                onChange={e => {
                  const name = e.target.value
                  setNewCat(p => ({ ...p, name, slug: p.slug || name.toLowerCase().replace(/\s+/g, "-") }))
                }}
                className={inputCls}
              />
              <input placeholder="სახელი (ინგლ.)" value={newCat.name_en} onChange={e => setNewCat(p => ({ ...p, name_en: e.target.value }))} className={inputCls} />
              <input placeholder="Slug (URL) *" value={newCat.slug} onChange={e => setNewCat(p => ({ ...p, slug: e.target.value }))} className={inputCls} />
              <input placeholder="აღწერა" value={newCat.description} onChange={e => setNewCat(p => ({ ...p, description: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <button
            onClick={addCategory}
            disabled={loading || !newCat.name || !newCat.slug}
            className="mt-4 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "ემატება..." : "დამატება"}
          </button>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            {editCatId === cat.id ? (
              /* Edit Category */
              <div className="p-5">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <label className="text-xs text-muted-foreground mb-1.5 block">ფოტო</label>
                    <ImageUpload value={editCat.image} onChange={url => setEditCat(p => ({ ...p, image: url }))} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 flex-1">
                    <input placeholder="სახელი (ქართ.)" value={editCat.name} onChange={e => setEditCat(p => ({ ...p, name: e.target.value }))} className={inputCls} />
                    <input placeholder="სახელი (ინგლ.)" value={editCat.name_en} onChange={e => setEditCat(p => ({ ...p, name_en: e.target.value }))} className={inputCls} />
                    <input placeholder="აღწერა" value={editCat.description} onChange={e => setEditCat(p => ({ ...p, description: e.target.value }))} className={`${inputCls} sm:col-span-2`} />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => saveEditCat(cat.id)} disabled={loading} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                    {loading ? "ინახება..." : "შენახვა"}
                  </button>
                  <button onClick={() => setEditCatId(null)} className="px-5 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                    გაუქმება
                  </button>
                </div>
              </div>
            ) : (
              /* Category Header */
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Thumb src={cat.image} />
                  <button onClick={() => setExpanded(expanded === cat.id ? null : cat.id)} className="flex items-center gap-2 text-left min-w-0">
                    {expanded === cat.id ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <div className="truncate">
                      <span className="font-medium text-foreground">{cat.name}</span>
                      {cat.name_en && <span className="text-sm text-muted-foreground ml-2">({cat.name_en})</span>}
                      <span className="text-xs text-muted-foreground ml-2">/{cat.slug}</span>
                    </div>
                  </button>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground shrink-0">
                    {cat.subcategories.length} ქვეკატ.
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEditCat(cat)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" aria-label="რედაქტირება">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCategory(cat.id, cat.name)} disabled={loading} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" aria-label="წაშლა">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Subcategories */}
            {expanded === cat.id && editCatId !== cat.id && (
              <div className="border-t border-border/50 px-5 py-4">
                <div className="space-y-2 mb-4">
                  {cat.subcategories.map(sub => (
                    editSubId === sub.id ? (
                      <div key={sub.id} className="flex items-center gap-2 flex-wrap py-2 px-3 rounded-lg bg-muted/40">
                        <ImageUpload value={editSub.image} onChange={url => setEditSub(p => ({ ...p, image: url }))} size={40} />
                        <input placeholder="სახელი" value={editSub.name} onChange={e => setEditSub(p => ({ ...p, name: e.target.value }))} className={`${inputCls} w-36`} />
                        <input placeholder="English" value={editSub.name_en} onChange={e => setEditSub(p => ({ ...p, name_en: e.target.value }))} className={`${inputCls} w-36`} />
                        <button onClick={() => saveEditSub(cat.id, sub.id)} disabled={loading} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">შენახვა</button>
                        <button onClick={() => setEditSubId(null)} className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">გაუქმება</button>
                      </div>
                    ) : (
                      <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40">
                        <div className="flex items-center gap-3 min-w-0">
                          <Thumb src={sub.image} size={32} />
                          <div className="truncate">
                            <span className="text-sm font-medium text-foreground">{sub.name}</span>
                            {sub.name_en && <span className="text-xs text-muted-foreground ml-2">({sub.name_en})</span>}
                            <span className="text-xs text-muted-foreground ml-2">/{sub.slug}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => startEditSub(sub)} className="p-1 rounded text-muted-foreground hover:text-primary transition-colors" aria-label="რედაქტირება">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteSubcategory(cat.id, sub.id, sub.name)} disabled={loading} className="p-1 rounded text-muted-foreground hover:text-red-500 transition-colors" aria-label="წაშლა">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                  {cat.subcategories.length === 0 && <p className="text-xs text-muted-foreground">ქვეკატეგორიები არ არის</p>}
                </div>

                {/* Add Subcategory */}
                {showNewSub === cat.id ? (
                  <div className="flex gap-2 flex-wrap items-center">
                    <ImageUpload value={newSub[cat.id]?.image ?? ""} onChange={url => setNewSub(p => ({ ...p, [cat.id]: { ...p[cat.id], image: url } }))} size={40} />
                    <input
                      placeholder="სახელი *"
                      value={newSub[cat.id]?.name ?? ""}
                      onChange={e => {
                        const name = e.target.value
                        setNewSub(p => ({ ...p, [cat.id]: { ...p[cat.id], name, slug: p[cat.id]?.slug || name.toLowerCase().replace(/\s+/g, "-") } }))
                      }}
                      className={`${inputCls} w-36`}
                    />
                    <input placeholder="English name" value={newSub[cat.id]?.name_en ?? ""} onChange={e => setNewSub(p => ({ ...p, [cat.id]: { ...p[cat.id], name_en: e.target.value } }))} className={`${inputCls} w-36`} />
                    <input placeholder="slug *" value={newSub[cat.id]?.slug ?? ""} onChange={e => setNewSub(p => ({ ...p, [cat.id]: { ...p[cat.id], slug: e.target.value } }))} className={`${inputCls} w-32`} />
                    <button onClick={() => addSubcategory(cat.id)} disabled={loading} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">დამატება</button>
                    <button onClick={() => setShowNewSub(null)} className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">გაუქმება</button>
                  </div>
                ) : (
                  <button onClick={() => setShowNewSub(cat.id)} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    ქვეკატეგორიის დამატება
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
