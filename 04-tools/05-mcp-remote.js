/**
 * 26 - MCP (Model Context Protocol) remoto
 * ----------------------------------------
 * Conecta el modelo a un servidor MCP externo (Stripe, GitHub, Notion, tu API...)
 * sin tener que escribir handlers de function calling manualmente.
 *
 * Ejemplo: usamos el MCP público de los docs de Anthropic.
 * En producción apuntarás al tuyo.
 *
 * Ejecutar: node 04-tools/05-mcp-remote.js
 */
const { openai } = require("../shared/client");

async function main() {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    tools: [
      {
        type: "mcp",
        server_label: "docs-anthropic",
        server_url: "https://mcp.deepwiki.com/mcp",
        require_approval: "never", // "always" para producción con aprobación humana
      },
    ],
    input:
      "Consulta la documentación del repo anthropics/anthropic-cookbook y dime qué ejemplos tiene sobre tool use.",
  });

  console.log(response.output_text);

  // Ver qué llamadas MCP hizo el modelo
  for (const item of response.output || []) {
    if (item.type === "mcp_call") {
      console.log(`\n🔌 MCP: ${item.server_label}.${item.name}`);
    }
  }
}

main().catch(console.error);
