// import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
// import { BufReader } from "https://deno.land/std/io/bufio.ts";
import csvutil from "https://taisukef.github.io/util/util.mjs";

// import extract from "https://dev.jspm.io/extract-zip";
// await extract("temp_diff/2020-06-06.zip", { dir: "temp_dir/" }); // NG

const date = "2020-06-05";

/*
const todo = [];
const files = Deno.readDirSync("temp_diff");
for (const f of files) {
  console.log(f.name);
}

Deno.exit(0);
*/
const p = Deno.run({
  cmd: ["unzip", "-p", `temp_diff/${date}.zip`, "*.csv"],
  stdout: "piped",
});
// console.log(p.stdout);
// Deno.exit(0);

const buf = await Deno.readAll(p.stdout);
const txt = new TextDecoder().decode(buf);
// console.log(txt);
const lines = txt.split("\n");

const DIV = 4; // 6

// const input = new TextProtoReader(new BufReader(p.stdout));
let cnt = 0;
//for (;;) {
//const line = await input.readLine();
for (const line of lines) {
  console.log(line);
  if (line == null || line.length === 0) break;
  const ss = csvutil.decodeCSV(line);
  if (ss.length !== 1) throw new Error(ss);
  const data = ss[0];
  const id = data[1];
  const upper = id.substring(1, id.length - DIV); // the first char is a check digit
  console.log(upper, id);

  // upadte
  const fn = `../data/${upper}.csv`;
  let org = null;
  try {
    const org = csvutil.decodeCSV(Deno.readTextFileSync(fn));
    let updateflg = false;
    for (let i = 0; i < org.length; i++) {
      const ssorg = org[i];
      if (ssorg[1] === id) {
        console.log("before", data);
        console.log("after ", ssorg);
        org[i] = data;
        updateflg = true;
        break;
      }
    }
    if (!updateflg) {
      org.push(data);
    }
    Deno.writeTextFileSync(fn, csvutil.encodeCSV(org));
  } catch (e) {
    Deno.writeTextFileSync(fn, csvutil.encodeCSV(data));
  }

  cnt++;
}
console.log(cnt);
