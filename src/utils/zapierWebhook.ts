
export async function postToZapierWebhook(webhookUrl: string, data: Record<string, any>): Promise<void> {
  if (!webhookUrl) return;
  try {
    // Use `no-cors` so errors do not block, user experience is not impacted
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "no-cors",
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...data
      })
    });
    // Optionally, you can add a toast or console log for confirmation
    console.log("Sent data to Zapier webhook", { webhookUrl, data });
  } catch (error) {
    console.error("Failed to send to Zapier webhook", error);
  }
}
