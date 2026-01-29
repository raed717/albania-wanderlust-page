import { apiClient } from "./apiClient";

/**
 * Email service for sending emails via Supabase Edge Function
 */

const EDGE_FUNCTION_URL =
  "https://futuwdbxszdovuliybfu.supabase.co/functions/v1/send-email";

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
  tags?: Record<string, string>;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  statusCode: number;
}

/**
 * Send email directly via edge function
 */
export const sendEmailDirect = async (
  emailData: EmailPayload,
): Promise<EmailResponse> => {
  console.log("[Email Service] 🚀 Starting email send process...");

  try {
    // Get current session
    console.log("[Email Service] 🔐 Getting session token...");
    const {
      data: { session },
      error: sessionError,
    } = await apiClient.auth.getSession();

    if (sessionError) {
      console.error("[Email Service] ❌ Session error:", sessionError);
      return {
        success: false,
        error: `Session error: ${sessionError.message}`,
        statusCode: 401,
      };
    }

    if (!session?.access_token) {
      console.error("[Email Service] ❌ No session token available");
      return {
        success: false,
        error: "Not authenticated - no session token",
        statusCode: 401,
      };
    }

    console.log("[Email Service] ✅ Session token obtained");
    console.log("[Email Service] 📦 Preparing request with payload:", {
      to: emailData.to,
      subject: emailData.subject,
      hasHtml: !!emailData.html,
      htmlLength: emailData.html?.length,
      replyTo: emailData.replyTo,
      from: emailData.from,
      hasTags: !!emailData.tags,
      tags: emailData.tags,
    });

    // Make request to edge function
    console.log(
      "[Email Service] 📤 Sending POST request to:",
      EDGE_FUNCTION_URL,
    );

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(emailData),
    });

    console.log("[Email Service] 📥 Response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    // Parse response
    let result;
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      result = await response.json();
      console.log("[Email Service] 📄 Response JSON:", result);
    } else {
      const text = await response.text();
      console.log("[Email Service] 📄 Response text:", text);
      result = { error: text || "Non-JSON response received" };
    }

    // Handle non-OK responses
    if (!response.ok) {
      console.error("[Email Service] ❌ Request failed:", {
        status: response.status,
        statusText: response.statusText,
        error: result.error,
        fullResponse: result,
      });

      return {
        success: false,
        error:
          result.error || `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      };
    }

    // Success
    console.log("[Email Service] ✅ Email sent successfully:", {
      messageId: result.messageId,
      success: result.success,
    });

    return {
      success: true,
      messageId: result.messageId,
      statusCode: 200,
    };
  } catch (error) {
    console.error("[Email Service] ❌ Unexpected error:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
      statusCode: 500,
    };
  }
};

/**
 * HTML Email Template for Provider Booking Notification
 */
export const getProviderBookingNotificationTemplate = (data: {
  providerName: string;
  propertyName: string;
  propertyType: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  bookingId: string;
  dashboardUrl: string;
}): string => {
  console.log("[Email Service] 📝 Generating email template with data:", data);

  const template = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .booking-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: bold; color: #6b7280; }
        .detail-value { color: #111827; }
        .button { display: inline-block; background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Booking Request</h1>
        </div>
        <div class="content">
          <p>Hello ${data.providerName},</p>
          <p>You have received a new booking request for your ${data.propertyType}.</p>
          
          <div class="booking-details">
            <h2>Booking Details</h2>
            <div class="detail-row">
              <span class="detail-label">Property:</span>
              <span class="detail-value">${data.propertyName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${data.propertyType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Booking ID:</span>
              <span class="detail-value">${data.bookingId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-in:</span>
              <span class="detail-value">${data.checkInDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-out:</span>
              <span class="detail-value">${data.checkOutDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Price:</span>
              <span class="detail-value">$${data.totalPrice}</span>
            </div>
          </div>

          <div class="booking-details">
            <h2>Guest Information</h2>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${data.guestName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${data.guestEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${data.guestPhone}</span>
            </div>
          </div>

          <center>
            <a href="${data.dashboardUrl}" class="button">View Booking in Dashboard</a>
          </center>

          <p>Please review this booking request and respond as soon as possible.</p>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from Discover Albania.</p>
          <p>Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  console.log(
    "[Email Service] ✅ Template generated, length:",
    template.length,
  );
  return template;
};
