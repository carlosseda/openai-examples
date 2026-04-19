/**
 * 08 - Structured Outputs (JSON Schema)
 * -------------------------------------
 * Fuerza al modelo a devolver JSON que cumpla un esquema exacto.
 * Mucho mejor que "dile que devuelva JSON": aquí está GARANTIZADO.
 *
 * Ejecutar: node 02-responses/05-structured-output.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input:
      "Extrae la información de esta reserva: 'Juan Pérez quiere mesa para 4 el viernes 25 a las 21:00, alérgico a los frutos secos.'",
    text: {
      format: {
        type: "json_schema",
        name: "reserva",
        strict: true,
        schema: {
          type: "object",
          properties: {
            nombre: { type: "string" },
            personas: { type: "integer" },
            fecha: { type: "string", description: "Formato YYYY-MM-DD" },
            hora: { type: "string", description: "Formato HH:MM" },
            alergias: { type: "array", items: { type: "string" } },
          },
          required: ["nombre", "personas", "fecha", "hora", "alergias"],
          additionalProperties: false,
        },
      },
    },
  });

  const data = JSON.parse(response.output_text);
  console.log("Datos extraídos:");
  console.dir(data, { depth: null });
}

main().catch(console.error);
