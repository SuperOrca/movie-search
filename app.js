// JavaScript

// Function to fetch data from the API and return a promise with the JSON data
async function fetchData(query) {
    try {
        const response = await fetch(`https://search.imdbot.workers.dev/?q=${query}`);
        const jsonData = await response.json();
        return jsonData.description;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Return null in case of an error
    }
}

// Function to update the results based on the search value
const updateResults = async (value) => {
    try {
        const description = await fetchData(value);

        // Clear the previous results
        const results = document.getElementById("results");
        results.innerHTML = "";

        if (!description) {
            // Show a message if there's no data or an error occurred
            const noResultsMessage = document.createElement("p");
            noResultsMessage.textContent = "No results found.";
            results.appendChild(noResultsMessage);
            return;
        }

        // Iterate through the movies and create HTML elements for each
        for (const movie of description) {
            const movieContainer = document.createElement("div");
            movieContainer.classList.add("movie");

            const moviePoster = document.createElement("img");
            moviePoster.classList.add("movie-poster");
            moviePoster.src = movie["#IMG_POSTER"];
            moviePoster.alt = "Movie Poster";

            const movieContent = document.createElement("div");
            movieContent.classList.add("movie-content");

            const movieTitle = document.createElement("h2");
            movieTitle.classList.add("movie-title");
            const movieTitleLink = document.createElement("a");
            movieTitleLink.href = movie["#IMDB_URL"];
            movieTitleLink.textContent = movie["#TITLE"];
            movieTitleLink.target = "_blank";
            movieTitle.appendChild(movieTitleLink);

            const movieYear = document.createElement("p");
            movieYear.classList.add("movie-year");
            movieYear.textContent = movie["#YEAR"];

            const movieActors = document.createElement("ul");
            movieActors.classList.add("movie-actors");
            for (const actor of movie["#ACTORS"].split(", ")) {
                const actorItem = document.createElement("li");
                actorItem.textContent = actor;
                movieActors.appendChild(actorItem);
            }

            const movieRank = document.createElement("h3");
            movieRank.classList.add("movie-rank");
            movieRank.textContent = "#" + movie["#RANK"].toLocaleString();

            movieContent.appendChild(movieTitle);
            movieContent.appendChild(movieYear);
            movieContent.appendChild(movieActors);

            movieContainer.appendChild(moviePoster);
            movieContainer.appendChild(movieContent);
            movieContainer.appendChild(movieRank);

            results.appendChild(movieContainer);
        }
    } catch (error) {
        console.error("Error updating results:", error);
    }
};

// Event listener for the search input
const search = document.getElementById("search");
search.addEventListener("input", (event) => {
    const value = event.target.value;

    // Only perform a search if the input has at least 3 characters
    if (value.length >= 3) {
        updateResults(value);
    } else {
        // Clear the results if the input is less than 3 characters
        const results = document.getElementById("results");
        results.innerHTML = "";
    }
});
