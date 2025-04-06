<template>
  <a-layout-content class="main-content">
    <a-card title="别名管理"  style="width: 100%" id="title">
      <a-layout-content class="search-box">
        <a-layout-content class="left-box">
          <a-select
            v-model:value="value"
            style="width: 100%"
            placeholder="表名"
            :options="options"
            @change="handleChange"
          ></a-select>
          <a-button type="primary" @click="onAdd" style="margin-left: 10px;">查询</a-button>
        </a-layout-content>
      <a-layout-content class="right-box">
        <a-button type="primary" @click="onAdd" >添加数据</a-button>
        <a-button type="primary" @click="onTest" >测试</a-button>
        <a-button type="primary" @click="flushTable">
          <ReloadOutlined />
        </a-button>
      </a-layout-content>
      </a-layout-content>
    </a-card>
  </a-layout-content>
 
</template>

<script setup>

import { ReloadOutlined } from '@ant-design/icons-vue'
import axiosInstance from '../services/axiosinstance';

import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';

const options = ref([]);
const value = ref('');

const getTags = () => {
  axiosInstance.get('/api/data/gettabletags').then((response) => {
    options.value = response.data.map((item) => ({
      label: item,
      value: item,
    }));
  });
};

onMounted(() => {
  getTags();
});


</script>

<style lang="css" scoped>
#title {
  text-align: left;
}

.search-box{
  display: flex;
  justify-content: flex-start;
}

.left-box{
  display: flex;
  flex: 3;
}

.right-box{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex: 2;
}
</style>