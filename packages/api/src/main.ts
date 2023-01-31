import { createApp } from "./create-app";

async function bootstrap() {
  const app = await createApp();
  await app.listen(1337);
}
bootstrap();
