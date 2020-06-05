import csvutil from "https://taisukef.github.io/util/util.mjs";
import util from "./lib/util.mjs";
import format from "./lib/format.mjs";

const DIV = 4; // 6
const corporatenumbercache = {};
const getCorporateNumber = async (code) => {
  const upper = code.substring(1, code.length - DIV); // ommit the first check digit char
  let cache = corporatenumbercache[upper];
  if (!cache) {
    const fn = `data/${upper}.csv`;
    let data = null;
    if (
      import.meta && import.meta.url && import.meta.url.startsWith("file://") &&
      window.Deno
    ) {
      const url = import.meta.url;
      const path = url.substring("file://".length, url.lastIndexOf("/") + 1);
      data = await Deno.readTextFile(path + fn);
    } else {
      data =
        await (await fetch(
          "https://code4sabae.github.io/imi-enrichment-hojin-es/" + fn,
        )).text();
    }
    const json = {};
    const csv = csvutil.decodeCSV(data);
    for (const d of csv) {
      json[parseInt(d[1])] = d;
    }
    cache = corporatenumbercache[upper] = json;
  }
  return cache[code];
};

const checkDigit = (id) => {
  if (typeof id === "string") {
    id = id.replace(/-/g, "");
  }
  let s = id.toString();
  if (s.length < 12) {
    s = "0000000000000" + s;
  }
  s = s.substring(s.length - 12);
  let sum = 0;
  s.split("").map((a) => parseInt(a)).forEach((v, i) => {
    sum += (i % 2 === 0 ? v * 2 : v);
  });
  const b = 9 - (sum % 9);
  return b + s;
};

const get = async (id) => {
  const data = await getCorporateNumber(id);
  if (!data) return null;
  return format(data);
};

const enrich = async function (src) {
  const dst = typeof src === "string" || typeof src === "number"
    ? {
      "@context": "https://imi.go.jp/ns/core/context.jsonld",
      "@type": "法人型",
      "ID": {
        "@type": "ID型",
        "体系": {
          "@type": "ID体系型",
          "表記": "法人番号",
        },
        "識別値": checkDigit(src),
      },
    }
    : JSON.parse(JSON.stringify(src));

  const targets = [];

  const dig = function (focus) {
    if (Array.isArray(focus)) {
      focus.forEach((a) => dig(a));
    } else if (typeof focus === "object") {
      if (focus["@type"] === "法人型" && focus["ID"] && focus["ID"]["識別値"]) {
        const key = checkDigit(focus["ID"]["識別値"]);
        if (!util.isValidHoujinBangou(key)) {
          util.put(focus, "メタデータ", {
            "@type": "文書型",
            "説明": "法人番号は1～9ではじまる13桁の数字でなければなりません",
          });
        } else if (!util.isValidCheckDigit(key)) {
          util.put(focus, "メタデータ", {
            "@type": "文書型",
            "説明": "法人番号のチェックデジットが不正です",
          });
        } else {
          targets.push(focus);
        }
      }
      Object.keys(focus).forEach((key) => {
        dig(focus[key]);
      });
    }
  };

  dig(dst);

  if (targets.length === 0) {
    return dst;
  }

  const promises = targets.map(async (target) => {
    try {
      const json = await get(target["ID"]["識別値"]);
      delete json["@context"];
      delete target["ID"];
      Object.keys(json).forEach((key) => {
        util.put(target, key, json[key]);
      });
    } catch (e) {
      util.put(target, "メタデータ", {
        "@type": "文書型",
        "説明": "該当する法人番号がありません",
      });
    }
  });
  await Promise.all(promises);
  return dst;
};

export default enrich;
