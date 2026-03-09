import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Hsidebar from "@/components/dashboard/hsidebar";
import {
  ArrowLeft,
  Edit,
  Ban,
  Mail,
  Calendar,
  X,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Loader2,
  AlertCircle,
  User as UserIcon,
} from "lucide-react";
import { userService } from "@/services/api/userService";
import { User, UpdateUser } from "@/types/user.types";
import { useTranslation } from "react-i18next";

// ----- helpers -----

const AVATAR_COLORS = [
  "from-rose-600 to-red-800",
  "from-amber-500 to-orange-700",
  "from-emerald-500 to-teal-700",
  "from-sky-500 to-blue-700",
  "from-violet-500 to-purple-700",
  "from-pink-500 to-rose-700",
];
const avatarColor = (id: string) =>
  AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (email?.substring(0, 2) || "??").toUpperCase();
}

const STATUS_CFG: Record<string, { cls: string; dot: string; icon: React.ReactNode }> = {
  active: {
    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  suspended: {
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
    icon: <XCircle className="h-3 w-3" />,
  },
  pending: {
    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
    icon: <Clock className="h-3 w-3" />,
  },
};

const ROLE_CFG: Record<string, string> = {
  admin: "bg-[#e41e20]/10 text-[#e41e20] border-[#e41e20]/20",
  provider: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  user: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${cfg.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {t(`userDetails.status.${status}`, status)}
    </span>
  );
};

const RoleTag = ({ role }: { role: string }) => {
  const { t } = useTranslation();
  const cls = ROLE_CFG[role] ?? ROLE_CFG.user;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${cls}`}>
      {t(`userDetails.roles.${role}`, role)}
    </span>
  );
};

// ----- field row -----
const Field = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
      {icon}
    </div>
    <div className="min-w-0">
      <dt className="text-[10px] font-medium uppercase tracking-widest text-white/35">{label}</dt>
      <dd className="mt-0.5 break-all text-sm text-white/80">{value || "-"}</dd>
    </div>
  </div>
);

// ----- dark input -----
const DarkInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-[#e41e20]/50 focus:outline-none focus:ring-0"
  />
);

// ===== Main component =====

function UserDetails() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<UpdateUser>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        if (!userId) return;
        const data = await userService.getUserById(userId);
        setUser(data);
      } catch {
        setError(t("userDetails.errors.fetchUser"));
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  const handleEditOpen = () => {
    if (!user) return;
    setEditData({
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      role: user.role,
      status: user.status,
    });
    setEditOpen(true);
  };

  const handelSuspendUser = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await userService.updateProfile(user.id, { status: "suspended" });
      setUser(updated);
    } catch {
      setError(t("userDetails.errors.suspendUser"));
    } finally {
      setSaving(false);
    }
  };

  const handelActivateUser = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await userService.updateProfile(user.id, { status: "active" });
      setUser(updated);
    } catch {
      setError(t("userDetails.errors.activateUser"));
    } finally {
      setSaving(false);
    }
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await userService.updateProfile(user.id, editData);
      setUser(updated);
      setEditOpen(false);
    } catch {
      setError(t("userDetails.errors.updateProfile"));
    } finally {
      setSaving(false);
    }
  };

  // --- Loading ---
  if (loading) {
    return (
      <Hsidebar>
        <div className="-m-8 flex min-h-[calc(100vh)] items-center justify-center bg-[#0d0d0d]">
          <Loader2 className="h-8 w-8 animate-spin text-[#e41e20]" />
        </div>
      </Hsidebar>
    );
  }

  // --- Not found ---
  if (!user) {
    return (
      <Hsidebar>
        <div className="-m-8 flex min-h-[calc(100vh)] flex-col items-center justify-center gap-4 bg-[#0d0d0d] text-white">
          <AlertCircle className="h-10 w-10 text-red-400" />
          <p className="text-sm text-white/50">{error || t("userDetails.errors.userNotFound")}</p>
          <Link
            to="/dashboard/userManagement"
            className="flex items-center gap-1 text-sm text-[#e41e20]/80 hover:text-[#e41e20]"
          >
            <ArrowLeft size={16} /> {t("userDetails.backToUsers")}
          </Link>
        </div>
      </Hsidebar>
    );
  }

  const initials = getInitials(user.full_name, user.email);
  const gradCls = avatarColor(user.id);

  return (
    <Hsidebar>
      <div className="-m-8 min-h-[calc(100vh)] bg-[#0d0d0d] text-white">

        {/* ── Header ── */}
        <div className="relative overflow-hidden border-b border-white/5 bg-[#111] px-6 py-6 md:px-10">
          <div className="pointer-events-none absolute -top-20 left-10 h-56 w-56 rounded-full bg-[#e41e20]/10 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <Link
              to="/dashboard/userManagement"
              className="flex items-center gap-2 text-sm text-white/40 transition hover:text-white/70"
            >
              <ArrowLeft size={16} />
              {t("userDetails.backToUserList")}
            </Link>
            <span className="hidden text-sm font-medium text-white/25 sm:block">
              {t("userDetails.userProfile")}
            </span>
          </div>
        </div>

        <div className="px-6 py-8 md:px-10">
          {/* global error banner */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* ── Profile card ── */}
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 sm:p-8">

              {/* Avatar + name */}
              <div className="flex flex-col gap-5 border-b border-white/5 pb-6 sm:flex-row sm:items-center">
                <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-bold text-white shadow-lg ${gradCls}`}>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || user.email}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold text-white">
                    {user.full_name || user.email.split("@")[0]}
                  </h2>
                  <p className="mt-0.5 truncate text-sm text-white/40">{user.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <RoleTag role={user.role || "user"} />
                    <StatusBadge status={user.status} />
                  </div>
                </div>
              </div>

              {/* Fields grid */}
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  icon={<Mail className="h-4 w-4 text-white/40" />}
                  label={t("userDetails.labels.email")}
                  value={user.email}
                />
                <Field
                  icon={<Phone className="h-4 w-4 text-white/40" />}
                  label={t("userDetails.labels.phone")}
                  value={user.phone}
                />
                <Field
                  icon={<Calendar className="h-4 w-4 text-white/40" />}
                  label={t("userDetails.labels.registrationDate")}
                  value={user.created_at ? new Date(user.created_at).toLocaleDateString() : undefined}
                />
                <Field
                  icon={<Clock className="h-4 w-4 text-white/40" />}
                  label={t("userDetails.labels.lastLogin")}
                  value={user.updated_at ? new Date(user.updated_at).toLocaleString() : undefined}
                />
              </div>

              {user.location && (
                <div className="mt-5 border-t border-white/5 pt-5">
                  <Field
                    icon={<MapPin className="h-4 w-4 text-white/40" />}
                    label={t("userDetails.labels.address")}
                    value={user.location}
                  />
                </div>
              )}
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-5">

              {/* Actions */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <h3 className="mb-4 border-b border-white/5 pb-3 text-sm font-semibold text-white/60 uppercase tracking-wider">
                  {t("userDetails.managementActions")}
                </h3>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleEditOpen}
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-40"
                  >
                    <Edit className="h-4 w-4" />
                    {t("userDetails.buttons.editProfile")}
                  </button>
                  <button
                    onClick={handelSuspendUser}
                    disabled={saving || user.status === "suspended"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
                  >
                    <Ban className="h-4 w-4" />
                    {t("userDetails.buttons.suspendUser")}
                  </button>
                  <button
                    onClick={handelActivateUser}
                    disabled={saving || user.status === "active"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:opacity-40"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {t("userDetails.buttons.activateUser")}
                  </button>
                </div>
              </div>

              {/* Activity placeholder */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <h3 className="mb-3 border-b border-white/5 pb-3 text-sm font-semibold text-white/60 uppercase tracking-wider">
                  {t("userDetails.recentActivity")}
                </h3>
                <p className="text-sm text-white/30">{t("userDetails.noActivityData")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{t("userDetails.modal.editUserProfile")}</h2>
              <button
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="text-white/30 transition hover:text-white/70 disabled:opacity-40"
              >
                <X size={22} />
              </button>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <form
              onSubmit={(e) => { e.preventDefault(); handleEditSave(); }}
              className="space-y-4"
            >
              {[
                { name: "full_name", label: t("userDetails.form.fullName"), type: "text" },
                { name: "avatar_url", label: t("userDetails.form.avatarUrl"), type: "text" },
                { name: "phone", label: t("userDetails.form.phone"), type: "text" },
                { name: "location", label: t("userDetails.form.location"), type: "text" },
              ].map(({ name, label, type }) => (
                <div key={name}>
                  <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
                  <DarkInput
                    type={type}
                    name={name}
                    value={(editData as any)[name] || ""}
                    onChange={handleEditChange}
                  />
                </div>
              ))}

              <div>
                <label className="mb-1 block text-xs font-medium text-white/50">{t("userDetails.form.bio")}</label>
                <textarea
                  name="bio"
                  value={editData.bio || ""}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-[#e41e20]/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-white/50">{t("userDetails.form.role")}</label>
                <select
                  name="role"
                  value={editData.role || "user"}
                  onChange={handleEditChange}
                  className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#e41e20]/50 focus:outline-none"
                >
                  <option value="user">{t("userDetails.form.user")}</option>
                  <option value="provider">{t("userDetails.form.provider", "Provider")}</option>
                  <option value="admin">{t("userDetails.form.admin")}</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-white/50">{t("userManagement.filters.allStatus")}</label>
                <select
                  name="status"
                  value={editData.status || "active"}
                  onChange={handleEditChange}
                  className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white focus:border-[#e41e20]/50 focus:outline-none"
                >
                  <option value="active">{t("userManagement.filters.active")}</option>
                  <option value="suspended">{t("userManagement.filters.suspended")}</option>
                  <option value="pending">{t("userManagement.filters.pending")}</option>
                </select>
              </div>

              <div className="flex gap-2 border-t border-white/5 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#e41e20] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#c91a1c] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {saving ? t("userDetails.form.saving") : t("userDetails.form.save")}
                </button>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.08] disabled:opacity-50"
                >
                  {t("userDetails.form.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Hsidebar>
  );
}

export default UserDetails;
