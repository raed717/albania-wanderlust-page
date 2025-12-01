import { useParams, Link } from "react-router-dom";
import Hsidebar from "@/components/dashboard/hsidebar"; // Assuming this is your dashboard layout
import { ArrowLeft, Edit, Ban, Mail, Calendar, User } from "lucide-react";

// --- Components ---

/**
 * Modern Status Badge Component
 * @param {'active' | 'suspended' | 'pending'} status
 */
const StatusBadge = ({ status }) => {
  let colorClass = "";
  let dotColor = "";

  switch (status) {
    case "active":
      colorClass = "bg-green-50 text-green-700 ring-green-600/20";
      dotColor = "bg-green-500";
      break;
    case "suspended":
      colorClass = "bg-red-50 text-red-700 ring-red-600/20";
      dotColor = "bg-red-500";
      break;
    case "pending":
      colorClass = "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
      dotColor = "bg-yellow-500";
      break;
    default:
      colorClass = "bg-gray-50 text-gray-700 ring-gray-600/20";
      dotColor = "bg-gray-500";
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colorClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${dotColor}`}></span>
      {status}
    </span>
  );
};

/**
 * Role Tag Component
 * @param {string} role
 */
const RoleTag = ({ role }) => (
  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800 shadow-sm capitalize">
    <User className="inline-block w-4 h-4 mr-1" />
    {role.replace("_", " ")}
  </span>
);

// --- Fake Data and Main Component ---

function UserDetails() {
  // Simulating fetching the user ID from the URL (though not used in fake data)
  // const { userId } = useParams();

  // 1. **Fake Data with New Attributes (img, phone, lastLogin, address)**
  const fakeUser = {
    id: 1,
    name: "Alice Johnson",
    email: "alice.j@example.com",
    role: "client", // Example: client, admin, manager
    status: "active", // Example: active, suspended, pending
    registered: "2023-10-01",
    lastLogin: "2024-05-27 09:30 AM",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, CA 90210",
    // 2. **Fake Image Attribute**
    img: "https://i.pravatar.cc/150?img=1", // A random avatar image URL
    recentActivity: [
      { id: 1, action: "Logged in", timestamp: "1 hour ago" },
      { id: 2, action: "Updated profile", timestamp: "3 hours ago" },
      { id: 3, action: "Viewed report X", timestamp: "1 day ago" },
    ],
  };

  const user = fakeUser; // Using the fake data

  if (!user) {
    return (
      <Hsidebar>
        <div className="p-8 bg-gray-50 min-h-screen">
          <p className="text-red-600 text-lg">User not found.</p>
          <Link
            to="/users"
            className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Users
          </Link>
        </div>
      </Hsidebar>
    );
  }

  return (
    <Hsidebar>
      {/* Main Container - Responsive Padding and Background */}
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard/userManagement"
            className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} /> Back to User List
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 hidden sm:block">
            User Profile
          </h1>
        </div>

        {/* --- Profile Overview Card --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b pb-6 mb-6">
              {/* Profile Image */}
              <img
                className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-indigo-500/30"
                src={user.img}
                alt={user.name}
              />

              {/* Basic Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h2>
                <div className="mt-2 flex items-center gap-4">
                  <RoleTag role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>

            {/* Contact and Registration Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-indigo-500" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-base text-gray-900 break-words">
                    {user.email}
                  </dd>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <span className="text-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.134.482l-.841 1.682c-.07.14-.14.28-.21.42a1.875 1.875 0 0 0 .942 2.536l-4.226-4.226a1.875 1.875 0 0 0 2.536.942l1.682-.841c.427-.232.592-.694.482-1.134l-1.106-4.423a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z"
                    />
                  </svg>
                </span>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="text-base text-gray-900">{user.phone}</dd>
                </div>
              </div>

              {/* Registration Date */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Registration Date
                  </dt>
                  <dd className="text-base text-gray-900">{user.registered}</dd>
                </div>
              </div>

              {/* Last Login */}
              <div className="flex items-center space-x-3">
                <span className="text-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Login
                  </dt>
                  <dd className="text-base text-gray-900">{user.lastLogin}</dd>
                </div>
              </div>
            </div>

            {/* Address (Full Width Detail) */}
            <div className="mt-6 pt-6 border-t">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Address
              </dt>
              <dd className="text-base text-gray-900">{user.address}</dd>
            </div>
          </div>

          {/* --- Actions & Activity Sidebar (Dynamic/Responsive) --- */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-3">
                Management Actions
              </h3>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                <button className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 shadow-md">
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend User
                </button>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-3">
                Recent Activity
              </h3>
              <ul className="space-y-3">
                {user.recentActivity.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-gray-500">{activity.timestamp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Hsidebar>
  );
}

export default UserDetails;
