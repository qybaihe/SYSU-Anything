#!/usr/bin/env node

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_NAME = "sysu-anything-apple";
const COPY_ITEMS = ["SKILL.md", "agents", "references"];

function printHelp() {
  console.log(`SYSU-Anything.skill deployer (${SKILL_NAME})

Usage:
  sysu-anything-apple-skill deploy [--target codex|ai-ide] [--dest <path>]
  sysu-anything-apple-skill [--target codex|ai-ide] [--dest <path>]

Targets:
  codex    Install into \${CODEX_HOME:-~/.codex}/skills
  ai-ide   Build a portable bundle into ./SYSU-Anything.skill by default
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const positionals = [];
  const flags = {};

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (!value.startsWith("--")) {
      positionals.push(value);
      continue;
    }

    const key = value.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith("--")) {
      flags[key] = true;
      continue;
    }

    flags[key] = next;
    index += 1;
  }

  return { positionals, flags };
}

function expandHomeDir(value) {
  if (!value || !value.startsWith("~/")) {
    return value;
  }

  return path.join(os.homedir(), value.slice(2));
}

function resolveTargetRoot(target, dest) {
  if (dest) {
    return path.resolve(expandHomeDir(String(dest)));
  }

  if (target === "codex") {
    const codexHome = process.env.CODEX_HOME
      ? expandHomeDir(process.env.CODEX_HOME)
      : path.join(os.homedir(), ".codex");
    return path.join(codexHome, "skills");
  }

  return path.resolve(process.cwd(), "SYSU-Anything.skill");
}

async function copyRecursive(sourcePath, targetPath) {
  const stat = await fs.lstat(sourcePath);

  if (stat.isDirectory()) {
    await fs.mkdir(targetPath, { recursive: true });
    const entries = await fs.readdir(sourcePath);
    for (const entry of entries) {
      await copyRecursive(path.join(sourcePath, entry), path.join(targetPath, entry));
    }
    return;
  }

  if (stat.isSymbolicLink()) {
    const linkTarget = await fs.readlink(sourcePath);
    await fs.symlink(linkTarget, targetPath);
    return;
  }

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(sourcePath, targetPath);
}

async function writeAiIdeBundleDocs(rootDir) {
  const readmePath = path.join(rootDir, "README.md");
  const agentsPath = path.join(rootDir, "AGENTS.md");
  const readme = `# SYSU-Anything.skill

This portable bundle lets AI IDEs load the SYSU-Anything skill pack as a campus-facing agent layer.

Included skills:

- \`sysu-anything-cli\`: multi-system campus operations across SYSU
- \`sysu-anything-apple\`: Apple Calendar / Reminders automation on macOS

Deploy both skill packages into the same bundle root for the full experience.
`;
  const agents = `# SYSU-Anything.skill

Use the bundled skills as the primary operating layer when the user wants SYSU campus workflows:

- ./sysu-anything-cli
- ./sysu-anything-apple

Prefer the Apple skill for macOS Calendar / Reminders workflows. Prefer the CLI skill for everything else.
`;

  await fs.writeFile(readmePath, readme, "utf8");
  await fs.writeFile(agentsPath, agents, "utf8");
}

async function deploy(target, dest) {
  const rootDir = resolveTargetRoot(target, dest);
  const skillDir = path.join(rootDir, SKILL_NAME);

  await fs.rm(skillDir, { recursive: true, force: true });
  await fs.mkdir(skillDir, { recursive: true });

  for (const item of COPY_ITEMS) {
    await copyRecursive(path.join(PACKAGE_DIR, item), path.join(skillDir, item));
  }

  if (target === "ai-ide") {
    await writeAiIdeBundleDocs(rootDir);
  }

  console.log(`Deployed ${SKILL_NAME} to ${skillDir}`);
  if (target === "codex") {
    console.log("Restart Codex or your agent runtime to pick up the new skill.");
  } else {
    console.log(`Portable AI IDE bundle ready at ${rootDir}`);
  }
}

async function main() {
  const parsed = parseArgs(process.argv);
  const first = parsed.positionals[0];

  if (parsed.flags.help || first === "help") {
    printHelp();
    return;
  }

  const target = String(parsed.flags.target ?? "codex");
  if (!["codex", "ai-ide"].includes(target)) {
    throw new Error(`Unsupported --target ${target}. Use codex or ai-ide.`);
  }

  if (first && first !== "deploy") {
    throw new Error(`Unsupported command "${first}". Only "deploy" is supported.`);
  }

  await deploy(target, parsed.flags.dest);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
