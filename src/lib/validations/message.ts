import { z } from "zod";

export const createConversationSchema = z.object({
  projectId: z.string().optional(),
  participantIds: z.array(z.string()).min(1, "参加者を指定してください"),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "メッセージを入力してください").max(10000),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
