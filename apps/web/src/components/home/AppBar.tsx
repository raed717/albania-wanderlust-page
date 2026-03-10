import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "@/services/api/authService";
import { userService } from "@/services/api/userService";
import { User } from "@/types/user.types";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import {
  Heart,
  CalendarDays,
  LayoutDashboard,
  User2,
  LogOut,
  LogIn,
  Menu,
  X,
  MapPin,
  Car,
  BookOpen,
  Home,
  ChevronDown,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PrimarySearchAppBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = React.useState<User>(null);
  const [userRole, setUserRole] = React.useState<any>(null);
  const [userStatus, setUserStatus] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [avatarError, setAvatarError] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Scroll-aware transparency
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Fetch current user
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        if (!currentUser) {
          setUser(null);
          setUserRole(null);
          setUserStatus(null);
          return;
        }
        setUser(currentUser);
        setUserRole(currentUser.role);
        setUserStatus(currentUser.status);
      } catch {
        setUser(null);
        setUserRole(null);
        setUserStatus(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Suspended user redirect
  React.useEffect(() => {
    if (userStatus === "suspended") {
      handleLogout();
      window.open("/suspended", "_blank");
    }
  }, [userStatus]);

  React.useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar_url]);

  const handleLogout = async () => {
    await authService.signOut();
    window.location.href = "/";
  };

  const isProfileComplete = React.useMemo(() => {
    if (!user) return false;
    return !!(user.full_name && user.phone && user.location);
  }, [user]);

  const getUserInitials = React.useMemo(() => {
    if (!user) return "";
    return (user.full_name || user.email || "")
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  const isAdmin = userRole?.role === "admin" || userRole === "admin";
  const isProvider = userRole?.role === "provider" || userRole === "provider";
  const isUser = userRole?.role === "user" || userRole === "user";

  const navLinks = [
    {
      label: t("sidebar.home") || "Home",
      href: "/",
      icon: <Home className="w-4 h-4" />,
    },
    {
      label: t("common.stay") || "Stays",
      href: "/searchResults",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      label: t("common.car") || "Cars",
      href: "/searchCarResults",
      icon: <Car className="w-4 h-4" />,
    },
    {
      label: t("common.culture") || "Culture",
      href: "/CultureDetails",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      label: t("common.map") || "Map",
      href: "/properties-map",
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  const renderAvatar= (size = "md") => {
    const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-xs";
    if (user?.avatar_url && !avatarError) {
      return (
        <img
          src={user.avatar_url}
          alt={user.full_name || user.email}
          className={`${dim} rounded-full object-cover`}
          onError={() => setAvatarError(true)}
        />
      );
    }
    return (
      <div
        className={`${dim} rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white font-bold flex-shrink-0`}
      >
        {getUserInitials}
      </div>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-gradient-to-r from-red-700 via-red-900 to-black shadow-md"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <button
              onClick={() => navigate("/")}
              className={`font-black text-xl tracking-tight transition-colors ${
                !scrolled ? "text-white" : "text-gray-900"
              }`}
            >
              BOOKinAL<span className="text-red-600">.</span>
            </button>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      !scrolled
                        ? isActive
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/15"
                        : isActive
                        ? "bg-red-50 text-red-700 font-semibold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Side Actions ── */}
            <div className="flex items-center gap-1">

              {/* Language Switcher */}
              <div
                className={
                  !scrolled
                    ? "[&_button]:text-white [&_button:hover]:bg-white/15"
                    : ""
                }
              >
                <LanguageSwitcher />
              </div>

              {/* Wishlist — desktop only */}
              {user && (
                <button
                  onClick={() => navigate("/wishlist")}
                  title={t("appBar.myWishlist")}
                  className={`hidden md:flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                    !scrolled
                      ? "text-white/80 hover:text-white hover:bg-white/15"
                      : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Heart className="w-[18px] h-[18px]" />
                </button>
              )}

              {/* ── Profile Dropdown (desktop) ── */}
              <div className="hidden md:block">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse" />
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full transition-all outline-none ${
                          !scrolled
                            ? "hover:bg-white/15 text-white"
                            : "hover:bg-gray-50 border border-gray-200 text-gray-700"
                        }`}
                      >
                        {/* Profile incomplete dot */}
                        <div className="relative">
                          {renderAvatar("sm")}
                          {!isProfileComplete && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-60 mt-2 rounded-2xl shadow-xl border-gray-100 p-1">
                      {/* User info header */}
                      <div className="px-3 py-3 mb-1">
                        <div className="flex items-center gap-3">
                          {renderAvatar()}
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">
                              {user.full_name || "User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="mx-2" />

                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() => navigate("/dashboard/bookings")}
                          className="rounded-xl mx-1 gap-2.5"
                        >
                          <LayoutDashboard className="w-4 h-4 text-gray-400" />
                          {t("appBar.dashboard")}
                        </DropdownMenuItem>
                      )}
                      {isProvider && isProfileComplete && (
                        <DropdownMenuItem
                          onClick={() => navigate("/dashboard/bookings")}
                          className="rounded-xl mx-1 gap-2.5"
                        >
                          <Home className="w-4 h-4 text-gray-400" />
                          {t("appBar.propertiesManagement")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => navigate("/myBookings")}
                        className="rounded-xl mx-1 gap-2.5"
                      >
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        {t("appBar.myBookings")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/myAccount")}
                        className="rounded-xl mx-1 gap-2.5"
                      >
                        <User2 className="w-4 h-4 text-gray-400" />
                        <span className="flex-1">
                          {isProfileComplete
                            ? t("appBar.myAccount")
                            : t("appBar.completeProfile")}
                        </span>
                        {!isProfileComplete && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                        )}
                      </DropdownMenuItem>
                      {isUser && (
                        <DropdownMenuItem
                          onClick={() => navigate("/ProviderRequest")}
                          className="rounded-xl mx-1 gap-2.5"
                        >
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {t("appBar.becomeProvider")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="mx-2" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="rounded-xl mx-1 gap-2.5 text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("appBar.logout")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button
                    onClick={() => navigate("/auth")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      !scrolled
                        ? "bg-white/15 text-white border border-white/25 hover:bg-white/25"
                        : "bg-red-600 text-white hover:bg-red-700 shadow-sm"
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    {t("appBar.login")}
                  </button>
                )}
              </div>

              {/* ── Mobile Hamburger ── */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className={`md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                  !scrolled
                    ? "text-white hover:bg-white/15"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu Panel ── */}
        <div
          className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="container mx-auto px-4 pt-3 pb-6 space-y-1">
            {/* Nav links */}
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`${isActive ? "text-red-500" : "text-gray-400"}`}
                  >
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="border-t border-gray-100 !mt-3 !pt-3 space-y-1">
              {user ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-3 mb-1">
                    {renderAvatar()}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.full_name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => { navigate("/wishlist"); setMobileOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-gray-400" />
                    {t("appBar.myWishlist")}
                  </button>
                  <button
                    onClick={() => { navigate("/myBookings"); setMobileOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    {t("appBar.myBookings")}
                  </button>
                  <button
                    onClick={() => { navigate("/myAccount"); setMobileOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User2 className="w-4 h-4 text-gray-400" />
                    <span className="flex-1">
                      {isProfileComplete
                        ? t("appBar.myAccount")
                        : t("appBar.completeProfile")}
                    </span>
                    {!isProfileComplete && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                  {(isAdmin || isProvider) && (
                    <button
                      onClick={() => { navigate("/dashboard/bookings"); setMobileOpen(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      {t("appBar.dashboard")}
                    </button>
                  )}
                  {isUser && (
                    <button
                      onClick={() => { navigate("/ProviderRequest"); setMobileOpen(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {t("appBar.becomeProvider")}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("appBar.logout")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigate("/auth"); setMobileOpen(false); }}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  {t("appBar.login")}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Flow spacer — ensures content below the fixed nav is not hidden */}
      <div className="h-16" />
    </>
  );
}

