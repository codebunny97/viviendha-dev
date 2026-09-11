// api/auth.js
// Vercel & Node compatible Serverless handler for secure Admin Authentication
import crypto from "node:crypto";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@viviendha.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Helper to base64url encode
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString();
}

// Generate secure signed token
export function createToken(payload) {
  if (!JWT_SECRET) {
    throw new Error("ADMIN_JWT_SECRET environment variable is not configured.");
  }
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days validity
  const body = base64UrlEncode(JSON.stringify({ ...payload, exp }));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

// Verify signed token
export function verifyToken(token) {
  if (!JWT_SECRET) return null;
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  try {
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const payload = JSON.parse(base64UrlDecode(body));
    if (payload.exp && payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// Helper to extract bearer token
export function extractToken(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader) return null;
  const [bearer, token] = authHeader.split(" ");
  if (bearer?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const url = new URL(req.url, "http://localhost");
  const pathParts = url.pathname.replace(/\/+$/, "").split("/");
  const lastPart = pathParts[pathParts.length - 1];
  const queryAction = url.searchParams.get("action");
  const body = req.body || {};

  let effectiveAction = "login";
  if (["login", "verify", "logout"].includes(lastPart)) {
    effectiveAction = lastPart;
  } else if (queryAction) {
    effectiveAction = queryAction;
  } else if (body.action) {
    effectiveAction = body.action;
  }

  if (req.method === "POST") {
    if (effectiveAction === "login") {
      const { email, password } = body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
      }

      if (!ADMIN_PASSWORD || !JWT_SECRET) {
        console.error("ADMIN_PASSWORD or ADMIN_JWT_SECRET is missing from environment variables.");
        return res.status(500).json({
          success: false,
          message: "Authentication service is unconfigured. Please configure ADMIN_PASSWORD and ADMIN_JWT_SECRET in your environment variables.",
        });
      }

      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        const token = createToken({
          email: ADMIN_EMAIL,
          role: "admin",
          name: "Viviendha Administrator",
        });

        return res.status(200).json({
          success: true,
          message: "Authentication successful.",
          token,
          user: {
            email: ADMIN_EMAIL,
            role: "admin",
            name: "Viviendha Administrator",
          },
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    if (effectiveAction === "verify") {
      const token = extractToken(req) || body.token;
      const user = verifyToken(token);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired session token.",
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    }

    if (effectiveAction === "logout") {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: `Method not allowed or unrecognized action '${effectiveAction}'.`,
  });
}
