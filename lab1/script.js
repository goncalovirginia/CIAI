
// Updates every minute
const ferriesAPI = "https://www.bcferriesapi.ca/api/";
const minuteInMs = 60000;

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
setInterval(function() { updateTable() }, minuteInMs);

async function fetchFerries(from, to) {
	const url = ferriesAPI + from + "/" + to + "/";
	const response = await fetch(url, {mode: 'cors'});
	return response.json();
}

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

async function updateTable() {
	const ferries = await fetchFerries(selectFrom.value, selectTo.value);
	tableSailings.innerHTML = "";
	appendTrHeaderToTable();
	
	ferries.sailings.forEach(sailing => {
		const tr = document.createElement("tr");
		tr.setAttribute("class", "custom-tr");

		const timeTd = appendTdToTr(tr, sailing.time);
		if (sailing.isCancelled == true) {
			timeTd.innerHTML = sailing.time + " (CANCELLED)";
			timeTd.style.color = getColor(0);
		}

		appendCapacityTdToTr(tr, sailing.fill);
		appendCapacityTdToTr(tr, sailing.carFill);
		appendCapacityTdToTr(tr, sailing.oversizeFill);

		appendTdToTr(tr, sailing.vesselName);

		tableSailings.appendChild(tr);
	});
	console.log("Table updated at " + new Date());
}

function appendTrHeaderToTable() {
	const tr = document.createElement("tr");
	tr.setAttribute("class", "custom-tr");
	appendTdToTr(tr, "Departure");
	const tdCapacities = appendTdToTr(tr, "Capacities <div id='capacities-icons-grid'> <img class='capacity-icon' id='capacity-icon-person' src='images/person-svgrepo-com.svg'> <img class='capacity-icon' id='capacity-icon-car' src='images/car-hatchback-svgrepo-com.svg'> <img class='capacity-icon' id='capacity-icon-truck' src='images/truck-svgrepo-com.svg'> </div>");
	tdCapacities.setAttribute("class", "capacity-td-header");
	tdCapacities.setAttribute("colspan", "3");
	appendTdToTr(tr, "Ferry");
	tableSailings.appendChild(tr);
}

function appendTdToTr(tr, text) {
	const td = document.createElement("td");
	td.setAttribute("class", "custom-td");
	td.innerHTML = text;
	tr.appendChild(td);
	return td;
}

function appendCapacityTdToTr(tr, fullness) {
	const td = document.createElement("td");
	const capacityPercentage = 100 - fullness;
	td.setAttribute("class", "capacity-td");
	td.style.color = getColor(capacityPercentage)
	td.innerHTML = capacityPercentage + "%";
	tr.appendChild(td);
}

function getColor(percentage) {
	var hue = (percentage * 1.2).toString(10);
	return ["hsl(", hue, ",100%,50%)"].join("");
  }
