/**
 * js/pages/gallery.js
 * Core Engine Module for Image Gallery Presentation Matrices
 */

let originalImageSet = [];
const GRID_CACHE_KEY = "gallery_assets_cache";
const GRID_CACHE_TIMEOUT = 90000; // 1.5 minutes local cache lifetime

document.addEventListener("DOMContentLoaded", () => {
  initializeGalleryEngine();
});

function initializeGalleryEngine() {
  fetchGalleryImages();

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", performGalleryFilter);
  }

  // Keyboard shortcut bounds for lightboxes
  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("galleryLightbox").classList.contains("active")) return;
    
    if (e.key === "Escape") closeLightboxWindow();
  });
}

/**
 * Handle network asset pipelines
 */
function fetchGalleryImages(bypassCache = false) {
  const gridSpinner = document.getElementById("gridSpinner");
  const galleryGrid = document.getElementById("galleryGrid");
  const endpointUrl = APP_API_REGISTRY.imageGallery;

  if (gridSpinner) gridSpinner.style.display = "block";
  if (galleryGrid) galleryGrid.style.display = "none";

  if (!bypassCache) {
    const activeCache = localStorage.getItem(GRID_CACHE_KEY);
    if (activeCache) {
      const parsed = JSON.parse(activeCache);
      if (Date.now() - parsed.timestamp < GRID_CACHE_TIMEOUT) {
        console.log("Gallery caching layer match hit.");
        originalImageSet = parsed.data;
        renderGalleryCards(originalImageSet);
        return;
      }
    }
  }

  fetch(endpointUrl)
    .then(res => {
      if (!res.ok) throw new Error("Network stream aborted by gallery provider script.");
      return res.json();
    })
    .then(payload => {
      const elements = Array.isArray(payload) ? payload : (payload.data || []);
      
      // Clean up dataset entries lacking real image content
      originalImageSet = elements.filter(row => row["Image"] || row["imageData"] || row["url"]);

      localStorage.setItem(GRID_CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: originalImageSet
      }));

      renderGalleryCards(originalImageSet);
    })
    .catch(error => {
      console.error("Gallery initialization loop fault:", error);
      if (gridSpinner) {
        gridSpinner.textContent = "Error collecting imagery repositories. Check deployment connections.";
      }
    });
}

/**
 * Render standard structural image card nodes
 */
function renderGalleryCards(records, searchFilter = "") {
  const gridSpinner = document.getElementById("gridSpinner");
  const galleryGrid = document.getElementById("galleryGrid");

  if (!galleryGrid) return;
  galleryGrid.innerHTML = "";

  if (gridSpinner) gridSpinner.style.display = "none";
  galleryGrid.style.display = "grid";

  if (records.length === 0) {
    galleryGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:50px; color:#94a3b8; font-weight:500;">No package sample validation images found matching criteria.</div>`;
    return;
  }

  records.forEach((item) => {
    const card = document.createElement("div");
    card.className = "gallery-card";

    const imgSrc = item["Image"] || item["imageData"] || item["url"];
    const trackingId = item["Tracking no"] || item["trackingNo"] || "UNTRACKED";
    const patientName = item["Patient name"] || item["patientName"] || "General Entry";
    const dateStamp = item["Sample Entry Date"] || item["date"] || "";

    // Highlight filter logic checks
    const hl = (txt) => {
      if (!txt) return "-";
      const str = txt.toString();
      if (!searchFilter) return str;
      const rx = new RegExp(`(${searchFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
      return str.replace(rx, "<mark>$1</mark>");
    };

    card.innerHTML = `
      <div class="card-img-container" onclick="openLightboxWindow('${imgSrc}', '${trackingId}', '${patientName.replace(/'/g, "\\'")}')">
        <img src="${imgSrc}" alt="Parcel Verification image for ${trackingId}" loading="lazy" class="card-raw-image" />
        <div class="hover-zoom-overlay"><span>Expand View 🔍</span></div>
      </div>
      <div class="card-meta-panel">
        <div class="meta-tracking-id">${hl(trackingId)}</div>
        <div class="meta-patient-name">${hl(patientName)}</div>
        ${dateStamp ? `<div class="meta-date">${dateStamp}</div>` : ""}
      </div>
    `;

    galleryGrid.appendChild(card);
  });
}

/**
 * Real-time text filter evaluation loop
 */
function performGalleryFilter() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();

  if (!query) {
    renderGalleryCards(originalImageSet);
    return;
  }

  const matches = originalImageSet.filter(row => {
    return Object.values(row).some(field => 
      field && field.toString().toLowerCase().includes(query)
    );
  });

  renderGalleryCards(matches, query);
}

/**
 * Lightbox presentation engine activations
 */
function openLightboxWindow(src, trackingNum, patient) {
  const overlay = document.getElementById("galleryLightbox");
  const viewImg = document.getElementById("lightboxTargetImage");
  const infoLabel = document.getElementById("lightboxDetailsText");

  if (!overlay || !viewImg) return;

  viewImg.src = src;
  if (infoLabel) {
    infoLabel.innerHTML = `<strong>ID:</strong> ${trackingNum} &nbsp;|&nbsp; <strong>Target Identity:</strong> ${patient}`;
  }

  overlay.classList.add("active");
}

function closeLightboxWindow() {
  const overlay = document.getElementById("galleryLightbox");
  if (overlay) overlay.classList.remove("active");
}

function forceSynchronizeGallery() {
  fetchGalleryImages(true);
}
