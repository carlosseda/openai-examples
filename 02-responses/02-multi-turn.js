/**
 * 05 - Conversación multi-turno
 * -----------------------------
 * Pasa un array de mensajes con roles para mantener contexto.
 * Alternativa: usar `previous_response_id` (ver script 03-conversation-state.js).
 *
 * Ejecutar: node 02-responses/02-multi-turn.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: "Eres un profesor de matemáticas paciente." },
      { role: "user", content: "¿Qué es una derivada?" },
      {
        role: "assistant",
        content:
          "Una derivada mide cómo cambia una función respecto a su variable.",
      },
      { role: "user", content: "Dame un ejemplo con f(x) = x²." },
    ],
  });

  console.log(response.output_text);
}

main().catch(console.error);
