import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Send,
    Loader2,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ArrowLeft,
    FileText
} from 'lucide-react';
import PrimarySearchAppBar from '@/components/home/AppBar';
import { requestService } from '@/services/api/requestService';
import { authService } from '@/services/api/authService';
import { Request } from '@/types/request.type';

export default function ProviderRequest() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [currentRole, setCurrentRole] = useState<string>('');
    const [pendingRequest, setPendingRequest] = useState<Request | null>(null);
    const [requestHistory, setRequestHistory] = useState<Request[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        reason: '',
    });

    useEffect(() => {
        initializePage();
    }, []);

    const initializePage = async () => {
        try {
            setLoading(true);
            const id = await authService.getCurrentUserId();
            const role = await authService.getCurrentUserRole();
            setUserId(id);
            setCurrentRole(role);

            // Check if user is already a provider or admin
            if (role === 'provider' || role === 'admin') {
                setError(`You are already a ${role}. No need to submit a request.`);
                setLoading(false);
                return;
            }

            // Fetch pending request and history
            const pending = await requestService.getUserPendingRequest(id);
            const history = await requestService.getUserRequests(id);

            setPendingRequest(pending);
            setRequestHistory(history);
        } catch (err) {
            console.error('Error initializing page:', err);
            setError('Failed to load request information');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.reason.trim()) {
            setError('Please provide a reason for your request');
            return;
        }

        if (formData.reason.trim().length < 50) {
            setError('Please provide a more detailed reason (at least 50 characters)');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await requestService.createRequest({
                userId,
                roleRequested: 'provider',
                reason: formData.reason.trim(),
            });

            setSuccess('Your request has been submitted successfully! An admin will review it soon.');
            setFormData({ reason: '' });

            // Refresh the page data
            await initializePage();

            setTimeout(() => {
                setSuccess(null);
            }, 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to submit request');
            console.error('Error submitting request:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelRequest = async () => {
        if (!pendingRequest) return;

        if (!window.confirm('Are you sure you want to cancel your pending request?')) {
            return;
        }

        try {
            setSubmitting(true);
            await requestService.cancelRequest(pendingRequest.id, userId);
            setSuccess('Request cancelled successfully');
            await initializePage();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to cancel request');
            console.error('Error cancelling request:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                    </span>
                );
            case 'approved':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approved
                    </span>
                );
            case 'rejected':
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div>
            <PrimarySearchAppBar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                    </button>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4">
                            <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900">
                                Become a Provider
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            Submit a request to become a service provider and start offering your properties and services on our platform.
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

                    {/* Pending Request Alert */}
                    {pendingRequest && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Request Pending Review
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                        Your request to become a provider is currently being reviewed by our admin team.
                                    </p>
                                    <div className="bg-white rounded-lg p-4 mb-3">
                                        <p className="text-sm text-gray-600 mb-1">Submitted on:</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(pendingRequest.submittedAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-3 mb-1">Your reason:</p>
                                        <p className="text-gray-900">{pendingRequest.reason}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleCancelRequest}
                                disabled={submitting}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel Request
                            </button>
                        </div>
                    )}

                    {/* Request Form */}
                    {!pendingRequest && currentRole === 'user' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center mb-6">
                                    <FileText className="w-6 h-6 text-blue-600 mr-3" />
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Submit Your Request
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Why do you want to become a provider? *
                                        </label>
                                        <textarea
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            rows={8}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                            placeholder="Please provide a detailed explanation of why you want to become a provider. Include information about your experience, the services you plan to offer, and how you can contribute to our platform. (Minimum 50 characters)"
                                            required
                                        />
                                        <p className="mt-2 text-sm text-gray-500">
                                            {formData.reason.length} / 50 characters minimum
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                        <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Your request will be reviewed by our admin team</li>
                                            <li>• You'll be notified once a decision is made</li>
                                            <li>• If approved, your account will be upgraded to provider status</li>
                                            <li>• You'll then be able to add and manage your properties and services</li>
                                        </ul>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || formData.reason.trim().length < 50}
                                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Submit Request
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Request History */}
                    {requestHistory.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 sm:p-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Request History
                                </h2>
                                <div className="space-y-4">
                                    {requestHistory.map((request) => (
                                        <div
                                            key={request.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Submitted on {new Date(request.submittedAt).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                    {request.reviewedAt && (
                                                        <p className="text-sm text-gray-600">
                                                            Reviewed on {new Date(request.reviewedAt).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                                {getStatusBadge(request.status)}
                                            </div>
                                            <div className="bg-gray-50 rounded p-3">
                                                <p className="text-sm text-gray-600 mb-1">Reason:</p>
                                                <p className="text-gray-900">{request.reason}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
