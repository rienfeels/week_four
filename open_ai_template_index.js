async function getChatGPTResponse(userInput, chatMemory = []) {
  const chatContainer = document.getElementById("chat-container");

  const typingIndicator = document.createElement("p");
  typingIndicator.id = "typing-indicator";
  typingIndicator.textContent = "Typing...";
  chatContainer.appendChild(typingIndicator);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer placeyourkeyhere",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [...chatMemory, { role: "user", content: userInput }],
      }),
    });

    if (!response.ok) {
      throw new Error("An error occurred in the request to the 'API");
    }

    const data = await response.json();

    if (
      !data.choices ||
      !data.choices.length ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      throw new Error("Invalid API response");
    }

    const chatGPTResponse = data.choices[0].message.content.trim();
    var cleanResponse = chatGPTResponse.replace(
      /(```html|```css|```javascript|```php|```python)(.*?)/gs,
      "$2"
    );
    cleanResponse = cleanResponse.replace(/```/g, "");
    showMessage("VivacityGPT", cleanResponse);

    // Place the current response in the context memory array
    chatMemory.push({ role: "user", content: userInput });
    chatMemory.push({ role: "assistant", content: cleanResponse });

    // Return the updated context memory
    return chatMemory;
  } catch (error) {
    console.error(error);
    // Here we can put some code to properly manage the errors.
  }
}
