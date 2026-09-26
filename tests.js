/* ==========================================================
   MediDent Clinic — Tests Reference List
   A short list of commonly prescribed tests, used to power
   autocomplete on the "Tests prescribed" field — same idea as
   the Medicine autocomplete in medicines.js. Admin can add more
   from the Admin tab.

   NOTE: "Tests prescribed" is a single free-text box where
   multiple tests are typed comma-separated (e.g. "HbA1c, Lipid
   profile"). Browser autocomplete (<datalist>) can only suggest
   replacing the *whole* box, not appending after a comma — so
   suggestions work best when prescribing one test, or picking
   the first one and then typing the rest by hand.
   ========================================================== */

const TEST_DB = [
  "Complete Blood Count (CBC)",
  "Fasting Blood Sugar (FBS)",
  "Postprandial Blood Sugar (PPBS)",
  "Random Blood Sugar (RBS)",
  "HbA1c",
  "Fasting Lipid Profile",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Thyroid Profile (T3, T4, TSH)",
  "Urine Routine & Microscopy",
  "ECG",
  "2D Echo",
  "Chest X-Ray",
  "USG Abdomen & Pelvis",
  "Vitamin D3",
  "Vitamin B12",
  "Serum Electrolytes",
  "CRP (C-Reactive Protein)",
  "ESR",
  "Blood Urea Nitrogen (BUN)",
  "Serum Creatinine",
  "Serum Uric Acid",
  "Stool Routine",
  "Widal Test",
  "Dengue NS1 / IgG / IgM",
  "Malaria Antigen",
  "COVID-19 RT-PCR",
  "OPG (Dental Panoramic X-Ray)",
  "RVG (Intraoral Dental X-Ray)",
  "Pulp Vitality Test"
];

/* ---------------- Custom tests (added by Admin) ---------------- */

const CUSTOM_TESTS_KEY = "medident_custom_tests_v1";

function getCustomTests() {
  try {
    const raw = localStorage.getItem(CUSTOM_TESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read custom tests", e);
    return [];
  }
}

function saveCustomTests(list) {
  try {
    localStorage.setItem(CUSTOM_TESTS_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error("Failed to save custom tests", e);
    return false;
  }
}

function addCustomTest(name) {
  name = (name || "").trim();
  if (!name) return false;
  const list = getCustomTests();
  if (!list.some(t => t.toLowerCase() === name.toLowerCase())) {
    list.push(name);
    saveCustomTests(list);
    rebuildTestIndex();
  }
  return true;
}

function deleteCustomTest(name) {
  const list = getCustomTests().filter(t => t.toLowerCase() !== (name || "").toLowerCase());
  saveCustomTests(list);
  rebuildTestIndex();
}

/* ---------------- Autocomplete wiring ---------------- */

function rebuildTestIndex() {
  const all = TEST_DB.concat(getCustomTests());
  let dl = document.getElementById("testDatalist");
  if (!dl) {
    dl = document.createElement("datalist");
    dl.id = "testDatalist";
    document.body.appendChild(dl);
  }
  dl.innerHTML = "";
  all.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    dl.appendChild(opt);
  });
}

function initTestAutocomplete() {
  rebuildTestIndex();
  const input = document.getElementById("dTests");
  if (input) {
    input.setAttribute("list", "testDatalist");
    input.setAttribute("autocomplete", "off");
  }
}
