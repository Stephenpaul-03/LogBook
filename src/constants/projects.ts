export interface Project {
  id: string;        // e.g. "LogBook"
  label: string;     // e.g. "LogBook Docs"
  sidebarUrl: string; // e.g. "/content/LogBook_Sidebar.json"
}

export const PROJECTS: Project[] = [
  { id: "LogBook", label: "LogBook Docs", sidebarUrl: "/content/LogBook_Sidebar.json" },
  { id: "Cascade", label: "Cascade Lab", sidebarUrl: "/content/Cascade_Sidebar.json" },
];
