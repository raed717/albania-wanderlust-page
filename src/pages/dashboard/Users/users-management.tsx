import { useMemo, useState, useEffect } from "react";
import Hsidebar from "@/components/dashboard/hsidebar";
import DataTable from "react-data-table-component";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { userService } from "@/services/api/userService";
import { User } from "@/types/user.types";

const StatusBadge = ({ status }) => {
  const config = {
    active: {
      color: "bg-green-100 text-green-800",
      icon: <CheckCircle size={14} />,
    },
    suspended: {
      color: "bg-red-100 text-red-800",
      icon: <XCircle size={14} />,
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock size={14} />,
    },
    default: { color: "bg-gray-100 text-gray-700", icon: null },
  };
  const { color, icon } = config[status] || config.default;

  return (
    <span
      className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full capitalize ${color}`}
    >
      {icon} {status}
    </span>
  );
};

const RoleTag = ({ role }) => (
  <span className="px-2 py-1 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 capitalize">
    {role.replace("_", " ")}
  </span>
);

// Transform Supabase user data to display format
function transformUserData(user: User) {
  return {
    id: user.id,
    name: user.full_name || user.email.split("@")[0],
    email: user.email,
    role: user.role,
    status: user.status, // You can add status field to user metadata if needed
    registered: user.created_at
      ? new Date(user.created_at).toLocaleDateString()
      : "-",
  };
}

function UserManagement() {
  const [users, setUsers] = useState<ReturnType<typeof transformUserData>[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch users from Supabase
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const allUsers = await userService.getAllUsers();
        console.log("Fetched users:", allUsers);
        const transformedUsers = allUsers.map(transformUserData);
        setUsers(transformedUsers);
      } catch (err: any) {
        setError("Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "Email",
        selector: (row) => row.email,
        sortable: true,
      },
      {
        name: "Role",
        selector: (row) => row.role,
        cell: (row) => <RoleTag role={row.role} />,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        cell: (row) => <StatusBadge status={row.status} />,
      },
      {
        name: "Registered",
        selector: (row) => row.registered,
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => (
          <Link
            to={`/dashboard/user-details/${row.id}`}
            className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
          >
            View Details
          </Link>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter ? u.role === roleFilter : true;
      const matchesStatus = statusFilter ? u.status === statusFilter : true;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter, users]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      suspended: users.filter((u) => u.status === "suspended").length,
    };
  }, [users]);

  return (
    <Hsidebar>
      <h3 className="text-2xl font-semibold mb-6">User Management</h3>
      <div className="p-6 space-y-6 w-full">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading users...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={stats.total} />
              <StatCard
                label="Active"
                value={stats.active}
                color="text-green-600"
              />
              <StatCard
                label="Suspended"
                value={stats.suspended}
                color="text-red-600"
              />
            </div>

            {/* Filters */}
            <div className="p-4 bg-white rounded-lg shadow flex flex-wrap gap-4 items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="pl-8 pr-3 py-2 border rounded w-full sm:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg
                  className="absolute left-2 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>

              <select
                className="px-3 py-2 border rounded"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <select
                className="px-3 py-2 border rounded"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white p-4 rounded-lg shadow">
              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                striped
                dense
              />
            </div>
          </>
        )}
      </div>
    </Hsidebar>
  );
}

function StatCard({ label, value, color = "text-blue-600" }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow flex flex-col items-start">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}

export default UserManagement;
