function convertChatToJSON(chatText) {
  const lines = chatText.split("\n");
  const messages = [];

  console.log(`Number of lines: ${lines.length}`);

  lines.forEach((line, index) => {
    console.log(`Processing line ${index + 1}: ${line}`);
    if (line.trim() !== "") {
      const parts = line.split(" - ");
      if (parts.length >= 2) {
        const dateTime = parts[0];
        const rest = parts.slice(1).join(" - ");
        const [sender, ...messageParts] = rest.split(": ");
        const message = messageParts.join(": ");

        if (sender && message) {
          console.log(`Match found for line ${index + 1}`);
          messages.push({
            dateTime,
            sender,
            message,
          });
        } else {
          console.log(`Incomplete data for line ${index + 1}`);
        }
      } else {
        console.log(`Invalid format for line ${index + 1}`);
      }
    } else {
      console.log(`Empty line at ${index + 1}`);
    }
  });

  console.log(`Total messages processed: ${messages.length}`);

  return JSON.stringify(messages, null, 2);
}

// Exporteer de functie
if (typeof module !== "undefined" && module.exports) {
  module.exports = { convertChatToJSON };
} else {
  window.convertChatToJSON = convertChatToJSON;
}
