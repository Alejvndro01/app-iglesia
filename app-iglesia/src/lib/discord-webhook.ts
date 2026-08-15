interface DiscordEmbed {
  title: string;
  description: string;
  color?: number; // Código decimal HEX (ej. 0x00ff00 = 65280)
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
}

interface WebhookPayload {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

export async function sendDiscordAlert(payload: WebhookPayload): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_SECURITY_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("DISCORD_SECURITY_WEBHOOK_URL no está configurada.");
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error("Error enviando alerta a Discord:", error);
    return false;
  }
}