import { useQuery } from "@tanstack/react-query";

export function usePermissions() {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const response = await fetch("/api/session");
      return response.json();
    },
  });

  const isAdmin = session?.user?.role === "ADMIN";
  const isEditor = session?.user?.role === "EDITOR";
  const isViewer = session?.user?.role === "VIEWER";
  const canEdit = isAdmin || isEditor;

  return {
    session,
    isAdmin,
    isEditor,
    isViewer,
    canEdit,
  };
}
