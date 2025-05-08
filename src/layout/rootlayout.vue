<template>
  <a-layout class="layout">
    <a-layout-header :style="{backgroundColor:token.colorPrimaryBg,color:token.colorPrimaryText}" class="header">
      <div class="logo">MyLogo</div>
      <div class="right-icons">
        <a-tooltip title="通知">
          <a-badge dot>
            <BellOutlined :style="{color:token.colorPrimaryText}" class="icon"/>
          </a-badge>
        </a-tooltip>
        <a-dropdown>
          <a-avatar class="avatar" >
            <template #icon>
              <UserOutlined :style="{color:token.colorPrimaryText}" class="icon"/>
            </template>
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>个人中心</a-menu-item>
              <a-menu-item>退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
    </div>
    </a-layout-header>
    <a-layout style="height: 100%">
      <a-layout-sider  width="200" :style="{backgroundColor:token.colorBgLayout}" class="sider">
        <a-menu
          id="dddddd"
          v-model:openKeys="state.openKeys"
          v-model:selectedKeys="state.selectedKeys"
          style="height: 100%;"
          mode="inline"
          :inline-collapsed="state.collapsed"
          :items="items"
          class="full-height-menu"
        ></a-menu>
      </a-layout-sider>
      
      <a-layout-content :style="{backgroundColor:token.colorBgLayout}">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { BellOutlined, UserOutlined } from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue';
const { useToken } = theme;
const { token } = useToken();
import { reactive, watch, h } from 'vue';
import {
  PieChartOutlined,
  MailOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';
import router from '../router';
const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
});
const items = reactive([
  {
    key: 'sub1',
    icon: () => h(PieChartOutlined),
    label: '数据管理',
    title: '数据管理',
    children: [
      {
        key: '/datalist',
        label: '数据列表',
        title: '数据列表',
        onClick: () => router.push('/datalist')
      },
      {
        key: '/alias',
        label: '别名管理',
        title: '别名管理',
        onClick: () => router.push('/alias')
      },
      {
        key: '/rule',
        label: '规则管理',
        title: '规则管理',
        onClick: () => router.push('/rule')
      }
    ],
  },
  {
    key: 'chat',
    icon: () => h(MailOutlined),
    label: '对话',
    title: '对话',
    onClick: () => router.push('/chat')
  },
  // {
  //   key: 'sub2',
  //   icon: () => h(AppstoreOutlined),
  //   label: 'Navigation Two',
  //   title: 'Navigation Two',
  //   children: [
  //     {
  //       key: '9',
  //       label: 'Option 9',
  //       title: 'Option 9',
  //     },
  //     {
  //       key: '10',
  //       label: 'Option 10',
  //       title: 'Option 10',
  //     },
  //     {
  //       key: 'sub3',
  //       label: 'Submenu',
  //       title: 'Submenu',
  //       children: [
  //         {
  //           key: '11',
  //           label: 'Option 11',
  //           title: 'Option 11',
  //         },
  //         {
  //           key: '12',
  //           label: 'Option 12',
  //           title: 'Option 12',
  //         },
  //       ],
  //     },
  //   ],
  // },
]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  },
);

const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
</script>

<style scoped lang="css">
.layout {
  height: 100%;
  /* background: #fff; */
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background:  var(component-background); */
  /* color: var(--component-background); */
  padding: 0 24px;
  height: 64px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.right-icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  font-size: 18px;
  color: white;
  cursor: pointer;
}

.avatar {
  cursor: pointer;
  background-color: transparent;
}

.sider {
  height: 100%;
  width: 200px;
  display: flex;
  flex-direction: column;
}

.full-height-menu {
  flex: 1; 
  overflow-y: auto; /* 菜单过多时滚动 */
}
</style>