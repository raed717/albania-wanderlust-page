// Rewritten full component/module
import React, { useState } from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  sidebarClasses,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Hotel,
  Car,
  Users,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  MessageSquare,
  Package,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ====================
// CONFIGURATION ARRAYS
// ====================

// Color constants
const COLORS = {
  sidebarBg: "#111827", // Tailwind: bg-gray-900
  sidebarBorder: "#1f2937", // Tailwind: border-gray-800
  primary: "#3b82f6", // Tailwind: blue-500
  textLight: "#e5e7eb", // Tailwind: text-gray-200
  submenuBg: "#0f172a", // Tailwind: bg-slate-900
  disabled: "#9ca3af", // Tailwind: text-gray-400
};

// Icon mapping for consistent usage
const ICONS = {
  dashboard: <LayoutDashboard size={20} />,
  apartments: <Home size={20} />,
  hotels: <Hotel size={20} />,
  cars: <Car size={20} />,
  users: <Users size={20} />,
  calendar: <Calendar size={20} />,
  finance: <DollarSign size={20} />,
  analytics: <BarChart3 size={20} />,
  messages: <MessageSquare size={20} />,
  inventory: <Package size={20} />,
  notifications: <Bell size={20} />,
  documentation: <FileText size={20} />,
  settings: <Settings size={20} />,
};

// Route paths configuration
const ROUTES = {
  home: "/",
  apartments: {
    list: "/dashboard/AppartmentsList",
    owners: "/hotels/rooms", // Note: This seems like it should be /apartments/owners
    bookings: "/hotels/bookings", // Note: This seems like it should be /apartments/bookings
    availability: "/hotels/availability", // Note: This seems like it should be /apartments/availability
  },
  hotels: {
    list: "/dashboard/HotelsList",
    rooms: "/hotels/rooms",
    bookings: "/hotels/bookings",
    availability: "/hotels/availability",
  },
  cars: {
    fleet: "/dashboard/carsList",
    rentals: "/dashboard/carsList",
    maintenance: "/cars/maintenance",
  },
  users: {
    management: "/dashboard/userManagement",
    roles: "/users/roles",
  },
  calendar: "/calendar",
  finance: {
    revenue: "/finance/revenue",
    invoices: "/finance/invoices",
    reports: "/finance/reports",
  },
  analytics: {
    overview: "/analytics/overview",
    performance: "/analytics/performance",
    trends: "/analytics/trends",
  },
  reviews: "/reviews",
  inventory: "/inventory",
  notifications: "/notifications",
  documentation: "/documentation",
  settings: "/settings",
};

// Menu items configuration
const MENU_ITEMS = {
  singleItems: [
    {
      label: "Home",
      icon: ICONS.dashboard,
      route: ROUTES.home,
    },
    // {
    //   label: "Calendar",
    //   icon: ICONS.calendar,
    //   route: ROUTES.calendar,
    // },
    // {
    //   label: "Reviews",
    //   icon: ICONS.messages,
    //   route: ROUTES.reviews,
    // },
    // {
    //   label: "Inventory",
    //   icon: ICONS.inventory,
    //   route: ROUTES.inventory,
    // },
    // {
    //   label: "Notifications",
    //   icon: ICONS.notifications,
    //   route: ROUTES.notifications,
    // },
    // {
    //   label: "Documentation",
    //   icon: ICONS.documentation,
    //   route: ROUTES.documentation,
    // },
    // {
    //   label: "Settings",
    //   icon: ICONS.settings,
    //   route: ROUTES.settings,
    // },
  ],

  subMenuItems: [
    {
      label: "Appartments",
      icon: ICONS.apartments,
      items: [
        { label: "All Appartments", route: ROUTES.apartments.list },
        { label: "Owners Management", route: ROUTES.apartments.owners },
        { label: "Bookings", route: ROUTES.apartments.bookings },
        { label: "Availability", route: ROUTES.apartments.availability },
      ],
    },
    {
      label: "Hotels",
      icon: ICONS.hotels,
      items: [
        { label: "All Hotels", route: ROUTES.hotels.list },
        { label: "Rooms Management", route: ROUTES.hotels.rooms },
        { label: "Bookings", route: ROUTES.hotels.bookings },
        { label: "Availability", route: ROUTES.hotels.availability },
      ],
    },
    {
      label: "Car Rentals",
      icon: ICONS.cars,
      items: [
        { label: "Fleet Management", route: ROUTES.cars.fleet },
        { label: "Active Rentals", route: ROUTES.cars.rentals },
        { label: "Maintenance", route: ROUTES.cars.maintenance },
      ],
    },
    {
      label: "Users",
      icon: ICONS.users,
      items: [
        { label: "Users Management", route: ROUTES.users.management },
        { label: "Roles & Permissions", route: ROUTES.users.roles },
      ],
    },
    {
      label: "Finance",
      icon: ICONS.finance,
      items: [
        { label: "Revenue", route: ROUTES.finance.revenue },
        { label: "Invoices", route: ROUTES.finance.invoices },
        { label: "Financial Reports", route: ROUTES.finance.reports },
      ],
    },
    {
      label: "Analytics",
      icon: ICONS.analytics,
      items: [
        { label: "Overview", route: ROUTES.analytics.overview },
        { label: "Performance", route: ROUTES.analytics.performance },
        { label: "Trends", route: ROUTES.analytics.trends },
      ],
    },
  ],
};

// ====================
// STYLES CONFIGURATION
// ====================

const menuItemStyles = {
  button: ({ level, active, disabled }) => ({
    color: disabled ? COLORS.disabled : COLORS.textLight,
    backgroundColor: active ? COLORS.primary : "transparent",
    borderRadius: "8px",
    margin: "4px 8px",
    padding: level === 0 ? "10px 16px" : "8px 16px",
    fontWeight: level === 0 ? 500 : 400,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: active ? COLORS.primary : COLORS.sidebarBorder,
      color: "#ffffff",
    },
  }),
  subMenuContent: {
    backgroundColor: COLORS.submenuBg,
  },
};

// ====================
// MAIN COMPONENT
// ====================

const Hsidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  // Render single menu items
  const renderSingleItems = () => {
    return MENU_ITEMS.singleItems.map((item, index) => (
      <MenuItem
        key={`single-${index}`}
        icon={item.icon}
        component={<Link to={item.route} />}
      >
        {item.label}
      </MenuItem>
    ));
  };

  // Render submenu items
  const renderSubMenuItems = () => {
    return MENU_ITEMS.subMenuItems.map((submenu, index) => (
      <SubMenu
        key={`submenu-${index}`}
        icon={submenu.icon}
        label={submenu.label}
      >
        {submenu.items.map((item, itemIndex) => (
          <MenuItem
            key={`${submenu.label}-${itemIndex}`}
            component={<Link to={item.route} />}
          >
            {item.label}
          </MenuItem>
        ))}
      </SubMenu>
    ));
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        collapsed={collapsed}
        transitionDuration={300}
        width="280px"
        collapsedWidth="80px"
        backgroundColor={COLORS.sidebarBg}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: COLORS.sidebarBg,
            borderRight: `1px solid ${COLORS.sidebarBorder}`,
          },
        }}
      >
        {/* Logo Section */}
        <div
          className={`
            min-h-20
            flex items-center
            border-b
            ${collapsed ? "justify-center p-6" : "justify-between p-6"}
            border-gray-800
          `}
        >
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <Hotel size={32} className="text-blue-500" />
              <span className="text-xl font-semibold text-white">HotelHub</span>
            </div>
          ) : (
            <Hotel size={28} className="text-blue-500" />
          )}
        </div>

        {/* Menu Section */}
        <div className="py-4 overflow-y-auto h-[calc(100vh-160px)]">
          <Menu menuItemStyles={menuItemStyles}>
            {renderSingleItems()}
            {renderSubMenuItems()}
          </Menu>
        </div>

        {/* Toggle Button */}
        <div
          className={`
            p-4 border-t border-gray-800 flex
            ${collapsed ? "justify-center" : "justify-end"}
          `}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              bg-gray-800 border border-gray-700
              rounded-lg p-2.5 text-gray-200 cursor-pointer
              flex items-center gap-2 transition-all duration-200
              font-medium
              hover:bg-gray-700 hover:text-white
            "
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </Sidebar>

      {/* Main Content Area */}
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Hsidebar;
