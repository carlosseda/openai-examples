/**
 * 27 - Computer Use (demo conceptual)
 * -----------------------------------
 * El modelo 'computer-use-preview' controla un ordenador: ve la pantalla,
 * hace clic, teclea. Necesita que TÚ proporciones las capturas y ejecutes
 * las acciones en un navegador real (Playwright/Puppeteer).
 *
 * Este script es solo el boilerplate del primer turno. Un flujo completo
 * requiere un bucle + un navegador real (demasiado para un ejemplo simple).
 *
 * Ejecutar: node 04-tools/06-computer-use.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "computer-use-preview",
    tools: [
      {
        type: "computer_use_preview",
        display_width: 1280,
        display_height: 800,
        environment: "browser",
      },
    ],
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Busca 'clima Palma de Mallorca' en Google.",
          },
          // En real mandarías aquí una captura inicial como input_image
        ],
      },
    ],
    truncation: "auto",
  });

  console.log("Primera acción sugerida por el modelo:");
  for (const item of response.output || []) {
    if (item.type === "computer_call") {
      console.log(" Acción:", item.action);
      console.log(" Tipo:", item.action.type); // click, type, scroll, keypress...
    }
  }

  console.log(
    "\n💡 Para el flujo completo, implementa el loop:\n" +
      "   1. Ejecutar la acción con Playwright\n" +
      "   2. Hacer screenshot\n" +
      "   3. Enviar screenshot como 'computer_call_output' con previous_response_id\n" +
      "   4. Repetir hasta que el modelo ya no pida más computer_calls"
  );
}

main().catch(console.error);
