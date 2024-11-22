---
title: 10-比较html
date: '2024-11-21'
udate: '2024-11-21'
---
# 比较HTML

说明：本算法开发時部分参考过 github 上代码 https://github.com/zhoujq/htmldiff， 特别感谢。

## 背景
在做富文本内容编辑的时候，有时需要比较两次编辑内容差异，需要通过前端页面显示出来。

目前在比较两个字符串的差异，可以递归获取最长子串，然后组合成一个新的字符串。而富文本不同于字符串比较，其有html标签，不能按照字符串的方案进行比较。

## 思路
参考 字符串比较算法

1. html 字符串比较中可以将 html 字符串进行拆分，其拆分的每一个单字或块，可以看做字符串中的一个字符，比如 `<a href="" />`, `<p>` `中` 中文单个字等，可以获得两个数组，比如 `[<a href="" />, <p>, 中, 文, 单, 字, </p>]` 和 `[<a href="" />, <p>, 中, 文, 单, 字, </p>]`
2. 递归比较两个序列，获取所有相同最长子串列表
3. 新的html可以看做一系列操作，比如 `删除`, `插入`, `复制` 等操作
4. 在两个相同子串之间，旧的区间可以看做是删除的部分，新的区间可以看做是插入的部分

特别需要处理的是 `img`, `<table></table>` 这种元素占用位置，需要特殊处理


下面的比较算法中，比较相同可以优化，比如 对于 html标签中 `<div>` 和 `<div class="aaa">` 其实是相等的，只是显示不同，对于文字而言，没有任何变化


## 代码
```js

/**
 * @typedef {insert|del|equal} action
 */

/**
 * html1 and html2 same parts info
 * @typedef {Object} Match
 * @property {number} html1Start
 * @property {number} html1End
 * @property {number} html2Start
 * @property {number} html2End
 * @property {string} html1PartStr
 * @property {string} html2PartStr
 */

/**
 * Operation Part
 * @typedef {Object} Operation
 * @property {action} action
 * @property {string} text
 * @property {Word[]} list
 */

/**
 * Word
 * @typedef {Object} Word
 * @property {string} value
 * @property {boolean} isOpeningTag
 * @property {boolean} isClosingTag
 * @property {boolean} isHtmlTag
 * @property {string} [tagName]
 * @property {string} [content]
 */

const cssStrMap = {
  insert: "diff-added",
  del: "diff-removed",
  equal: "diff-equal",
};

/**
 * @class
 * @classdesc HtmlDiff, a way to compare two html
 */
class HtmlDiff {
  /**
   * HtmlDiff Constructor
   * @constructor
   * @param {string} html1
   * @param {string} html2
   */
  constructor(html1, html2) {
    this.html1 = this.preParseHtml(html1);
    this.html2 = this.preParseHtml(html2);

    /**
     * @type {string}
     */
    this.html = "";

    /**
     * html1 split words
     * @type {Word[]}
     */
    this.html1Words = [];

    /**
     * html2 split words
     * @type {Word[]}
     */
    this.html2Words = [];

    /** @type {Match[]} */
    this.matches = [];

    /** @type {Operation[]} */
    this.operations = [];

    this.contents = [];

    this.build();
  }

  build() {
    this.html1Words = this.splitHtmlToWords(this.html1);
    this.html2Words = this.splitHtmlToWords(this.html2);

    this.matches = this.findCommonParts(
      0,
      this.html1Words.length - 1,
      0,
      this.html2Words.length - 1
    );

    this.computeOperations();
    this.performOperations();
  }

  /**
   * pre parse html
   * @param {string} html
   * @returns
   */
  // eslint-disable-next-line class-methods-use-this
  preParseHtml(html) {
    html = html || "<p></br></p>";
    html = html.trim();

    if (html && (html[0] !== "<" || html[html.length - 1] !== ">")) {
      html = `<p>${html}</p>`;
    }

    return html;
  }

  /**
   * splitHtmlToWords
   * @param {string} html
   */
  // eslint-disable-next-line class-methods-use-this
  splitHtmlToWords(html) {
    const wordValues = html.match(/<[^>]+>|[^<|>|\w]|\w+\b|\s+/gm);
    const tagNameReg = /\w+\b/;
    const contentReg = /(href|src)="[^"]*"/;

    const hasContentTagNames = ["img", "a", "video"];

    const words = [];

    // eslint-disable-next-line no-unused-vars
    for (const value of wordValues) {
      const isOpeningTag = this.isOpeningTag(value);
      const isClosingTag = this.isClosingTag(value);
      const isHtmlTag = isOpeningTag || isClosingTag;

      let content = value;
      let tagName = "";

      if (isHtmlTag) {
        // eslint-disable-next-line prefer-destructuring
        tagName = value.match(tagNameReg)[0];

        if (hasContentTagNames.includes(tagName)) {
          // eslint-disable-next-line prefer-destructuring
          content = value.match(contentReg)[0];
        }
      }

      const word = {
        value,
        isOpeningTag,
        isClosingTag,
        isHtmlTag,
        tagName,
        content,
      };

      words.push(word);
    }
    return words;
  }

  /**
   * findCommonParts
   * @param {number} html1Start
   * @param {number} html1End
   * @param {number} html2Start
   * @param {number} html2End
   * @param {Match[]} matches
   */
  findCommonParts(html1Start, html1End, html2Start, html2End, matches = []) {
    const match = this.findMatch(html1Start, html1End, html2Start, html2End);

    if (!match) return;

    if (html1Start < match.html1Start && html2Start < match.html2Start) {
      this.findCommonParts(
        html1Start,
        match.html1Start - 1,
        html2Start,
        match.html2Start - 1,
        matches
      );
    }

    matches.push(match);

    if (match.html1End < html1End && match.html2End < html2End) {
      this.findCommonParts(
        match.html1End + 1,
        html1End,
        match.html2End + 1,
        html2End,
        matches
      );
    }

    return matches;
  }

  /**
   * findMatch
   * @param {number} html1Start
   * @param {number} html1End
   * @param {number} html2Start
   * @param {number} html2End
   * @return {Match}
   */
  findMatch(html1Start, html1End, html2Start, html2End) {
    const m = html1End - html1Start + 1;
    const n = html2End - html2Start + 1;

    const html1WordsParts = this.html1Words.slice(html1Start, html1End + 1);
    const html2WordsParts = this.html2Words.slice(html2Start, html2End + 1);

    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));

    let maxLength = 0;

    let html1EndPos = 0;
    let html2EndPos = 0;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        // <img src="aaa" />
        // <img src="bbb" />
        // <div class="a1">
        // <div class="a2">
        // <hr /> <table>
        // </table>
        // <br /> <br/>
        // html1WordsParts[i - 1] === html2WordsParts[j - 1]
        if (this.isWordEqual(html1WordsParts[i - 1], html2WordsParts[j - 1])) {
          dp[i][j] = dp[i - 1][j - 1] + 1;

          if (dp[i][j] > maxLength) {
            maxLength = dp[i][j];

            html1EndPos = i - 1;
            html2EndPos = j - 1;
          }
        } else {
          dp[i][j] = 0;
        }
      }
    }

    if (!maxLength) return null;

    const html1StartPos = html1EndPos - maxLength + 1;
    const html2StartPos = html2EndPos - maxLength + 1;

    const html1PartStr = html1WordsParts
      .slice(html1StartPos, html1EndPos + 1)
      .map((item) => item.value)
      .join("");
    const html2PartStr = html2WordsParts
      .slice(html2StartPos, html2EndPos + 1)
      .map((item) => item.value)
      .join("");

    const match = {
      html1Start: html1Start + html1StartPos,
      html1End: html1Start + html1EndPos,
      html2Start: html2Start + html2StartPos,
      html2End: html2Start + html2EndPos,
      html1PartStr,
      html2PartStr,
    };

    return match;
  }

  /**
   * isWordEqual
   * @param {Word} word1
   * @param {Word} word2
   * @returns {boolean}
   */
  // eslint-disable-next-line class-methods-use-this
  isWordEqual(word1, word2) {
    // <div> 和 <div class="aaa"> 相同
    // <a href="a" /> 跟 <a href="b" /> 不同
    // <img src="a" /> 跟 <img src="b" /> 不同

    const hasContentTagNames = ["img", "a", "video"];

    if (word1.value == word2.value) return true;

    // 同时是html标签可以比较
    if (
      (word1.isOpeningTag && word2.isOpeningTag) ||
      (word1.isClosingTag && word2.isClosingTag)
    ) {
      const isSameTag = word1.tagName == word2.tagName;

      if (isSameTag && hasContentTagNames.includes(word1.tagName)) {
        return word1.content == word2.content;
      }

      return isSameTag;
    }

    return false;
  }

  /**
   * get operations
   */
  computeOperations() {
    let p = -1;
    let q = -1;

    // eslint-disable-next-line no-unused-vars
    for (const match of this.matches) {
      if (p < match.html1Start - 1) {
        const list = this.html1Words.slice(p + 1, match.html1Start);
        const operation1 = {
          action: "del",
          list,
          text: list.map((item) => item.value).join(""),
        };

        this.operations.push(operation1);
      }

      if (q < match.html2Start - 1) {
        const list = this.html2Words.slice(q + 1, match.html2Start);
        const operation2 = {
          action: "insert",
          list,
          text: list.map((item) => item.value).join(""),
        };

        this.operations.push(operation2);
      }

      const list = this.html2Words.slice(match.html2Start, match.html2End + 1);
      const operation = {
        action: "equal",
        list,
        text: list.map((item) => item.value).join(""),
      };
      this.operations.push(operation);

      p = match.html1End;
      q = match.html2End;
    }

    if (p < this.html1Words.length - 1) {
      const list = this.html1Words.slice(p + 1, this.html1Words.length);
      const operation1 = {
        action: "del",
        list,
        text: list.map((item) => item.value).join(""),
      };

      this.operations.push(operation1);
    }

    if (q < this.html2Words.length - 1) {
      const list = this.html2Words.slice(q + 1, this.html2Words.length);
      const operation2 = {
        action: "insert",
        list,
        text: list.map((item) => item.value).join(""),
      };

      this.operations.push(operation2);
    }
  }

  /**
   * perform operation in sequence
   */
  performOperations() {
    this.operations.forEach((operation) => {
      this.insertContent(operation);
    });

    this.html = this.contents.join("");
  }

  /**
   * insert operation string to content
   * @param {Operation} operation
   */
  insertContent(operation) {
    const { action, list } = operation;
    const cssStr = cssStrMap[action] || "";

    let text = list.map((item) => item.value).join("");
    if (["insert", "del"].includes(action)) {
      const newList = this.wrapTextList(list, cssStr, action);
      text = newList.join("");

      text = this.wrapBlockContent(text, cssStr);
    }

    this.contents.push(text);
  }

  /**
   * 查找非标签字符列表
   * @param {Word[]} list
   * @param {string} cssStr
   * @param {string} action
   * @returns {string[]}
   */
  // eslint-disable-next-line class-methods-use-this
  wrapTextList(list, cssStr, action) {
    const parts = [];
    let newList = [];
    let hasContent = false;

    // eslint-disable-next-line no-unused-vars
    for (const word of list) {
      const { value, isHtmlTag } = word;
      if (isHtmlTag) {
        if (parts.length) {
          let textPart = parts.join("");
          textPart = `<span class="${cssStr}">${textPart}</span>`;
          newList.push(textPart);
          parts.length = 0;
        }

        // 下面的标签，即使删除也要占位
        if (
          !hasContent &&
          (value.indexOf("<img") > -1 ||
            value.indexOf("<a") > -1 ||
            value.indexOf("<table")) > -1
        ) {
          hasContent = true;
        }

        newList.push(value);
        continue;
      }

      hasContent = true;
      parts.push(value);
    }

    if (parts.length) {
      let textPart = parts.join("");
      textPart = `<span class="${cssStr}">${textPart}</span>`;
      newList.push(textPart);
    }

    if (!hasContent && action === "del") {
      newList = [];
    }
    return newList;
  }

  /**
   * 包装块状结构，比如 img, table 等
   * @param {string} text
   * @param {string} cssStr
   */
  // eslint-disable-next-line class-methods-use-this
  wrapBlockContent(text, cssStr) {
    // 图片处理
    const imgReg = /<img[^>]*>/gi;
    if (imgReg.test(text)) {
      const list = text.match(imgReg);
      const set = new Set();
      // eslint-disable-next-line no-unused-vars
      for (const item of list) {
        if (set.has(item)) continue;
        const regex2 = new RegExp(item, "g");

        text = text.replace(
          regex2,
          `<div class="${cssStr} diff-block">${item}</div>`
        );
        set.add(item);
      }
    }

    // 表格处理
    const tableStartReg = /<table[^>]*>/gi;
    const tableEndReg = /<\/table>/gi;

    if (tableStartReg.test(text)) {
      const list = text.match(tableStartReg);
      const set = new Set();
      // eslint-disable-next-line no-unused-vars
      for (const item of list) {
        if (set.has(item)) continue;
        const regex2 = new RegExp(item, "g");

        text = text.replace(regex2, `<div class="${cssStr}">${item}`);
        set.add(item);
      }
    }

    if (tableEndReg.test(text)) {
      const list = text.match(tableEndReg);
      const set = new Set();
      // eslint-disable-next-line no-unused-vars
      for (const item of list) {
        if (set.has(item)) continue;
        const regex2 = new RegExp(item, "g");

        text = text.replace(regex2, `${item}</div>`);
        set.add(item);
      }
    }

    return text;
  }

  /**
   * isOpeningTag
   * @param {string} str
   * @returns
   */
  // eslint-disable-next-line class-methods-use-this
  isOpeningTag(str) {
    return /^\s*<\s*[a-zA-Z]+[^>]*[/]?\s*>\s*$/gi.test(str);
  }

  /**
   * isClosingTag
   * @param {string} str
   * @returns
   */
  // eslint-disable-next-line class-methods-use-this
  isClosingTag(str) {
    return /^\s*<\s*\/[^>]+>\s*/gi.test(str);
  }

  /**
   * isHtmlTag
   * @param {string} str
   * @returns {boolean}
   */
  isHtmlTag(str) {
    return this.isOpeningTag(str) || this.isClosingTag(str);
  }
}

export default HtmlDiff;

```
