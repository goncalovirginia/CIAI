
const terminalCodeToName = {
	"TSA": "Tsawwassen",
	"SWB": "Swartz Bay",
	"SGI": "Southern Gulf Islands",
	"DUK": "Duke Point",
	"FUL": "Fulford Harbour",
	"HSB": "Horseshoe Bay",
	"NAN": "Departure Bay (Nanaimo)",
	"LNG": "Langford",
	"BOW": "Bowen Island"
};

const terminalDestinations = {
	"TSA": ["SWB", "SGI", "DUK"],
	"SWB": ["TSA", "FUL", "SGI"],
	"HSB": ["NAN", "LNG", "BOW"],
	"DUK": ["TSA"],
	"LNG": ["HSB"],
	"NAN": ["HSB"],
	"FUL": ["SWB"],
	"BOW": ["HSB"]
}

const selectFrom = document.getElementById("selectFrom");
const selectTo = document.getElementById("selectTo");
const tableSailings = document.getElementById("tableSailings");

selectFrom.addEventListener("input", updateSelectsAndTable);
selectTo.addEventListener("input", updateTable);

initializeSelects();
updateTable();

function initializeSelects() {
	Object.keys(terminalDestinations).forEach(terminalCode => {
		appendSelectOption(selectFrom, terminalCode, terminalCodeToName[terminalCode]);
	});
	terminalDestinations[selectFrom.value].forEach(terminalCode => {
		appendSelectOption(selectTo, terminalCode, terminalCodeToName[terminalCode]);
	});
}

function updateSelectsAndTable() {
	selectTo.innerHTML = "";
	terminalDestinations[selectFrom.value].forEach(terminalCode => {
		appendSelectOption(selectTo, terminalCode, terminalCodeToName[terminalCode]);
	});
	updateTable();
}

function appendSelectOption(selectElement, value, text) {
	const option = document.createElement("option");
	option.setAttribute("value", value);
	option.innerHTML = text;
	selectElement.appendChild(option);
}

async function fetchFerries(from, to) {
	const url = "https://www.bcferriesapi.ca/api/" + from + "/" + to + "/";
	const response = await fetch(url, {mode: 'cors'});
	return response.json();
}

async function updateTable() {
	const ferries = await fetchFerries(selectFrom.value, selectTo.value);
	console.log(ferries);
	tableSailings.innerHTML = "";
	appendTrHeaderToTable();

	ferries.sailings.forEach(sailing => {
		const tr = document.createElement("tr");
		tr.setAttribute("class", "custom-tr");
		appendTdToTr(tr, sailing.time);
		appendTdToTr(tr, (100 - sailing.fill) + "% " + (100 - sailing.carFill) + "% " + (100 - sailing.oversizeFill) + "%");
		appendTdToTr(tr, sailing.vesselName);
		tableSailings.appendChild(tr);
	});
}

function appendTrHeaderToTable() {
	const tr = document.createElement("tr");
	tr.setAttribute("class", "custom-tr");
	appendTdToTr(tr, "Departure");
	appendTdToTr(tr, "Capacity");
	appendTdToTr(tr, "Ferry");
	tableSailings.appendChild(tr);
}

function appendTdToTr(tr, tdText) {
	const td = document.createElement("td");
	td.setAttribute("class", "custom-td");
	td.innerHTML = tdText;
	tr.appendChild(td);
}
