// unzip 

import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import csvutil from "https://taisukef.github.io/util/util.mjs";

/*
const reader = Deno.open("cache/18_fukui_all_20200529.csv");
const r = new TextProtoReader(new BufReader(reader));
for (;;) {
  const line = await r.readLine();
  console.log(line);
}
*/
// const scsv = Deno.readTextFileSync("data/18_fukui_all_20200529.csv");

const DIV = 4; // 6

const input = new TextProtoReader(new BufReader(Deno.stdin)); // 18,440,000 lines
let cnt = 0;
for (;;) {
  const line = await input.readLine();
  if (line == null) { break; }
  const ss = csvutil.decodeCSV(line);
  if (ss.length !== 1) { throw new Error(ss) }
  const data = ss[0];
  const id = data[1];
  const upper = id.substring(1, id.length - DIV); // the first char is a check digit
  const csv = csvutil.encodeCSV(data);
  Deno.writeFileSync(`../data/${upper}.csv`, new TextEncoder().encode(csv), { append: true });
  cnt++;
  /*
  const map = {};
  for (const s of ss) {
    console.log(s[1]);
    map[s[1]] = s;
  }
  */
}
// Deno.exit(0);
