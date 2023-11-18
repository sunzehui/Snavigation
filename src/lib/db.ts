// import { createClient } from '@supabase/supabase-js'
import Dexie, { Table } from 'dexie';

// export const DBClient = createClient(
//   import.meta.env.VITE_APP_SUPABASE_URL as string,
//   import.meta.env.VITE_APP_SUPABASE_KEY as string
// )

export interface LinkPayload {
  name: string;
  url: string
}
export interface LinkCategory {
  id?: number;
  category: string;
  create_time: number;
  links: LinkPayload[]
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  links!: Table<LinkCategory>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      links: '++id, category, link.name, create_time' // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
// 使用'populate'事件插入初始默认数据

db.on('populate', function () {
  console.log('run');

  db.links.add({ id: 0, category: '默认分组', create_time: +new Date(), links: [] });
});
// 打开数据库
db.open().then(function () {
  // 'ready'事件在数据库打开并初始化数据后触发
  db.on('ready', function () {
    console.log('数据库已准备好，并包含初始数据。');
  });
}).catch(function (error) {
  console.error('打开数据库时出错: ' + error);
});
