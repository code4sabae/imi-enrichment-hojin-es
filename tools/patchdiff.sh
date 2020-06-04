#!/usr/bin/env bash

# deno run -A download.mjs

for zip in `find temp_diff/*.zip ` ; do
  echo ${zip}
  unzip -p ${zip} '*.csv' | deno run -A patchdiff.mjs
done
