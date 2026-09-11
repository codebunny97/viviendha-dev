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
      if (!res.ok) {
        throw new Error(`Failed to load projects: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data.projects));
        } catch {
          // ignore quota errors
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

    const syncProjects = async () => {
      try {
        const headers = getAuthHeaders();
        const res = await fetch("/api/projects", { headers });
        if (res.ok && !ignore) {
          const data = await res.json();
          if (data.success && Array.isArray(data.projects)) {
            setProjects(data.projects);
            try {
              localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data.projects));
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        if (!ignore) {
          console.warn("Could not sync projects with backend:", err);
        }
      }
    };

    syncProjects();

    return () => {
      ignore = true;
    };
  }, [getAuthHeaders, isAuthenticated]);

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

  // CRUD actions
  const createProject = async (projectData) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create project.");
      }

      setProjects((prev) => {
        const next = [data.project, ...prev.filter((p) => p.id !== data.project.id)];
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      return { success: true, project: data.project };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ ...projectData, id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update project.");
      }

      setProjects((prev) => {
        const next = prev.map((p) => (p.id === id ? data.project : p));
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      return { success: true, project: data.project };
    } catch (err) {
      return { success: false, error: err.message };
    }
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update project status.");
      }

      setProjects((prev) => {
        const next = prev.map((p) => (p.id === id ? data.project : p));
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      return { success: true, project: data.project };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete project.");
      }

      setProjects((prev) => {
        const next = prev.filter((p) => p.id !== id);
        try {
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
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
