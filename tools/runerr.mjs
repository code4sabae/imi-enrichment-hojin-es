import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";

const p = Deno.run({
  cmd: ["cat", "runerr.mjs"],
  // stdout: "inherit",
  stdout: "piped",
});
await p.output();

const input = new TextProtoReader(new BufReader(p.stdout));
//const input = new TextProtoReader(new BufReader(Deno.stdin)); // inherit, ok but won't stop
for (;;) {
  const line = await input.readLine();
  console.log(line);
  if (line == null) break;
}
