import fastify from "fastify";

const fastifyApp = fastify({
  logger: true,
});

async function startServer() {
  await fastifyApp.listen({ port: 3000, host: "localhost" });
}

startServer();
