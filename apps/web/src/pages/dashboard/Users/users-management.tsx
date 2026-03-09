import { useMemo, useState, useEffect } from "react";
import Hsidebar from "@/components/dashboard/hsidebar";
import { Link } from "react-router-dom";
import { userService } from "@/services/api/userService";
import type { User } from "@/types/user.types";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Users,
  Loader2,
  AlertCircle,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

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

const getInitials = (name?: string, email?: string): string => {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : "??";
};

const STATUS_CFG: Record<
  string,
  { cls: string; icon: React.ReactNode; dot: string }
> = {
  active: {
    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: <CheckCircle className="h-3 w-3" />,
    dot: "bg-emerald-400",
  },
  suspended: {
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: <XCircle className="h-3 w-3" />,
    dot: "bg-red-400",
  },
  pending: {
    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: <Clock className="h-3 w-3" />,
    dot: "bg-amber-400",
  },
};

const ROLE_CFG: Record<string, string> = {
  admin: "bg-[#e41e20]/10 text-[#e41e20] border-[#e41e20]/20",
  provider: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  user: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

function transformUserData(user: User) {
  return {
    id: user.id,
    name: user.full_name || user.email.split("@")[0],
    email: user.email,
    role: user.role,
    status: user.status,
    phone: user.phone,
    location: user.location,
    avatar_url: user.avatar_url,
    registered: user.created_at
      ? new Date(user.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
        })
      : "-",
  };
}

function UserManagement() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<ReturnType<typeof transformUserData>[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers.map(transformUserData));
      } catch (err: any) {
        setError(t("userManagement.error"));
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q);
      const matchesRole = roleFilter ? u.role === roleFilter : true;
      const matchesStatus = statusFilter ? u.status === statusFilter : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter, users]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      suspended: users.filter((u) => u.status === "suspended").length,
      providers: users.filter((u) => u.role === "provider").length,
      admins: users.filter((u) => u.role === "admin").length,
    }),
    [users],
  );

  return (
    <Hsidebar>
      <div className="-m-8 min-h-[calc(100vh)] bg-[#0d0d0d] text-white">
        {/* â”€â”€ Header â”€â”€ */}
        <div className="relative overflow-hidden border-b border-white/5 bg-[#111] px-6 py-8 md:px-10">
          <div className="pointer-events-none absolute -top-20 left-10 h-60 w-60 rounded-full bg-[#e41e20]/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e41e20]/15 ring-1 ring-[#e41e20]/40">
                <Users className="h-4 w-4 text-[#e41e20]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {t("userManagement.title")}
              </h1>
            </div>
            <p className="mt-1 ml-12 text-sm text-white/40">
              {t(
                "userManagement.subtitle",
                "Manage all platform users and their roles",
              )}
            </p>
          </div>
        </div>

        <div className="px-6 py-6 md:px-10">
          {/* â”€â”€ Error â”€â”€ */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* â”€â”€ Stats â”€â”€ */}
          {!loading && (
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                {
                  label: t("userManagement.stats.totalUsers"),
                  value: stats.total,
                  color: "text-white",
                },
                {
                  label: t("userManagement.stats.active"),
                  value: stats.active,
                  color: "text-emerald-400",
                },
                {
                  label: t("userManagement.stats.suspended"),
                  value: stats.suspended,
                  color: "text-red-400",
                },
                {
                  label: t("userManagement.roles.provider", "Providers"),
                  value: stats.providers,
                  color: "text-violet-400",
                },
                {
                  label: t("userManagement.roles.admin", "Admins"),
                  value: stats.admins,
                  color: "text-[#e41e20]",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <p className="text-[10px] uppercase tracking-widest text-white/30">
                    {s.label}
                  </p>
                  <p className={`mt-1 text-2xl font-bold ${s.color}`}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* â”€â”€ Filters â”€â”€ */}
          {!loading && (
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("userManagement.filters.searchPlaceholder")}
                  className="h-10 rounded-xl border border-white/10 bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/25 focus:border-[#e41e20]/50 focus:ring-0"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 pointer-events-none" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 appearance-none rounded-xl border border-white/10 bg-white/[0.04] pl-8 pr-8 text-sm text-white focus:border-[#e41e20]/50 focus:outline-none"
                >
                  <option value="" className="bg-[#1a1a1a]">
                    {t("userManagement.filters.allRoles")}
                  </option>
                  <option value="user" className="bg-[#1a1a1a]">
                    {t("userManagement.filters.user")}
                  </option>
                  <option value="provider" className="bg-[#1a1a1a]">
                    {t("userManagement.roles.provider")}
                  </option>
                  <option value="admin" className="bg-[#1a1a1a]">
                    {t("userManagement.filters.admin")}
                  </option>
                </select>
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white focus:border-[#e41e20]/50 focus:outline-none"
                >
                  <option value="" className="bg-[#1a1a1a]">
                    {t("userManagement.filters.allStatus")}
                  </option>
                  <option value="active" className="bg-[#1a1a1a]">
                    {t("userManagement.filters.active")}
                  </option>
                  <option value="suspended" className="bg-[#1a1a1a]">
                    {t("userManagement.filters.suspended")}
                  </option>
                  <option value="pending" className="bg-[#1a1a1a]">
                    {t("userManagement.filters.pending")}
                  </option>
                </select>
              </div>
            </div>
          )}

          {/* â”€â”€ Loading â”€â”€ */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-white/40">
              <Loader2 className="h-8 w-8 animate-spin text-[#e41e20]" />
              <p className="mt-3 text-sm">{t("userManagement.loading")}</p>
            </div>
          )}

          {/* â”€â”€ Empty â”€â”€ */}
          {!loading && !error && filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Users className="h-7 w-7 text-white/20" />
              </div>
              <p className="text-sm font-medium text-white/50">
                {search || roleFilter || statusFilter
                  ? t("userManagement.noUsers", "No users match your filters")
                  : t("userManagement.noUsers", "No users found")}
              </p>
            </div>
          )}

          {/* â”€â”€ User Grid â”€â”€ */}
          {!loading && !error && filteredData.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredData.map((user) => {
                const statusCfg = STATUS_CFG[user.status] ?? STATUS_CFG.pending;
                const roleCls = ROLE_CFG[user.role] ?? ROLE_CFG.user;
                return (
                  <Link
                    key={user.id}
                    to={`/dashboard/user-details/${user.id}`}
                    className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 text-left transition-all duration-200 hover:border-[#e41e20]/30 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(228,30,32,0.08)] focus:outline-none"
                  >
                    {/* status dot */}
                    <span
                      className={`absolute right-4 top-4 h-2 w-2 rounded-full ${statusCfg.dot}`}
                    />

                    {/* Avatar */}
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-md ${avatarColor(user.id)}`}
                    >
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      ) : (
                        getInitials(user.name, user.email)
                      )}
                    </div>

                    {/* Name & email */}
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-white/40">
                      {user.email}
                    </p>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${roleCls}`}
                      >
                        {t(`userManagement.roles.${user.role}`, user.role)}
                      </span>
                      <span
                        className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusCfg.cls}`}
                      >
                        {statusCfg.icon}
                        {t(`userManagement.status.${user.status}`, user.status)}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="mt-3 space-y-1">
                      {user.location && (
                        <div className="flex items-center gap-1.5 text-xs text-white/35">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{user.location}</span>
                        </div>
                      )}
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-white/35">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="truncate">{user.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-white/35">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>
                          {t("adminProvidersList.memberSince", "Since")}{" "}
                          {user.registered}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-xs font-medium text-[#e41e20]/80">
                        {t("userManagement.viewDetails")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-[#e41e20]/60 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Hsidebar>
  );
}

export default UserManagement;
