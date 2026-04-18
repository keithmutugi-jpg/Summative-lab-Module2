const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const result = document.getElementById("result");
const error = document.getElementById("error");
const favoritesList = document.getElementById("favorites");

let favorites = [];

// EVENT LISTENER (SPA BEHAVIOR)
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const word = input.value.trim();
    if (!word) return;

    fetchWord(word);
});

// FETCH API FUNCTION
async function fetchWord(word) {
    try {
        error.textContent = "";
        result.innerHTML = "Loading...";

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();
        displayWord(data[0]);

    } catch (err) {
        result.innerHTML = "";
        error.textContent = "❌ Word not found. Try another word.";
    }
}

// DISPLAY DATA (DOM MANIPULATION)
function displayWord(data) {
    const meaning = data.meanings[0];
    const definition = meaning.definitions[0];

    let audio = "";
    if (data.phonetics[0] && data.phonetics[0].audio) {
        audio = `<audio controls src="${data.phonetics[0].audio}"></audio>`;
    }

    result.innerHTML = `
        <h2>${data.word}</h2>
        <p><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</p>
        <p><strong>Definition:</strong> ${definition.definition}</p>
        <p><strong>Example:</strong> ${definition.example || "No example available"}</p>
        <p><strong>Synonyms:</strong> ${meaning.synonyms?.join(", ") || "None"}</p>
        ${audio}

        <button class="favorite-btn" onclick="addFavorite('${data.word}')">
             Save to Favorites
        </button>
    `;
}

// FAVORITES FEATURE
function addFavorite(word) {
    if (!favorites.includes(word)) {
        favorites.push(word);
        renderFavorites();
    }
}

// RENDER FAVORITES
function renderFavorites() {
    favoritesList.innerHTML = "";

    favorites.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        favoritesList.appendChild(li);
    });
}