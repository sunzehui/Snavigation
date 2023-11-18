import { LinkCategory, LinkPayload, db } from '@/lib/db';

import { parseBookmark } from '@/utils/bookmark'
export async function getAllLink() {
  const linkRecord = await db.links
    .orderBy('create_time') // 按照create_time字段排序
    .toArray();
  return linkRecord
}

export async function saveLink(category: string, payload: LinkPayload) {
  const linkCategory = await db.links.where('category').equals(category).first()
  if (!linkCategory) {
    return db.links.add({
      category,
      create_time: +new Date(),
      links: payload ? [payload] : []
    })
  }
  return db.links.where('category').equals(category).modify({
    links: [
      ...linkCategory.links,
      payload
    ]
  })
}
export async function batchSaveLink(category: string, payload: LinkPayload[]) {
  const linkCategory = await db.links.where('category').equals(category).first()
  if (!linkCategory) {
    return db.links.add({
      category,
      create_time: +new Date(),
      links: payload || []
    })
  }
  return db.links.where('category').equals(category).modify({
    links: [
      ...linkCategory.links,
      ...payload
    ]
  })
}

export async function deleteLink(cate: string, linkName: string) {
  const cateDO = await db.links.where('category').equals(cate).first()
  console.log("🚀 ~ file: link.ts:29 ~ deleteLink ~ cateDO:", cateDO)
  return db.links.where('category').equals(cate)
    .modify({
      links: cateDO.links.filter((link: LinkPayload) => link.name !== linkName)
    });
}
export function deleteCategory(cate: string) {
  return db.links.where('category').equals(cate).delete()
}
