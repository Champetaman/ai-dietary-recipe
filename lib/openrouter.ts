export type FreeModel = {
  id: string;
  label: string;
};

const DEFAULT_CHAT_MODELS = [
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama 3.3 70B" },
  { id: "nousresearch/hermes-3-llama-3.1-405b:free", label: "Hermes 3 405B" },
  { id: "google/gemma-4-26b-a4b-it:free", label: "Gemma 4 26B" },
  { id: "qwen/qwen3-next-80b-a3b-instruct:free", label: "Qwen 3 Next 80B" },
  { id: "openai/gpt-oss-120b:free", label: "OpenAI 120B" },
] as const;

export type OpenRouterRole = "system" | "user" | "assistant" | "tool";

export type OpenRouterMessage = {
  role: OpenRouterRole;
  content: string;
  tool_call_id?: string;
  name?: string;
};

export type AgentTool = {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
};

export type AgentConfig = {
  apiKey?: string;
  model?: string;
  instructions?: string;
  tools?: AgentTool[];
  maxSteps?: number;
};

export type AgentEvents = {
  "message:user": OpenRouterMessage;
  "message:assistant": OpenRouterMessage;
  "tool:call": { name: string; args: Record<string, unknown> };
  "tool:result": { name: string; result: unknown };
  error: Error;
};

type EventName = keyof AgentEvents;
type Listener<T extends EventName> = (payload: AgentEvents[T]) => void;

type OpenRouterResponse = {
  id?: string;
  model?: string;
  choices?: Array<{
    message?: {
      role?: "assistant";
      content?: string | null;
      tool_calls?: Array<{
        id?: string;
        type?: "function";
        function?: {
          name?: string;
          arguments?: string;
        };
      }>;
    };
  }>;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function parseChatModels(value: string | undefined) {
  if (!value?.trim()) {
    return [...DEFAULT_CHAT_MODELS];
  }

  const models = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [id, label] = entry.split("|").map((item) => item.trim());
      return id
        ? {
            id,
            label: label || id,
          }
        : null;
    })
    .filter((item): item is FreeModel => Boolean(item));

  return models.length ? models : [...DEFAULT_CHAT_MODELS];
}

export const FREE_MODELS: FreeModel[] = parseChatModels(
  process.env.NEXT_PUBLIC_OPENROUTER_CHAT_MODELS,
);

function getApiKey(explicitApiKey?: string) {
  const apiKey = explicitApiKey ?? process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY.");
  }

  return apiKey;
}

function safeJsonParse(value: string | undefined) {
  if (!value) {
    return {};
  }

  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function toolToSchema(tool: AgentTool) {
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters ?? {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
    },
  };
}

export function isSupportedFreeModel(model: string) {
  return FREE_MODELS.some((item) => item.id === model);
}

export async function createOpenRouterCompletion(
  payload: Record<string, unknown>,
  apiKey?: string,
) {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(30000),
    headers: {
      Authorization: `Bearer ${getApiKey(apiKey)}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "AI Recipe Studio",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as Record<string, unknown>;

  if (!response.ok) {
    const apiMessage =
      typeof data.error === "object" &&
      data.error &&
      "message" in data.error &&
      typeof data.error.message === "string"
        ? data.error.message
        : "OpenRouter request failed.";

    const models = Array.isArray(payload.models)
      ? payload.models.join(", ")
      : typeof payload.model === "string"
        ? payload.model
        : "unknown";

    throw new Error(
      `OpenRouter request failed (${response.status} ${response.statusText}) for model selection [${models}]. ${apiMessage}`,
    );
  }

  return data;
}

export class OpenRouterAgent {
  private apiKey: string;
  private model: string;
  private instructions: string;
  private maxSteps: number;
  private tools: AgentTool[];
  private messages: OpenRouterMessage[] = [];
  private listeners: {
    [K in EventName]: Set<Listener<K>>;
  } = {
    "message:user": new Set(),
    "message:assistant": new Set(),
    "tool:call": new Set(),
    "tool:result": new Set(),
    error: new Set(),
  };

  constructor(config: AgentConfig = {}) {
    this.apiKey = getApiKey(config.apiKey);
    this.model = config.model ?? "openrouter/auto";
    this.instructions = config.instructions ?? "You are a helpful assistant.";
    this.maxSteps = config.maxSteps ?? 5;
    this.tools = config.tools ?? [];
  }

  on<T extends EventName>(event: T, listener: Listener<T>) {
    this.listeners[event].add(listener as never);
    return () => this.off(event, listener);
  }

  off<T extends EventName>(event: T, listener: Listener<T>) {
    this.listeners[event].delete(listener as never);
  }

  private emit<T extends EventName>(event: T, payload: AgentEvents[T]) {
    for (const listener of this.listeners[event]) {
      listener(payload as never);
    }
  }

  getMessages() {
    return [...this.messages];
  }

  clearHistory() {
    this.messages = [];
  }

  setInstructions(instructions: string) {
    this.instructions = instructions;
  }

  addTool(tool: AgentTool) {
    this.tools.push(tool);
  }

  private async callModel() {
    return (await createOpenRouterCompletion(
      {
        model: this.model,
        messages: [
          { role: "system", content: this.instructions },
          ...this.messages,
        ],
        tools: this.tools.length ? this.tools.map(toolToSchema) : undefined,
        tool_choice: this.tools.length ? "auto" : undefined,
      },
      this.apiKey,
    )) as OpenRouterResponse;
  }

  async send(content: string) {
    const userMessage: OpenRouterMessage = { role: "user", content };
    this.messages.push(userMessage);
    this.emit("message:user", userMessage);

    let steps = 0;

    try {
      while (steps < this.maxSteps) {
        steps += 1;
        const response = await this.callModel();
        const message = response.choices?.[0]?.message;

        if (!message) {
          throw new Error("No assistant message returned.");
        }

        const toolCalls = message.tool_calls ?? [];
        const assistantText =
          typeof message.content === "string" ? message.content : "";

        if (assistantText.trim()) {
          const assistantMessage: OpenRouterMessage = {
            role: "assistant",
            content: assistantText,
          };
          this.messages.push(assistantMessage);
          this.emit("message:assistant", assistantMessage);
        }

        if (!toolCalls.length) {
          return assistantText;
        }

        this.messages.push({
          role: "assistant",
          content: assistantText,
        });

        for (const toolCall of toolCalls) {
          const toolName = toolCall.function?.name;
          const tool = this.tools.find((item) => item.name === toolName);

          if (!tool || !toolName) {
            continue;
          }

          const args = safeJsonParse(toolCall.function?.arguments);
          this.emit("tool:call", { name: toolName, args });

          const result = await tool.execute(args);
          this.emit("tool:result", { name: toolName, result });

          this.messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: toolName,
            content: JSON.stringify(result),
          });
        }
      }

      throw new Error("Agent reached maxSteps before completion.");
    } catch (error) {
      const normalized =
        error instanceof Error ? error : new Error(String(error));
      this.emit("error", normalized);
      throw normalized;
    }
  }

  async sendSync(content: string) {
    return this.send(content);
  }
}

export function createAgent(config: AgentConfig = {}) {
  return new OpenRouterAgent(config);
}
