/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import initialProjects from "../data/projects-db.json";
import { useAuth } from "./AuthContext";

const ProjectsContext = createContext(null);
const LOCAL_CACHE_KEY = "viviendha_projects_cache_v2";

export const ProjectsProvider = ({ children }) => {
  const { getAuthHeaders, isAuthenticated } = useAuth();

  const [projects, setProjects] = useState(() => {
    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to static seed
    }
    return initialProjects;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Re-fetch helper (callable on demand)
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders();
      const res = await fetch("/api/projects", { headers });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects)) {
          setProjects(data.projects);
          try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data.projects));
          } catch {
            // ignore quota errors
          }
        }
      }
    } catch (err) {
      console.warn("Could not fetch latest projects from API, using cached data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Synchronize with backend on mount or auth change without calling setState synchronously in effect
  useEffect(() => {
    let ignore = false;

    const syncInitial = async () => {
      try {
        const headers = getAuthHeaders();
        const res = await fetch("/api/projects", { headers });
        const contentType = res.headers.get("content-type") || "";
        if (res.ok && contentType.includes("application/json")) {
          const data = await res.json();
          if (!ignore && data.success && Array.isArray(data.projects)) {
            setProjects(data.projects);
            try {
              localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data.projects));
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // Silently use localStorage / static seed
      }
    };

    syncInitial();
    return () => {
      ignore = true;
    };
  }, [getAuthHeaders]);

  // Publicly visible projects (published only)
  const publicProjects = useMemo(() => {
    return projects.filter((p) => p.isPublished !== false);
  }, [projects]);

  // Helper lookup functions
  const getProjectBySlug = useCallback(
    (slug) => {
      if (!slug) return null;
      const source = isAuthenticated ? projects : publicProjects;
      return source.find((p) => p.slug === slug || p.id === slug) || null;
    },
    [projects, publicProjects, isAuthenticated]
  );

  const getProjectById = useCallback(
    (id) => {
      return projects.find((p) => p.id === id) || null;
    },
    [projects]
  );

  // CRUD actions with hybrid offline-first resilience
  const createProject = async (projectData) => {
    const newProject = {
      ...projectData,
      id: projectData.id || `proj_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(newProject),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && data.project) {
          setProjects((prev) => {
            const next = [data.project, ...prev.filter((p) => p.id !== data.project.id)];
            try {
              localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
            } catch {
              // ignore storage error
            }
            return next;
          });
          return { success: true, project: data.project };
        }
      }
    } catch (err) {
      console.warn("Serverless API unavailable, saving project locally:", err);
    }

    // Local fallback persistence
    setProjects((prev) => {
      const next = [newProject, ...prev.filter((p) => p.id !== newProject.id)];
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });

    return { success: true, project: newProject };
  };

  const updateProject = async (id, projectData) => {
    const updated = {
      ...projectData,
      id,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updated),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && data.project) {
          setProjects((prev) => {
            const next = prev.map((p) => (p.id === id ? data.project : p));
            try {
              localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
            } catch {
              // ignore storage error
            }
            return next;
          });
          return { success: true, project: data.project };
        }
      }
    } catch (err) {
      console.warn("Serverless API unavailable, updating project locally:", err);
    }

    // Local fallback persistence
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? updated : p));
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });

    return { success: true, project: updated };
  };

  const togglePublish = async (id, isPublished) => {
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ id, isPublished }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success && data.project) {
          setProjects((prev) => {
            const next = prev.map((p) => (p.id === id ? data.project : p));
            try {
              localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
            } catch {
              // ignore storage error
            }
            return next;
          });
          return { success: true, project: data.project };
        }
      }
    } catch (err) {
      console.warn("Serverless API unavailable, updating publish status locally:", err);
    }

    // Local fallback persistence
    let updatedProj = null;
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          updatedProj = { ...p, isPublished, updatedAt: new Date().toISOString() };
          return updatedProj;
        }
        return p;
      });
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });

    return { success: true, project: updatedProj };
  };

  const deleteProject = async (id) => {
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to delete project.");
        }
      }
    } catch (err) {
      console.warn("Serverless API unavailable, deleting project locally:", err);
    }

    // Local fallback persistence
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage error
      }
      return next;
    });

    return { success: true };
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        publicProjects,
        loading,
        error,
        refreshProjects: fetchProjects,
        getProjectBySlug,
        getProjectById,
        createProject,
        updateProject,
        togglePublish,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};

export default ProjectsContext;
