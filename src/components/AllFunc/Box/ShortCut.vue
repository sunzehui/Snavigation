<script lang="ts" setup>
import { ref, nextTick, h } from "vue";
import {
  NButton,
  NScrollbar,
  NGrid,
  NGridItem,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NDropdown,
  NIcon,
} from "naive-ui";
import { siteStore, setStore } from "@/stores";
import SvgIcon from "@/components/SvgIcon.vue";
import { LinkOutline } from '@vicons/ionicons5'

const props = defineProps<{
  list: any
}>()
const { $message, $dialog } = window
const set = setStore();
const shortcutData = computed(() => props.list)

// 图标渲染
const renderIcon = (icon) => {
  return () => {
    return h(SvgIcon, { iconName: `icon-${icon}` }, null);
  };
};

// 添加捷径数据
const addShortcutModalShow = ref(false);
const addShortcutModalType = ref(false); // false 添加 / true 编辑
const linkFromValue = ref({
  name: "",
  url: "",
});


// 右键菜单数据
const shortCutDropdownX = ref(0);
const shortCutDropdownY = ref(0);
const shortCutDropdownShow = ref(false);
const shortCutDropdownOptions = [
  {
    label: "编辑",
    key: "edit",
    icon: renderIcon("edit"),
  },
  {
    label: "删除",
    key: "delete",
    icon: renderIcon("delete-1"),
  },
];



// 开启添加捷径
const addShortcutModalOpen = () => {
  // 生成表单数据
  linkFromValue.value = {
    name: "",
    url: "",
  };
  addShortcutModalType.value = false;
  addShortcutModalShow.value = true;
};



// 删除捷径
const delShortcuts = () => {
  const deleteName = linkFromValue.value.name;
  const indexToRemove = shortcutData.value.findIndex(
    (item) => item.name === deleteName
  );
  if (indexToRemove === -1) {
    return window.$message.error("捷径删除失败，请重试");
  }

  siteStore().deleteThisCategorysLink(deleteName);
  window.$message.success("捷径删除成功");
  return true;

};

// 开启右键菜单
const shortCutContextmenu = (e, data) => {
  e.preventDefault();
  shortCutDropdownShow.value = false;
  // 写入弹窗数据
  const { name, url } = data;
  linkFromValue.value = { name, url };
  nextTick().then(() => {
    shortCutDropdownShow.value = true;
    shortCutDropdownX.value = e.clientX;
    shortCutDropdownY.value = e.clientY;
  });
};

// 右键菜单点击
const shortCutDropdownSelect = (key) => {
  shortCutDropdownShow.value = false;
  console.log(key);
  switch (key) {
    case "edit":
      addShortcutModalType.value = true;
      addShortcutModalShow.value = true;
      break;
    case "delete":
      $dialog.warning({
        title: "删除捷径",
        content: `确认删除 ${linkFromValue.value.name} 捷径？此操作将无法恢复！`,
        positiveText: "删除",
        negativeText: "取消",
        onPositiveClick: () => {
          delShortcuts();
        },
      });
      break;
    default:
      break;
  }
};

// 捷径跳转
const shortCutJump = (url) => {
  const urlRegex = /^(https?:\/\/)/i;
  const urlFormat = urlRegex.test(url) ? url : `//${url}`;
  if (set.urlJumpType === "href") {
    window.location.href = urlFormat;
  } else if (set.urlJumpType === "open") {
    window.open(urlFormat, "_blank");
  }
};
</script>


<template>
  <div style="height: 100%;">
    <!-- 捷径 -->
    <Transition name="fade" mode="out-in">
      <div v-if="shortcutData?.length" class="shortcut">
        <n-scrollbar class="scrollbar">
          <n-grid class="all-shortcut" responsive="screen" cols="2 s:3 m:4 l:5" :x-gap="10" :y-gap="10">
            <n-grid-item style="" v-for="item in shortcutData" :key="item.name" class="shortcut-item"
              @contextmenu="shortCutContextmenu($event, item)" @click="shortCutJump(item.url)">
              <n-icon class="i-icon">
                <img v-if="item.icon" :src="item.icon" style="height: 1.3rem;width: 1.3rem;" alt="">
                <LinkOutline v-else-if="!item.icon" />
              </n-icon>
              <n-ellipsis style="max-width: 240px" class="name">
                {{ item.name }}
              </n-ellipsis>
            </n-grid-item>
            <n-grid-item class="shortcut-item" @contextmenu="
              (e) => {
                e.preventDefault();
              }
            " @click="addShortcutModalOpen">
              <SvgIcon iconName="icon-add" />

              <span class="name">添加捷径</span>
            </n-grid-item>
          </n-grid>
        </n-scrollbar>
      </div>
      <div v-else-if="!shortcutData?.length" class="not-shortcut">
        <span class="tip">暂无捷径，去添加吧</span>
        <n-button strong secondary @click="addShortcutModalOpen">
          <template #icon>
            <SvgIcon iconName="icon-add" />
          </template>
          添加捷径
        </n-button>
      </div>
    </Transition>
    <!-- 添加捷径 -->
    <LinkAdd v-model:show="addShortcutModalShow" v-model:value="linkFromValue" :isEdit="addShortcutModalType" />
    <!-- 捷径右键菜单 -->
    <n-dropdown placement="bottom-start" trigger="manual" size="large" :x="shortCutDropdownX" :y="shortCutDropdownY"
      :options="shortCutDropdownOptions" :show="shortCutDropdownShow" :on-clickoutside="
        () => {
          shortCutDropdownShow = false;
        }
      " @select="shortCutDropdownSelect" />
  </div>
</template>

<style lang="scss" scoped>
.shortcut {
  width: 100%;
  height: 100%;

  .all-shortcut {
    padding: 20px;
    box-sizing: border-box;

    .shortcut-item {
      cursor: pointer;
      height: 60px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      // justify-content: center;
      background-color: var(--main-background-light-color);
      border-radius: 8px;
      font-size: 16px;
      transition: background-color 0.3s, box-shadow 0.3s;

      .i-icon {
        width: 1rem;
        margin-right: 6px;
        font-size: 20px;
        opacity: 1;
      }

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:hover {
        background-color: var(--main-background-hover-color);
        box-shadow: 0 0 0px 2px var(--main-background-hover-color);
      }

      &:active {
        box-shadow: none;
      }
    }
  }
}

.not-shortcut {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .tip {
    font-size: 24px;
    margin-bottom: 20px;
  }
}
</style>
