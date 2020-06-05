// import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
// import { BufReader } from "https://deno.land/std/io/bufio.ts";

const p = Deno.run({
  cmd: ["cat", "runerr.mjs"],
  // stdout: "inherit",
  stdout: "piped",
});

const buf = await Deno.readAll(p.stdout);
const txt = new TextDecoder().decode(buf);
console.log(txt);

/*
// const input = new TextProtoReader(new BufReader(p.stdout));
//const input = new TextProtoReader(new BufReader(Deno.stdin)); // inherit, ok but won't stop
for (;;) {
  const line = await input.readLine();
  console.log(line);
  if (line == null) { break; }
}

*/
