import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Calendar,
  FileText,
  Filter,
} from "lucide-react";
import { roleRequestService } from "@/services/api/roleRequestService";
import { authService } from "@/services/api/authService";
import { RoleRequest } from "@/types/request.type";
import Hsidebar from "../../../components/dashboard/hsidebar";

export default function RequestsManagement() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RoleRequest[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [reviewerId, setReviewerId] = useState<string>("");

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [filter, requests]);

  const initializePage = async () => {
    try {
      setLoading(true);
      const id = await authService.getCurrentUserId();
      setReviewerId(id);

      const allRequests = await roleRequestService.getAllRequests();
      setRequests(allRequests);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    if (filter === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter((req) => req.status === filter));
    }
  };

  const handleApprove = async (requestId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to approve this request? The user will be upgraded to provider status.",
      )
    ) {
      return;
    }

    try {
      setProcessing(requestId);
      setError(null);

      await roleRequestService.approveRequest(requestId, reviewerId);
      setSuccess(
        "Request approved successfully! User has been upgraded to provider.",
      );

      // Refresh requests
      await initializePage();

      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to approve request");
      console.error("Error approving request:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!window.confirm("Are you sure you want to reject this request?")) {
      return;
    }

    try {
      setProcessing(requestId);
      setError(null);

      await roleRequestService.rejectRequest(requestId, reviewerId);
      setSuccess("Request rejected successfully.");

      // Refresh requests
      await initializePage();

      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to reject request");
      console.error("Error rejecting request:", err);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <Hsidebar>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Provider Requests Management
          </h1>
          <p className="text-gray-600">
            Review and manage user requests to become service providers
          </p>
        </div>
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {/* Filter Tabs */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-gray-600" />
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({requests.filter((r) => r.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved ({requests.filter((r) => r.status === "approved").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({requests.filter((r) => r.status === "rejected").length})
          </button>
        </div>
        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No requests found
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "There are no provider requests yet."
                : `There are no ${filter} requests.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.userName || "Unknown User"}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {request.userEmail}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Submitted{" "}
                        {new Date(request.submittedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </div>
                    {request.reviewedAt && (
                      <div className="text-sm text-gray-600 mb-3">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Reviewed on{" "}
                        {new Date(request.reviewedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Reason for Request:
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {request.reason}
                  </p>
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={processing === request.id}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing === request.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={processing === request.id}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing === request.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Hsidebar>
  );
}
