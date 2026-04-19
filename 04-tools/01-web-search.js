/**
 * 22 - Web Search (herramienta integrada)
 * ---------------------------------------
 * El modelo busca en internet por sí solo. No tienes que hacer nada más
 * que activar la tool. Devuelve respuesta con citas a las fuentes.
 *
 * Ejecutar: node 04-tools/01-web-search.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    tools: [{ type: "web_search" }],
    input:
      "¿Cuáles son las últimas noticias sobre la API de OpenAI de esta semana? Incluye fechas.",
  });

  console.log("🤖 Respuesta:\n", response.output_text);

  // Extraer citas (URLs que usó el modelo)
  const citations = [];
  for (const item of response.output || []) {
    if (item.type === "message") {
      for (const c of item.content || []) {
        for (const a of c.annotations || []) {
          if (a.type === "url_citation") {
            citations.push({ title: a.title, url: a.url });
          }
        }
      }
    }
  }

  if (citations.length) {
    console.log("\n🔗 Fuentes:");
    citations.forEach((c, i) => console.log(` ${i + 1}. ${c.title}\n    ${c.url}`));
  }
}

main().catch(console.error);
