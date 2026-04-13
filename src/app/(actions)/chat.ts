"use server"

export async function askAI(prompt: string, conversationId: number | null) {
  try {
    // MUHIM: localhost o'rniga 127.0.0.1 ishlating
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        conversation_id: conversationId,
      }),
      // Server-side bo'lgani uchun keshni cheklaymiz
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
        const errorMsg = await response.text();
        console.error("Flask Error:", errorMsg);
        throw new Error("Backenddan xato keldi");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return { error: "Server bilan aloqa uzildi" };
  }
}



// Barcha suhbatlarni olish
export async function getConversations() {
  const res = await fetch("http://127.0.0.1:5000/conversations", { cache: 'no-store' });
  console.log(res)
  return res.json();
}

// Tanlangan suhbat xabarlarini olish
export async function getChatHistory(convId: number) {
  const res = await fetch(`http://127.0.0.1:5000/history/${convId}`, { cache: 'no-store' });
  return res.json();
}