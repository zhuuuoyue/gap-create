import os from "os";

import * as utils from "./utils";

/**
 * 文本生成器接口
 */
interface TextCreator {
  /**
   * 生成并返回文本
   */
  create(): string;
}

/**
 * 源文件生成器
 */
class SourceFileCreator implements TextCreator {
  /**
   * 生成文本（作者信息部分）
   * @returns 作者信息文本
   */
  create(): string {
    const authorInfo = utils.loadAuthorInfo();
    return `// Owner: ${authorInfo.owner}
// Co-Owner: ${authorInfo.co_owner}`;
  }
}

/**
 * 类生成器
 */
class ClassCreator extends SourceFileCreator {
  public className: string; // 类名
  public includes: string[]; // 引入头文件

  /**
   * @param className 类名
   * @param includes 头文件列表
   */
  constructor(className: string, includes: string[] = []) {
    super();
    this.className = className;
    this.includes = includes;
  }

  /**
   * 生成引入头文件行
   * @param header 头文件文件名
   * @returns 引入头文件行字符串
   */
  includeLine(header: string): string {
    return `#include "${header}"`;
  }

  /**
   * 生成头文件行字符串
   * @returns 引入头文件行字符串
   */
  getIncludeLines(): string {
    let includeLines = this.includes.map((incl) => {
      return this.includeLine(incl);
    });
    return includeLines.join(os.EOL);
  }
}

/**
 * 头文件生成器
 */
export class HCreator extends ClassCreator {
  /**
   * 头文件生成器
   * @param className 类名
   */
  constructor(className: string) {
    super(className);
  }

  /**
   * 生成头文件字符串
   * @returns 头文件内容
   */
  create(): string {
    return `${super.create()}

#pragma once

${this.getIncludeLines()}

namespace gap
{
    class ${this.className}
    {
    public:

        ${this.className}();

        ~${this.className}();

    };
}
`;
  }
}

/**
 * 源文件生成器
 */
export class CppCreator extends ClassCreator {
  public namespaces: string[]; // 命名空间

  /**
   * 源文件生成器
   * @param className 类名
   */
  constructor(className: string) {
    super(className);
    this.namespaces = [];
  }

  /**
   * 生成使用命名空间行
   * @param namespace 命名空间
   * @returns 行字符串
   */
  getNamespaceLine(namespace: string): string {
    return `using namespace ${namespace};`;
  }

  /**
   * 生成使用命名空间行
   * @returns 行字符串
   */
  getNamespaceLines(): string {
    return this.namespaces
      .map((ns) => {
        return this.getNamespaceLine(ns);
      })
      .join(os.EOL);
  }

  /**
   * 生成源文件内容
   * @returns 文件内容字符串
   */
  create(): string {
    return `${super.create()}

${this.getIncludeLines()}

#include "EnableCompileWarning_The_LAST_IncludeInCpp.h"

${this.getNamespaceLines()}

${this.className}::${this.className}()
{
}

${this.className}::~${this.className}()
{
}
`;
  }
}

/**
 * UI 文件生成器
 */
export class UiCreator implements TextCreator {
  public className: string; // 类名
  public x: number; // 窗口位置 X
  public y: number; // 窗口位置 Y
  public width: number; // 窗口宽度
  public height: number; // 窗口高度

  /**
   * UI 文件生成器
   * @param className 类名
   */
  constructor(className: string) {
    this.className = className;
    this.x = 0;
    this.y = 0;
    this.width = 800;
    this.height = 600;
  }

  /**
   * 生成 UI 文件内容
   * @returns UI 文件内容字符串
   */
  create(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
    <class>${this.className}UI</class>
    <widget class="QDialog" name="${this.className}UI">
    <property name="geometry">
    <rect>
    <x>${this.x}</x>
    <y>${this.y}</y>
    <width>${this.width}</width>
    <height>${this.height}</height>
    </rect>
    </property>
    <widget class="GmTitleBar" name="gbmp_title" native="true">
    <property name="geometry">
    <rect>
        <x>0</x>
        <y>0</y>
        <width>720</width>
        <height>24</height>
    </rect>
    </property>
    <property name="minimumSize">
    <size>
        <width>0</width>
        <height>24</height>
    </size>
    </property>
    <property name="font">
    <font>
        <family>微软雅黑</family>
    </font>
    </property>
    <property name="autoFillBackground">
    <bool>false</bool>
    </property>
    </widget>
    </widget>
    <customwidgets>
    <customwidget>
    <class>GmTitleBar</class>
    <extends>QWidget</extends>
    <header>GmtitleBar.h</header>
    <container>1</container>
    </customwidget>
    </customwidgets>
    <resources/>
    <connections/>
</ui>
`;
  }
}
