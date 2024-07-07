// const getButton = document.getElementById('get');
// const postButton = document.getElementById('post');
// const input = document.getElementById('input');

// const baseUrl = 'http://localhost:8383/';

// getButton.addEventListener('click', getInfo);
// postButton.addEventListener('click', postInfo);

// async function getInfo(event) {
//     event.preventDefault();
//     const res = await fetch(baseUrl + "info/amit?key=hello", {
//         method: 'GET'
//     })

//     console.log(res);

//     const data = await res.json();
//     input.value = data.info;
// }

// async function postInfo(event) {
//     event.preventDefault();
//     if (input.value == '') { return }
//     const res = await fetch(baseUrl,
//         {
//             method: 'POST',
//             headers: {
//                 "Content-Type": 'application/json'
//             },
//             body: JSON.stringify({
//                 parcel: input.value
//             })
//         }
//     );
// }
const baseUrl = "http://localhost:8383/";

const input = document.getElementById("input");
const input2 = document.getElementById("input2");

const resultsArea = document.getElementById("results");

const emailButton = document.getElementById("emailButton");
emailButton.addEventListener("click", emailSearch);

const nameButton = document.getElementById("nameButton");
nameButton.addEventListener("click", nameSearch);

function updateResults(data) {
	resultsArea.innerHTML = "";
	data.forEach((item) => {
		const p = document.createElement("p");
		p.textContent = `Name: (${item.firstName} ${item.lastName}), Email: ${
			item.email
		}, Password: ${item.password}, Address: ${
			item.address || "n/a"
		}, Credit Card: ${item.creditCard || "n/a"}`;
		resultsArea.appendChild(p);
	});
}

async function emailSearch(event) {
	event.preventDefault();

	console.log(input.value);

	const res = await fetch(
		baseUrl + `api/users/search/email?email_input=${input.value}`,
		{
			method: "GET",
		}
	);

	const data = await res.json();

	console.log(data);

	updateResults(data);
}

async function nameSearch(event) {
	event.preventDefault();

	const res = await fetch(
		baseUrl +
			`api/users/search/name?firstName_input=${input.value}&lastName_input=${input2.value}`,
		{
			method: "GET",
		}
	);

	const data = await res.json();

	console.log(data);

	updateResults(data);
}

const createAccount_form = document.getElementById("createAccount");

createAccount_form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const formData = new FormData(createAccount_form);

	const newAccountInfo = {
		firstName: formData.get("firstName"),
		lastName: formData.get("lastName"),
		email: formData.get("email"),
		password: formData.get("password"),
		address: formData.get("address"),
		creditCard: formData.get("creditCard"),
	};

	// Now that we have the form data we can make the api POST call
	try {
		const res = await fetch(baseUrl + "api/users/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newAccountInfo),
		});

		if (!res.ok) {
			throw new Error(
				"Problem with uploading new account information " + res.statusText
			);
		}

		console.log(
			`New user created --> Name: (${newAccountInfo.firstName} ${
				newAccountInfo.lastName
			}), Email: ${newAccountInfo.email}, Password: ${
				newAccountInfo.password
			}, Address: ${newAccountInfo.address || "n/a"}, Credit Card: ${
				newAccountInfo.creditCard || "n/a"
			}`
		);
	} catch (err) {
		console.error("Error creating user: ", err);
	}
});
