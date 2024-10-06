let chatMessages = [];
let currentSort = "newest";
let currentPage = 0;
let messagesPerPage = 50;
let isMobile = false;

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

  const startIndex = currentPage * messagesPerPage;
  const messagesToDisplay = sortedMessages.slice(
    startIndex,
    startIndex + messagesPerPage
  );
  displayMessages(messagesToDisplay);

  updateNavigationButtons(sortedMessages.length);
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

    // Converteer URLs naar klikbare links
    const contentWithLinks = message.message.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    messageElement.innerHTML = `
      <p class="sender">${message.sender}</p>
      <p class="datetime">${message.dateTime}</p>
      <p class="content">${contentWithLinks}</p>
    `;
    chatContainer.appendChild(messageElement);
  });
}

function setupEventListeners() {
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

  window.addEventListener("resize", () => {
    const oldMessagesPerPage = messagesPerPage;
    checkMobile();
    if (oldMessagesPerPage !== messagesPerPage) {
      currentPage = 0;
      sortAndDisplayMessages();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkMobile();
  loadChatData();
  setupEventListeners();
});
