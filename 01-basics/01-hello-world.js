/**
 * 01 - Hello World
 * ----------------
 * La petición más simple posible a la Responses API.
 * Este es el "hola mundo" del SDK de OpenAI.
 *
 * Ejecutar: node 01-basics/01-hello-world.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: "Escribe un haiku sobre programar en JavaScript.",
  });

  // output_text es un helper que concatena todo el texto de la respuesta
  console.log(response.output_text);
}

main().catch(console.error);
