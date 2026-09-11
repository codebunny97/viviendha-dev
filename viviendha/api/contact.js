// api/contact.js
// Vercel-compatible Serverless function for contact and project enquiries

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST.",
    });
  }

  try {
    const { fullName, email, phone, subject, message, source } = req.body || {};

    // Validate required fields server-side
    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: fullName, email, phone, and message are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address format.",
      });
    }

    const cleanPhone = String(phone).replace(/[\s\-()]/g, "");
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Must have at least 10 digits.",
      });
    }

    // Prepare dispatch payload
    const inquiryPayload = {
      to: process.env.NOTIFICATION_EMAIL || "satya@viviendhadevelopers.com",
      from: process.env.SENDER_EMAIL || "notifications@viviendha.com",
      replyTo: email,
      subject: `[Viviendha Lead] ${subject || "Website Inquiry"} - ${fullName}`,
      text: `
New residential enquiry received:
----------------------------------------
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Subject/Project: ${subject || "General"}
Source: ${source || "Website Form"}
Timestamp: ${new Date().toISOString()}

Message:
${message}
----------------------------------------
      `.trim(),
    };

    // If Resend API key is configured in environment
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryPayload),
      });

      if (!resendRes.ok) {
        const errorData = await resendRes.json();
        console.error("Resend API error:", errorData);
        throw new Error("Failed to dispatch email notification via Resend.");
      }
    } else {
      // Log for serverless runtime inspection when email provider credentials are not yet configured
      console.log("Inquiry received (No RESEND_API_KEY set):", inquiryPayload);
    }

    return res.status(200).json({
      success: true,
      message: "Your inquiry has been successfully received by Viviendha Developers.",
    });
  } catch (error) {
    console.error("Error processing contact submission:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An internal error occurred while processing your inquiry.",
    });
  }
}
