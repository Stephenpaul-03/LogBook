import { sitePath } from "@/lib/site-path"

export interface Project {
  id: string;        // e.g. "LogBook"
  label: string;     // e.g. "LogBook Docs"
  sidebarUrl: string; // e.g. "/content/LogBook_Sidebar.json"
}

export const PROJECTS: Project[] = [
  { id: "LogBook", label: "LogBook Docs", sidebarUrl: sitePath("/content/LogBook_Sidebar.json") },
  { id: "Cascade", label: "Cascade Lab", sidebarUrl: sitePath("/content/Cascade_Sidebar.json") },
];
