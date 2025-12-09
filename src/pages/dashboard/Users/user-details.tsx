import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Hsidebar from "@/components/dashboard/hsidebar";
import { ArrowLeft, Edit, Ban, Mail, Calendar, User, X } from "lucide-react";
import { userService } from "@/services/api/userService";
import { UserProfile, UpdateUserProfileData } from "@/types/user.types";

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
    {(role || "user").replace("_", " ")}
  </span>
);

// --- Fake Data and Main Component ---

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<UpdateUserProfileData>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        if (!userId) return;
        const data = await userService.getUserById(userId);
        setUser(data);
      } catch (err: any) {
        setError("User not found or error fetching user.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  const handleEditOpen = () => {
    if (!user) return;
    setEditData({
      full_name: user.raw_user_meta_data?.full_name,
      avatar_url: user.raw_user_meta_data?.avatar_url,
      phone: user.phone,
      bio: user.raw_user_meta_data?.bio,
      location: user.raw_user_meta_data?.location,
      role: user.role,
    });
    setEditOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
    } catch (err: any) {
      setError("Failed to update user profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Hsidebar>
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading user...</p>
        </div>
      </Hsidebar>
    );
  }
  if (!user) {
    return (
      <Hsidebar>
        <div className="p-8 bg-gray-50 min-h-screen">
          <p className="text-red-600 text-lg">{error || "User not found."}</p>
          <Link
            to="/dashboard/userManagement"
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
                src={
                  user.raw_user_meta_data?.avatar_url ||
                  "https://i.pravatar.cc/150?u=" + user.id
                }
                alt={user.raw_user_meta_data?.full_name || user.email}
              />
              {/* Basic Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {user.raw_user_meta_data?.full_name || user.email}
                </h2>
                <div className="mt-2 flex items-center gap-4">
                  <RoleTag
                    role={user.role || user.raw_user_meta_data?.role || "user"}
                  />
                  {/* StatusBadge can be customized if you add status to metadata */}
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
                  <dd className="text-base text-gray-900">
                    {user.phone || user.phone || "-"}
                  </dd>
                </div>
              </div>

              {/* Registration Date */}
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Registration Date
                  </dt>
                  <dd className="text-base text-gray-900">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "-"}
                  </dd>
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
                  <dd className="text-base text-gray-900">
                    {user.updated_at
                      ? new Date(user.updated_at).toLocaleString()
                      : "-"}
                  </dd>
                </div>
              </div>
            </div>

            {/* Address (Full Width Detail) */}
            <div className="mt-6 pt-6 border-t">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Address
              </dt>
              <dd className="text-base text-gray-900">
                {user.raw_user_meta_data?.location || "-"}
              </dd>
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
                <button
                  className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                  onClick={handleEditOpen}
                  disabled={saving}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 shadow-md">
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend User
                </button>
              </div>
            </div>

            {/* Recent Activity Card (not available from Supabase by default) */}
            {/* You can implement activity tracking if needed */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-3">
                Recent Activity
              </h3>
              <p className="text-gray-500">No activity data available.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit User Profile</h2>
              <button
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            {error && (
              <p className="text-red-600 mb-4 text-sm bg-red-50 p-3 rounded">
                {error}
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSave();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={editData.full_name || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Avatar URL
                </label>
                <input
                  type="text"
                  name="avatar_url"
                  value={editData.avatar_url || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={editData.bio || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={editData.location || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={editData.role || "user"}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 mt-6 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-400"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
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
