"use client";
import { useEffect, useState } from "react";
import { adminGetUsers, adminToggleUserStatus } from "@/lib/api";
import { User } from "@/types";
import { Avatar, StatusBadge, Spinner, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { Users, Search, ShieldOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminGetUsers()
      .then((r) => setUsers(r.data.data || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async (user: User) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    if (!confirm(`${newStatus === "blocked" ? "Block" : "Unblock"} ${user.name}?`)) return;
    setToggling(user.id);
    try {
      await adminToggleUserStatus(user.id, newStatus);
      toast.success(`User ${newStatus}`);
      load();
    } catch {
      toast.error("Update failed");
    }
    setToggling(null);
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const byRole = (role: string) => filtered.filter((u) => u.role === role).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-black text-ink">Users</h1>
          <p className="text-ink/40 text-sm mt-1">
            {users.length} total · {byRole("student")} students · {byRole("tutor")} tutors
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 bg-white border-2 border-orange-100 rounded-xl text-sm focus:outline-none focus:border-brand-500 w-56"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users size={28} />} title="No users found" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-orange-100 bg-orange-50/50">
                  <th className="text-left px-4 py-3 text-xs font-display font-bold text-ink/50 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-display font-bold text-ink/50 uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-display font-bold text-ink/50 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-display font-bold text-ink/50 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 text-xs font-display font-bold text-ink/50 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} image={user.image} size="sm" />
                        <div>
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-xs text-ink/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                        user.role === "admin" ? "bg-violet-100 text-violet-700" :
                        user.role === "tutor" ? "bg-blue-100 text-blue-700" :
                        "bg-orange-100 text-brand-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-ink/40">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleToggle(user)}
                          disabled={toggling === user.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                            user.status === "active"
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {toggling === user.id ? <Spinner size={11} /> :
                            user.status === "active" ? <><ShieldOff size={11} /> Block</> : <><ShieldCheck size={11} /> Unblock</>
                          }
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
