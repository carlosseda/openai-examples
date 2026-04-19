/**
 * 09 - Structured Outputs con Zod
 * -------------------------------
 * En vez de escribir el JSON Schema a mano, defines un esquema Zod
 * y el SDK lo convierte. Más cómodo y con autocompletado.
 *
 * Ejecutar: node 02-responses/06-structured-output-zod.js
 */
const { openai } = require("../shared/client");
const { z } = require("zod");
const { zodTextFormat } = require("openai/helpers/zod");

const Producto = z.object({
  nombre: z.string(),
  precio_eur: z.number(),
  stock: z.number().int(),
  categorias: z.array(z.string()),
});

const ListaProductos = z.object({
  productos: z.array(Producto),
});

async function main() {
  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input:
      "Inventa 3 productos para una tienda online de café. Devuelve nombre, precio, stock y categorías.",
    text: {
      format: zodTextFormat(ListaProductos, "lista_productos"),
    },
  });

  // response.output_parsed ya viene como objeto JS validado
  console.dir(response.output_parsed, { depth: null });
}

main().catch(console.error);
