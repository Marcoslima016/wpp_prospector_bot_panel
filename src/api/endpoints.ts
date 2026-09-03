import { apiFetch } from "./client";
import {
  conversationDetailSchema,
  conversationListPageSchema,
  consumptionSeriesSchema,
  overviewSchema,
  type ConsumptionGroupBy,
  type ConsumptionSeries,
  type ConversationDetail,
  type ConversationListPage,
  type Overview,
} from "./contracts";
import { parseWithContract } from "./parse";

export interface ConversationListParams {
  state?: string;
  leadIntent?: string;
  phone?: string;
  activityFrom?: string;
  activityTo?: string;
  limit?: number;
  cursor?: string;
}

export async function listConversations(
  params: ConversationListParams = {},
  signal?: AbortSignal,
): Promise<ConversationListPage> {
  const data = await apiFetch("/conversations", { query: { ...params }, signal });
  return parseWithContract(conversationListPageSchema, data);
}

export async function getConversation(
  leadPhone: string,
  signal?: AbortSignal,
): Promise<ConversationDetail> {
  const data = await apiFetch(`/conversations/${encodeURIComponent(leadPhone)}`, { signal });
  return parseWithContract(conversationDetailSchema, data);
}

export interface ConsumptionParams {
  from: string;
  to: string;
  groupBy: ConsumptionGroupBy;
}

export async function getConsumption(
  params: ConsumptionParams,
  signal?: AbortSignal,
): Promise<ConsumptionSeries> {
  const data = await apiFetch("/stats/consumption", { query: { ...params }, signal });
  return parseWithContract(consumptionSeriesSchema, data);
}

export async function getOverview(signal?: AbortSignal): Promise<Overview> {
  const data = await apiFetch("/stats/overview", { signal });
  return parseWithContract(overviewSchema, data);
}

/** Troca o segredo compartilhado por um cookie de sessão. Lança `ApiError` (401) no segredo errado. */
export async function createSession(secret: string): Promise<void> {
  await apiFetch("/session", { method: "POST", body: { secret }, emitSessionLost: false });
}

export async function deleteSession(): Promise<void> {
  await apiFetch("/session", { method: "DELETE", emitSessionLost: false });
}

// --- Ações sobre a conversa (change add-management-conversation-actions) ---
// As funções existem sempre; a disponibilidade real é decidida por
// `useActionAvailability`. Um deploy sem esses endpoints responde 404.

export async function handoffConversation(leadPhone: string): Promise<void> {
  await apiFetch(`/conversations/${encodeURIComponent(leadPhone)}/handoff`, { method: "POST" });
}

export async function resumeConversation(leadPhone: string): Promise<void> {
  await apiFetch(`/conversations/${encodeURIComponent(leadPhone)}/resume`, { method: "POST" });
}

export async function sendManualMessage(leadPhone: string, text: string): Promise<void> {
  await apiFetch(`/conversations/${encodeURIComponent(leadPhone)}/messages`, {
    method: "POST",
    body: { text },
  });
}

export interface Capabilities {
  conversationActions: boolean;
  prospecting: boolean;
}

/** `null` quando o deploy ainda não expõe `/admin/api/capabilities` (→ usar flags de build). */
export async function getCapabilities(signal?: AbortSignal): Promise<Capabilities | null> {
  try {
    const data = await apiFetch<Partial<Capabilities>>("/capabilities", { signal });
    return {
      conversationActions: Boolean(data?.conversationActions),
      prospecting: Boolean(data?.prospecting),
    };
  } catch {
    return null;
  }
}
