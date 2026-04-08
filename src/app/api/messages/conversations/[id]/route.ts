import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError, createNotification } from "@/lib/api-helpers";
import { sendMessageSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;

    // Verify participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId: session.userId } },
    });
    if (!participant) {
      return NextResponse.json(
        { error: "この会話にアクセスする権限がありません" },
        { status: 403 },
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, serviceUnit: true, buildingType: true },
        },
        participants: true,
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                role: true,
                clientProfile: { select: { contactName: true } },
                contractorProfile: { select: { contactName: true } },
                leadBuyerProfile: { select: { contactName: true } },
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "会話が見つかりません" },
        { status: 404 },
      );
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: session.userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    // Update lastReadAt
    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId: id, userId: session.userId } },
      data: { lastReadAt: new Date() },
    });

    return NextResponse.json({ data: conversation });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: "会話の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;
    const { id } = await params;

    // Verify participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId: session.userId } },
    });
    if (!participant) {
      return NextResponse.json(
        { error: "この会話にメッセージを送信する権限がありません" },
        { status: 403 },
      );
    }

    const parsed = await parseBodyOrError(request, sendMessageSchema);
    if (parsed.error) return parsed.error;
    const { content } = parsed.data;

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: session.userId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            clientProfile: { select: { contactName: true } },
            contractorProfile: { select: { contactName: true } },
            leadBuyerProfile: { select: { contactName: true } },
          },
        },
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Notify other participants
    const otherParticipants = await prisma.conversationParticipant.findMany({
      where: { conversationId: id, userId: { not: session.userId } },
    });

    const senderName =
      message.sender.clientProfile?.contactName ??
      message.sender.contractorProfile?.contactName ??
      message.sender.leadBuyerProfile?.contactName ??
      message.sender.email;

    for (const p of otherParticipants) {
      await createNotification({
        userId: p.userId,
        type: "MESSAGE_NEW",
        title: "新着メッセージ",
        message: `${senderName}さんからメッセージが届きました。`,
        linkUrl: `/dashboard/issuer/messages?conversation=${id}`,
      });
    }

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "メッセージの送信中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
