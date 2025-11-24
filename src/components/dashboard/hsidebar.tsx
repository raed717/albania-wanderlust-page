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

const Hsidebar = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItemStyles = {
    button: ({ level, active, disabled }) => ({
      color: disabled ? "#9ca3af" : "#e5e7eb",
      backgroundColor: active ? "#3b82f6" : "transparent",
      borderRadius: "8px",
      margin: "4px 8px",
      padding: level === 0 ? "10px 16px" : "8px 16px",
      fontWeight: level === 0 ? 500 : 400,
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: active ? "#3b82f6" : "#1f2937",
        color: "#ffffff",
      },
    }),
    subMenuContent: {
      backgroundColor: "#0f172a",
    },
    label: {
      fontWeight: 500,
    },
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        transitionDuration={300}
        width="280px"
        collapsedWidth="80px"
        backgroundColor="#111827"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#111827",
            borderRight: "1px solid #1f2937",
          },
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            padding: collapsed ? "24px 16px" : "24px",
            borderBottom: "1px solid #1f2937",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            minHeight: "80px",
          }}
        >
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Hotel size={32} color="#3b82f6" />
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                HotelHub
              </span>
            </div>
          )}
          {collapsed && <Hotel size={28} color="#3b82f6" />}
        </div>

        {/* Menu Section */}
        <div
          style={{
            padding: "16px 0",
            overflowY: "auto",
            height: "calc(100vh - 160px)",
          }}
        >
          <Menu menuItemStyles={menuItemStyles}>
            <MenuItem icon={<LayoutDashboard size={20} />} component={<Link to="/" />}>
              Dashboard
            </MenuItem>

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
              <MenuItem component={<Link to="/users/customers" />}>
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

        {/* Toggle Button */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #1f2937",
            display: "flex",
            justifyContent: collapsed ? "center" : "flex-end",
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "#e5e7eb",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s ease",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#374151";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1f2937";
              e.currentTarget.style.color = "#e5e7eb";
            }}
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

      {/* Main Content Area - Now accepts children */}
      <main
        style={{
          flex: 1,
          padding: "32px",
          backgroundColor: "#f9fafb",
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Hsidebar;
