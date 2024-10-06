let chatMessages = [];
let currentSort = "newest";
let currentPage = 0;
let messagesPerPage = 50;
let isMobile = false;
let searchTerm = "";

function checkMobile() {
  isMobile = window.innerWidth <= 768;
  messagesPerPage = isMobile ? 5 : 50;
}

async function loadChatData() {
  try {
    const response = await fetch("data/chat_nagelhout.json");
    chatMessages = await response.json();
    currentSort = "newest";
    currentPage = 0;
    sortAndDisplayMessages();
  } catch (error) {
    console.error("Error loading chat data:", error);
    document.getElementById("chat-container").innerHTML =
      "<p>Error loading chat data. Please try again later.</p>";
  }
}

function sortAndDisplayMessages() {
  if (chatMessages.length === 0) return;

  const sortedMessages = [...chatMessages].sort((a, b) => {
    const dateA = new Date(
      a.dateTime.split(" ")[0].split("-").reverse().join("-") +
        " " +
        a.dateTime.split(" ")[1]
    );
    const dateB = new Date(
      b.dateTime.split(" ")[0].split("-").reverse().join("-") +
        " " +
        b.dateTime.split(" ")[1]
    );
    return currentSort === "newest" ? dateB - dateA : dateA - dateB;
  });

  const filteredMessages = sortedMessages.filter(
    (message) =>
      message.message.includes(searchTerm) ||
      message.sender.includes(searchTerm) ||
      message.dateTime.includes(searchTerm)
  );

  const startIndex = currentPage * messagesPerPage;
  const messagesToDisplay = filteredMessages.slice(
    startIndex,
    startIndex + messagesPerPage
  );
  displayMessages(messagesToDisplay);

  updateNavigationButtons(filteredMessages.length);
}

function updateNavigationButtons(totalMessages) {
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");

  prevButton.disabled = currentPage === 0;
  nextButton.disabled = (currentPage + 1) * messagesPerPage >= totalMessages;
}

function displayMessages(messages) {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.innerHTML = "";

  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add(message.sender.toLowerCase());

    // Functie om URLs te detecteren en om te zetten naar klikbare links
    function linkify(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    }

    // Markeer de zoekterm in de berichtinhoud, maar behoud de URL-structuur
    let highlightedMessage = linkify(message.message);
    if (searchTerm) {
      const searchRegex = new RegExp(`(${searchTerm})`, "gi");
      highlightedMessage = highlightedMessage.replace(
        searchRegex,
        '<span class="highlight">$1</span>'
      );
    }

    messageElement.innerHTML = `
      <p class="sender">${message.sender}</p>
      <p class="datetime">${message.dateTime}</p>
      <p class="content">${highlightedMessage}</p>
    `;
    chatContainer.appendChild(messageElement);
  });
}

function setupEventListeners() {
  const searchButton = document.getElementById("search-button");
  const sortNewestButton = document.getElementById("sort-newest");
  const sortOldestButton = document.getElementById("sort-oldest");
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");
  const clearButton = document.getElementById("clear-button");
  const darkModeButton = document.getElementById("dark-mode-button");

  if (searchButton) {
    searchButton.addEventListener("click", performSearch);
  }
  if (sortNewestButton) {
    sortNewestButton.addEventListener("click", () => {
      currentSort = "newest";
      currentPage = 0;
      sortAndDisplayMessages();
    });
  }
  if (sortOldestButton) {
    sortOldestButton.addEventListener("click", () => {
      currentSort = "oldest";
      currentPage = 0;
      sortAndDisplayMessages();
    });
  }
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        sortAndDisplayMessages();
      }
    });
  }
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if ((currentPage + 1) * messagesPerPage < chatMessages.length) {
        currentPage++;
        sortAndDisplayMessages();
      }
    });
  }
  if (clearButton) {
    clearButton.addEventListener("click", clearSearch);
  }
  if (darkModeButton) {
    darkModeButton.addEventListener("click", toggleDarkMode);
  }

  window.addEventListener("resize", () => {
    const oldMessagesPerPage = messagesPerPage;
    checkMobile();
    if (oldMessagesPerPage !== messagesPerPage) {
      currentPage = 0;
      sortAndDisplayMessages();
    }
  });
}

function performSearch() {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  if (searchButton.textContent === "Wis zoekopdracht") {
    // Als de knop "Wis zoekopdracht" is, reset de zoekterm en het zoekveld
    clearSearch();
  } else {
    // Voer de zoekopdracht uit
    searchTerm = searchInput.value;
    if (searchTerm) {
      currentPage = 0;
      sortAndDisplayMessages();
      searchButton.textContent = "Wis zoekopdracht"; // Verander de knoptekst
    }
  }
}

function clearSearch() {
  searchTerm = ""; // Reset de zoekterm
  document.getElementById("search-input").value = ""; // Maak het zoekveld leeg
  currentPage = 0; // Reset de pagina
  sortAndDisplayMessages(); // Herstel de oorspronkelijke toestand

  // Zet de knoptekst terug naar "Zoek"
  document.getElementById("search-button").textContent = "Zoek";
}

document.addEventListener("DOMContentLoaded", () => {
  checkMobile();
  loadChatData();
  setupEventListeners();
});

// Functie om de donkere modus in te schakelen
function toggleDarkMode() {
  const body = document.body;
  const appContainer = document.getElementById("app-container");
  const buttons = document.querySelectorAll("button");
  const darkModeButton = document.getElementById("dark-mode-button");

  // Toggle de dark-mode klasse
  body.classList.toggle("dark-mode");
  appContainer.classList.toggle("dark-mode");

  // Toggle de dark-mode klasse voor knoppen
  buttons.forEach((button) => {
    button.classList.toggle("dark-mode");
  });

  // Verander het icoon op basis van de modus
  if (body.classList.contains("dark-mode")) {
    darkModeButton.innerHTML = '<i class="fas fa-moon"></i> Lichte Modus'; // Maanicoon voor lichte modus
  } else {
    darkModeButton.innerHTML = '<i class="fas fa-sun"></i> Donkere Modus'; // Zonnetje voor donkere modus
  }
}

function createStars() {
  const starrySky = document.getElementById("starry-sky");
  const numberOfStars = 100; // Aantal sterren

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Random positie en grootte
    const size = Math.random() * 3 + 1; // Ster grootte tussen 1 en 4
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}vw`; // Random horizontale positie
    star.style.top = `${Math.random() * 100}vh`; // Random verticale positie
    star.style.animationDuration = `${Math.random() * 1 + 0.5}s`; // Random twinkle snelheid

    starrySky.appendChild(star);
  }
}

function createFallingStar() {
  const starrySky = document.getElementById("starry-sky");
  const fallingStar = document.createElement("div");
  fallingStar.classList.add("falling-star");

  // Random horizontale positie
  const randomX = Math.random() * 100; // Willekeurige horizontale positie
  fallingStar.style.left = `${randomX}vw`;
  fallingStar.style.top = `0`; // Begin bovenaan

  // Voeg een schuine beweging toe door een random waarde voor translateX toe te voegen
  const randomAngle = Math.random() * 40 - 20; // Willekeurige schuine hoek tussen -20 en 20 graden
  fallingStar.style.transform = `translateX(${randomAngle}px)`; // Schuine startpositie

  starrySky.appendChild(fallingStar);

  // Verwijder de vallende ster na de animatie
  fallingStar.addEventListener("animationend", () => {
    fallingStar.remove();
  });
}

// Maak sterren aan bij het laden van de pagina
document.addEventListener("DOMContentLoaded", () => {
  createStars();

  // Maak elke 2 seconden een vallende ster
  setInterval(createFallingStar, 2000);
});
