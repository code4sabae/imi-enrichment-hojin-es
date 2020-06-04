# 法人種別名の抽出コンポーネント imi-enrichment-hojin ES module ver.

入力となる JSON-LD に含まれる `ID>識別値 をもつ 法人型` に対して各種のプロパティを補完して返すESモジュールです。

[![esmodules](https://taisukef.github.com/denolib/esmodulesbadge.svg)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules)
[![deno](https://taisukef.github.com/denolib/denobadge.svg)](https://deno.land/)

## API (web / Deno)

モジュール `imi-enrichment-hojin` は以下のような API の関数を提供します。

```
import IMIEnrichmentHojin from "https://code4sabae.github.io/imi-enrichment-hojin/IMIEnrichmentHojin.mjs";

console.log(await IMIEnrichmentHojin("4000012090001"));
```
toplevel await 非対応のブラウザでは、async関数内で使用してください。

**input.json**

```input.json
{
  "@type": "法人型",
  "ID" : {
    "@type": "ID型",
    "識別値" : "4000012090001"
  }
}
```

**output.json**

```output.json
{
  "@type": "法人型",
  "組織種別": {
    "@type": "コード型",
    "コード種別": {
      "@type": "コードリスト型",
      "表記": "法人種別"
    },
    "識別値": "101",
    "表記": "国の機関"
  },
  "ID": {
    "@type": "ID型",
    "体系": {
      "@type": "ID体系型",
      "表記": "法人番号"
    },
    "識別値": "4000012090001"
  },
  "表記": "経済産業省",
  "名称": {
    "@type": "名称型",
    "表記": "経済産業省",
    "ローマ字表記": "Ministry of Economy, Trade and Industry",
    "カナ表記": "ケイザイサンギョウショウ"
  },
  "住所": [
    {
      "@type": "住所型",
      "種別": "国内所在地",
      "表記": "東京都 千代田区 霞が関１丁目３－１",
      "郵便番号": "1000013",
      "都道府県": "東京都",
      "都道府県コード": "http://data.e-stat.go.jp/lod/sac/C13000",
      "市区町村": "千代田区",
      "市区町村コード": "http://data.e-stat.go.jp/lod/sac/C13101"
    },
    {
      "@type": "住所型",
      "種別": "国内所在地(英語表記)",
      "表記": "1-3-1, Kasumigaseki, Chiyoda ku, Tokyo",
      "都道府県": "Tokyo"
    }
  ]
}
```

- 補完される情報は [国税庁法人番号公表サイト](https://www.houjin-bangou.nta.go.jp/) で公開されている情報を `法人型` にマッピングしたものとなります
- データソースは [国税庁法人番号公表サイト・基本3情報](https://www.houjin-bangou.nta.go.jp/download/) をダウンロードしたものです
- 本パッケージに添付されているデータは 令和2年5月29日更新 のものになります （元パッケージは、令和元年12月27日更新）
- 所与の法人番号に問題がある場合には `メタデータ` プロパティにメッセージが記述されます

**output_with_error.json**

```
{
  "@context": "https://imi.go.jp/ns/core/context.jsonld",
  "@type": "法人型",
  "ID": {
    "@type": "ID型",
    "体系": {
      "@type": "ID体系型",
      "表記": "法人番号"
    },
    "識別値": "2876543210987"
  },
  "メタデータ": {
    "@type": "文書型",
    "説明": "該当する法人番号がありません"
  }
}
```

以下のエラーが検出されます

- 法人番号が 13桁の数字でない場合
- 法人番号の先頭が 2～9 でない場合
- 法人番号のチェックデジットが不正な場合
- 指定された法人番号が存在しない場合

# 利用者向け情報

以下の手順はパッケージアーカイブ `imi-enrichment-hojin-2.0.0.tgz` を用いて実行します。

## インストール

以下の手順でインストールしローカルでも使用できます。（全法人番号をダウンロードするため重いので注意！）

```
$ github clone https://github.com/code4sabae/imi-enrichment-hojin.git
```

## データ生成

[国税庁法人番号公表サイト・全件データのダウンロード（各都道府県別）](https://www.houjin-bangou.nta.go.jp/download/zenken/) から CSV 形式・Unicode をダウンロードする download.mjs と、makedata.sh を使って data ファルダ内のCSVファイルを生成します。（1時間ほどかかります）
生成後、tempフォルダは削除して構いません。

```
$ tools
$ deno run -A download.mjs
$ sh makedata.sh
```

## 環境構築

以下の手順で環境を構築します。

```
$ mkdir imi-enrichment-hojin
$ cd imi-enrichment-hojin
$ tar xvzf /tmp/imi-enrichment-hojin-2.0.0.src.tgz
$ npm install
$ mkdir cache
$ cp /tmp/zenken/*.zip cache
$ npm run setup
```

## テスト

以下の手順でテストを実行します

```
$ deno test -A
```

## 依存モジュール

util.mjs (decodeCSV)  
https://github.com/taisukef/util


## 出典

本ライブラリは IMI 情報共有基盤 コンポーネントツール <https://info.gbiz.go.jp/tools/imi_tools/> の「法人種別名の抽出コンポーネント」をESモジュール対応したものです。

## 関連記事

国税庁法人番号を使った経産省発、法人種別名の抽出コンポーネントのESモジュール版公開  
https://fukuno.jig.jp/2870  

Deno対応ESモジュール対応、IMIコンポーネントツールx4とDenoバッジ  
https://fukuno.jig.jp/2866  

日本政府発のJavaScriptライブラリを勝手にweb標準化するプロジェクト、全角-半角統一コンポーネントのESモジュール/Deno対応版公開  
https://fukuno.jig.jp/2865  
