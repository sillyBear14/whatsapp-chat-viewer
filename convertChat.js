// convertChat.js
const fs = require("fs");
const path = require("path");
const { convertChatToJSON } = require("./js/convertToJson.js"); // Zorg ervoor dat dit pad correct is

// Pad naar het input bestand
const inputFile = path.join(__dirname, "data", "chat_nagelhout.txt");

// Pad naar het output bestand
const outputFile = path.join(__dirname, "data", "chat_nagelhout.json");

// Lees de inhoud van het tekstbestand
fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  console.log("Chat text read from file:");
  console.log(data); // Log de inhoud van het bestand

  // Converteer de chat tekst naar JSON
  const jsonOutput = convertChatToJSON(data);
  console.log("Converted JSON output:");
  console.log(jsonOutput); // Log de geconverteerde JSON

  // Schrijf de JSON naar een nieuw bestand
  fs.writeFile(outputFile, jsonOutput, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log(
      "Conversion completed successfully. JSON file saved as:",
      outputFile
    );
  });
});
