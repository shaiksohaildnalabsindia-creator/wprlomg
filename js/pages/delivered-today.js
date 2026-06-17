/**
 * js/pages/delivered-today.js
 * Core Runtime Module Engine for Delivered Today tracking logs views
 */

// Local Memory State Cache
let fullLogRegistry = [];
const CACHE_KEY = "delivered_today_cache";
const CACHE_DURATION_MS = 60000; // 1 minute client-side cache restriction threshold

document.addEventListener("DOMContentLoaded", () => {
  initializePagePipeline();
});

/**
 * Orchestrate initial load steps
 */
function initializePagePipeline() {
  loadDeliveredParcels();

  // Attach interactive text event tracking elements
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterResultsTable);
  }

  // Hook up full-screen image modal escape closures
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeImageLightbox();
    }
  });
}

/**
 * Handle data recovery from network endpoints with local performance storage checkpoints
 */
function loadDeliveredParcels(forceBypassCache = false) {
  const loadingIndicator = document.getElementById("loadingIndicator");
  const dataTable = document.getElementById("recordsTable");
  const fetchUrl = APP_API_REGISTRY.deliveredToday;

  if (loadingIndicator) loadingIndicator.style.display = "block";
  if (dataTable) dataTable.style.display = "none";

  // Check storage engine for healthy recent query payloads
  if (!forceBypassCache) {
    const localCache = localStorage.getItem(CACHE_KEY);
    if (localCache) {
      const parsedCache = JSON.parse(localCache);
      const cacheAge = Date.now() - parsedCache.timestamp;

      if (cacheAge < CACHE_DURATION_MS) {
        console.log("Performance caching layer hit. Resolving local records stream.");
        fullLogRegistry = parsedCache.data;
        processAndRenderTable(fullLogRegistry);
        return;
      }
    }
  }

  // Make the live network call to Google Web App script engines
  fetch(fetchUrl)
    .then(response => {
      if (!response.ok) throw new Error("Data stream handshake dropped by destination endpoint.");
      return response.json();
    })
    .then(payload => {
      // Normalize both flat lists and envelope objects returned from AppScript pipelines
      const rawRows = Array.isArray(payload) ? payload : (payload.data || []);
      
      // Filter the data on the client side to keep entries that match today's date
      fullLogRegistry = filterDataToTodayOnly(rawRows);

      // Save a local copy in storage to reduce duplicate network loads
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: fullLogRegistry
      }));

      processAndRenderTable(fullLogRegistry);
    })
    .catch(error => {
      console.error("Database resolution error:", error);
      if (loadingIndicator) {
        loadingIndicator.textContent = "Error parsing deliveries. Check connection parameters.";
      }
    });
}

/**
 * Filter data to ensure only rows processed on the current day appear
 */
function filterDataToTodayOnly(rows) {
  const todayString = new Date().toLocaleDateString('en-CA'); // Outputs standard YYYY-MM-DD template format

  return rows.filter(row => {
    // Look for potential alternate keys used by different sheet setups
    const dateValue = row["Sample Entry Date"] || row["date"] || row["Timestamp"];
    if (!dateValue) return false;

    // Standardize string dates to extract YYYY-MM-DD
    try {
      const parsedRowDate = new Date(dateValue).toLocaleDateString('en-CA');
      return parsedRowDate === todayString;
    } catch {
      return false;
    }
  });
}

/**
 * Map matching array profiles into HTML table row components
 */
function processAndRenderTable(dataset, highlightSearchTerm = "") {
  const loadingIndicator = document.getElementById("loadingIndicator");
  const dataTable = document.getElementById("recordsTable");
  const tableBody = document.getElementById("tableBody");

  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (loadingIndicator) loadingIndicator.style.display = "none";
  if (dataTable) dataTable.style.display = "table";

  if (dataset.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:#94a3b8; font-weight:500;">No packages have been delivered today yet.</td></tr>`;
    return;
  }

  dataset.forEach((item, index) => {
    const tr = document.createElement("tr");

    // Dynamic text highlight engine matching active query parameters
    const txtWrap = (field) => {
      if (!field) return "-";
      const standardStr = field.toString();
      if (!highlightSearchTerm) return standardStr;

      const regexMatcher = new RegExp(`(${highlightSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
      return standardStr.replace(regexMatcher, "<mark>$1</mark>");
    };

    // Recover image attachment signatures safely
    const base64ImageString = item["Image"] || item["imageData"] || null;
    let visualCellElement = `<span style="color:#94a3b8; font-style:italic;">No Image</span>`;

    if (base64ImageString) {
      visualCellElement = `
        <div class="table-img-wrapper" onclick="openImageLightbox('${base64ImageString}', '${item["Tracking no"] || 'Asset'}')">
          <img src="${base64ImageString}" alt="Package Thumbnail" class="table-thumb-preview" />
          <span class="zoom-badge-icon">🔍</span>
        </div>
      `;
    }

    tr.innerHTML = `
      <td style="font-weight:600; color:#64748b;">${index + 1}</td>
      <td style="font-family:monospace; font-weight:700; color:#0f172a;">${txtWrap(item["Tracking no"] || item["trackingNo"])}</td>
      <td>${txtWrap(item["Patient name"] || item["patientName"] || "Walk-in Target")}</td>
      <td>${txtWrap(item["Location"] || item["location"] || "Central Sorting Hub")}</td>
      <td style="text-align:center;">${visualCellElement}</td>
    `;

    tableBody.appendChild(tr);
  });
}

/**
 * Filter the rows based on the text entered in the search bar
 */
function filterResultsTable() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  
  if (!query) {
    processAndRenderTable(fullLogRegistry);
    return;
  }

  const filteredSubset = fullLogRegistry.filter(row => {
    return Object.values(row).some(val => 
      val && val.toString().toLowerCase().includes(query)
    );
  });

  processAndRenderTable(filteredSubset, query);
}

/**
 * Modal window trigger animations for lightbox views
 */
function openImageLightbox(imageSrc, trackingId) {
  const overlay = document.getElementById("lightboxOverlay");
  const lightboxImg = document.getElementById("lightboxImage");
  const titleText = document.getElementById("lightboxTitle");

  if (!overlay || !lightboxImg) return;

  lightboxImg.src = imageSrc;
  if (titleText) titleText.textContent = `Verification Evidence: ${trackingId}`;

  overlay.classList.add("active");
}

function closeImageLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  if (overlay) overlay.classList.remove("active");
}

// Clean up local cache if explicitly forced by UI interactions
function forceRefreshDeliveredRecords() {
  loadDeliveredParcels(true);
}
