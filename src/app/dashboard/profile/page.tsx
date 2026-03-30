"use client";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { updateMyProfile } from "@/lib/api";
import { Avatar, Spinner } from "@/components/ui";
import { User, Mail, Camera } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMyProfile({ name, image });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-black text-ink">My Profile</h1>
        <p className="text-ink/40 text-sm mt-1">Manage your account information</p>
      </div>

      <div className="card p-6">
        {/* Avatar section */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-orange-100">
          <Avatar name={name || "?"} image={image || undefined} size="lg" />
          <div>
            <h2 className="font-display font-bold text-xl">{name}</h2>
            <p className="text-sm text-ink/50 capitalize">{user?.role}</p>
            <p className="text-xs text-ink/30 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 max-w-md">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink mb-1.5">
              <User size={13} /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink mb-1.5">
              <Mail size={13} /> Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="input opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-ink/30 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink mb-1.5">
              <Camera size={13} /> Profile Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100 text-xs text-ink/60">
            Role: <span className="font-semibold capitalize text-brand-600">{user?.role}</span>
            · Status: <span className={`font-semibold ${user?.status === "active" ? "text-green-600" : "text-red-500"}`}>{user?.status}</span>
          </div>

          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? <Spinner size={16} /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
