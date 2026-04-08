import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionOrError, parseBodyOrError } from "@/lib/api-helpers";
import { createConversationSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    const parsed = await parseBodyOrError(request, createConversationSchema);
    if (parsed.error) return parsed.error;
    const { projectId, participantIds } = parsed.data;

    // Ensure current user is included in participants
    const allParticipantIds = Array.from(new Set([session.userId, ...participantIds]));

    // Check if conversation already exists between these participants for this project
    if (projectId) {
      const existing = await prisma.conversation.findFirst({
        where: {
          projectId,
          participants: {
            every: {
              userId: { in: allParticipantIds },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (existing && existing.participants.length === allParticipantIds.length) {
        return NextResponse.json({ data: existing });
      }
    }

    const conversation = await prisma.conversation.create({
      data: {
        projectId: projectId ?? null,
        participants: {
          create: allParticipantIds.map((userId) => ({ userId })),
        },
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json({ data: conversation }, { status: 201 });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "会話の作成中にエラーが発生しました" },
      { status: 500 },
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const auth = await getSessionOrError();
    if (auth.error) return auth.error;
    const { session } = auth;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: session.userId },
        },
      },
      include: {
        project: {
          select: { id: true, serviceUnit: true, buildingType: true },
        },
        participants: {
          include: {
            // We need the user info for display
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Enrich with participant names and unread counts
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            senderId: { not: session.userId },
            isRead: false,
          },
        });

        // Get other participant info
        const otherParticipantIds = conv.participants
          .filter((p) => p.userId !== session.userId)
          .map((p) => p.userId);

        const otherUsers = await prisma.user.findMany({
          where: { id: { in: otherParticipantIds } },
          select: {
            id: true,
            email: true,
            role: true,
            clientProfile: { select: { contactName: true, companyName: true } },
            contractorProfile: { select: { contactName: true, companyName: true } },
            leadBuyerProfile: { select: { contactName: true, companyName: true } },
          },
        });

        return {
          id: conv.id,
          projectId: conv.projectId,
          project: conv.project,
          lastMessage: conv.messages[0] ?? null,
          unreadCount,
          otherParticipants: otherUsers,
          updatedAt: conv.updatedAt,
        };
      }),
    );

    return NextResponse.json({ data: enriched });
  } catch (error) {
    console.error("List conversations error:", error);
    return NextResponse.json(
      { error: "会話一覧の取得中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
