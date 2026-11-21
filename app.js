/* ==========================================================================
   YUTARA MARKETPLACE — EXACT SANDBOX DATA & INTERACTIONS
   File: app.js
   Description: Replicates the exact properties, PromotedCarousel, PropertyCard,
                PropertyDetailView, search filters, and auth flows from
                https://yutarasandbox.vercel.app/
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. EXACT MARKETPLACE PROPERTIES (from src/lib/marketplace.ts)
   -------------------------------------------------------------------------- */
const ROAD_ACCESS_LABEL = {
  BARANGAY_ROAD: "Accessible from Barangay Road",
  NATIONAL_ROAD: "Accessible from National Road",
  PRIVATE_ROAD: "Private road access",
  NONE_SPECIFIED: "Road access not specified",
};

const ACTIVE_PROPERTIES = [
  {
    id: 1,
    title: "Quiet family lot near the city center",
    type: "Residential",
    barangay: "San Vicente",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 2500000,
    area: 200,
    promoted: true,
    seller: "Maya Santos",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    description: "A gently sloping residential lot in a growing Panabo neighborhood, close to everyday essentials.",
    latitude: 7.308,
    longitude: 125.684,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 2,
    title: "Productive coconut land with road access",
    type: "Agricultural",
    barangay: "Cagangohan",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 3900000,
    area: 1800,
    promoted: false,
    seller: "Lio Navarro",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
    description: "Productive agricultural land with road access and a calm rural setting in Panabo City.",
    latitude: 7.331,
    longitude: 125.676,
    roadAccess: "NATIONAL_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 3,
    title: "Corner parcel for a neighborhood shop",
    type: "Commercial",
    barangay: "Gredu",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 5200000,
    area: 350,
    promoted: true,
    seller: "Celia Ramos",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    description: "A visible corner lot positioned for a small commercial build in an active Panabo district.",
    latitude: 7.3,
    longitude: 125.688,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 9,
    title: "Small office site in a growing district",
    type: "Commercial",
    barangay: "J.P. Laurel",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 8300000,
    area: 420,
    promoted: false,
    seller: "Mara Lim",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    description: "A commercial site surrounded by new residential development in Panabo City.",
    latitude: 7.305,
    longitude: 125.681,
    roadAccess: "NATIONAL_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 11,
    title: "Starter lot close to local schools",
    type: "Residential",
    barangay: "Poblacion",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 1950000,
    area: 180,
    promoted: false,
    seller: "Nico Dizon",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description: "A practical residential parcel within reach of schools and local services.",
    latitude: 7.302,
    longitude: 125.685,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 15,
    title: "Residential lot with open views",
    type: "Residential",
    barangay: "San Roque",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 2750000,
    area: 240,
    promoted: true,
    seller: "Lara Gomez",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    description: "A bright residential lot with open views and a quiet neighborhood feel.",
    latitude: 7.324,
    longitude: 125.69,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 21,
    title: "Sunlit family parcel 1",
    type: "Residential",
    barangay: "Kiotoy",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 2625000,
    area: 225,
    promoted: false,
    seller: "Maya Santos",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    description: "A gently sloping residential lot in a growing Panabo neighborhood, close to everyday essentials.",
    latitude: 7.3,
    longitude: 125.66,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 22,
    title: "Harvest-ready farm lot 2",
    type: "Agricultural",
    barangay: "Little Panay",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 4150000,
    area: 1850,
    promoted: false,
    seller: "Lio Navarro",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
    description: "Productive agricultural land with road access and a calm rural setting in Panabo City.",
    latitude: 7.307,
    longitude: 125.669,
    roadAccess: "NATIONAL_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 23,
    title: "Neighborhood trade site 3",
    type: "Commercial",
    barangay: "Lower Panaga",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 5575000,
    area: 425,
    promoted: true,
    seller: "Celia Ramos",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    description: "A visible corner lot positioned for a small commercial build in an active Panabo district.",
    latitude: 7.314,
    longitude: 125.678,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 24,
    title: "Flexible work yard 4",
    type: "Residential",
    barangay: "Mabuhay",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 2300000,
    area: 260,
    promoted: false,
    seller: "Noah Villanueva",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    description: "An accessible lot for a first home, with wide streets and established utilities nearby.",
    latitude: 7.321,
    longitude: 125.687,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 25,
    title: "Quiet garden property 5",
    type: "Agricultural",
    barangay: "Magsaysay",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 3475000,
    area: 2625,
    promoted: false,
    seller: "Rina Dela Cruz",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
    description: "Open, practical land with water access and room for mixed agricultural use.",
    latitude: 7.328,
    longitude: 125.696,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 26,
    title: "Sunlit family parcel 6",
    type: "Industrial",
    barangay: "Malativas",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 8350000,
    area: 1050,
    promoted: false,
    seller: "Eli Mercado",
    image: "https://images.unsplash.com/photo-1565610222536-ef125c59da2e?auto=format&fit=crop&w=1200&q=80",
    description: "A strategically placed Panabo parcel with vehicle access for logistics, storage, or light industry.",
    latitude: 7.335,
    longitude: 125.665,
    roadAccess: "NATIONAL_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 27,
    title: "Harvest-ready farm lot 7",
    type: "Residential",
    barangay: "Manay",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 3975000,
    area: 455,
    promoted: false,
    seller: "Amara Reyes",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=80",
    description: "A promising residential property submitted for YuTara review.",
    latitude: 7.302,
    longitude: 125.674,
    roadAccess: "NONE_SPECIFIED",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 28,
    title: "Neighborhood trade site 8",
    type: "Agricultural",
    barangay: "New Malaga",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 3100000,
    area: 1600,
    promoted: false,
    seller: "Tomas Flores",
    image: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=1200&q=80",
    description: "Submitted land awaiting additional information from the seller.",
    latitude: 7.309,
    longitude: 125.683,
    roadAccess: "BARANGAY_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 29,
    title: "Flexible work yard 9",
    type: "Commercial",
    barangay: "New Malitbog",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 9425000,
    area: 645,
    promoted: false,
    seller: "Mara Lim",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    description: "A commercial site surrounded by new residential development in Panabo City.",
    latitude: 7.316,
    longitude: 125.692,
    roadAccess: "NATIONAL_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
  {
    id: 30,
    title: "Quiet garden property 10",
    type: "Other",
    barangay: "New Pandan",
    city: "Panabo City",
    province: "Davao del Norte",
    generalAddress: "General location available upon inquiry",
    price: 4650000,
    area: 2150,
    promoted: false,
    seller: "Ira Bautista",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    description: "A spacious green parcel suited to a low-impact retreat concept.",
    latitude: 7.323,
    longitude: 125.661,
    roadAccess: "PRIVATE_ROAD",
    listingStatus: "OPEN_FOR_OFFERS",
  },
];

/* --------------------------------------------------------------------------
   2. FORMATTING & SAVED PROPERTIES HELPERS
   -------------------------------------------------------------------------- */
function formatMoney(value) {
  return "₱" + new Intl.NumberFormat("en-PH").format(value);
}

function getSavedIds() {
  try {
    const raw = localStorage.getItem("yutara-saved");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function showToast(msg) {
  let toast = document.getElementById("yutara-live-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "yutara-live-toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2400);
}

function toggleSaveProperty(id, buttonEl) {
  const saved = getSavedIds();
  const isSaved = saved.includes(id);
  const next = isSaved ? saved.filter((x) => x !== id) : [...saved, id];
  try {
    localStorage.setItem("yutara-saved", JSON.stringify(next));
  } catch {}
  showToast(isSaved ? "Removed from saved properties" : "Saved to your properties");
  syncHeartIcons();
  if (document.getElementById("marketplace-property-grid")) {
    renderMarketplace();
    renderPromotedCarousel();
  }
  if (document.getElementById("property-detail-mount")) {
    renderPropertyDetailPage();
  }
}

function syncHeartIcons() {
  const saved = getSavedIds();
  document.querySelectorAll("[data-save-id]").forEach((btn) => {
    const id = Number(btn.getAttribute("data-save-id"));
    const svg = btn.querySelector("svg");
    if (svg) {
      svg.setAttribute("fill", saved.includes(id) ? "#d79c43" : "none");
      svg.setAttribute("color", saved.includes(id) ? "#d79c43" : "currentColor");
    }
  });
}

/* --------------------------------------------------------------------------
   3. NAVBAR SCROLL & MOBILE MENU
   -------------------------------------------------------------------------- */
function toggleMobileNav() {
  const nav = document.getElementById("mobile-nav");
  if (!nav) return;
  nav.style.display = nav.style.display === "none" ? "flex" : "none";
}

window.addEventListener("scroll", () => {
  const publicNav = document.getElementById("public-nav");
  if (publicNav) {
    if (window.scrollY > 10) {
      publicNav.classList.add("scrolled");
    } else {
      publicNav.classList.remove("scrolled");
    }
  }
});

/* --------------------------------------------------------------------------
   4. HOME PAGE SEARCH REDIRECT
   -------------------------------------------------------------------------- */
function submitHomeSearch() {
  const q = document.getElementById("home-search-query")?.value || "";
  const type = document.getElementById("home-search-type")?.value || "All types";
  const min = document.getElementById("home-search-min")?.value || "";
  const max = document.getElementById("home-search-max")?.value || "";
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type && type !== "All types") params.set("type", type);
  if (min) params.set("min", min);
  if (max) params.set("max", max);
  const qs = params.toString();
  window.location.href = "marketplace.html" + (qs ? "?" + qs : "");
}

/* --------------------------------------------------------------------------
   5. MARKETPLACE VIEW & PROMOTED CAROUSEL
   -------------------------------------------------------------------------- */
let carouselIndex = 0;
let hasSearchedMarketplace = false;

function toggleMarketplaceFilterPanel() {
  const panel = document.getElementById("marketplace-search-panel");
  const trigger = document.getElementById("search-land-trigger");
  if (!panel) return;
  const isOpen = panel.classList.toggle("open");
  if (trigger) trigger.setAttribute("aria-expanded", String(isOpen));
}

function handleMarketplaceSearchSubmit(event) {
  event.preventDefault();
  hasSearchedMarketplace = true;
  const panel = document.getElementById("marketplace-search-panel");
  const trigger = document.getElementById("search-land-trigger");
  if (panel) panel.classList.remove("open");
  if (trigger) trigger.setAttribute("aria-expanded", "false");
  renderMarketplace();
}

function clearMarketplaceFilters() {
  const qEl = document.getElementById("market-query");
  const typeEl = document.getElementById("marketplace-property-type");
  const brgyEl = document.getElementById("marketplace-barangay");
  const sortEl = document.getElementById("marketplace-sort");
  const minEl = document.getElementById("market-min-price");
  const maxEl = document.getElementById("market-max-price");

  if (qEl) qEl.value = "";
  if (typeEl) typeEl.value = "All types";
  if (brgyEl) brgyEl.value = "All barangays";
  if (sortEl) sortEl.value = "Recommended";
  if (minEl) minEl.value = "";
  if (maxEl) maxEl.value = "";
  hasSearchedMarketplace = false;

  const panel = document.getElementById("marketplace-search-panel");
  if (panel) panel.classList.remove("open");
  renderMarketplace();
}

function movePromotedCarousel(dir) {
  const promoted = ACTIVE_PROPERTIES.filter((p) => p.promoted);
  if (!promoted.length) return;
  carouselIndex = (carouselIndex + dir + promoted.length) % promoted.length;
  renderPromotedCarousel();
}

function setPromotedCarouselIndex(idx) {
  carouselIndex = idx;
  renderPromotedCarousel();
}

function renderPromotedCarousel() {
  const mount = document.getElementById("promoted-carousel-mount");
  if (!mount) return;

  const promoted = ACTIVE_PROPERTIES.filter((p) => p.promoted);
  const prop = promoted[carouselIndex % promoted.length];
  const saved = getSavedIds();
  const isSaved = saved.includes(prop.id);
  const heartFill = isSaved ? "#d79c43" : "none";
  const heartColor = isSaved ? "#d79c43" : "currentColor";

  const dotsHtml = promoted
    .map(
      (item, idx) => `
      <button
        aria-label="Show promoted property ${idx + 1}"
        ${idx === carouselIndex ? 'aria-current="true" class="active"' : ""}
        onclick="setPromotedCarouselIndex(${idx})"
      ></button>`
    )
    .join("");

  mount.innerHTML = `
    <div class="featured-carousel" tabindex="0">
      <div class="featured-card featured-desktop-card">
        <img
          class="featured-image"
          src="${prop.image}"
          alt="${prop.title} in ${prop.barangay}, Panabo City"
          style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;object-fit:cover;object-position:center;"
        />
        <div class="featured-overlay"></div>
        <button
          class="featured-save featured-save-desktop"
          aria-label="${isSaved ? "Remove saved property" : "Save property"}"
          onclick="toggleSaveProperty(${prop.id}, this)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart">
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
          </svg>
        </button>
        <div class="featured-content">
          <div class="featured-badges">
            <span class="badge badge-promoted">Promoted</span>
          </div>
          <div class="property-type">${prop.type} lot</div>
          <h3 class="featured-title">${prop.title}</h3>
          <p class="featured-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${prop.barangay}, ${prop.city}, ${prop.province}
          </p>
          <div class="featured-price">${formatMoney(prop.price)}</div>
          <div class="featured-meta">
            ${prop.area.toLocaleString()} sqm <span>•</span> ${prop.type}
          </div>
          <div class="featured-actions">
            <button class="button button-primary" onclick="window.location.href='property.html?id=${prop.id}'">
              View property
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <article class="featured-mobile-card">
        <div class="featured-mobile-image" style="position:relative;">
          <img
            class="featured-image"
            src="${prop.image}"
            alt="${prop.title}"
            style="width:100%;height:100%;object-fit:cover;"
          />
        </div>
        <div class="featured-mobile-content">
          <div class="featured-badges">
            <span class="badge badge-promoted">Promoted</span>
          </div>
          <h3>${prop.title}</h3>
          <p class="featured-mobile-description">${prop.description}</p>
          <p class="featured-location">${prop.barangay}, ${prop.city}</p>
          <div class="featured-mobile-price">${formatMoney(prop.price)}</div>
          <div class="featured-meta">${prop.area.toLocaleString()} sqm <span>•</span> ${prop.type}</div>
          <div class="featured-mobile-actions">
            <button class="button button-primary" onclick="window.location.href='property.html?id=${prop.id}'">
              View property →
            </button>
          </div>
        </div>
      </article>

      <button class="featured-arrow featured-arrow-left" aria-label="Previous promoted property" onclick="movePromotedCarousel(-1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>
      <button class="featured-arrow featured-arrow-right" aria-label="Next promoted property" onclick="movePromotedCarousel(1)">
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>
      <div class="featured-dots">${dotsHtml}</div>
    </div>
  `;
}

function renderPropertyCardHtml(property, savedIds) {
  const isSaved = savedIds.includes(property.id);
  const pricePerSqm = property.area > 0 ? Math.round(property.price / property.area) : 0;
  const heartFill = isSaved ? "#d79c43" : "none";
  const heartColor = isSaved ? "#d79c43" : "currentColor";

  return `
    <article class="property-card group fade-up">
      <div class="property-image" style="background-image: url('${property.image}'); background-position: center;">
        <span class="badge badge-green">Open for Offers</span>
        ${property.promoted ? '<span class="badge badge-gray">Promoted</span>' : ""}
        <button
          class="save-float"
          aria-label="${isSaved ? "Remove saved property" : "Save property"}"
          onclick="toggleSaveProperty(${property.id}, this)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart">
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
          </svg>
        </button>
      </div>
      <div class="property-body">
        <div class="property-type">${property.type} lot</div>
        <h3 class="property-title">${property.title}</h3>
        <div class="property-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          ${property.barangay}, ${property.city}
        </div>
        <div class="property-meta" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;flex-direction:column;min-width:0;">
            <span class="price">${formatMoney(property.price)}</span>
            <span class="price-per-sqm" style="font-size:0.74rem;color:#666;">₱${pricePerSqm.toLocaleString()}/sqm</span>
          </div>
          <span class="area" style="white-space:nowrap;margin-left:auto;">${property.area.toLocaleString()} sqm</span>
        </div>
        <div class="property-road-access">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${ROAD_ACCESS_LABEL[property.roadAccess]}</span>
        </div>
        <button class="btn btn-ghost card-action" onclick="window.location.href='property.html?id=${property.id}'">
          View property
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </article>
  `;
}

function renderMarketplace() {
  const grid = document.getElementById("marketplace-property-grid");
  if (!grid) return;

  const query = (document.getElementById("market-query")?.value || "").trim();
  const type = document.getElementById("marketplace-property-type")?.value || "All types";
  const barangay = document.getElementById("marketplace-barangay")?.value || "All barangays";
  const sort = document.getElementById("marketplace-sort")?.value || "Recommended";
  const minPrice = (document.getElementById("market-min-price")?.value || "").trim();
  const maxPrice = (document.getElementById("market-max-price")?.value || "").trim();

  const showSearchResults =
    hasSearchedMarketplace ||
    Boolean(query) ||
    type !== "All types" ||
    barangay !== "All barangays" ||
    Boolean(minPrice) ||
    Boolean(maxPrice);

  let filtered = ACTIVE_PROPERTIES.filter((prop) => {
    const haystack = `${prop.title} ${prop.barangay} ${prop.type} ${prop.description}`.toLowerCase();
    return (
      haystack.includes(query.toLowerCase()) &&
      (type === "All types" || prop.type === type) &&
      (barangay === "All barangays" || prop.barangay === barangay) &&
      (!minPrice || prop.price >= Number(minPrice)) &&
      (!maxPrice || prop.price <= Number(maxPrice))
    );
  });

  filtered.sort((a, b) =>
    sort === "Price: Low to High"
      ? a.price - b.price
      : sort === "Price: High to Low"
        ? b.price - a.price
        : sort === "Newest"
          ? b.id - a.id
          : Number(Boolean(b.promoted)) - Number(Boolean(a.promoted))
  );

  const promotedSection = document.getElementById("market-promoted-section");
  const eyebrowEl = document.getElementById("market-grid-eyebrow");
  const headingEl = document.getElementById("market-grid-heading");

  if (showSearchResults) {
    if (promotedSection) promotedSection.style.display = "none";
    if (eyebrowEl) eyebrowEl.textContent = "Search Results";
    if (headingEl) headingEl.textContent = "Matching properties";
  } else {
    if (promotedSection) promotedSection.style.display = "block";
    if (eyebrowEl) eyebrowEl.textContent = "All Listings";
    if (headingEl) headingEl.textContent = "All land for sale";
  }

  const itemsToRender = showSearchResults
    ? filtered
    : filtered.filter((p) => !p.promoted);

  const savedIds = getSavedIds();

  if (itemsToRender.length > 0) {
    grid.className = "property-grid";
    grid.innerHTML = itemsToRender
      .map((prop) => renderPropertyCardHtml(prop, savedIds))
      .join("");
  } else {
    grid.className = "";
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No properties match your filters.</h3>
        <p>Try adjusting your search criteria.</p>
        <button class="btn btn-ghost" onclick="clearMarketplaceFilters()">Clear all filters</button>
      </div>
    `;
  }
}

/* --------------------------------------------------------------------------
   6. PROPERTY DETAIL PAGE (PropertyDetailView.tsx)
   -------------------------------------------------------------------------- */
function calculateTransferCosts(salePrice) {
  const safePrice = Math.max(Number(salePrice) || 0, 0);
  const reservationFee = Math.min(20000, safePrice);
  const capitalGainsTax = Math.round(safePrice * 0.06);
  const documentaryStampTax = Math.round(safePrice * 0.015);
  const localTransferTax = Math.round(safePrice * 0.0075);
  const registrationFee = Math.round(safePrice * 0.005);
  const agencyEscrowFee = Math.round(safePrice * 0.025);
  const buyerClosingCosts = documentaryStampTax + localTransferTax + registrationFee;
  const sellerNetProceeds = Math.max(safePrice - (capitalGainsTax + agencyEscrowFee), 0);

  return {
    reservationFee,
    buyerClosingCosts,
    agencyEscrowFee,
    sellerNetProceeds,
  };
}

function openInquiryModal() {
  const modal = document.getElementById("inquiry-modal");
  if (modal) modal.style.display = "grid";
}

function closeInquiryModal() {
  const modal = document.getElementById("inquiry-modal");
  if (modal) modal.style.display = "none";
}

function submitInquiryModal(event) {
  event.preventDefault();
  closeInquiryModal();
  showToast("Inquiry sent to the property seller.");
}

function renderPropertyDetailPage() {
  const mount = document.getElementById("property-detail-mount");
  if (!mount) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = Number(params.get("id") || 1);
  const property =
    ACTIVE_PROPERTIES.find((p) => p.id === requestedId) || ACTIVE_PROPERTIES[0];

  const savedIds = getSavedIds();
  const isSaved = savedIds.includes(property.id);
  const costs = calculateTransferCosts(property.price);
  const pricePerSqm =
    property.area > 0 ? Math.round(property.price / property.area) : 0;

  mount.innerHTML = `
    <div class="detail-view page">
      <div class="container">
        <button class="back-button" onclick="window.location.href='marketplace.html'">
          ← Back to marketplace
        </button>
        <div class="detail-grid">
          <div class="detail-gallery">
            <div
              class="detail-image"
              style="background-image: url('${property.image}'); background-position: center;"
            ></div>
            <div class="detail-location">
              <div class="eyebrow">Location reference</div>
              <strong>${property.barangay}, ${property.city}</strong>
              <p>Coordinates: ${property.latitude.toFixed(4)}, ${property.longitude.toFixed(4)}</p>
              <small>Coordinates and boundaries are approximate and do not replace an official survey.</small>
            </div>
          </div>

          <div class="detail-copy">
            <div class="badge-row">
              <span class="badge badge-green">Open for Offers</span>
              ${property.promoted ? '<span class="badge badge-gray">Promoted</span>' : ""}
            </div>
            <h1 class="detail-title">${property.title}</h1>
            <div class="property-location">📍 ${property.barangay}, ${property.city}</div>
            <div class="muted" style="margin-top: 6px; font-size: .82rem;">
              ${property.province} · ${property.generalAddress}
            </div>
            <div class="detail-price">${formatMoney(property.price)}</div>
            <div class="muted" style="margin-top: 4px;">
              ₱${pricePerSqm.toLocaleString()}/sqm · Listed by ${property.seller}
            </div>

            <div class="detail-specs">
              <div class="spec">
                <span>Land area</span>
                <strong>${property.area.toLocaleString()} sqm</strong>
              </div>
              <div class="spec">
                <span>Property type</span>
                <strong>${property.type}</strong>
              </div>
              <div class="spec">
                <span>Road access</span>
                <strong>${ROAD_ACCESS_LABEL[property.roadAccess]}</strong>
              </div>
              <div class="spec">
                <span>Listing status</span>
                <strong>Open for Offers</strong>
              </div>
            </div>

            <p>${property.description}</p>

            <div style="display: flex; gap: 9px; margin-top: 24px; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="window.location.href='login.html'">
                Request Booking
              </button>
              <button class="btn btn-ghost" onclick="openInquiryModal()">
                💬 Contact Seller
              </button>
              <button class="btn btn-ghost" onclick="toggleSaveProperty(${property.id}, this)">
                ${isSaved ? "★ Saved" : "☆ Save"}
              </button>
            </div>

            <div class="verification-box" style="margin-top: 18px;">
              <h3>Estimated Transfer &amp; Escrow Breakdown</h3>
              <div class="detail-specs" style="margin-top: 10px;">
                <div class="spec">
                  <span>Reservation deposit</span>
                  <strong>${formatMoney(costs.reservationFee)}</strong>
                </div>
                <div class="spec">
                  <span>Est. Buyer closing (DST + LGU + RD)</span>
                  <strong>${formatMoney(costs.buyerClosingCosts)}</strong>
                </div>
                <div class="spec">
                  <span>Agency escrow fee (2.5%)</span>
                  <strong>${formatMoney(costs.agencyEscrowFee)}</strong>
                </div>
                <div class="spec">
                  <span>Est. Seller net (after 6% CGT)</span>
                  <strong>${formatMoney(costs.sellerNetProceeds)}</strong>
                </div>
              </div>
            </div>

            <div class="verification-box">
              <h3>Listing Information</h3>
              <ul>
                <li>Property details are provided by the seller and have not been independently verified by YuTara.</li>
                <li>Buyers should conduct appropriate legal and government due diligence before completing a purchase.</li>
                <li>YuTara does not establish legal ownership at the listing stage.</li>
              </ul>
              <p style="font-size: .74rem; margin-bottom: 0; margin-top: 8px;">
                The affiliated agency coordinates the ownership transfer process once a booking is approved by the seller.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   7. LOGIN, FORGOT PASSWORD, REGISTER & CONTACT FORMS
   -------------------------------------------------------------------------- */
function handleLoginSubmit(event) {
  event.preventDefault();
  const email = (document.getElementById("login-email")?.value || "").trim();
  const password = document.getElementById("login-password")?.value || "";
  const errEl = document.getElementById("login-error");

  if (!email) {
    errEl.textContent = "Email is required.";
    errEl.style.display = "block";
    return;
  }
  if (!email.includes("@")) {
    errEl.textContent = "Enter a valid email address.";
    errEl.style.display = "block";
    return;
  }
  if (!password) {
    errEl.textContent = "Password is required.";
    errEl.style.display = "block";
    return;
  }

  window.location.href = "dashboard.html";
}

function openForgotModal() {
  const email = document.getElementById("login-email")?.value || "";
  const forgotInput = document.getElementById("forgot-email");
  if (forgotInput) forgotInput.value = email;
  const modal = document.getElementById("forgot-modal");
  if (modal) modal.style.display = "grid";
}

function closeForgotModal() {
  const modal = document.getElementById("forgot-modal");
  if (modal) modal.style.display = "none";
}

function handleForgotSubmit(event) {
  event.preventDefault();
  const email = (document.getElementById("forgot-email")?.value || "").trim();
  const msgEl = document.getElementById("forgot-message");
  if (!email || !email.includes("@")) {
    msgEl.textContent = "Enter a valid email address.";
    msgEl.style.background = "#fef2f2";
    msgEl.style.color = "var(--danger)";
    msgEl.style.display = "block";
    return;
  }
  msgEl.textContent =
    "If an account exists for this email, a password reset link has been sent.";
  msgEl.style.background = "var(--background-green)";
  msgEl.style.color = "var(--deep-green)";
  msgEl.style.display = "block";
}

/* --- 4-Step Register Stepper --- */
let regCurrentStep = 1;
let regUploadedIds = { 1: "", 2: "" };
let regFaceVerified = false;

function handleRegIdUpload(slot, inputEl) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  regUploadedIds[slot] = file.name;
  const nameSpan = document.getElementById(`reg-file-${slot}-name`);
  if (nameSpan) {
    nameSpan.textContent = file.name;
    nameSpan.style.display = "inline";
  }
  const count = (regUploadedIds[1] ? 1 : 0) + (regUploadedIds[2] ? 1 : 0);
  const countLabel = document.getElementById("reg-id-count-label");
  if (countLabel) {
    countLabel.textContent = `Valid ID upload (${count} of 2 uploaded)`;
  }
}

function runSimulatedFaceScan() {
  const titleEl = document.getElementById("face-scan-title");
  const btnEl = document.getElementById("face-scan-btn");
  const badgeEl = document.getElementById("face-verified-badge");

  if (titleEl) titleEl.textContent = "Scanning...";
  if (btnEl) btnEl.textContent = "Scanning...";

  setTimeout(() => {
    regFaceVerified = true;
    if (titleEl) titleEl.textContent = "Verification complete";
    if (btnEl) btnEl.style.display = "none";
    if (badgeEl) badgeEl.style.display = "inline-flex";
  }, 900);
}

function goToRegStep(stepNum) {
  regCurrentStep = stepNum;
  const errEl = document.getElementById("reg-error");
  if (errEl) errEl.style.display = "none";

  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById(`reg-step-${i}`);
    const btn = document.getElementById(`step-btn-${i}`);
    if (panel) panel.style.display = i === stepNum ? (i === 1 ? "grid" : "block") : "none";
    if (btn) {
      btn.className = i === stepNum ? "active" : i < stepNum ? "complete" : "disabled";
      btn.disabled = i > stepNum;
    }
  }

  if (stepNum === 4) {
    document.getElementById("rev-name").textContent =
      document.getElementById("reg-fullname")?.value || "—";
    document.getElementById("rev-mobile").textContent =
      document.getElementById("reg-mobile")?.value || "—";
    document.getElementById("rev-email").textContent =
      document.getElementById("reg-email")?.value || "—";
  }

  document.getElementById("reg-back-btn").style.display =
    stepNum > 1 ? "inline-flex" : "none";
  document.getElementById("reg-next-btn").style.display =
    stepNum < 4 ? "inline-flex" : "none";
  document.getElementById("reg-submit-btn").style.display =
    stepNum === 4 ? "inline-flex" : "none";
}

function nextRegStep() {
  const errEl = document.getElementById("reg-error");
  if (regCurrentStep === 1) {
    const name = (document.getElementById("reg-fullname")?.value || "").trim();
    const mobile = (document.getElementById("reg-mobile")?.value || "").trim();
    const email = (document.getElementById("reg-email")?.value || "").trim();
    const pass = document.getElementById("reg-password")?.value || "";
    const confirm = document.getElementById("reg-confirm")?.value || "";

    if (!name || !mobile || !email || !pass) {
      errEl.textContent = "Please complete all required fields before continuing.";
      errEl.style.display = "block";
      return;
    }
    if (pass.length < 6) {
      errEl.textContent = "Password must be at least 6 characters.";
      errEl.style.display = "block";
      return;
    }
    if (pass !== confirm) {
      errEl.textContent = "Passwords do not match.";
      errEl.style.display = "block";
      return;
    }
  } else if (regCurrentStep === 2) {
    if (!regUploadedIds[1] && !regUploadedIds[2]) {
      errEl.textContent = "Please upload at least one valid ID before continuing.";
      errEl.style.display = "block";
      return;
    }
  } else if (regCurrentStep === 3) {
    if (!regFaceVerified) {
      errEl.textContent = "Please complete the face scan before continuing.";
      errEl.style.display = "block";
      return;
    }
  }
  goToRegStep(regCurrentStep + 1);
}

function prevRegStep() {
  if (regCurrentStep > 1) {
    goToRegStep(regCurrentStep - 1);
  }
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const consent = document.getElementById("reg-consent")?.checked;
  const errEl = document.getElementById("reg-error");
  if (!consent) {
    errEl.textContent = "Please accept the terms and privacy notice.";
    errEl.style.display = "block";
    return;
  }
  document.getElementById("registration-form").style.display = "none";
  document.getElementById("reg-submitted-box").style.display = "block";
}

function handleContactForm(event) {
  event.preventDefault();
  document.getElementById("contact-fields").style.display = "none";
  document.getElementById("contact-success").style.display = "block";
}

/* --------------------------------------------------------------------------
   8. INITIALIZE ON PAGE LOAD
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  syncHeartIcons();

  // If on marketplace.html, apply any query params from home search and render
  if (document.getElementById("marketplace-property-grid")) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
      document.getElementById("market-query").value = params.get("q");
      hasSearchedMarketplace = true;
    }
    if (params.get("type")) {
      document.getElementById("marketplace-property-type").value = params.get("type");
      hasSearchedMarketplace = true;
    }
    if (params.get("min")) {
      document.getElementById("market-min-price").value = params.get("min");
      hasSearchedMarketplace = true;
    }
    if (params.get("max")) {
      document.getElementById("market-max-price").value = params.get("max");
      hasSearchedMarketplace = true;
    }

    renderPromotedCarousel();
    renderMarketplace();

    // Auto-advance promoted carousel every 5.5s
    setInterval(() => {
      movePromotedCarousel(1);
    }, 5500);
  }

  // If on property.html, render the selected property detail
  if (document.getElementById("property-detail-mount")) {
    renderPropertyDetailPage();
  }
});
