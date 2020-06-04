import IMIEnrichmentHojin from "https://code4sabae.github.io/imi-enrichment-hojin/IMIEnrichmentHojin.mjs";
//import IMIEnrichmentHojin from "./IMIEnrichmentHojin.mjs";

console.log(await IMIEnrichmentHojin("4000012090001"));
console.log(await IMIEnrichmentHojin("011101042092")); // len 12 ver.
console.log(await IMIEnrichmentHojin(12090001)); // int ok!
console.log(await IMIEnrichmentHojin("0111-01-042092")); // with -

