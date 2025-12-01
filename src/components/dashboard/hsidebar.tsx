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

// Define the colors/sizes based on the original inline styles for react-pro-sidebar props
const SIDEBAR_BG_COLOR = "#111827"; // Tailwind: bg-gray-900
const SIDEBAR_BORDER_COLOR = "#1f2937"; // Tailwind: border-gray-800
const PRIMARY_COLOR = "#3b82f6"; // Tailwind: blue-500
const TEXT_COLOR_LIGHT = "#e5e7eb"; // Tailwind: text-gray-200
const SUBMENU_BG_COLOR = "#0f172a"; // Tailwind: bg-slate-900

// We must still use a style object for react-pro-sidebar's customization, but now it's cleaner.
const menuItemStyles = {
  button: ({ level, active, disabled }) => ({
    color: disabled ? "#9ca3af" : TEXT_COLOR_LIGHT, // text-gray-400 : text-gray-200
    backgroundColor: active ? PRIMARY_COLOR : "transparent", // bg-blue-500
    borderRadius: "8px", // rounded-lg
    margin: "4px 8px", // my-1 mx-2
    padding: level === 0 ? "10px 16px" : "8px 16px", // py-2.5 px-4 : py-2 px-4
    fontWeight: level === 0 ? 500 : 400, // font-medium : font-normal
    transition: "all 0.2s ease", // transition-all duration-200 ease-in-out
    "&:hover": {
      backgroundColor: active ? PRIMARY_COLOR : SIDEBAR_BORDER_COLOR, // hover:bg-gray-800
      color: "#ffffff", // hover:text-white
    },
  }),
  subMenuContent: {
    backgroundColor: SUBMENU_BG_COLOR,
  },
};

const Hsidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar
        collapsed={collapsed}
        transitionDuration={300}
        width="280px"
        collapsedWidth="80px"
        backgroundColor={SIDEBAR_BG_COLOR}
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: SIDEBAR_BG_COLOR,
            borderRight: `1px solid ${SIDEBAR_BORDER_COLOR}`,
          },
        }}
      >
        {/* Logo Section - All inline styles replaced with Tailwind classes */}
        <div
          className={`
            min-h-20
            flex items-center
            border-b
            ${collapsed ? "justify-center p-6" : "justify-between p-6"}
            border-gray-800
          `}
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Hotel size={32} className="text-blue-500" />
              <span className="text-xl font-semibold text-white">HotelHub</span>
            </div>
          )}
          {collapsed && <Hotel size={28} className="text-blue-500" />}
        </div>

        {/* Menu Section - Container classes added */}
        <div className="py-4 overflow-y-auto h-[calc(100vh-160px)]">
          <Menu menuItemStyles={menuItemStyles}>
            <MenuItem
              icon={<LayoutDashboard size={20} />}
              component={<Link to="/" />}
            >
              Dashboard
            </MenuItem>

            {/* SubMenu structure */}
            <SubMenu icon={<Home size={20} />} label="Appartments">
              <MenuItem component={<Link to="/dashboard/HotelsList" />}>
                All Appartments
              </MenuItem>
              <MenuItem component={<Link to="/hotels/rooms" />}>
                Owners Management
              </MenuItem>
              <MenuItem component={<Link to="/hotels/bookings" />}>
                Bookings
              </MenuItem>
              <MenuItem component={<Link to="/hotels/availability" />}>
                Availability
              </MenuItem>
            </SubMenu>

            <SubMenu icon={<Hotel size={20} />} label="Hotels">
              <MenuItem component={<Link to="/dashboard/HotelsList" />}>
                All Hotels
              </MenuItem>
              <MenuItem component={<Link to="/hotels/rooms" />}>
                Rooms Management
              </MenuItem>
              <MenuItem component={<Link to="/hotels/bookings" />}>
                Bookings
              </MenuItem>
              <MenuItem component={<Link to="/hotels/availability" />}>
                Availability
              </MenuItem>
            </SubMenu>

            <SubMenu icon={<Car size={20} />} label="Car Rentals">
              <MenuItem component={<Link to="/dashboard/carsList" />}>
                Fleet Management
              </MenuItem>
              <MenuItem component={<Link to="/dashboard/carsList" />}>
                Active Rentals
              </MenuItem>
              <MenuItem component={<Link to="/cars/maintenance" />}>
                Maintenance
              </MenuItem>
            </SubMenu>

            <SubMenu icon={<Users size={20} />} label="Users">
              <MenuItem component={<Link to="/dashboard/userManagement" />}>
                Customers
              </MenuItem>
              <MenuItem component={<Link to="/users/staff" />}>Staff</MenuItem>
              <MenuItem component={<Link to="/users/roles" />}>
                Roles & Permissions
              </MenuItem>
            </SubMenu>

            <MenuItem
              icon={<Calendar size={20} />}
              component={<Link to="/calendar" />}
            >
              Calendar
            </MenuItem>

            <SubMenu icon={<DollarSign size={20} />} label="Finance">
              <MenuItem component={<Link to="/finance/revenue" />}>
                Revenue
              </MenuItem>
              <MenuItem component={<Link to="/finance/invoices" />}>
                Invoices
              </MenuItem>
              <MenuItem component={<Link to="/finance/reports" />}>
                Financial Reports
              </MenuItem>
            </SubMenu>

            <SubMenu icon={<BarChart3 size={20} />} label="Analytics">
              <MenuItem component={<Link to="/analytics/overview" />}>
                Overview
              </MenuItem>
              <MenuItem component={<Link to="/analytics/performance" />}>
                Performance
              </MenuItem>
              <MenuItem component={<Link to="/analytics/trends" />}>
                Trends
              </MenuItem>
            </SubMenu>

            <MenuItem
              icon={<MessageSquare size={20} />}
              component={<Link to="/reviews" />}
            >
              Reviews
            </MenuItem>

            <MenuItem
              icon={<Package size={20} />}
              component={<Link to="/inventory" />}
            >
              Inventory
            </MenuItem>

            <MenuItem
              icon={<Bell size={20} />}
              component={<Link to="/notifications" />}
            >
              Notifications
            </MenuItem>

            <MenuItem
              icon={<FileText size={20} />}
              component={<Link to="/documentation" />}
            >
              Documentation
            </MenuItem>

            <MenuItem
              icon={<Settings size={20} />}
              component={<Link to="/settings" />}
            >
              Settings
            </MenuItem>
          </Menu>
        </div>

        {/* Toggle Button - All inline styles replaced with Tailwind classes */}
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
            // Removed onMouseEnter/onMouseLeave, relying on Tailwind's hover: class
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

      {/* Main Content Area - All inline styles replaced with Tailwind classes */}
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Hsidebar;
