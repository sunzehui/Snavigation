import { deleteCategory, deleteLink, getAllLink, saveLink } from "@/api/link";
import { LinkPayload } from "@/lib/db";
import { initial, keys } from "lodash-es";
import { defineStore } from "pinia";

const useSiteDataStore = defineStore("siteData", {
  state: () => {
    return {
      // 捷径数据
      shortcutData: [],
      links: [],
      selectedCategory: null
    };
  },
  actions: {
    setShortcutData(value) {
      this.shortcutData = value;
    },
    setLinks(value) {
      this.links = value
    },
    async initLinks() {
      const links = await getAllLink()
      this.setLinks(links)
      return links
    },
    async init() {
      await this.initLinks();
      this.selectedCategory = this.links[0]?.category || null
    },
    async addCategory(category) {
      await saveLink(category, null)
      this.initLinks();
      this.selectedCategory = category
      return true
    },
    async deleteCategory(category) {
      await deleteCategory(category)
      this.initLinks();
      // 当前选中的是被删除的分组，则选中第一个，否则不变
      if (this.selectedCategory === category)
        this.selectedCategory = this.categories[0] || null
      return true
    },
    async addLink(linkPayload: LinkPayload) {
      await saveLink(this.selectedCategory, linkPayload)
      await this.initLinks()
    },
    async deleteThisCategorysLink(linkName: string) {
      await deleteLink(this.selectedCategory, linkName)
      await this.initLinks()
    }
  },
  getters: {
    categories: (state) => {
      return keys(state.links)
    },
    activeLinks() {
      const activeCate = this.selectedCategory
      if (!activeCate) return []
      const cate = this.links.find(link => link.category === activeCate)
      return cate.links
    }
  }
  // 开启数据持久化
});

export default useSiteDataStore;
