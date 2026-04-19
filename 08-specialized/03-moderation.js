/**
 * 46 - Moderation API
 * -------------------
 * Clasifica texto/imagen en categorías de contenido (violencia, sexual, odio...).
 * Es GRATIS. Úsala siempre antes de mostrar inputs/outputs al usuario.
 *
 * Modelo recomendado: omni-moderation-latest (soporta texto + imagen)
 *
 * Ejecutar: node 08-specialized/03-moderation.js
 */
const { openai } = require("../shared/client");

async function main() {
  const textos = [
    "Me encanta cocinar paella los domingos.",
    "Voy a matar a mi vecino por ruido.",
    "Este tutorial está buenísimo, gracias.",
  ];

  for (const texto of textos) {
    const r = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: texto,
    });

    const result = r.results[0];
    const flagged = result.flagged;
    const categorias = Object.entries(result.categories)
      .filter(([, v]) => v)
      .map(([k]) => k);

    console.log(flagged ? "🚫" : "✅", `"${texto}"`);
    if (flagged) {
      console.log("   Categorías:", categorias.join(", "));
    }
  }
}

main().catch(console.error);
