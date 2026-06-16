// Global Configuration Scope
const APP_CONFIG = {
  firebase: {
    apiKey: "AIzaSyDO5TlgcFHew195ivE1STKTenIeIGw2rvU",
    authDomain: "dnaindia-9bdd7.firebaseapp.com",
    projectId: "dnaindia-9bdd7",
    storageBucket: "dnaindia-9bdd7.firebasestorage.app",
    messagingSenderId: "1080314065286",
    appId: "1:1080314065286:web:a4fe82cbb08854d839bc07"
  }
};

// Orchestrate Layout Injections & Render Pipelines
document.addEventListener("DOMContentLoaded", () => {
  const sidebarTarget = document.getElementById("sidebar-injector");
  if (!sidebarTarget) return;

  fetch("sidebar.html")
    .then(response => {
      if (!response.ok) throw new Error("Sidebar structural engine asset down.");
      return response.text();
    })
    .then(htmlFragment => {
      sidebarTarget.outerHTML = htmlFragment;
      initializeSidebarState();
      highlightActiveNavigation();
    })
    .catch(err => console.error("Layout initialization fault:", err));
});

function initializeSidebarState() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent") || document.querySelector(".main-content");
  const wasCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

  if (wasCollapsed && sidebar && mainContent) {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("sidebar-collapsed");
  }
  updateMenuTooltips();
}

function toggleCollapse() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent") || document.querySelector(".main-content");
  if (!sidebar || !mainContent) return;

  sidebar.classList.toggle("collapsed");
  mainContent.classList.toggle("sidebar-collapsed");
  localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
  updateMenuTooltips();
}

function updateMenuTooltips() {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  const isCollapsed = sidebar.classList.contains("collapsed");

  document.querySelectorAll(".menu-item").forEach(item => {
    if (isCollapsed) {
      const text = item.querySelector(".menu-item-text")?.textContent || "";
      item.setAttribute("data-tooltip", text.trim());
    } else {
      item.removeAttribute("data-tooltip");
    }
  });
}

function highlightActiveNavigation() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const normalizedPage = currentPath.replace(".html", "");
  const targetElement = document.getElementById(`nav-${normalizedPage}`);
  if (targetElement) {
    targetElement.classList.add("active");
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("open");
}

function goToDashboard() {
  window.location.href = "index.html";
}