"use client";
import { useEffect, useState } from "react";
import { getMyTutorProfile, upsertTutorProfile, getCategories } from "@/lib/api";
import { Category } from "@/types";
import { Spinner } from "@/components/ui";
import { User, DollarSign, BookOpen, Tag, Plus, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function TutorProfilePage() {
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyTutorProfile(), getCategories()])
      .then(([profileRes, catRes]) => {
        const p = profileRes.data.data;
        const cats = catRes.data.data || [];
        setAllCategories(cats);
        if (p) {
          setBio(p.bio || "");
          setHourlyRate(String(p.hourlyRate || ""));
          setExperience(String(p.experience || ""));
          setSelectedCategories(p.categories?.map((c: any) => c.name) || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bio || !hourlyRate || !experience) { toast.error("Fill in all fields"); return; }
    setSaving(true);
    try {
      await upsertTutorProfile({
        bio,
        hourlyRate: Number(hourlyRate),
        experience: Number(experience),
        categories: selectedCategories,
      });
      setSaved(true);
      toast.success("Profile saved!");
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Save failed");
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Spinner size={36} /></div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-black text-ink">Tutor Profile</h1>
        <p className="text-ink/40 text-sm mt-1">Set up your public profile to attract students</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Bio */}
        <div className="card p-6">
          <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <User size={16} className="text-brand-500" /> About You
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell students about your background, teaching style, and what you can help them achieve..."
                className="input resize-none"
              />
              <p className="text-xs text-ink/30 mt-1">{bio.length}/500 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-ink mb-1.5">
                  <DollarSign size={13} /> Hourly Rate ($)
                </label>
                <input
                  type="number"
                  min="1"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="e.g. 50"
                  className="input"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-ink mb-1.5">
                  <BookOpen size={13} /> Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 3"
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="card p-6">
          <h2 className="font-display font-bold text-lg mb-2 flex items-center gap-2">
            <Tag size={16} className="text-brand-500" /> Subjects You Teach
          </h2>
          <p className="text-xs text-ink/40 mb-4">Select from available categories</p>

          {allCategories.length === 0 ? (
            <p className="text-sm text-ink/40 italic">No categories available. Ask admin to add some.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const selected = selectedCategories.includes(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all duration-150",
                      selected
                        ? "bg-brand-500 text-white border-brand-500"
                        : "bg-white text-ink/60 border-orange-100 hover:border-brand-300"
                    )}
                  >
                    {selected ? <X size={11} /> : <Plus size={11} />}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}

          {selectedCategories.length > 0 && (
            <p className="text-xs text-brand-600 font-semibold mt-3">
              {selectedCategories.length} subject{selectedCategories.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className={cn(
            "btn-primary w-full sm:w-auto justify-center",
            saved && "!bg-green-500 !shadow-green-500/30"
          )}
        >
          {saving ? <Spinner size={16} /> : saved ? <><CheckCircle size={16} /> Saved!</> : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
