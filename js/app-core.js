// Global Script Module Layout Handler Orchestrator
document.addEventListener("DOMContentLoaded", () => {
  const mountPoint = document.getElementById("sidebar-injector");
  if (!mountPoint) return;

  fetch("sidebar.html")
    .then(res => {
      if (!res.ok) throw new Error("Sidebar structural system asset offline.");
      return res.text();
    })
    .then(htmlContent => {
      mountPoint.outerHTML = htmlContent;
      restoreSidebarLayoutState();
      applyNavigationHighlights();
    })
    .catch(error => console.error("Global Layout Injector Fault:", error));
});

function restoreSidebarLayoutState() {
  const sidebar = document.getElementById("sidebar");
  const mainWrapper = document.getElementById("mainContent") || document.querySelector(".main-content");
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

  if (isCollapsed && sidebar && mainWrapper) {
    sidebar.classList.add("collapsed");
    mainWrapper.classList.add("sidebar-collapsed");
  }
  refreshMenuTooltips();
}

function toggleCollapse() {
  const sidebar = document.getElementById("sidebar");
  const mainWrapper = document.getElementById("mainContent") || document.querySelector(".main-content");
  if (!sidebar || !mainWrapper) return;

  sidebar.classList.toggle("collapsed");
  mainWrapper.classList.toggle("sidebar-collapsed");
  localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
  refreshMenuTooltips();
}

function refreshMenuTooltips() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  const isCollapsed = sidebar.classList.contains("collapsed");

  document.querySelectorAll(".menu-item").forEach(item => {
    if (isCollapsed) {
      const labelText = item.querySelector(".menu-item-text")?.textContent || "";
      item.setAttribute("data-tooltip", labelText.trim());
    } else {
      item.removeAttribute("data-tooltip");
    }
  });
}

function applyNavigationHighlights() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const matchingKey = path.replace(".html", "");
  const currentNavNode = document.getElementById(`nav-${matchingKey}`);
  if (currentNavNode) {
    currentNavNode.classList.add("active");
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

function goToDashboard() {
  window.location.href = "index.html";
}
