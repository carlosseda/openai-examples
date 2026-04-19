/**
 * 10 - Function Calling (Tool use)
 * --------------------------------
 * Defines funciones que el modelo puede "llamar" cuando le hace falta.
 * Tú ejecutas la función y le devuelves el resultado para que siga.
 *
 * Flujo:
 *   1. Envías mensaje + definición de tools.
 *   2. El modelo responde con un 'function_call' si decide usar una.
 *   3. TÚ ejecutas la función de verdad.
 *   4. Le mandas el resultado y sigue generando la respuesta final.
 *
 * Ejecutar: node 02-responses/07-function-calling.js
 */
const { openai } = require("../shared/client");

// --- Funciones reales que implementamos nosotros ---
function getWeather(city) {
  // En la vida real aquí llamarías a una API meteorológica
  const mocks = {
    "Palma de Mallorca": { temp: 22, desc: "soleado" },
    Madrid: { temp: 15, desc: "nublado" },
    Barcelona: { temp: 19, desc: "lluvia ligera" },
  };
  return mocks[city] || { temp: 20, desc: "desconocido" };
}

// --- Definición de tools para el modelo ---
const tools = [
  {
    type: "function",
    name: "get_weather",
    description: "Obtiene el tiempo actual en una ciudad",
    parameters: {
      type: "object",
      properties: {
        city: { type: "string", description: "Nombre de la ciudad" },
      },
      required: ["city"],
      additionalProperties: false,
    },
    strict: true,
  },
];

async function main() {
  const input = [
    { role: "user", content: "¿Qué tiempo hace en Palma y en Madrid?" },
  ];

  // Paso 1: primera llamada
  let response = await openai.responses.create({
    model: "gpt-4o-mini",
    input,
    tools,
  });

  // Paso 2: ejecutar cada function_call que haya pedido el modelo
  for (const item of response.output) {
    if (item.type === "function_call") {
      const args = JSON.parse(item.arguments);
      const result = getWeather(args.city);
      console.log(`🔧 Llamando a ${item.name}(${args.city}) =`, result);

      // Añadimos el call y su resultado al historial
      input.push(item);
      input.push({
        type: "function_call_output",
        call_id: item.call_id,
        output: JSON.stringify(result),
      });
    }
  }

  // Paso 3: segunda llamada para que el modelo use los resultados
  response = await openai.responses.create({
    model: "gpt-4o-mini",
    input,
    tools,
  });

  console.log("\n🤖", response.output_text);
}

main().catch(console.error);
