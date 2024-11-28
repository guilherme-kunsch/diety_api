import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from "crypto";

export async function getSessionId(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
        sessionId = randomUUID();
        reply.cookie('sessionId', sessionId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
        });
    }

    return sessionId;
}
