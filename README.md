# OpenAI API Demos (Node.js CommonJS)

Colección de scripts independientes, uno por cada funcionalidad de la API de OpenAI. Pensado para aprender ejecutando cada archivo y viendo el resultado.

## Instalación

```bash
npm install
cp .env.example .env
# edita .env y pon tu OPENAI_API_KEY
```

## Ejecución

Cada script se ejecuta por separado:

```bash
node 02-responses/01-instructions.js
node 02-responses/04-streaming.js
# ...
```

## Índice

### 01 · Fundamentos
| # | Archivo | Qué hace |
|---|---|---|
| 01 | `01-basics/01-hello-world.js` | Primera petición a Responses |
| 02 | `01-basics/02-list-models.js` | Listar modelos disponibles |
| 03 | `01-basics/03-count-tokens.js` | Estimar tokens de un texto |

### 02 · Responses API (núcleo)
| # | Archivo | Qué hace |
|---|---|---|
| 04 | `02-responses/01-instructions.js` | System prompt con `instructions` |
| 05 | `02-responses/02-multi-turn.js` | Conversación con array de mensajes |
| 06 | `02-responses/03-conversation-state.js` | Estado con `previous_response_id` |
| 07 | `02-responses/04-streaming.js` | Respuesta token a token |
| 08 | `02-responses/05-structured-output.js` | JSON Schema estricto |
| 09 | `02-responses/06-structured-output-zod.js` | Structured outputs con Zod |
| 10 | `02-responses/07-function-calling.js` | Function calling básico |
| 11 | `02-responses/08-function-calling-loop.js` | Loop agéntico con funciones |
| 12 | `02-responses/09-reasoning.js` | Modelos de razonamiento (o-series) |
| 13 | `02-responses/10-generation-params.js` | temperature, top_p, max_tokens |

### 03 · Multimodal
| # | Archivo | Qué hace |
|---|---|---|
| 14 | `03-multimodal/01-vision-url.js` | Analizar imagen por URL |
| 15 | `03-multimodal/02-vision-local.js` | Analizar imagen local (base64) |
| 16 | `03-multimodal/03-image-generation.js` | Generar imagen con gpt-image-1 |
| 17 | `03-multimodal/04-text-to-speech.js` | TTS con voces |
| 18 | `03-multimodal/05-speech-to-text.js` | Transcripción (Whisper) |
| 19 | `03-multimodal/06-audio-translation.js` | Traducir audio a inglés |
| 20 | `03-multimodal/07-audio-input.js` | Razonar sobre audio (gpt-4o-audio) |
| 21 | `03-multimodal/08-pdf-input.js` | PDF como input del modelo |

### 04 · Tools integradas
| # | Archivo | Qué hace |
|---|---|---|
| 22 | `04-tools/01-web-search.js` | Búsqueda web nativa |
| 23 | `04-tools/02-file-search.js` | RAG con vector stores |
| 24 | `04-tools/03-code-interpreter.js` | Ejecutar Python en sandbox |
| 25 | `04-tools/04-image-gen-tool.js` | Generar imágenes dentro del flujo |
| 26 | `04-tools/05-mcp-remote.js` | Conectar a servidor MCP externo |
| 27 | `04-tools/06-computer-use.js` | Boilerplate de computer use |
| 28 | `04-tools/07-multiple-tools.js` | Combinar varias tools |

### 05 · Agents SDK (`npm i @openai/agents`)
| # | Archivo | Qué hace |
|---|---|---|
| 29 | `05-agents/01-basic-agent.js` | Agente básico |
| 30 | `05-agents/02-agent-with-tools.js` | Agente con tools propias |
| 31 | `05-agents/03-handoffs.js` | Triage y handoffs |
| 32 | `05-agents/04-guardrails.js` | Input guardrails |
| 33 | `05-agents/05-streaming.js` | Agente en streaming |

### 06 · Realtime
| # | Archivo | Qué hace |
|---|---|---|
| 34 | `06-realtime/01-realtime-websocket.js` | Conexión WS (`npm i ws`) |
| 35 | `06-realtime/02-ephemeral-token.js` | Token efímero para navegador |
| 36 | `06-realtime/03-transcription-session.js` | Sesión de transcripción en vivo |

### 07 · Producción
| # | Archivo | Qué hace |
|---|---|---|
| 37 | `07-production/01-batch-api.js` | Batch API (50% más barato) |
| 38 | `07-production/02-background-mode.js` | Tareas largas en background |
| 39 | `07-production/03-webhooks.js` | Receptor de webhooks con firma |
| 40 | `07-production/04-retries.js` | Retries + backoff exponencial |
| 41 | `07-production/05-prompt-caching.js` | Prompt caching automático |
| 42 | `07-production/06-error-handling.js` | Tipos de error y rate limits |
| 43 | `07-production/07-usage-cost.js` | Medir uso y coste estimado |

### 08 · Modelos especializados
| # | Archivo | Qué hace |
|---|---|---|
| 44 | `08-specialized/01-embeddings-basic.js` | Vector a partir de texto |
| 45 | `08-specialized/02-semantic-search.js` | Búsqueda por similaridad coseno |
| 46 | `08-specialized/03-moderation.js` | Moderación (gratis) |
| 47 | `08-specialized/04-deep-research.js` | Deep research en background |
| 48 | `08-specialized/05-classification.js` | Clasificación por embeddings |

### 09 · Evaluación
| # | Archivo | Qué hace |
|---|---|---|
| 49 | `09-evals/01-basic-eval.js` | Eval con string-check |
| 50 | `09-evals/02-llm-judge.js` | Eval con LLM-as-judge |

## Dependencias opcionales

Algunos scripts requieren paquetes extra que **no están en package.json por defecto**:

```bash
npm install @openai/agents     # scripts de 05-agents
npm install ws                 # scripts de 06-realtime
npm install js-tiktoken        # conteo exacto de tokens
```

## Notas

- Los modelos concretos (`gpt-4o-mini`, `o4-mini`, `gpt-image-1`, etc.) pueden cambiar. Consulta `01-basics/02-list-models.js` o el dashboard para ver los que tienes disponibles.
- Algunos ejemplos necesitan archivos en `assets/` (imagen, PDF, audio). El script te avisa si falta.
- Los scripts de 05-agents, 06-realtime y 07-production/03-webhooks requieren dependencias adicionales (ver arriba).
- El script 37 (batch) y 47 (deep research) pueden tardar varios minutos en completarse.
