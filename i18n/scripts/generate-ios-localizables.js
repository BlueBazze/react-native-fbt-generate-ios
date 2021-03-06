/**
 * @generated SignedSource<<7d0f7ede07f1a121c1b64e8ac61e16c5>>
 * @codegen-command : phps FBSyncAll
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !! This file is synchronized from fbsource. You should not     !!
 * !! modify it directly. Instead:                                !!
 * !!                                                             !!
 * !! 1) Update this file on fbsource and land your change there. !!
 * !! 2) A sync diff should be created and accepted automatically !!
 * !!    within 30 minutes that copies the changes you made on    !!
 * !!    fbsource to www. All that's left is to verify the        !!
 * !!    revision is good land it on www.                         !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import type { TranslationScriptOutput } from "./translate-fbts";

const invariant = require("invariant");
const fs = require("fs");
const path = require("path");

/**
 * Generates locales that comply with IOS resources format
 * https://developer.ios.com/guide/topics/resources/providing-resources
 *
 * @param locale Locale in the form langCode_regionCode.
 * @return Locale in the form langCode-rRegionCode.
 */
function generateIOSLocale(locale: string): string {
  const langRegionCode = locale.split("_");
  invariant(
    langRegionCode.length == 2,
    "Lang-region array must have two items"
  );
  return `${langRegionCode[0]}.lproj`;
}

function jsonEncodeValues(localeValues) {
  const encodedValues = {};
  for (const hash in localeValues) {
    encodedValues[hash] = JSON.stringify(localeValues[hash]);
  }
  return encodedValues;
}

/**
 * Take translations output, and write individual JSON files for each locale
 * raw-es_rES/localizable.json => {<hash>: translatedString}
 * raw-ru_rRU/localizable.json
 */
function generateIOSLocalizableFiles(
  translationOutput: TranslationScriptOutput,
  iosResDir: string,
  translationsFileName: string
) {
  try {
    for (const locale in translationOutput) {
      const iosLocale = generateIOSLocale(locale);
      const rawXXDir = path.join(iosResDir, `${iosLocale}`); //`raw-${iosLocale}`);

      if (!fs.existsSync(rawXXDir)) {
        fs.mkdirSync(rawXXDir);
      }
      fs.writeFileSync(
        path.join(rawXXDir, translationsFileName),
        JSON.stringify(jsonEncodeValues(translationOutput[locale]))
          .replaceAll("{", "")
          .replaceAll("}", "")
          .replaceAll(":", " = ")
          .replaceAll('",', '";\n')
          .toString() + ";",
        {
          encoding: "utf8",
        }
      );
    }
  } catch (error) {
    console.error("An error ocurred while generating the ios localizables");
    console.error(error);
    process.exit(1);
    throw error;
  }
}

module.exports = {
  generateIOSLocalizableFiles,
};
