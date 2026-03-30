"use client";
import { useEffect, useState } from "react";
import { adminGetCategories, adminCreateCategory } from "@/lib/api";
import { Category } from "@/types";
import { Spinner, EmptyState } from "@/components/ui";
import { Tag, Plus, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    adminGetCategories()
      .then((r) => setCategories(r.data.data || []))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { toast.error("Enter a category name"); return; }
    setCreating(true);
    try {
      await adminCreateCategory(newName.trim());
      toast.success(`"${newName}" added!`);
      setNewName("");
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Create failed");
    }
    setCreating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-black text-ink">Categories</h1>
        <p className="text-ink/40 text-sm mt-1">Manage subject categories for tutors</p>
      </div>

      {/* Add form */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Plus size={16} className="text-brand-500" /> Add Category
        </h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Mathematics, Programming, Music..."
            className="input flex-1 max-w-sm"
          />
          <button type="submit" disabled={creating} className="btn-primary disabled:opacity-50">
            {creating ? <Spinner size={16} /> : <><Plus size={14} /> Add</>}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <Tag size={16} className="text-brand-500" /> All Categories
          <span className="ml-1 text-sm font-normal text-ink/40">({categories.length})</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner size={28} /></div>
        ) : categories.length === 0 ? (
          <EmptyState icon={<Tag size={24} />} title="No categories yet" description="Add your first category above." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-2 px-4 py-2 bg-orange-50 border-2 border-orange-100 rounded-xl text-sm font-semibold text-ink hover:border-brand-300 transition-colors group"
              >
                <CheckCircle size={13} className="text-brand-500" />
                {cat.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
