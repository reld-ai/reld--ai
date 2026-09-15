import { CreateMLCEngine } from "@mlc-ai/web-llm";

let engine = null;

const MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

export async function getEngine(onProgress = () => {}) {
  if (engine) return engine;

  console.log("Loading Reld AI model...");

  engine = await CreateMLCEngine(MODEL, {
    initProgressCallback: (progress) => {
      console.log(progress.text);
      onProgress(progress);
    }
  });

  console.log("Reld AI model loaded.");

  return engine;
}

export { MODEL };
