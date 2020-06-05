import csvutil from "https://taisukef.github.io/util/util.mjs";

const countLines = (fn) => {
  const csv = csvutil.decodeCSV(Deno.readTextFileSync(fn));
  return csv.length;
};

const path = "../data/";
const list = Deno.readDirSync(path);
let sum = 0;
let max = 0;
let nfiles = 0;
const corpnums = [];
for (const file of list) {
  const fn = file.name;
  if (!fn.endsWith(".csv")) continue;
  const len = countLines(path + fn);
  console.log(file.name, len);
  sum += len;
  if (len > max) max = len;
  nfiles++;
  corpnums.push(parseInt(fn));
}
console.log(corpnums);
console.log("total", sum); // total 4,889,111
console.log("max", max); // max 17310
console.log("nfiles", nfiles); // nfiles 3542
// 13桁 checkdegit消して、12桁、末尾6桁が通し番号 -> DIV -> 4

// v2
// total 4886634 あれ？
// max 8751 2Mb
// nfiles 1065

// v2 6/4
// total 4887178
// max 8750
// nfiles 1066
