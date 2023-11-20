export const createHighlightText = (text: string) => {
  // 使用正则表达式匹配在方括号内和不在方括号内的内容
  var regex = /\[([^\]]*)\]|([^\[\]]+)/g;
  var children = [];
  var matches;
  // 遍历匹配的结果
  while ((matches = regex.exec(text)) !== null) {
    // 如果匹配到方括号内的内容，则将其加入数组
    if (matches[1]) {
      children.push(
        h('span', { style: { color: '#f2c97d' } },
          matches[1]
        )
      );
    }
    // 如果匹配到不在方括号内的内容，则将其加入数组
    else if (matches[2]) {
      children.push(matches[2]);
    }
  }

  return h("p", null, children)
}
