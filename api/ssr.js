import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { applySsrTemplate } from "../scripts/applySsrTemplate.mjs";

let templateCache = null;
let renderModuleCache = null;

async function getTemplate() {
  if (templateCache) return templateCache;
  const templatePath = path.join(process.cwd(), "dist", "index.html");
  templateCache = await fs.readFile(templatePath, "utf-8");
  return templateCache;
}

async function getRenderModule() {
  if (renderModuleCache) return renderModuleCache;
  const serverBundlePath = path.join(process.cwd(), "dist", "entry-server.js");
  const fileUrl = pathToFileURL(serverBundlePath);
  renderModuleCache = await import(fileUrl.href);
  return renderModuleCache;
}

export default async function handler(req, res) {
  try {
    const template = await getTemplate();
    const { render } = await getRenderModule();

    const url = req.url || "/";
    const result = await render(url);
    const html = applySsrTemplate(template, result);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (error) {
    console.error("SSR handler error:", error);
    res.status(500).send("Server error while rendering page.");
  }
}
