import { useMemo, useState } from "react";
import Hsidebar from "@/components/dashboard/hsidebar";
import DataTable from "react-data-table-component";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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

const UsersData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.j@example.com",
    role: "client",
    status: "active",
    registered: "2023-10-01",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.s@example.com",
    role: "staff",
    status: "active",
    registered: "2023-09-15",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    role: "car_owner",
    status: "suspended",
    registered: "2023-11-20",
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana.p@example.com",
    role: "apartment_owner",
    status: "active",
    registered: "2024-01-05",
  },
  {
    id: 5,
    name: "Eve Adams",
    email: "eve.a@example.com",
    role: "client",
    status: "pending",
    registered: "2024-03-10",
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank.m@example.com",
    role: "staff",
    status: "active",
    registered: "2023-08-01",
  },
  {
    id: 7,
    name: "Grace Hall",
    email: "grace.h@example.com",
    role: "car_owner",
    status: "active",
    registered: "2024-05-25",
  },
  {
    id: 8,
    name: "Heidi Klum",
    email: "heidi.k@example.com",
    role: "client",
    status: "active",
    registered: "2023-12-12",
  },
];

function goToUserDetails(userId) {
  // navigate to /userDetails/id
  window.location.href = `/dashboard/UserDetails?id=${userId}`;
}

function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
          <button
            onClick={() => goToUserDetails(row.id)}
            className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
          >
            View Details
          </button>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return UsersData.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter ? u.role === roleFilter : true;
      const matchesStatus = statusFilter ? u.status === statusFilter : true;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: UsersData.length,
      active: UsersData.filter((u) => u.status === "active").length,
      suspended: UsersData.filter((u) => u.status === "suspended").length,
      pending: UsersData.filter((u) => u.status === "pending").length,
    };
  }, []);

  return (
    <Hsidebar>
      <h3 className="text-2xl font-semibold mb-6">User Management</h3>
      <div className="p-6 space-y-6 w-full">
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
          <StatCard
            label="Pending"
            value={stats.pending}
            color="text-yellow-600"
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
            <option value="client">Client</option>
            <option value="staff">Staff</option>
            <option value="car_owner">Car Owner</option>
            <option value="apartment_owner">Apartment Owner</option>
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
