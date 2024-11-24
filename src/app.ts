import fastify from "fastify";
import { user } from "./routes/user";
import cookie from '@fastify/cookie'

export const app = fastify();

app.addHook('preHandler', async (request) => {
    console.log(`[${request.method}] ${request.url}`);
});

app.register(cookie)

app.register(user, {
    prefix: 'user'
})