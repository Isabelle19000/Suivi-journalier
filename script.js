// --- Base alimentaire (exemple) ---
const baseAliments = [
  { nom: "Pomme", pointsPour100g: 0.5 },
  { nom: "Pain", pointsPour100g: 2 },
  { nom: "Poulet", pointsPour100g: 3 },
  { nom: "Fromage", pointsPour100g: 5 },
  { nom: "Chocolat", pointsPour100g: 8 }
];

// --- Variables ---
let consommation = [];
let pointsJour = 0;
let reserve = 21;

// --- Initialisation ---
const selectAliment = document.getElementById("aliment");
const tableBody = document.getElementById("table-body");
const pointsJourEl = document.getElementById("points-jour");
const reserveEl = document.getElementById("reserve");

// Remplir le menu déroulant
baseAliments.forEach(a => {
  const opt = document.createElement("option");
  opt.value = a.nom;
  opt.textContent = a.nom;
  selectAliment.appendChild(opt);
});

// --- Ajouter un aliment consommé ---
document.getElementById("ajouter-btn").addEventListener("click", () => {
  const nom = selectAliment.value;
  const quantite = parseFloat(document.getElementById("quantite").value);

  const aliment = baseAliments.find(a => a.nom === nom);
  if (!aliment) return;

  const points = (aliment.pointsPour100g * quantite) / 100;
  consommation.push({ nom, quantite, points });
  majTableau();
  majResume();
});

// --- Supprimer un aliment ---
function supprimer(index) {
  consommation.splice(index, 1);
  majTableau();
  majResume();
}

// --- Mettre à jour le tableau ---
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
    reserve = 21;
  }

  pointsJourEl.textContent = pointsJour.toFixed(1);
  reserveEl.textContent = reserve.toFixed(1);
}
