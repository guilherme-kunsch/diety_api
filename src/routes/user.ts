import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import knex from "knex";
import { z } from 'zod'
import dbKnex from "../database";
import { getSessionId } from "../middlewares/check-cookies";

export async function user(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const userSchema = z.object({
          name: z.string().trim(),
          surname: z.string().trim(),
          email: z.string().trim(),
        });
      
        const { name, surname, email } = userSchema.parse(request.body);
      
        let sessionId = await getSessionId(request, reply);
      
        const userEmail = await dbKnex('user').where({ email }).first();
        if (userEmail) {
          return reply.status(400).send({ message: 'User already exists' });
        }
      
        const existingSession = await dbKnex('user').where({ session_id: sessionId }).first();
        if (existingSession) {
          sessionId = randomUUID();
          reply.cookie('sessionId', sessionId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          });
        }
      
        await dbKnex('user').insert({
          id: randomUUID(),
          name,
          surname,
          email,
          session_id: sessionId,
        });
      
        return reply.code(201).send("User created");
      });
      
}