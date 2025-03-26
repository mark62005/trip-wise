const searchBtn = document.getElementById("search-btn");
const clearSearchBtn = document.getElementById("clear-search-btn");

function resetField() {
	document.getElementById("search-input").value = "";
}
clearSearchBtn.addEventListener("click", resetField);

function getResultCardElement(data) {
	// Create main card container
	const card = document.createElement("div");
	card.className = "flex flex-col justify-between bg-white";

	// Create image element
	const img = document.createElement("img");
	img.src = `./${data.imageUrl}`;
	img.alt = `Image of ${data.name}`;
	img.className = "basis-1/2 object-cover object-center";

	// Create text container
	const textContainer = document.createElement("div");
	textContainer.className =
		"basis-1/2 flex flex-col justify-between gap-4 px-4 py-6";

	// Create name element
	const h4 = document.createElement("h4");
	h4.className = "text-black text-xl font-medium";
	h4.textContent = data.name;

	// Create description paragraph
	const p = document.createElement("p");
	p.className = "text-gray-500";
	p.textContent = data.description;

	// Create button
	const button = document.createElement("button");
	button.className =
		"w-fit bg-[#177474] rounded-md py-2 px-6 cursor-pointer hover:bg-[#177474]/90 hover:text-white/90";
	button.textContent = "Visit";

	// Append elements
	textContainer.appendChild(h4);
	textContainer.appendChild(p);
	textContainer.appendChild(button);
	card.appendChild(img);
	card.appendChild(textContainer);

	return card;
}

function checkInsideCoutriesArr(input, countries) {
	return countries.findIndex((c) => c.name.toLowerCase() === input);
}

function handleSearch() {
	const input = document
		.getElementById("search-input")
		.value.trim()
		.toLowerCase();
	const resultDiv = document.getElementById("results");

	fetch("travel_recommendation_api.json")
		.then((response) => response.json())
		.then((data) => {
			const beachRegex = /\bbeach(es)?\b/;
			const templeRegex = /\btemple(s)?\b/;
			const countryRegex = /\bcountr(?:y|ies)?\b/;

			const targetIndex = checkInsideCoutriesArr(input, data.countries);

			if (targetIndex !== -1) {
				data.countries[targetIndex].cities.forEach((city) => {
					resultDiv.appendChild(getResultCardElement(city));
				});
			} else {
				if (input.match(countryRegex)) {
					data.countries.forEach((country) => {
						country.cities.forEach((city) => {
							resultDiv.appendChild(getResultCardElement(city));
						});
					});
				} else if (input.match(templeRegex)) {
					data.temples.forEach((temple) => {
						resultDiv.appendChild(getResultCardElement(temple));
					});
				} else if (input.match(beachRegex)) {
					data.beaches.forEach((beach) => {
						resultDiv.appendChild(getResultCardElement(beach));
					});
				} else {
					resultDiv.innerHTML = "Destination not found";
				}
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			resultDiv.innerHTML = "An error occurred while fetching data.";
		});
}
searchBtn.addEventListener("click", handleSearch);
