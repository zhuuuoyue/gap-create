import path from "path";

import * as utils from "./utils";
import { HCreator, CppCreator, UiCreator } from "./creator";

/**
 * 创建 .h 文件
 * @param destination 生成文件的路径
 * @param className 类名
 * @param includes 包含头文件列表
 */
export function createHFile(destination: string, className: string, includes: string[] = []): void {
  let creator = new HCreator(className);
  creator.includes = includes;
  const content = creator.create();
  utils.saveFileAsUtf8BOM(path.join(destination, utils.hFilename(className)), content);
}

/**
 * 创建 .cpp 文件
 * @param destination 生成文件的路径
 * @param className 类名
 * @param includes 包含头文件列表
 */
export function createCppFile(destination: string, className: string, includes: string[]): void {
  let creator = new CppCreator(className);
  creator.includes = includes;
  creator.namespaces = ["gcmp", "gap"];
  const content = creator.create();
  utils.saveFileAsUtf8BOM(path.join(destination, utils.cppFilename(className)), content);
}

/**
 * 创建 QT 的 .ui 文件
 * @param destination 生成文件的路径
 * @param className 类名
 */
export function createUiFile(destination: string, className: string): void {
  let creator = new UiCreator(className);
  const content = creator.create();
  utils.saveFileAsUtf8(path.join(destination, utils.uiFilename(className)), content);
}
