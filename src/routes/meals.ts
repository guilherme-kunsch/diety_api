import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id";
import { boolean, string, z } from "zod";
import dbKnex from "../database";
import { randomUUID } from "crypto";
import { user } from "./user";
import { send } from "process";

export function meals(app: FastifyInstance) {
    app.post('/', { preHandler: checkSessionIdExists }, async (request, reply) => {
        try {
            const mealsSchema = z.object({
                name: string().trim(),
                description: string().trim(),
                isOnDiet: boolean(),
                date: z.coerce.date()
            });

            const { name, description, isOnDiet, date } = mealsSchema.parse(request.body);

            const mealId = randomUUID();
            await dbKnex('meals').insert({
                id: mealId,
                name,
                description,
                is_on_diet: isOnDiet,
                date: date.getTime(),
                user_id: request.user?.id
            });

            return reply.code(201).send({ id: mealId });
        } catch (error) {
            return reply.code(400).send({ error: "Invalid data", details: error });
        }
    });

    app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        const meals = await dbKnex("meals").where({ user_id: request.user?.id });
        return reply.send({ meals });
    });

    app.get('/:mealId', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        try {
            const paramsSchema = z.object({ mealId: z.string().uuid() });
            const { mealId } = paramsSchema.parse(request.params);

            const meal = await dbKnex('meals').where({ id: mealId }).first();

            if (!meal) {
                return reply.code(404).send({ error: "Meal not found" });
            }

            return reply.code(200).send(meal);
        } catch (error) {
            return reply.code(400).send({ error: "Invalid data", details: error });
        }
    });

    app.put('/:mealId', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        try {
            const paramsSchema = z.object({ mealId: z.string().uuid() });
            const { mealId } = paramsSchema.parse(request.params);

            const updateMealSchema = z.object({
                name: string().trim(),
                description: string().trim(),
                isOnDiet: boolean(),
                date: z.coerce.date()
            });

            const { name, description, isOnDiet, date } = updateMealSchema.parse(request.body);

            const meal = await dbKnex('meals').where({ id: mealId }).first();

            if (!meal) {
                return reply.code(404).send({ error: "Meal not found" });
            }

            await dbKnex('meals').where({ id: mealId }).update({
                name,
                description,
                is_on_diet: isOnDiet,
                date: date.getTime()
            });

            return reply.code(200).send({ message: "Meal updated successfully" });
        } catch (error) {
            return reply.code(400).send({ error: "Invalid data", details: error });
        }
    });

    app.delete('/:mealId', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
        try {
            const paramsSchema = z.object({ mealId: z.string().uuid() });
            const { mealId } = paramsSchema.parse(request.params);

            const meal = await dbKnex("meals").where({ id: mealId }).first();

            if (!meal) {
                return reply.code(404).send({ error: "Meal not found" });
            }

            await dbKnex("meals").where({ id: mealId }).delete();

            return reply.code(200).send({ message: "Meal deleted successfully" });
        } catch (error) {
            return reply.code(400).send({ error: "Invalid data", details: error });
        }
    });

    app.get(
        '/metrics',
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
          const totalMealsOnDiet = await dbKnex('meals')
            .where({ user_id: request.user?.id, is_on_diet: true })
            .count('id', { as: 'total' })
            .first()
    
          const totalMealsOffDiet = await dbKnex('meals')
            .where({ user_id: request.user?.id, is_on_diet: false })
            .count('id', { as: 'total' })
            .first()
    
          const totalMeals = await dbKnex('meals')
            .where({ user_id: request.user?.id })
            .orderBy('date', 'desc')
    
          const { bestOnDietSequence } = totalMeals.reduce(
            (acc, meal) => {
              if (meal.is_on_diet) {
                acc.currentSequence += 1
              } else {
                acc.currentSequence = 0
              }
    
              if (acc.currentSequence > acc.bestOnDietSequence) {
                acc.bestOnDietSequence = acc.currentSequence
              }
    
              return acc
            },
            { bestOnDietSequence: 0, currentSequence: 0 },
          )
    
          return reply.send({
            totalMeals: totalMeals.length,
            totalMealsOnDiet: totalMealsOnDiet?.total,
            totalMealsOffDiet: totalMealsOffDiet?.total,
            bestOnDietSequence,
          })
        },
      )
}
