
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, watch as fsWatch } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import browserslist from "browserslist";
import { transform, browserslistToTargets } from "lightningcss";
import postcss from "postcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "app", "(portal)", "portal.tailwind.css");
const output = path.join(root, "app", "(portal)", "portal.css");
const watch = process.argv.includes("--watch");

/*
 * Matches the browser support the portal shipped with standalone. Keep this in
 * step with any browserslist the site adopts later.
 */
const targets = browserslistToTargets(browserslist("> 0.25%, last 2 versions, not dead"));
const LAYER_PREFIX = "portal-";
const RESERVED = new Set(["base", "components", "utilities"]);

const renameLayers = {
  postcssPlugin: "rename-portal-layers",
  AtRule: {
    layer: (rule) => {
      rule.params = rule.params
        .split(",")
        .map((name) => {
          const n = name.trim();
          return RESERVED.has(n) ? `${LAYER_PREFIX}${n}` : n;
        })
        .join(",");
    },
  },
};

function postProcess() {
  const css = readFileSync(output);

  // lab()/hex fallbacks for the oklch colours, as Turbopack produced upstream.
  const { code } = transform({
    filename: "portal.css",
    code: css,
    targets,
    minify: true,
  });

  const renamed = postcss([renameLayers]).process(code.toString(), {
    from: output,
    to: output,
  }).css;

  writeFileSync(output, renamed);
}

function compile(extraArgs = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(root, "node_modules", "@tailwindcss", "cli", "dist", "index.mjs"),
        "-i",
        input,
        "-o",
        output,
        "--minify",
        ...extraArgs,
      ],
      { stdio: "inherit", cwd: root },
    );
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`tailwindcss exited with ${code}`)),
    );
  });
}

async function build() {
  await compile();
  postProcess();
}

if (watch) {
  /*
   * The sources are watched here rather than with the CLI's own --watch,
   * because the layer rename in postProcess() is not optional: a portal.css
   * written without it fails the Next build. Driving the whole pipeline keeps
   * every rebuild complete.
   */
  await build();
  console.log("portal.css built — watching");

  let pending = null;
  const rebuild = () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      build()
        .then(() => console.log("portal.css rebuilt"))
        .catch((error) => console.error(error.message));
    }, 150);
  };

  for (const dir of [path.join(root, "app", "(portal)"), path.join(root, "mentorship")]) {
    watchDir(dir, rebuild);
  }
} else {
  await build();
  console.log("portal.css built");
}

function watchDir(dir, onChange) {
  fsWatch(dir, { recursive: true }, (_event, filename) => {
    // portal.css is this script's own output; reacting to it would loop.
    if (!filename || /portal\.css$/.test(filename)) return;
    if (/\.(tsx?|css)$/.test(filename)) onChange();
  });
}
