"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ChevronDown, ChevronUp, X } from "lucide-react"

type Subcategory = { id: string; name: string; name_en: string; slug: string }
type Category = { id: string; name: string; name_en: string; slug: string; description: string; subcategories: Subcategory[] }

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // New category form
  const [newCat, setNewCat] = useState({ name: '', name_en: '', slug: '', description: '' })
  const [showNewCat, setShowNewCat] = useState(false)

  // New subcategory form
  const [newSub, setNewSub] = useState<{ [catId: string]: { name: string; name_en: string; slug: string } }>({})
  const [showNewSub, setShowNewSub] = useState<string | null>(null)

  const refresh = () => router.refresh()

  // Add Category
  const addCategory = async () => {
    if (!newCat.name || !newCat.slug) return
    setLoading(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    })
    if (res.ok) {
      const created = await res.json()
      setCategories(prev => [...prev, { ...created, subcategories: [] }])
      setNewCat({ name: '', name_en: '', slug: '', description: '' })
      setShowNewCat(false)
    }
    setLoading(false)
  }

  // Delete Category
  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`კატეგორიის "${name}" წაშლა? ყველა ქვეკატეგორიაც წაიშლება.`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.id !== id))
    }
    setLoading(false)
  }

  // Add Subcategory
  const addSubcategory = async (categoryId: string) => {
    const sub = newSub[categoryId]
    if (!sub?.name || !sub?.slug) return
    setLoading(true)
    const res = await fetch('/api/admin/subcategories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id: categoryId, ...sub }),
    })
    if (res.ok) {
      const created = await res.json()
      setCategories(prev => prev.map(c =>
        c.id === categoryId ? { ...c, subcategories: [...c.subcategories, created] } : c
      ))
      setNewSub(prev => ({ ...prev, [categoryId]: { name: '', name_en: '', slug: '' } }))
      setShowNewSub(null)
    }
    setLoading(false)
  }

  // Delete Subcategory
  const deleteSubcategory = async (catId: string, subId: string, name: string) => {
    if (!confirm(`ქვეკატეგორიის "${name}" წაშლა?`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/subcategories/${subId}`, { method: 'DELETE' })
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
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input
              placeholder="სახელი (ქართ.) *"
              value={newCat.name}
              onChange={e => {
                const name = e.target.value
                setNewCat(p => ({ ...p, name, slug: p.slug || name.toLowerCase().replace(/\s+/g, '-') }))
              }}
              className="px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              placeholder="სახელი (ინგლ.)"
              value={newCat.name_en}
              onChange={e => setNewCat(p => ({ ...p, name_en: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              placeholder="Slug (URL) *"
              value={newCat.slug}
              onChange={e => setNewCat(p => ({ ...p, slug: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              placeholder="აღწერა"
              value={newCat.description}
              onChange={e => setNewCat(p => ({ ...p, description: e.target.value }))}
              className="px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={addCategory}
            disabled={loading || !newCat.name || !newCat.slug}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'ემატება...' : 'დამატება'}
          </button>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            {/* Category Header */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
                  className="flex items-center gap-2 text-left"
                >
                  {expanded === cat.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  <div>
                    <span className="font-medium text-foreground">{cat.name}</span>
                    {cat.name_en && <span className="text-sm text-muted-foreground ml-2">({cat.name_en})</span>}
                    <span className="text-xs text-muted-foreground ml-2">/{cat.slug}</span>
                  </div>
                </button>
                <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                  {cat.subcategories.length} ქვეკატ.
                </span>
              </div>
              <button
                onClick={() => deleteCategory(cat.id, cat.name)}
                disabled={loading}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Subcategories */}
            {expanded === cat.id && (
              <div className="border-t border-border/50 px-5 py-4">
                <div className="space-y-2 mb-4">
                  {cat.subcategories.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40">
                      <div>
                        <span className="text-sm font-medium text-foreground">{sub.name}</span>
                        {sub.name_en && <span className="text-xs text-muted-foreground ml-2">({sub.name_en})</span>}
                        <span className="text-xs text-muted-foreground ml-2">/{sub.slug}</span>
                      </div>
                      <button
                        onClick={() => deleteSubcategory(cat.id, sub.id, sub.name)}
                        disabled={loading}
                        className="p-1 rounded text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {cat.subcategories.length === 0 && (
                    <p className="text-xs text-muted-foreground">ქვეკატეგორიები არ არის</p>
                  )}
                </div>

                {/* Add Subcategory */}
                {showNewSub === cat.id ? (
                  <div className="flex gap-2 flex-wrap">
                    <input
                      placeholder="სახელი *"
                      value={newSub[cat.id]?.name ?? ''}
                      onChange={e => {
                        const name = e.target.value
                        setNewSub(p => ({ ...p, [cat.id]: { ...p[cat.id], name, slug: p[cat.id]?.slug || name.toLowerCase().replace(/\s+/g, '-') } }))
                      }}
                      className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-36"
                    />
                    <input
                      placeholder="English name"
                      value={newSub[cat.id]?.name_en ?? ''}
                      onChange={e => setNewSub(p => ({ ...p, [cat.id]: { ...p[cat.id], name_en: e.target.value } }))}
                      className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-36"
                    />
                    <input
                      placeholder="slug *"
                      value={newSub[cat.id]?.slug ?? ''}
                      onChange={e => setNewSub(p => ({ ...p, [cat.id]: { ...p[cat.id], slug: e.target.value } }))}
                      className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-32"
                    />
                    <button
                      onClick={() => addSubcategory(cat.id)}
                      disabled={loading}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      დამატება
                    </button>
                    <button onClick={() => setShowNewSub(null)} className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                      გაუქმება
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewSub(cat.id)}
                    className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
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
