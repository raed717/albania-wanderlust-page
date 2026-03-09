import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User } from "@/types/user.types";
import { userService } from "@/services/api/userService";
import Hsidebar from "@/components/dashboard/hsidebar";
import {
  Search,
  Users,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Calendar,
  AlertCircle,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const getInitials = (name?: string, email?: string): string => {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : "??";
};

// Deterministic color from provider id
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

const AdminProvidersList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        setError(null);
        const users = await userService.getProviderUsers();
        setProviders(users);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
        setError(t("adminProvidersList.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [t]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return providers;
    return providers.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q),
    );
  }, [providers, searchQuery]);

  return (
    <Hsidebar>
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        {/* ── Header ── */}
        <div className="relative overflow-hidden border-b border-white/5 bg-[#111] px-6 py-8 md:px-10">
          {/* decorative red glow */}
          <div className="pointer-events-none absolute -top-20 left-10 h-60 w-60 rounded-full bg-[#e41e20]/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e41e20]/15 ring-1 ring-[#e41e20]/40">
                <BookOpen className="h-4 w-4 text-[#e41e20]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {t("adminProvidersList.title")}
              </h1>
            </div>
            <p className="mt-1 ml-12 text-sm text-white/40">
              {t("adminProvidersList.subtitle")}
            </p>
          </div>
        </div>

        <div className="px-6 py-6 md:px-10">
          {/* ── Stats strip ── */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-5 py-3">
            <Users className="h-4 w-4 text-[#e41e20]" />
            <span className="text-sm text-white/60">
              <span className="font-semibold text-white">
                {providers.length}
              </span>{" "}
              {t("adminProvidersList.totalProviders")}
            </span>
          </div>

          {/* ── Search ── */}
          <div className="relative mb-8">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("adminProvidersList.searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 text-sm text-white placeholder:text-white/25 focus:border-[#e41e20]/50 focus:ring-0"
            />
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-white/40">
              <Loader2 className="h-8 w-8 animate-spin text-[#e41e20]" />
              <p className="mt-3 text-sm">{t("adminProvidersList.loading")}</p>
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <Users className="h-7 w-7 text-white/20" />
              </div>
              <p className="text-sm font-medium text-white/50">
                {searchQuery
                  ? t("adminProvidersList.noProvidersSearch")
                  : t("adminProvidersList.noProviders")}
              </p>
            </div>
          )}

          {/* ── Provider Grid ── */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() =>
                    navigate(`/dashboard/bookings/provider/${provider.id}`, {
                      state: { provider },
                    })
                  }
                  className="group relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 text-left transition-all duration-200 hover:border-[#e41e20]/30 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(228,30,32,0.08)] focus:outline-none"
                >
                  {/* status dot */}
                  <span
                    className={`absolute right-4 top-4 h-2 w-2 rounded-full ${provider.status === "active" ? "bg-emerald-400" : "bg-white/20"}`}
                  />

                  {/* Avatar */}
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-md ${avatarColor(provider.id)}`}
                  >
                    {provider.avatar_url ? (
                      <img
                        src={provider.avatar_url}
                        alt={provider.full_name || provider.email}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      getInitials(provider.full_name, provider.email)
                    )}
                  </div>

                  {/* Name & email */}
                  <p className="truncate text-sm font-semibold text-white">
                    {provider.full_name || t("adminProvidersList.unnamed")}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/40">
                    {provider.email}
                  </p>

                  {/* Meta info */}
                  <div className="mt-3 space-y-1.5">
                    {provider.location && (
                      <div className="flex items-center gap-1.5 text-xs text-white/35">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{provider.location}</span>
                      </div>
                    )}
                    {provider.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-white/35">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span className="truncate">{provider.phone}</span>
                      </div>
                    )}
                    {provider.created_at && (
                      <div className="flex items-center gap-1.5 text-xs text-white/35">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>
                          {t("adminProvidersList.memberSince")}{" "}
                          {new Date(provider.created_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short" },
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA row */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-xs font-medium text-[#e41e20]/80">
                      {t("adminProvidersList.viewBookings")}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#e41e20]/60 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Hsidebar>
  );
};

export default AdminProvidersList;
