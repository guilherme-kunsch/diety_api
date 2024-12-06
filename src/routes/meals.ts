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

        return reply.code(201).send("Meals create")
    })

    app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const meals = await dbKnex("meals").where({ user_id: request.user?.id })
        return reply.send({ meals })
    },
    )

    app.get('/:mealId', { preHandler: [checkSessionIdExists] }, async(request, reply) => {
        const paramsSchema = z.object({ mealId: z.string().uuid() })

        const { mealId } = paramsSchema.parse(request.params)
    } )

    app.put("/:mealId", { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const paramsSchema = z.object({ mealId: z.string().uuid() })

        const { mealId } = paramsSchema.parse(request.params)

        
        const updateMealIdSchema = z.object({
            name: string().trim(),
            description: string().trim(),
            isOnDiet: boolean(),
            date: z.coerce.date()
        })

        const { name, description, isOnDiet, date } = updateMealIdSchema.parse(request.body)

        const meal = dbKnex('meals').where({ id: mealId }).first()

        if(!meal) {
            return reply.code(404).send("meal not exist")
        }

        await dbKnex('meals').update({
            name,
            description,
            is_on_diet: isOnDiet,
            date: date.getTime()
        })

        return reply.code(200).send("updated meal")
    })
}