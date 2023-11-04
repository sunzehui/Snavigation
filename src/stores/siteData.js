import { defineStore } from "pinia";
// import defaultShortCut from "@/../public/defaultShortCut";


const useSiteDataStore = defineStore("siteData", {
  state: () => {
    return {
      // 捷径数据
      shortcutData: [],
    };
  },
  actions: {
    setShortcutData(value) {
      this.shortcutData = value;
    },
  },
  // 开启数据持久化
  persist: {
    key: "siteData",
    storage: window.localStorage,
  },
});

export default useSiteDataStore;
