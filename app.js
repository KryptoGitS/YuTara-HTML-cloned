/* ==========================================================================
   YUTARA MARKETPLACE — EXACT SANDBOX DATA, ACCOUNTS & INTERACTIONS
   File: app.js
   Description: Replicates https://yutarasandbox.vercel.app/ with full
                Account Creation (Admin, User, Agency), Login Authentication,
                Admin Approval Queue, PromotedCarousel, and Marketplace Filters.
   ========================================================================== */

/* --------------------------------------------------------------------------
   0. SAFE HTML ESCAPE HELPER
   -------------------------------------------------------------------------- */
function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* --------------------------------------------------------------------------
   1. ACCOUNT & AUTHENTICATION STORE (matching src/lib/demo-auth.ts)
   Built-in Demo Accounts + User-Created Accounts saved in localStorage
   -------------------------------------------------------------------------- */
const SESSION_KEY = "yutara-session";
const ACCOUNTS_KEY = "yutara-registered-accounts";
const LISTING_STATUS_KEY = "yutara-listing-statuses";

const DEMO_ACCOUNTS = {
  "admin@yutara.com": {
    email: "admin@yutara.com",
    password: "12345",
    role: "ADMIN",
    name: "YuTara Admin 1",
    status: "APPROVED",
    builtIn: true,
  },
  "buyer@yutara.com": {
    email: "buyer@yutara.com",
    password: "12345",
    role: "USER",
    name: "Juan Buyer",
    status: "APPROVED",
    builtIn: true,
  },
  "seller@yutara.com": {
    email: "seller@yutara.com",
    password: "12345",
    role: "USER",
    name: "Maria Seller",
    status: "APPROVED",
    builtIn: true,
  },
  "agency.admin@yutara.com": {
    email: "agency.admin@yutara.com",
    password: "12345",
    role: "AGENCY_ADMIN",
    name: "Agency Admin",
    status: "APPROVED",
    builtIn: true,
  },
  "agency.officer@yutara.com": {
    email: "agency.officer@yutara.com",
    password: "12345",
    role: "AGENCY_OFFICER",
    name: "Agency Officer",
    status: "APPROVED",
    builtIn: true,
  },
  "agency.processor@yutara.com": {
    email: "agency.processor@yutara.com",
    password: "12345",
    role: "AGENCY_PROCESSOR",
    name: "Agency Processor",
    status: "APPROVED",
    builtIn: true,
  },
};

function readCustomAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCustomAccounts(accounts) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

function isEmailAlreadyTaken(email) {
  const normalized = email.trim().toLowerCase();
  if (DEMO_ACCOUNTS[normalized]) return true;
  return readCustomAccounts().some((acc) => acc.email === normalized);
}

function createRegisteredAccount({ name, email, password, role, mobile, id1, id2, instantApprove }) {
  const normalized = email.trim().toLowerCase();
  const newAccount = {
    id: "ACC-" + Date.now(),
    name: name.trim(),
    email: normalized,
    password: password,
    role: role || "USER",
    mobile: (mobile || "").trim(),
    id1: id1 || "sample-valid-id.png",
    id2: id2 || "",
    status: instantApprove ? "APPROVED" : "PENDING",
    createdAt: new Date().toISOString(),
    builtIn: false,
  };
  const existing = readCustomAccounts();
  writeCustomAccounts([newAccount, ...existing]);
  return newAccount;
}

function authenticateAccount(email, password) {
  const normalized = email.trim().toLowerCase();

  // 1. Check built-in demo accounts
  const demo = DEMO_ACCOUNTS[normalized];
  if (demo) {
    if (demo.password === password) {
      return { ok: true, user: { email: demo.email, name: demo.name, role: demo.role } };
    }
    return { ok: false, error: "Invalid email or password." };
  }

  // 2. Check user-created custom accounts in localStorage
  const custom = readCustomAccounts().find((acc) => acc.email === normalized);
  if (!custom) {
    return { ok: false, error: "Invalid email or password. Need an account? Click Create account below." };
  }
  if (custom.status === "PENDING") {
    return {
      ok: false,
      error: "Your account is still pending administrator approval. Sign in as Admin (admin@yutara.com / 12345) to approve it.",
    };
  }
  if (custom.status === "DENIED") {
    return {
      ok: false,
      error: "Your account application was denied. Please contact YuTara support.",
    };
  }
  if (custom.password !== password) {
    return { ok: false, error: "Invalid email or password." };
  }

  return {
    ok: true,
    user: { email: custom.email, name: custom.name, role: custom.role },
  };
}

function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email && parsed.role) return parsed;
    return null;
  } catch {
    return null;
  }
}

function setStoredSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {}
}

function clearStoredSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

function logoutSession() {
  clearStoredSession();
  window.location.href = "index.html";
}

function getInitials(name) {
  const parts = String(name || "YU").trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return String(name || "YU").slice(0, 2).toUpperCase();
}

function getRoleDisplayLabel(role) {
  if (role === "ADMIN") return "Admin Account";
  if (role && role.startsWith("AGENCY")) return "Agency Account";
  return "User Account";
}

/* --------------------------------------------------------------------------
   2. SYNC SESSION INTO HEADER NAV ON ALL PUBLIC PAGES
   -------------------------------------------------------------------------- */
function syncHeaderSessionUI() {
  const session = getStoredSession();
  if (!session) return;

  const isAdmin = session.role === "ADMIN";
  const workspaceUrl = isAdmin ? "admin.html" : "dashboard.html";
  const workspaceText = isAdmin ? "Admin Workspace" : "My YuTara";

  // Home & Marketplace transparent nav (.header-auth-links)
  document.querySelectorAll(".header-auth-links").forEach((el) => {
    el.innerHTML = `
      <a class="header-link home-login-button" href="${workspaceUrl}">${workspaceText}</a>
      <button type="button" class="header-link home-register-button" onclick="logoutSession()">Log out</button>
    `;
  });

  // Subpage AppNav (.nav-auth)
  document.querySelectorAll(".nav-auth").forEach((el) => {
    el.innerHTML = `
      <a class="button button-ghost" href="${workspaceUrl}">${workspaceText} (${escapeHtml(session.name)})</a>
      <button type="button" class="button button-primary" onclick="logoutSession()">Log out</button>
    `;
  });

  // Mobile Nav
  const mobileNav = document.getElementById("mobile-nav");
  if (mobileNav) {
    mobileNav.innerHTML = `
      <a href="index.html">Home</a>
      <a href="marketplace.html">Marketplace</a>
      <a href="about.html">About Us</a>
      <a href="services.html">Services Offered</a>
      <a href="contact.html">Contact Us</a>
      <a href="${workspaceUrl}">${workspaceText}</a>
      <button type="button" onclick="logoutSession()">Log out (${escapeHtml(session.name)})</button>
    `;
  }
}

/* --------------------------------------------------------------------------
   3. EXACT MARKETPLACE PROPERTIES (from src/lib/marketplace.ts)
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

function readListingStatusOverrides() {
  try {
    const raw = localStorage.getItem(LISTING_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getAllPropertiesWithStatus() {
  const overrides = readListingStatusOverrides();
  return ACTIVE_PROPERTIES.map((prop) => ({
    ...prop,
    listingStatus: overrides[prop.id] || prop.listingStatus,
  }));
}

function setListingStatusOverride(id, status) {
  const overrides = readListingStatusOverrides();
  overrides[id] = status;
  try {
    localStorage.setItem(LISTING_STATUS_KEY, JSON.stringify(overrides));
  } catch {}
}

/* --------------------------------------------------------------------------
   4. FORMATTING & SAVED PROPERTIES HELPERS
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
  }, 2600);
}

function toggleSaveProperty(id) {
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
   5. NAVBAR SCROLL & MOBILE MENU
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
   6. HOME PAGE SEARCH REDIRECT
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
   7. MARKETPLACE VIEW & PROMOTED CAROUSEL
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
  const promoted = getAllPropertiesWithStatus().filter(
    (p) => p.promoted && p.listingStatus === "OPEN_FOR_OFFERS"
  );
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

  const promoted = getAllPropertiesWithStatus().filter(
    (p) => p.promoted && p.listingStatus === "OPEN_FOR_OFFERS"
  );
  if (!promoted.length) {
    mount.innerHTML = `<div class="featured-empty">No promoted properties currently open.</div>`;
    return;
  }

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
        ${idx === carouselIndex % promoted.length ? 'aria-current="true" class="active"' : ""}
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
          onclick="toggleSaveProperty(${prop.id})"
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
          <p class="featured-location">${prop.barangay}, ${prop.city}, ${prop.province}</p>
          <div class="featured-price">${formatMoney(prop.price)}</div>
          <div class="featured-meta">${prop.area.toLocaleString()} sqm <span>•</span> ${prop.type}</div>
          <div class="featured-actions">
            <button class="button button-primary" onclick="window.location.href='property.html?id=${prop.id}'">
              View property →
            </button>
          </div>
        </div>
      </div>

      <article class="featured-mobile-card">
        <div class="featured-mobile-image" style="position:relative;">
          <img class="featured-image" src="${prop.image}" alt="${prop.title}" style="width:100%;height:100%;object-fit:cover;" />
        </div>
        <div class="featured-mobile-content">
          <div class="featured-badges"><span class="badge badge-promoted">Promoted</span></div>
          <h3>${prop.title}</h3>
          <p class="featured-mobile-description">${prop.description}</p>
          <p class="featured-location">${prop.barangay}, ${prop.city}</p>
          <div class="featured-mobile-price">${formatMoney(prop.price)}</div>
          <div class="featured-meta">${prop.area.toLocaleString()} sqm <span>•</span> ${prop.type}</div>
          <div class="featured-mobile-actions">
            <button class="button button-primary" onclick="window.location.href='property.html?id=${prop.id}'">View property →</button>
          </div>
        </div>
      </article>

      <button class="featured-arrow featured-arrow-left" aria-label="Previous promoted property" onclick="movePromotedCarousel(-1)">‹</button>
      <button class="featured-arrow featured-arrow-right" aria-label="Next promoted property" onclick="movePromotedCarousel(1)">›</button>
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
          onclick="toggleSaveProperty(${property.id})"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart">
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
          </svg>
        </button>
      </div>
      <div class="property-body">
        <div class="property-type">${property.type} lot</div>
        <h3 class="property-title">${property.title}</h3>
        <div class="property-location">${property.barangay}, ${property.city}</div>
        <div class="property-meta" style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;flex-direction:column;min-width:0;">
            <span class="price">${formatMoney(property.price)}</span>
            <span class="price-per-sqm" style="font-size:0.74rem;color:#666;">₱${pricePerSqm.toLocaleString()}/sqm</span>
          </div>
          <span class="area" style="white-space:nowrap;margin-left:auto;">${property.area.toLocaleString()} sqm</span>
        </div>
        <div class="property-road-access">
          <span>${ROAD_ACCESS_LABEL[property.roadAccess]}</span>
        </div>
        <button class="btn btn-ghost card-action" onclick="window.location.href='property.html?id=${property.id}'">
          View property →
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

  let filtered = getAllPropertiesWithStatus()
    .filter((p) => p.listingStatus === "OPEN_FOR_OFFERS")
    .filter((prop) => {
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
    grid.innerHTML = itemsToRender.map((prop) => renderPropertyCardHtml(prop, savedIds)).join("");
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
   8. PROPERTY DETAIL PAGE
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
  return { reservationFee, buyerClosingCosts, agencyEscrowFee, sellerNetProceeds };
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
  const all = getAllPropertiesWithStatus();
  const property = all.find((p) => p.id === requestedId) || all[0];

  const savedIds = getSavedIds();
  const isSaved = savedIds.includes(property.id);
  const costs = calculateTransferCosts(property.price);
  const pricePerSqm = property.area > 0 ? Math.round(property.price / property.area) : 0;
  const session = getStoredSession();

  mount.innerHTML = `
    <div class="detail-view page">
      <div class="container">
        <button class="back-button" onclick="window.location.href='marketplace.html'">
          ← Back to marketplace
        </button>
        <div class="detail-grid">
          <div class="detail-gallery">
            <div class="detail-image" style="background-image: url('${property.image}'); background-position: center;"></div>
            <div class="detail-location">
              <div class="eyebrow">Location reference</div>
              <strong>${property.barangay}, ${property.city}</strong>
              <p>Coordinates: ${property.latitude.toFixed(4)}, ${property.longitude.toFixed(4)}</p>
              <small>Coordinates and boundaries are approximate and do not replace an official survey.</small>
            </div>
          </div>

          <div class="detail-copy">
            <div class="badge-row">
              <span class="badge badge-green">${property.listingStatus.replaceAll("_", " ")}</span>
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
              <div class="spec"><span>Land area</span><strong>${property.area.toLocaleString()} sqm</strong></div>
              <div class="spec"><span>Property type</span><strong>${property.type}</strong></div>
              <div class="spec"><span>Road access</span><strong>${ROAD_ACCESS_LABEL[property.roadAccess]}</strong></div>
              <div class="spec"><span>Listing status</span><strong>${property.listingStatus.replaceAll("_", " ")}</strong></div>
            </div>

            <p>${property.description}</p>

            <div style="display: flex; gap: 9px; margin-top: 24px; flex-wrap: wrap;">
              <button class="btn btn-primary" onclick="${session ? "showToast('Booking request sent to seller!')" : "window.location.href='login.html'"}">
                Request Booking
              </button>
              <button class="btn btn-ghost" onclick="openInquiryModal()">💬 Contact Seller</button>
              <button class="btn btn-ghost" onclick="toggleSaveProperty(${property.id})">
                ${isSaved ? "★ Saved" : "☆ Save"}
              </button>
            </div>

            <div class="verification-box" style="margin-top: 18px;">
              <h3>Estimated Transfer &amp; Escrow Breakdown</h3>
              <div class="detail-specs" style="margin-top: 10px;">
                <div class="spec"><span>Reservation deposit</span><strong>${formatMoney(costs.reservationFee)}</strong></div>
                <div class="spec"><span>Est. Buyer closing (DST + LGU + RD)</span><strong>${formatMoney(costs.buyerClosingCosts)}</strong></div>
                <div class="spec"><span>Agency escrow fee (2.5%)</span><strong>${formatMoney(costs.agencyEscrowFee)}</strong></div>
                <div class="spec"><span>Est. Seller net (after 6% CGT)</span><strong>${formatMoney(costs.sellerNetProceeds)}</strong></div>
              </div>
            </div>

            <div class="verification-box">
              <h3>Listing Information</h3>
              <ul>
                <li>Property details are provided by the seller and have not been independently verified by YuTara.</li>
                <li>Buyers should conduct appropriate legal and government due diligence before completing a purchase.</li>
                <li>YuTara does not establish legal ownership at the listing stage.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   9. LOGIN PAGE HANDLERS (login.html)
   -------------------------------------------------------------------------- */
function quickFillLogin(email, password, label) {
  const emailEl = document.getElementById("login-email");
  const passEl = document.getElementById("login-password");
  const errEl = document.getElementById("login-error");
  if (emailEl) emailEl.value = email;
  if (passEl) passEl.value = password;
  if (errEl) errEl.style.display = "none";
  showToast(`Filled ${label} credentials`);
}

function renderCustomAccountsOnLogin() {
  const mount = document.getElementById("custom-accounts-mount");
  if (!mount) return;

  const custom = readCustomAccounts();
  if (custom.length === 0) {
    mount.innerHTML = "";
    return;
  }

  const buttonsHtml = custom
    .map((acc) => {
      const icon = acc.role === "ADMIN" ? "🛡️" : acc.role.startsWith("AGENCY") ? "🏛️" : "👤";
      const badge =
        acc.status === "APPROVED"
          ? ""
          : ` [${acc.status}]`;
      return `
        <button
          type="button"
          class="btn btn-ghost btn-sm"
          onclick="quickFillLogin('${escapeHtml(acc.email)}', '${escapeHtml(acc.password)}', '${escapeHtml(acc.name)}')"
        >
          ${icon} ${escapeHtml(acc.name)} (${escapeHtml(acc.role)})${badge}
        </button>
      `;
    })
    .join("");

  mount.innerHTML = `
    <div style="border-top: 1px solid var(--green-border); padding-top: 10px;">
      <div style="font-size: 0.74rem; font-weight: 700; color: var(--heading-color); margin-bottom: 6px;">
        Your Created Accounts (${custom.length}):
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">${buttonsHtml}</div>
    </div>
  `;
}

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

  const result = authenticateAccount(email, password);
  if (!result.ok) {
    errEl.textContent = result.error;
    errEl.style.display = "block";
    return;
  }

  setStoredSession(result.user);
  window.location.href = result.user.role === "ADMIN" ? "admin.html" : "dashboard.html";
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
  msgEl.textContent = "If an account exists for this email, a password reset link has been sent.";
  msgEl.style.background = "var(--background-green)";
  msgEl.style.color = "var(--deep-green)";
  msgEl.style.display = "block";
}

/* --------------------------------------------------------------------------
   10. ACCOUNT CREATION / 4-STEP REGISTRATION (register.html)
   -------------------------------------------------------------------------- */
let regCurrentStep = 1;
let regUploadedIds = { 1: "", 2: "" };
let regFaceVerified = false;

function handleRegIdUpload(slot, inputEl) {
  const file = inputEl.files && inputEl.files[0];
  if (!file) return;
  regUploadedIds[slot] = file.name;
  updateRegIdUI();
}

function attachSampleIdForTesting() {
  regUploadedIds[1] = "philippine-national-id-sample.png";
  updateRegIdUI();
  showToast("Sample ID attached for sandbox testing!");
}

function updateRegIdUI() {
  [1, 2].forEach((slot) => {
    const nameSpan = document.getElementById(`reg-file-${slot}-name`);
    if (nameSpan && regUploadedIds[slot]) {
      nameSpan.textContent = regUploadedIds[slot];
      nameSpan.style.display = "inline";
    }
  });
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
  }, 700);
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
    const role = document.getElementById("reg-role")?.value || "USER";
    const instant = document.getElementById("reg-instant-approve")?.checked ?? true;
    document.getElementById("rev-role").textContent = `YuTara ${role}`;
    document.getElementById("rev-access").textContent =
      role === "ADMIN"
        ? "Manage listings & approve user accounts"
        : role === "AGENCY_OFFICER"
          ? "Coordinate agency land transfers"
          : "Buy and sell land";
    document.getElementById("rev-activation").textContent = instant
      ? "Instant Activate (Ready to log in immediately)"
      : "Requires Admin Approval in admin.html";
    document.getElementById("rev-name").textContent =
      document.getElementById("reg-fullname")?.value || "—";
    document.getElementById("rev-mobile").textContent =
      document.getElementById("reg-mobile")?.value || "—";
    document.getElementById("rev-email").textContent =
      document.getElementById("reg-email")?.value || "—";
  }

  document.getElementById("reg-back-btn").style.display = stepNum > 1 ? "inline-flex" : "none";
  document.getElementById("reg-next-btn").style.display = stepNum < 4 ? "inline-flex" : "none";
  document.getElementById("reg-submit-btn").style.display = stepNum === 4 ? "inline-flex" : "none";
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
    if (!email.includes("@")) {
      errEl.textContent = "Please enter a valid email address.";
      errEl.style.display = "block";
      return;
    }
    if (isEmailAlreadyTaken(email)) {
      errEl.textContent = "This email is already registered. Use a different email or log in.";
      errEl.style.display = "block";
      return;
    }
    if (pass.length < 5) {
      errEl.textContent = "Password must be at least 5 characters.";
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
      errEl.textContent = "Please upload an ID or click 'Use Sample ID (Quick Test)' before continuing.";
      errEl.style.display = "block";
      return;
    }
  } else if (regCurrentStep === 3) {
    if (!regFaceVerified) {
      errEl.textContent = "Please complete the simulated face scan before continuing.";
      errEl.style.display = "block";
      return;
    }
  }
  goToRegStep(regCurrentStep + 1);
}

function prevRegStep() {
  if (regCurrentStep > 1) goToRegStep(regCurrentStep - 1);
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

  const name = document.getElementById("reg-fullname").value;
  const mobile = document.getElementById("reg-mobile").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;
  const instantApprove = document.getElementById("reg-instant-approve").checked;

  const created = createRegisteredAccount({
    name,
    email,
    password,
    role,
    mobile,
    id1: regUploadedIds[1],
    id2: regUploadedIds[2],
    instantApprove,
  });

  document.getElementById("registration-form").style.display = "none";
  const box = document.getElementById("reg-submitted-box");
  box.style.display = "block";

  if (created.status === "APPROVED") {
    document.getElementById("reg-submitted-title").textContent = `${getRoleDisplayLabel(created.role)} Created & Active!`;
    document.getElementById("reg-submitted-msg").textContent =
      `Account for ${created.name} (${created.email}) is now active with role ${created.role}. You can sign in immediately on the login page.`;
    document.getElementById("reg-submitted-sub").textContent =
      `Tip: Your newly created account also appears in the Quick-Fill Sandbox Accounts box on login.html.`;
  } else {
    document.getElementById("reg-submitted-title").textContent = "Application Submitted (Pending Approval)";
    document.getElementById("reg-submitted-msg").textContent =
      `Registration for ${created.name} (${created.email}) has been added to the Admin Approval Queue.`;
    document.getElementById("reg-submitted-sub").textContent =
      `To approve it: log in as Admin (admin@yutara.com / 12345), open Admin Workspace, and click Approve.`;
  }
}

/* --------------------------------------------------------------------------
   11. ADMIN WORKSPACE (admin.html)
   -------------------------------------------------------------------------- */
function handleAdminQuickCreateAccount(event) {
  event.preventDefault();
  const role = document.getElementById("admin-new-role").value;
  const name = document.getElementById("admin-new-name").value.trim();
  const email = document.getElementById("admin-new-email").value.trim();
  const password = document.getElementById("admin-new-pass").value;

  if (!name || !email || password.length < 5) {
    showToast("Enter name, valid email, and password (min 5 chars).");
    return;
  }
  if (isEmailAlreadyTaken(email)) {
    showToast("An account with that email already exists.");
    return;
  }

  createRegisteredAccount({
    name,
    email,
    password,
    role,
    instantApprove: true,
  });

  event.target.reset();
  renderAdminWorkspace();
  showToast(`Created ${role} account for ${name}!`);
}

function updateCustomAccountStatus(accountId, newStatus) {
  const accounts = readCustomAccounts().map((acc) =>
    acc.id === accountId ? { ...acc, status: newStatus } : acc
  );
  writeCustomAccounts(accounts);
  renderAdminWorkspace();
  showToast(`Account status updated to ${newStatus}`);
}

function deleteCustomAccount(accountId) {
  const accounts = readCustomAccounts().filter((acc) => acc.id !== accountId);
  writeCustomAccounts(accounts);
  renderAdminWorkspace();
  showToast("Custom account removed.");
}

function adminChangeListingStatus(propertyId, status) {
  setListingStatusOverride(propertyId, status);
  renderAdminWorkspace();
  showToast(`Listing #${propertyId} updated to ${status.replaceAll("_", " ")}`);
}

function resetSandboxData() {
  if (!window.confirm("Reset all custom accounts, saved properties, and listing status overrides?")) return;
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(LISTING_STATUS_KEY);
  localStorage.removeItem("yutara-saved");
  renderAdminWorkspace();
  showToast("Sandbox data reset.");
}

function renderAdminWorkspace() {
  const accountsTbody = document.getElementById("admin-accounts-tbody");
  const listingsTbody = document.getElementById("admin-listings-tbody");
  if (!accountsTbody || !listingsTbody) return;

  const session = getStoredSession();
  const guardNotice = document.getElementById("admin-guard-notice");
  const contentWrap = document.getElementById("admin-content-wrap");

  if (!session || session.role !== "ADMIN") {
    if (guardNotice) guardNotice.style.display = "block";
    if (contentWrap) contentWrap.style.display = "none";
    return;
  }

  if (guardNotice) guardNotice.style.display = "none";
  if (contentWrap) contentWrap.style.display = "block";

  document.getElementById("admin-profile-name").textContent = session.name;
  document.getElementById("admin-profile-role").textContent = session.email;
  document.getElementById("admin-avatar-initials").textContent = getInitials(session.name);

  const properties = getAllPropertiesWithStatus();
  const customAccounts = readCustomAccounts();
  const demoList = Object.values(DEMO_ACCOUNTS);
  const allAccounts = [...customAccounts, ...demoList];

  document.getElementById("admin-stat-total").textContent = String(properties.length);
  document.getElementById("admin-stat-open").textContent = String(
    properties.filter((p) => p.listingStatus === "OPEN_FOR_OFFERS").length
  );
  document.getElementById("admin-stat-accounts").textContent = String(allAccounts.length);
  document.getElementById("admin-stat-pending").textContent = String(
    customAccounts.filter((u) => u.status === "PENDING").length
  );

  // Render Accounts Table
  accountsTbody.innerHTML = allAccounts
    .map((acc) => {
      const statusClass =
        acc.status === "APPROVED"
          ? "verified"
          : acc.status === "DENIED"
            ? "correction"
            : "review";

      let actionsHtml = `<span class="muted" style="font-size: 0.78rem;">Built-in Demo</span>`;
      if (!acc.builtIn) {
        actionsHtml = `
          <div class="admin-actions" style="display:flex;gap:6px;flex-wrap:wrap;">
            ${
              acc.status !== "APPROVED"
                ? `<button class="button button-primary" onclick="updateCustomAccountStatus('${escapeHtml(acc.id)}', 'APPROVED')">Approve</button>`
                : ""
            }
            ${
              acc.status === "PENDING"
                ? `<button class="button button-ghost" onclick="updateCustomAccountStatus('${escapeHtml(acc.id)}', 'DENIED')">Deny</button>`
                : ""
            }
            <button class="button button-danger" onclick="deleteCustomAccount('${escapeHtml(acc.id)}')">Delete</button>
          </div>
        `;
      }

      return `
        <tr>
          <td><strong>${escapeHtml(acc.name)}</strong></td>
          <td><span class="muted">${escapeHtml(acc.email)}</span></td>
          <td><span class="badge ${acc.role === "ADMIN" ? "badge-amber" : "badge-green"}">${escapeHtml(acc.role)}</span></td>
          <td><span class="status ${statusClass}">${escapeHtml(acc.status)}</span></td>
          <td>${actionsHtml}</td>
        </tr>
      `;
    })
    .join("");

  // Render Land Listings Table
  listingsTbody.innerHTML = properties
    .map((item) => {
      const isOpen = item.listingStatus === "OPEN_FOR_OFFERS";
      return `
        <tr>
          <td>
            <strong>${escapeHtml(item.title)}</strong><br />
            <span class="muted">${escapeHtml(item.barangay)}, ${escapeHtml(item.city)}</span>
          </td>
          <td><strong>${escapeHtml(item.seller)}</strong></td>
          <td>${escapeHtml(item.type)}</td>
          <td><span class="status ${isOpen ? "verified" : "review"}">${escapeHtml(item.listingStatus.replaceAll("_", " "))}</span></td>
          <td>
            <div class="admin-actions" style="display:flex;gap:6px;flex-wrap:wrap;">
              ${
                isOpen
                  ? `<button class="button button-ghost" onclick="adminChangeListingStatus(${item.id}, 'CLOSED')">Close</button>
                     <button class="button button-danger" onclick="adminChangeListingStatus(${item.id}, 'SOLD')">Mark sold</button>`
                  : `<button class="button button-primary" onclick="adminChangeListingStatus(${item.id}, 'OPEN_FOR_OFFERS')">Reopen</button>`
              }
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

/* --------------------------------------------------------------------------
   12. USER DASHBOARD SYNC (dashboard.html)
   -------------------------------------------------------------------------- */
function renderUserDashboard() {
  const welcomeHeading = document.getElementById("dash-welcome-heading");
  if (!welcomeHeading) return;

  const session = getStoredSession();
  const promptEl = document.getElementById("dash-login-prompt");
  const adminLinkItem = document.getElementById("sidebar-admin-link-item");

  document.getElementById("dash-stat-saved").textContent = String(getSavedIds().length);

  if (!session) {
    if (promptEl) promptEl.style.display = "block";
    welcomeHeading.textContent = "Welcome to YuTara Workspace";
    return;
  }

  if (promptEl) promptEl.style.display = "none";
  welcomeHeading.textContent = `Welcome back, ${session.name}!`;
  document.getElementById("dash-profile-name").textContent = session.name;
  document.getElementById("dash-profile-role").textContent = session.email;
  document.getElementById("dash-avatar-initials").textContent = getInitials(session.name);
  document.getElementById("dash-stat-role").textContent = session.role;

  if (adminLinkItem && session.role === "ADMIN") {
    adminLinkItem.style.display = "block";
  }
}

/* --------------------------------------------------------------------------
   13. CONTACT FORM
   -------------------------------------------------------------------------- */
function handleContactForm(event) {
  event.preventDefault();
  document.getElementById("contact-fields").style.display = "none";
  document.getElementById("contact-success").style.display = "block";
}

/* --------------------------------------------------------------------------
   14. INITIALIZE ON PAGE LOAD
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  syncHeaderSessionUI();
  syncHeartIcons();
  renderCustomAccountsOnLogin();
  renderUserDashboard();
  renderAdminWorkspace();

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

    setInterval(() => {
      movePromotedCarousel(1);
    }, 5500);
  }

  if (document.getElementById("property-detail-mount")) {
    renderPropertyDetailPage();
  }
});
