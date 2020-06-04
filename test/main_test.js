import { describe, it, expect, makeDirname } from "https://taisukef.github.io/denolib/nodelikeassert.mjs"
const __dirname = makeDirname(import.meta.url)

const spec = __dirname + "/../spec";

import enrich from "../IMIEnrichmentHojin.mjs";

const readdirSync = dir => {
  const i = Deno.readDirSync(dir);
  const files = [];
  for (const f of i) { files.push(f); }
  return files.map(f => f.name);
};

describe('imi-enrichment-hojin', function() {

  describe("spec", function() {
    readdirSync(spec).filter(file => file.match(/json$/)).forEach(file => {
      describe(file, function() {
        const json = JSON.parse(Deno.readTextFileSync(`${spec}/${file}`))
        json.forEach(a => {
          it(a.name, async () => {
            const json = await enrich(a.input);
            expect(json).deep.equal(a.output);
          });
        });
      });
    });
  });
});
