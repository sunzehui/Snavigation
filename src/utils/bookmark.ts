import { LinkCategory } from "@/lib/db";

function attr2Date(attr: string) {
  return Number(attr || 0) * 1000
}
export function parseBookmark(bookmarkText: string) {
  const bookmarks = [];

  var parser = new DOMParser();
  var doc = parser.parseFromString(bookmarkText, 'text/html');
  const bookmarkBlockList = doc.querySelectorAll('body > dl > dt > dl > dt')
  bookmarkBlockList.forEach(b => {
    const bTitle = b.querySelector('h3')
    const linkEls = b.querySelectorAll('dl>dt>a')
    const linkList = []
    let categoryName = '默认分组'
    let create_time = null
    if (linkEls.length) {
      linkEls.forEach((l) => {
        const url = l.getAttribute('href')
        const name = l.innerHTML;
        const create_time = attr2Date(l.getAttribute('add_date'))
        const icon = l.getAttribute('icon')
        linkList.push({
          url, name, create_time, icon
        })
      })
    }

    if (bTitle) {
      categoryName = bTitle.innerText
      create_time = attr2Date(bTitle.getAttribute('add_date'))
    }
    const category: LinkCategory = {
      category: categoryName,
      create_time,
      links: linkList
    }
    // find and insert
    const bookmarkIdx = bookmarks.findIndex(item => item.category === category.category);
    if (bookmarkIdx < 0) {
      bookmarks.push(category)
    } else {
      const oldList = bookmarks[bookmarkIdx].links || []
      bookmarks[bookmarkIdx].links = oldList.concat(linkList)
    }
  })

  return bookmarks;
}
