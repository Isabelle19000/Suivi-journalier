// --- Base alimentaire (exemple) ---
const baseAliments = [
  { nom: "Pomme", pointsPour100g: 0.5 },
  { nom: "Pain", pointsPour100g: 2 },
  { nom: "Poulet", pointsPour100g: 3 },
  { nom: "Fromage", pointsPour100g: 5 },
  { nom: "Chocolat", pointsPour100g: 8 }
];

// --- Variables ---
let consommation = JSON.parse(localStorage.getItem("consommation")) || [];
let historique = JSON.parse(localStorage.getItem("historique")) || [];
let pointsJour = 0;
let reserve = parseFloat(localStorage.getItem("reserve")) || 21;

// --- Éléments du DOM ---
const selectAliment = document.getElementById("aliment");
const tableBody = document.getElementById("table-body");
const pointsJourEl = document.getElementById("points-jour");
const reserveEl = document.getElementById("reserve");
const historiqueBody = document.getElementById("historique-body");

// --- Initialisation ---
baseAliments.forEach(a => {
  const opt = document.createElement("option");
  opt.value = a.nom;
  opt.textContent = a.nom;
  selectAliment.appendChild(opt);
});

// --- Affichage initial ---
majTableau();
majResume();
majHistorique();

// --- Ajouter un aliment ---
document.getElementById("ajouter-btn").addEventListener("click", () => {
  const nom = selectAliment.value;
  const quantite = parseFloat(document.getElementById("quantite").value);
  const aliment = baseAliments.find(a => a.nom === nom);
  if (!aliment) return;

  const points = (aliment.pointsPour100g * quantite) / 100;
  consommation.push({ nom, quantite, points });
  sauvegarder();
  majTableau();
  majResume();
});

// --- Supprimer un aliment ---
function supprimer(index) {
  consommation.splice(index, 1);
  sauvegarder();
  majTableau();
  majResume();
}

// --- Valider la journée ---
document.getElementById("valider-journee").addEventListener("click", () => {
  if (consommation.length === 0) {
    alert("Aucun aliment saisi aujourd’hui !");
    return;
  }

  const date = new Date().toLocaleDateString("fr-FR");
  const total = pointsJour;
  const reserveRestante = reserve;

  historique.push({ date, total, reserveRestante });
  if (historique.length > 7) historique.shift(); // garder 7 derniers jours

  // Réinitialiser pour le lendemain
  consommation = [];
  pointsJour = 0;
  reserve = 21;

  sauvegarder();
  majTableau();
  majResume();
  majHistorique();

  alert("Journée enregistrée !");
});

// --- Sauvegarde ---
function sauvegarder() {
  localStorage.setItem("consommation", JSON.stringify(consommation));
  localStorage.setItem("historique", JSON.stringify(historique));
  localStorage.setItem("reserve", reserve);
}

// --- Tableau du jour ---
function majTableau() {
  tableBody.innerHTML = "";
  consommation.forEach((item, i) => {
    const row = `
      <tr>
        <td>${item.nom}</td>
        <td>${item.quantite}</td>
        <td>${item.points.toFixed(1)}</td>
        <td><button onclick="supprimer(${i})">🗑️</button></td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// --- Mise à jour des totaux ---
function majResume() {
  pointsJour = consommation.reduce((sum, item) => sum + item.points, 0);

  if (pointsJour > 23) {
    const depassement = pointsJour - 23;
    reserve = Math.max(0, 21 - depassement);
  } else {
    reserve = 21 - (21 - reserve); // garde la réserve si non utilisée
  }

  pointsJourEl.textContent = pointsJour.toFixed(1);
  reserveEl.textContent = reserve.toFixed(1);
  sauvegarder();
}

// --- Historique ---
function majHistorique() {
  historiqueBody.innerHTML = "";
  historique.forEach((j) => {
    const row = `
      <tr>
        <td>${j.date}</td>
        <td>${j.total.toFixed(1)}</td>
        <td>${j.reserveRestante.toFixed(1)}</td>
      </tr>
    `;
    historiqueBody.innerHTML += row;
  });
}
