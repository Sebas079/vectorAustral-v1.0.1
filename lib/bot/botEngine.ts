import {
  fallbackResponse,
  knowledgeBase,
  pricingKeywords,
  pricingResponse,
  type KnowledgeEntry,
} from "./knowledgeBase";

export interface BotResponse {
  message: string;
  intent: "knowledge" | "pricing" | "fallback";
  shouldRedirectToContact: boolean;
}

function normalizeText(input: string): string {
  return input.trim().toLocaleLowerCase("es-AR");
}

function findKnowledgeEntry(message: string): KnowledgeEntry | undefined {
  return knowledgeBase.find((entry) =>
    entry.keywords.some((keyword) => message.includes(keyword)),
  );
}

export function answerBot(message: string): BotResponse {
  const normalizedMessage = normalizeText(message);

  if (!normalizedMessage) {
    return {
      message: fallbackResponse,
      intent: "fallback",
      shouldRedirectToContact: true,
    };
  }

  if (pricingKeywords.some((keyword) => normalizedMessage.includes(keyword))) {
    return {
      message: pricingResponse,
      intent: "pricing",
      shouldRedirectToContact: true,
    };
  }

  const entry = findKnowledgeEntry(normalizedMessage);

  if (!entry) {
    return {
      message: fallbackResponse,
      intent: "fallback",
      shouldRedirectToContact: true,
    };
  }

  return {
    message: entry.response,
    intent: "knowledge",
    shouldRedirectToContact: false,
  };
}
