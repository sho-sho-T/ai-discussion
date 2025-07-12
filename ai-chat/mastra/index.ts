import { Mastra } from "@mastra/core/mastra"
import { LibSQLStore } from "@mastra/libsql"
import { PinoLogger } from "@mastra/loggers"
import { chuuniAgent } from "./agents/chuuni-agent"
import { confusedAgent } from "./agents/confused-agent"
import { dataAgent } from "./agents/data-agent"
import { designerAgent } from "./agents/designer-agent"
import { developerAgent } from "./agents/developer-agent"
import { devilAgent } from "./agents/devil-agent"
import { elderlyAgent } from "./agents/elderly-agent"
import { elementaryAgent } from "./agents/elementary-agent"
import { infraAgent } from "./agents/infra-agent"
import { pmAgent } from "./agents/pm-agent"
import { qaAgent } from "./agents/qa-agent"
import { richAgent } from "./agents/rich-agent"
import { weatherAgent } from "./agents/weather-agent"
import { weatherWorkflow } from "./workflows/weather-workflow"

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: {
    weatherAgent,
    elementaryAgent,
    chuuniAgent,
    devilAgent,
    richAgent,
    pmAgent,
    designerAgent,
    elderlyAgent,
    developerAgent,
    qaAgent,
    infraAgent,
    dataAgent,
    confusedAgent,
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: "file:../mastra.db",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
})
