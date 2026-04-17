"use server"

export async function askAI(prompt: string, conversationId: number | null) {
  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        conversation_id: conversationId,
      }),
      next: { revalidate: 0 } 
    });

    const data = await response.json();

    if (!response.ok) {
        return { error: data.error || "Backenddan xato keldi" };
    }

    return data;
  } catch (error: any) {
    return { error: "Server o'chiq yoki ulanib bo'lmadi" };
  }
}

export async function getConversations() {
  try {
    const res = await fetch("http://127.0.0.1:5000/conversations", { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export async function getChatHistory(convId: number) {
  try {
    const res = await fetch(`http://127.0.0.1:5000/history/${convId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}