
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

selectFrom.addEventListener("select", updateListing);
selectTo.addEventListener("select", updateListing);

initializeSelectElements();

function initializeSelectElements() {
	Object.keys(terminalDestinations).forEach(terminalCode => {
		appendSelectOption(selectFrom, terminalCode, terminalCodeToName[terminalCode]);
	});
	terminalDestinations["TSA"].forEach(terminalCode => {
		appendSelectOption(selectTo, terminalCode, terminalCodeToName[terminalCode]);
	});
}

function appendSelectOption(selectElement, value, text) {
	const option = document.createElement("option");
	option.setAttribute("value", value);
	option.innerHTML = text;
	selectElement.appendChild(option);
}

async function fetchFerries(from, to) {
	const url = "https://www.bcferriesapi.ca/api/" + from + "/" + to + "/";
	const response = await fetch(url, {
		mode: 'cors'
	});
	const data = await response.json();
	console.log(data);
}

function updateListing() {
	fetchFerries(selectFrom.value, selectTo.value);
	console.log("updated");
}


