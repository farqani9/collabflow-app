async function createTestChannel() {
  try {
    const response = await fetch("http://localhost:3001/api/channels/seed", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Test channel created:", data);

    if (data.channel?.id) {
      console.log("\nYou can now visit:");
      console.log(`http://localhost:3001/channels/${data.channel.id}`);
    }
  } catch (error) {
    console.error("Error creating test channel:", error);
  }
}

createTestChannel();
