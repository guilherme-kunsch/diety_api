import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id";
import { boolean, string, z } from "zod";
import dbKnex from "../database";
import { randomUUID } from "crypto";
import knex from "knex";

export function meals(app: FastifyInstance) {
    app.post('/', { preHandler: checkSessionIdExists }, async (request, reply) => {
        const mealsSchema = z.object({
            name: string().trim(),
            description: string().trim(),
            isOnDiet: boolean(),
            date: z.coerce.date()
        })

        const { name, description, isOnDiet, date } = mealsSchema.parse(request.body)

        await dbKnex('meals').insert({
            id: randomUUID(),
            name,
            description,
            is_on_diet: isOnDiet,
            date: date.getTime(),
            user_id: request.user?.id
        })

        console.log("POST user_id:", request.user?.id); // No método POST

        return reply.code(201).send("Meals create")
    })

    app.get('/',{ preHandler: [checkSessionIdExists] }, async (request, reply) => {
            const meals = await dbKnex("meals").where({ user_id: request.user?.id })

            console.log("GET user_id:", request.user?.id); // No método GET

            return reply.send({ meals })
        },
    )
}