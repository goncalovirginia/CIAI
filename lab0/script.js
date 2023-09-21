
const KEY = "p4fA29gHA0VZkJ6kzd8jXXM9CvYa";
const SECRET = "jwyqobX3GI85pQQZ4N_jLB978Aga"
const TOKEN = "b07c687b-700a-34aa-935f-821f375d22c4";

async function fetchTest() {
	const response = await fetch("https://api.metrolisboa.pt:8243/estadoServicoML/1.0.1/tempoEspera/Estacao/todos");
	const data = await response.json();
	console.log(data);
}

fetchTest();





