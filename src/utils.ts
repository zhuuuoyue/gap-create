import os from "os";
import fs from "fs";
import path from "path";

import { AuthorInfo } from "./author-info";

/**
 * 获取配置路径
 * @returns 配置根目录
 */
export function getRootDir(): string {
  return path.join(os.homedir(), ".gap_create");
}

/**
 * 判断文件夹路径是否是有效路径
 * @param folderPath 待判断路线
 * @returns 是否有效，有则返回 true，否则返回 false
 */
export function isValidDirectory(folderPath: string): boolean {
  if (!fs.existsSync(folderPath)) {
    return false;
  }
  const stat = fs.statSync(folderPath);
  return stat.isDirectory();
}

/**
 * 判断文件路径是否是有效路径
 * @param filePath 待判断路径
 * @returns 是否有效，有效则返回 true，否则返回 false
 */
export function isValidFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const stat = fs.statSync(filePath);
  return stat.isFile();
}

/**
 * 将文本以 UTF-8 编码写入文件
 * @param filename 保存路径
 * @param content 待写入内容
 */
export function saveFileAsUtf8(filename: string, content: string): void {
  fs.writeFileSync(filename, content, {
    encoding: "utf-8",
  });
}

/**
 * 将文本以 UTF-8 with BOM 格式写入文件
 * @param filename 保存路径
 * @param content 待写入内容
 */
export function saveFileAsUtf8BOM(filename: string, content: string): void {
  saveFileAsUtf8(filename, `\uFEFF${content}`);
}

/**
 * 从 UTF-8 文件中读取内容
 * @param filename 读取路径
 * @returns 读取的内容
 */
export function loadContentFromUtf8File(filename: string): string {
  return fs.readFileSync(filename, {
    encoding: "utf-8",
  });
}

/**
 * 从 JSON 文件中读取内容
 * @param filename 文件路径
 * @returns 读取到的值
 */
export function loadJsonAs<T>(filename: string): T {
  return JSON.parse(loadContentFromUtf8File(filename)) as T;
}

/**
 * 根据规则生成文件名
 * @param mainName 文件名的主体
 * @param ext 拓展名
 * @param prefix 前缀
 * @returns 生成的文件名
 */
export function createFilename(mainName: string, ext: string, prefix: string = "Gap"): string {
  return `${prefix}${mainName}${ext}`;
}

/**
 * 生成头文件名
 * @param className 类名
 * @param ext 拓展名，默认 `.h`
 * @returns 生成的头文件名
 */
export function hFilename(className: string, ext: string = ".h"): string {
  return createFilename(className, ext);
}

/**
 * 生成源文件名
 * @param className 类名
 * @param ext 拓展名，默认 `.cpp`
 * @returns 生成的源文件名
 */
export function cppFilename(className: string, ext: string = ".cpp"): string {
  return createFilename(className, ext);
}

/**
 * 生成界面文件名
 * @param className 类名
 * @param ext 拓展名，默认 `.ui`
 * @returns 生成的界面文件名
 */
export function uiFilename(className: string, ext: string = ".ui"): string {
  return createFilename(className, ext);
}

/**
 * 生成界面头文件名
 * @param className 类名
 * @param ext 拓展名，默认 `.h`
 * @returns 生成的界面头文件名
 */
export function uiClassFilename(className: string, ext: string = ".h"): string {
  return createFilename(className, ext, `ui_Gap`);
}

/**
 * 获取默认的作者信息
 * @returns 作者信息
 */
export function getDefaultAuthorInfo(): AuthorInfo {
  return {
    owner: "",
    co_owner: "",
  };
}

/**
 * 获取作者信息文件路径
 * @returns 作者信息文件路径
 */
export function getAuthorInfoPath(): string {
  return path.join(getRootDir(), "author_info.json");
}

/**
 * 将作者信息写入文件
 * @param authorInfo 作者信息
 */
export function writeAuthorInfo(authorInfo?: AuthorInfo): void {
  if (typeof authorInfo === "undefined") {
    authorInfo = getDefaultAuthorInfo();
  }
  saveFileAsUtf8(getAuthorInfoPath(), JSON.stringify(authorInfo));
}

/**
 * 获取作者信息
 * @returns 作者信息
 */
export function loadAuthorInfo(): AuthorInfo {
  const authorInfoPath = getAuthorInfoPath();
  return isValidFile(authorInfoPath) ? loadJsonAs<AuthorInfo>(authorInfoPath) : getDefaultAuthorInfo();
}
