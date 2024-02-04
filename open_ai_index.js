// JS: open_ai_index.js
async function findSampledMusic() {
  const userInput = document.getElementById("songInput").value;
  const chatMemory = await getChatGPTResponse(userInput);
  // Handle the chatMemory as needed for displaying results or further interactions
}

async function getChatGPTResponse(userInput, chatMemory = []) {
  try {
    // Check if userInput is defined and not null before using trim
    const trimmedInput = userInput ? userInput.trim() : "";

    // Construct the question dynamically
    const question = `What songs were sampled to make "${trimmedInput}"?`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          ...chatMemory,
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("Invalid API response");
    }

    const chatGPTResponse = data.choices[0].message.content.trim();
    document.getElementById("result").innerText = chatGPTResponse;

    // Place the current response in the context memory array
    chatMemory.push({ role: "user", content: question });
    chatMemory.push({ role: "assistant", content: chatGPTResponse });

    // Return the updated context memory
    return chatMemory;
  } catch (error) {
    console.error(error);
    // Handle errors here
  }
}
