// api/projects.js
// Vercel & Node compatible Serverless handler for Projects CRUD
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { verifyToken, extractToken } from "./auth.js";

const require = createRequire(import.meta.url);

// Bundled canonical projects data (guaranteed to be bundled by Vercel/Node File Trace)
let bundledProjects = [];
try {
  bundledProjects = require("../src/data/projects-db.json");
} catch {
  try {
    bundledProjects = require("./projects-db.json");
  } catch {
    bundledProjects = [];
  }
}

// In-memory runtime cache for serverless invocation lifecycle
let memoryProjectsCache = Array.isArray(bundledProjects) ? [...bundledProjects] : [];

function getLocalDbPath() {
  return path.join(process.cwd(), "src", "data", "projects-db.json");
}

function readProjects() {
  const localPath = getLocalDbPath();

  // 1. In local development, read directly from project filesystem if available
  try {
    if (fs.existsSync(localPath)) {
      const content = fs.readFileSync(localPath, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read local disk projects-db.json, falling back to bundled canonical data:", err);
  }

  // 2. In serverless production (Vercel), return in-memory cache or bundled canonical project data
  if (Array.isArray(memoryProjectsCache) && memoryProjectsCache.length > 0) {
    return memoryProjectsCache;
  }

  if (Array.isArray(bundledProjects) && bundledProjects.length > 0) {
    return bundledProjects;
  }

  return [];
}

function writeProjects(projects) {
  memoryProjectsCache = projects;
  const localPath = getLocalDbPath();

  // Local development persistence: write to project source file
  try {
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localPath, JSON.stringify(projects, null, 2), "utf-8");
    return true;
  } catch {
    // Expected on Vercel serverless (read-only container filesystem).
    // Note: Serverless environments require a cloud database (e.g. Supabase, Postgres, MongoDB)
    // for persistent multi-tenant writes across cold starts.
    return false;
  }
}


function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const token = extractToken(req);
  const user = token ? verifyToken(token) : null;
  const isAdmin = Boolean(user && user.role === "admin");

  const url = new URL(req.url, "http://localhost");
  const queryId = url.searchParams.get("id");
  const querySlug = url.searchParams.get("slug");

  // GET: Retrieve projects
  if (req.method === "GET") {
    const projects = readProjects();

    if (queryId || querySlug) {
      const project = projects.find(
        (p) => p.id === queryId || p.slug === querySlug
      );
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found." });
      }
      if (!project.isPublished && !isAdmin) {
        return res.status(404).json({ success: false, message: "Project not found." });
      }
      return res.status(200).json({ success: true, project });
    }

    // List all
    if (isAdmin) {
      return res.status(200).json({ success: true, projects, total: projects.length });
    }

    // Public only sees published
    const published = projects.filter((p) => p.isPublished !== false);
    return res.status(200).json({ success: true, projects: published, total: published.length });
  }

  // Admin protection for mutating endpoints
  if (!isAdmin) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Admin authentication token required.",
    });
  }

  // POST: Create a new project
  if (req.method === "POST") {
    const body = req.body || {};
    if (!body.title) {
      return res.status(400).json({ success: false, message: "Project title is required." });
    }

    const projects = readProjects();
    const slug = body.slug ? slugify(body.slug) : slugify(body.title);
    const id = body.id || slug || `proj-${Date.now()}`;

    // Check duplicate id or slug
    if (projects.some((p) => p.id === id || p.slug === slug)) {
      return res.status(400).json({
        success: false,
        message: "A project with this title or slug already exists. Please use a unique title.",
      });
    }

    const newProject = {
      id,
      slug,
      title: body.title,
      subtitle: body.subtitle || "",
      tagline: body.tagline || "",
      category: body.category || "Residential",
      status: body.status || "Upcoming",
      badge: body.badge || (body.status === "Completed" ? "Landmark Project" : "Ongoing Development"),
      isPublished: body.isPublished !== false, // default true
      location: body.location || "Hyderabad, Telangana",
      coordinates: body.coordinates || { lat: 17.5318, lng: 78.3463 },
      googleMapsUrl: body.googleMapsUrl || "",
      reraNumber: body.reraNumber || "",
      possession: body.possession || "TBD",
      totalUnits: body.totalUnits || "Exclusive Residences",
      configurations: Array.isArray(body.configurations) && body.configurations.length > 0
        ? body.configurations
        : ["2 BHK", "3 BHK"],
      areaRange: body.areaRange || "1,200 - 2,000 sq.ft",
      pricing: body.pricing || "Price on Request",
      heroImage: body.heroImage || "/apartment.png",
      coverImage: body.coverImage || "/hero.png",
      brochurePdf: body.brochurePdf || "",
      projectPlanPdf: body.projectPlanPdf || "",
      overview: body.overview || "",
      keyHighlights: Array.isArray(body.keyHighlights) ? body.keyHighlights : [],
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      specifications: Array.isArray(body.specifications) ? body.specifications : [],
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      floorPlans: Array.isArray(body.floorPlans) ? body.floorPlans : [],
      constructionProgress: body.constructionProgress || {
        percentage: 0,
        status: "Planning Phase",
        latestUpdate: "Initial project blueprint underway.",
      },
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.unshift(newProject);
    writeProjects(projects);

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: newProject,
    });
  }

  // PUT: Update an existing project
  if (req.method === "PUT") {
    const body = req.body || {};
    const targetId = body.id || queryId;

    if (!targetId) {
      return res.status(400).json({ success: false, message: "Project ID is required for update." });
    }

    const projects = readProjects();
    const index = projects.findIndex((p) => p.id === targetId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    const current = projects[index];
    const updatedSlug = body.slug ? slugify(body.slug) : current.slug;

    const updatedProject = {
      ...current,
      ...body,
      id: current.id, // preserve ID
      slug: updatedSlug,
      updatedAt: new Date().toISOString(),
    };

    projects[index] = updatedProject;
    writeProjects(projects);

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project: updatedProject,
    });
  }

  // PATCH: Quick update for status / publish toggle
  if (req.method === "PATCH") {
    const body = req.body || {};
    const targetId = body.id || queryId;

    if (!targetId) {
      return res.status(400).json({ success: false, message: "Project ID is required." });
    }

    const projects = readProjects();
    const index = projects.findIndex((p) => p.id === targetId);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (typeof body.isPublished === "boolean") {
      projects[index].isPublished = body.isPublished;
    }
    if (body.status) {
      projects[index].status = body.status;
    }
    projects[index].updatedAt = new Date().toISOString();

    writeProjects(projects);

    return res.status(200).json({
      success: true,
      message: "Project status updated successfully.",
      project: projects[index],
    });
  }

  // DELETE: Remove project
  if (req.method === "DELETE") {
    const body = req.body || {};
    const targetId = body.id || queryId;

    if (!targetId) {
      return res.status(400).json({ success: false, message: "Project ID is required for deletion." });
    }

    const projects = readProjects();
    const filtered = projects.filter((p) => p.id !== targetId);

    if (filtered.length === projects.length) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    writeProjects(filtered);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  }

  return res.status(405).json({ success: false, message: "Method not allowed." });
}
