#!/usr/bin/env bash

# deno run -A download.mjs

for zip in `find temp/*.zip ` ; do
  echo ${zip}
  unzip -p ${zip} '*.csv' | deno run -A makedata.mjs
done
