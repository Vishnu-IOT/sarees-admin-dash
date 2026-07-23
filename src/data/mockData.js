// Local fallback data for the resources that don't have a backend endpoint
// yet (Looms and Users - no routes were provided for these). Categories,
// Sub-categories, Products and Orders are all fetched live from the API in
// DataContext and do not use mock data.

export const MOCK_LOOMS = [
  {
    id: "LM-2023-01",
    model: "Picanol Optimax-i",
    location: "Zone A - Floor 02",
    specs: ["Air-Jet", "Silk-Ready"],
    status: true,
  },
  {
    id: "LM-2023-02",
    model: "Dornier P2 Rapier",
    location: "Zone A - Floor 02",
    specs: ["Jacquard"],
    status: true,
  },
  {
    id: "LM-2023-03",
    model: "Toyota JAT810",
    location: "Zone B - Floor 01",
    specs: ["Air-Jet", "Repair needed"],
    status: false,
  },
  {
    id: "LM-2023-04",
    model: "Itema R9500²",
    location: "Zone C - Outskirts",
    specs: ["Denim/Heavy"],
    status: true,
  },
  {
    id: "LM-2023-05",
    model: "Tsudakoma ZAX9200i",
    location: "Zone B - Floor 01",
    specs: ["Multi-color"],
    status: true,
  },
];

export const MOCK_USERS = [
  {
    id: "UID-88293",
    name: "Rajesh Kumar",
    role: "Super Admin",
    email: "r.kumar@sareejewelry.co",
    status: "Active",
  },
  {
    id: "UID-88418",
    name: "Priya Sharma",
    role: "Inventory Lead",
    email: "p.sharma@sareejewelry.co",
    status: "Active",
  },
  {
    id: "UID-89021",
    name: "Anish Varma",
    role: "QC Auditor",
    email: "a.varma@sareejewelry.co",
    status: "Away",
  },
  {
    id: "UID-87552",
    name: "Meena Iyer",
    role: "Cataloger",
    email: "m.iyer@sareejewelry.co",
    status: "Offline",
  },
];
