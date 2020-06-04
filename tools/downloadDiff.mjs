import IMIEnrichmentDate from "https://code4sabae.github.io/imi-enrichment-date/IMIEnrichmentDate.mjs";
import cheerio from "https://dev.jspm.io/cheerio@0.22.0";

/*
<form id="appForm" action="" method="post"><div><input type="hidden" name="jp.go.nta.houjin_bangou.framework.web.common.CNSFWTokenProcessor.request.token" value="8066bb93-a3be-410a-ba85-662db80f11c8"/></div>
<input type="hidden" name="event" id="event" value="download">
<input type="hidden" name="selDlFileNo" id="selDlFileNo">
*/
const downloadDiff = async (fileno, dstfn) => {
  const formurl = "https://www.houjin-bangou.nta.go.jp/download/sabun/index.html"
  const data = {
    // "jp.go.nta.houjin_bangou.framework.web.common.CNSFWTokenProcessor.request.token": token, // tokenは不要
    "event": "download",
    "selDlFileNo": fileno,
  };
  const method = "POST";
  const body = Object.keys(data).reduce((o, key) => (o.set(key, data[key]), o), new FormData());
  const headers = {
    'Accept': 'application/json'
  };
  const res = await fetch(formurl, { method, headers, body });
  // const res = await fetch(formurl + `?selDlFileNo=${fileno}`); // GETでは取得できない
  const bin = await res.arrayBuffer();
  const ar = new Uint8Array(bin);
  console.log(`${fileno} downloaded ${ar.length} bytes, saved ${dstfn}`);
  Deno.writeFileSync(dstfn, ar);
  return ar.length;
};
// await download(11348, "temp/test.zip");
// Deno.exit(0);

const downloadIndexDiff = async () => {
  const url = "https://www.houjin-bangou.nta.go.jp/download/sabun/"
  const html = await (await fetch(url)).text();
  Deno.writeTextFileSync("diff.html", html);
}

// await downloadIndexDiff();
const html = Deno.readTextFileSync("diff.html");
const dom = cheerio.load(html);

const searchDomClass = (base, cls) => {
  let c = base;
  for (;;) {
    c = c.next;
    if (c == null) { return null; }
    if (c.type !== "tag") { continue };
    if (c.attribs.class === cls) { break; }
  }
  return c;
};
const searchDomTag = (base, tag) => {
  let c = base;
  for (;;) {
    // console.log(c.type, c.name, tag);
    if (c.children) {
      for (let i = 0; i < c.children.length; i++) {
        const res = searchDomTag(c.children[i], tag);
        if (res) { return res; }
      }
    }
    c = c.next;
    if (c == null) { return null; }
    if (c.type !== "tag") { continue };
    if (c.name === tag) { break; }
  }
  return c;
};

try {
  Deno.mkdirSync("temp");
} catch (e) {
}

const h2 = dom("#csv-unicode")[0];
const tbl = searchDomClass(h2, "tbl03");
const links = dom(".type1_corpHistory1", null, tbl);
for (let i = 0; i < links.length; i++) {
  const link = links[i];
  const date = IMIEnrichmentDate(dom(searchDomTag(link, "th")).text()).標準型日付;
  const atag = searchDomTag(link, "a");
  const code = atag.attribs["onclick"]?.match(/^return doDownload\((\d+)\);$/)[1];
  console.log(date, code);
  // console.log(code);
  const len = await downloadDiff(code, `temp_diff/${date}.zip`);
  console.log(`${len} bytes downloaded`);
}
