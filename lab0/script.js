
async function fetchFerries(from, to) {
	const response = (await fetch("https://www.bcferriesapi.ca/api/" + from + "/" + to));
	const data = await response.json();
	console.log(data);
}

fetchFerries("TSA", "SWB");






