/**
 * Ponto único de importação dos contratos de resposta da API de gestão. Os
 * schemas zod e a versão vêm do pacote do servidor
 * (`wpp_prospector_bot_server/contracts`) — não redefina DTOs aqui.
 */
export {
  MANAGEMENT_CONTRACT_VERSION,
  CONVERSATION_STATES,
  conversationStateSchema,
  leadIntentSchema,
  leadQualificationSchema,
  commercialPlanSchema,
  moduleIdSchema,
  isoDateStringSchema,
  conversationListItemSchema,
  conversationListPageSchema,
  conversationDetailTurnSchema,
  conversationDetailSchema,
  CONSUMPTION_GROUP_BY,
  consumptionGroupBySchema,
  consumptionTotalsSchema,
  consumptionRowSchema,
  consumptionSeriesSchema,
  overviewSchema,
  EMPTY_OVERVIEW,
  CONVERSATIONS_PAGE_DEFAULT,
  CONVERSATIONS_PAGE_MAX,
} from "wpp_prospector_bot_server/contracts";

export type {
  ConversationListItem,
  ConversationListPage,
  ConversationDetail,
  ConsumptionTotals,
  ConsumptionRow,
  ConsumptionSeries,
  Overview,
} from "wpp_prospector_bot_server/contracts";

import type { consumptionGroupBySchema } from "wpp_prospector_bot_server/contracts";
import type { z } from "zod";

/** `"day" | "lead" | "model" | "category"`. */
export type ConsumptionGroupBy = z.infer<typeof consumptionGroupBySchema>;
