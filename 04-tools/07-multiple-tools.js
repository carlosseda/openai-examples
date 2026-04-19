/**
 * 28 - Combinando varias herramientas
 * -----------------------------------
 * Puedes activar múltiples tools a la vez y el modelo decide cuál usar.
 * Aquí: web search + code interpreter + una function propia.
 *
 * Ejecutar: node 04-tools/07-multiple-tools.js
 */
const { openai } = require("../shared/client");

function getExchangeRate(from, to) {
  // mock: en real usarías una API de divisas
  const rates = { "USD-EUR": 0.92, "EUR-USD": 1.09 };
  return rates[`${from}-${to}`] || null;
}

async function main() {
  const input = [
    {
      role: "user",
      content:
        "Busca el precio actual del Bitcoin en USD, después conviértelo a EUR y finalmente calcula cuántos BTC podría comprar con 5000€.",
    },
  ];

  const tools = [
    { type: "web_search" },
    { type: "code_interpreter", container: { type: "auto" } },
    {
      type: "function",
      name: "get_exchange_rate",
      description: "Tipo de cambio entre dos divisas",
      parameters: {
        type: "object",
        properties: {
          from: { type: "string" },
          to: { type: "string" },
        },
        required: ["from", "to"],
        additionalProperties: false,
      },
      strict: true,
    },
  ];

  let iter = 0;
  while (iter++ < 10) {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      tools,
    });

    const calls = response.output.filter((i) => i.type === "function_call");

    if (calls.length === 0) {
      console.log("\n🤖", response.output_text);
      break;
    }

    for (const call of calls) {
      const args = JSON.parse(call.arguments);
      const result = getExchangeRate(args.from, args.to);
      console.log(`🔧 ${call.name}(${JSON.stringify(args)}) →`, result);
      input.push(call);
      input.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify({ rate: result }),
      });
    }
  }
}

main().catch(console.error);
