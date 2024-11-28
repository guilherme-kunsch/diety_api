  import { FastifyReply, FastifyRequest } from 'fastify'
  import dbKnex from '../database'

  export async function checkSessionIdExists(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const user = await dbKnex('user').where({ session_id: sessionId }).first()

    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    request.user = user
  }
