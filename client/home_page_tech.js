/* NOTE: You must specify the port in the fetch() commands */

document.addEventListener("DOMContentLoaded", () => {
	const nameSearchForm = document.getElementById("nameSearchForm");
	const findAllButton = document.getElementById("findAllButton");
	const resultsDiv = document.getElementById("searchResults");
    const createAccountForm = document.getElementById("newAccountForm");

    createAccountForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        // We add this line to prevent the actual action of the submit button

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const address = document.getElementById('address').value || undefined;
        const creditCard = document.getElementById('creditCard').value || undefined;

        // console.log(`Form submitted: ${firstName}, ${lastName}, ${email}, ${password}, ${address}, ${creditCard}`);

        const accountQuery = new URLSearchParams({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            address: address,
            creditCard: creditCard
        });

        console.log(accountQuery.entries());

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                // },
                body: JSON.stringify(accountQuery)
            });

            console.log('here');

            if (!response.ok) {
                throw new Error('New Account Creation Failed ' + response.statusText);
            }

            const newUser = response.json();

            alert('New account created successfully ' + JSON.stringify(newUser));
        } catch (error) {
            console.error('Error creating new user: ', error);
        }
    });

	nameSearchForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		const firstName = document.getElementById("firstName").value;
		const lastName = document.getElementById("lastName").value;

		//   console.log('Account Search Initiated: (firstName: %s, lastName: %s)', firstName, lastName);

		const searchQuery = new URLSearchParams({
			firstName: firstName || undefined,
			lastName: lastName || undefined,
		}).toString();

		try {
			const response = await fetch(
				`http://localhost:5000/api/check?${searchQuery}`
			);

			if (!response.ok) {
				throw new Error("Network response was not ok " + response.statusText);
			}

			const accounts = await response.json();

			displayUsers(accounts);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	});

	findAllButton.addEventListener("click", async () => {
		try {
			const response = await fetch("http://localhost:5000/api/users");
			if (!response.ok) {
				throw new Error("Network response was not ok " + response.statusText);
			}
			const users = await response.json();
			displayUsers(users);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	});

	function displayUsers(users) {
		resultsDiv.innerHTML = ""; // Clear previous results
		if (users.length > 0) {
			users.forEach((user) => {
				const p = document.createElement("p");
				p.textContent = `Name: ${user.firstName} ${user.lastName}, Email: ${user.email}`;
				resultsDiv.appendChild(p);
			});
		} else {
			resultsDiv.textContent = "No users found";
		}
	}
});
