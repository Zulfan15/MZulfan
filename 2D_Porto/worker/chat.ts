import { PERSONA_RECEPTION, PERSONA_TWIN, SYSTEM_KNOWLEDGE } from './generated/knowledge';
import type { Env } from './telemetry';

export async function handleChat(request: Request, env: Env): Promise<Response> {
  try {
    const body = (await request.json()) as { message?: string; persona?: string };
    const userMessage = body.message?.trim();
    const persona = body.persona === 'reception' ? PERSONA_RECEPTION : PERSONA_TWIN;

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Message cannot be empty.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `
${SYSTEM_KNOWLEDGE}

Current Persona: ${persona.name}
Tone and Style: ${persona.style}
You must answer strictly according to the facts above. If asked about something not mentioned, state that you do not know and suggest emailing zulfanangga2908@gmail.com. Keep replies under 120 words.
`.trim();

    // If Cloudflare Workers AI binding is available
    if (env.AI) {
      const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 256,
      });

      return new Response(JSON.stringify({ reply: response.response }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Smart fallback if Cloudflare AI binding is not attached (e.g. static preview)
    const lower = userMessage.toLowerCase();
    let fallbackReply = `Hi there! I am ${persona.name}. You can explore Zulfan's 13 missions, CV, or email him at zulfanangga2908@gmail.com!`;

    if (lower.includes('aeroscan') || lower.includes('aircraft') || lower.includes('vision') || lower.includes('yolo')) {
      fallbackReply = "AeroScan is Zulfan's edge AI platform detecting 15 military aircraft from aerial imagery using custom YOLOv11s and TensorRT FP16, running at ~1.8 ms/frame (>500 FPS) on an RTX 4060!";
    } else if (lower.includes('foodlink') || lower.includes('laravel') || lower.includes('waste')) {
      fallbackReply = "FoodLink is a cloud-native food-surplus redistribution platform built with Laravel 12, PostGIS spatial indexing, Redis 7 distributed locks, and Kafka event streaming to prevent overselling.";
    } else if (lower.includes('thesis') || lower.includes('gambling') || lower.includes('spam')) {
      fallbackReply = "Zulfan's undergraduate thesis achieved 99.56% F1-score detecting obfuscated online gambling spam in Indonesian YouTube comments using TF-IDF trigrams and Random Forest.";
    } else if (lower.includes('hire') || lower.includes('contact') || lower.includes('job') || lower.includes('work')) {
      fallbackReply = "Zulfan is open to software engineering, edge AI/computer vision, and data science opportunities! You can contact him at zulfanangga2908@gmail.com.";
    }

    return new Response(JSON.stringify({ reply: fallbackReply }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Chat error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
