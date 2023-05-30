import {
  ActivityTypes,
  createBot,
  enableCachePlugin,
  enableCacheSweepers,
  fastFileLoader,
  GatewayIntents,
  startBot,
} from "./deps.ts";
import { logger } from "./src/utils/logger.ts";
import { events } from "./src/events/mod.ts";
import { updateCommands } from "./src/utils/helpers.ts";

const log = logger({ name: "Main" });

log.info("Starting Bot, this might take a while...");

const paths = ["./src/events", "./src/commands"];
await fastFileLoader(paths).catch((err) => {
  log.fatal(`Unable to Import ${paths}`);
  log.fatal(err);
  Deno.exit(1);
});

export const bot = enableCachePlugin(
  createBot({
    token: Deno.env.get("BOT_TOKEN") || "",
    intents:
      GatewayIntents.Guilds |
      GatewayIntents.DirectMessages |
      GatewayIntents.MessageContent |
      GatewayIntents.GuildMessages,
    events,
  })
);

enableCacheSweepers(bot);

bot.gateway.manager.createShardOptions.makePresence = (shardId: number) => {
  return {
    shardId,
    status: "online",
    activities: [
      {
        name: "🫠",
        type: ActivityTypes.Game,
        createdAt: Date.now(),
      },
    ],
  };
};

await startBot(bot);

await updateCommands(bot);
