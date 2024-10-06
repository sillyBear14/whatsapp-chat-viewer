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
  document
    .getElementById("search-button")
    .addEventListener("click", performSearch); // Voeg de event listener toe
  document.getElementById("sort-newest").addEventListener("click", () => {
    currentSort = "newest";
    currentPage = 0;
    sortAndDisplayMessages();
  });

  document.getElementById("sort-oldest").addEventListener("click", () => {
    currentSort = "oldest";
    currentPage = 0;
    sortAndDisplayMessages();
  });

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      sortAndDisplayMessages();
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if ((currentPage + 1) * messagesPerPage < chatMessages.length) {
      currentPage++;
      sortAndDisplayMessages();
    }
  });

  document
    .getElementById("clear-button")
    .addEventListener("click", clearSearch); // Voeg de event listener toe

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
