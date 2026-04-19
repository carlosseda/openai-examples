/**
 * 11 - Function Calling con loop agéntico
 * ---------------------------------------
 * Versión más robusta: el modelo puede llamar a funciones varias veces
 * en bucle hasta completar la tarea. Patrón típico para agentes.
 *
 * Ejecutar: node 02-responses/08-function-calling-loop.js
 */
const { openai } = require("../shared/client");

// Base de datos fake
const usuarios = {
  1: { id: 1, nombre: "Ana", email: "ana@mail.com" },
  2: { id: 2, nombre: "Bob", email: "bob@mail.com" },
};
const pedidos = {
  1: [
    { id: 101, producto: "Café", total: 12 },
    { id: 102, producto: "Taza", total: 8 },
  ],
  2: [{ id: 201, producto: "Molinillo", total: 45 }],
};

const handlers = {
  get_user: ({ id }) => usuarios[id] || null,
  get_orders: ({ user_id }) => pedidos[user_id] || [],
};

const tools = [
  {
    type: "function",
    name: "get_user",
    description: "Devuelve datos de un usuario por ID",
    parameters: {
      type: "object",
      properties: { id: { type: "integer" } },
      required: ["id"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: "function",
    name: "get_orders",
    description: "Devuelve los pedidos de un usuario",
    parameters: {
      type: "object",
      properties: { user_id: { type: "integer" } },
      required: ["user_id"],
      additionalProperties: false,
    },
    strict: true,
  },
];

async function main() {
  const input = [
    {
      role: "user",
      content:
        "Dame un resumen de lo que ha comprado el usuario 1. Incluye su nombre.",
    },
  ];

  // Bucle hasta que el modelo deje de pedir funciones
  let keepGoing = true;
  let iter = 0;
  while (keepGoing && iter++ < 10) {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      tools,
    });

    const calls = response.output.filter((i) => i.type === "function_call");

    if (calls.length === 0) {
      console.log("\n🤖", response.output_text);
      keepGoing = false;
      break;
    }

    // Ejecutar todas las llamadas pedidas
    for (const call of calls) {
      const args = JSON.parse(call.arguments);
      const result = handlers[call.name](args);
      console.log(`🔧 ${call.name}(${JSON.stringify(args)}) →`, result);

      input.push(call);
      input.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(result),
      });
    }
  }
}

main().catch(console.error);
