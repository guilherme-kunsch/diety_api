import { app } from "./app";
app
  .listen({
    port: 3336,
  })
  .then(() => {
    console.log("HTTP Server Running on port 3336");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
