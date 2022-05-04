import commandLineArgs, { OptionDefinition, CommandLineOptions } from "command-line-args";
import _ from "lodash";

import * as utils from "./utils";
import { createHFile, createCppFile, createUiFile } from "./create";

// 定义目标参数

type FileType = "h" | "cpp" | "ui" | "qt";

interface Arguments {
  destination: string;
  className: string;
  files: FileType[];
}

// 解析命令行参数

const KEY_DESTINATION: string = "destination";
const KEY_CLASS_NAME: string = "className";
const KEY_FILES: string = "files";

const optionDefinitions: OptionDefinition[] = [
  { name: KEY_DESTINATION, type: String },
  { name: KEY_CLASS_NAME, type: String },
  { name: KEY_FILES, type: String, multiple: true },
];

function parseArguments(parsed: CommandLineOptions): Arguments | undefined {
  if (!_.has(parsed, KEY_DESTINATION) || !_.has(parsed, KEY_CLASS_NAME)) {
    return;
  }
  let files: FileType[] = ["h", "cpp"];
  if (_.has(parsed, KEY_FILES)) {
    if (-1 !== parsed[KEY_FILES].indexOf("qt")) {
      files = ["h", "cpp", "ui"];
    } else if (parsed[KEY_FILES].length !== 0) {
      files = parsed[KEY_FILES];
    }
  }
  let result: Arguments = {
    destination: parsed[KEY_DESTINATION],
    className: parsed[KEY_CLASS_NAME],
    files: files,
  };
  return result;
}

const parsed = commandLineArgs(optionDefinitions, {
  argv: process.argv,
});

// 使用参数生成文件

const args = parseArguments(parsed);
if (typeof args !== "undefined") {
  if (-1 !== args.files.indexOf("h")) {
    let includes: string[] = [];
    if (-1 !== args.files.indexOf("ui")) {
      includes.push(utils.uiClassFilename(args.className));
    }
    createHFile(args.destination, args.className, includes);
  }

  if (-1 !== args.files.indexOf("cpp")) {
    const headerFilename = utils.hFilename(args.className);
    createCppFile(args.destination, args.className, [headerFilename]);
  }

  if (-1 !== args.files.indexOf("ui")) {
    createUiFile(args.destination, args.className);
  }
}
