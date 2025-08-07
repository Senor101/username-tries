import Fastify from "fastify";

const fastifyApp = Fastify({
  logger: true,
});

fastifyApp.get("/", async (request, reply) => {
  return { message: "Hello, World!" };
});

async function startServer() {
  await fastifyApp.listen({ port: 3000, host: "localhost" });
}

startServer();
