<template>
  <a-layout-content class="main-content">
    <response-area/>
    <div style="margin: 100px;"></div>

    <a-card class="chat-box">
      <a-layout-content style="overflow-y: auto; max-height: 200px; min-height: 80px;">
        <a-textarea
          v-model:value="searchText"
          placeholder="请输入任何问题"
          :auto-size="{ minRows: 2}"
          :bordered="false"
          size="large"
          style="height: 100%;"
        />
      </a-layout-content>

      <a-layout-content style="text-align: right;">
        <a-tooltip title="搜索">
          <a-button shape="circle" :icon="h(ArrowUpOutlined)" :disabled="searchText == ''"/>
        </a-tooltip>
      </a-layout-content>
    </a-card>
  </a-layout-content>
  
</template>

<script setup>
import { onMounted, ref, h } from 'vue';

import { ArrowUpOutlined } from '@ant-design/icons-vue';

import responseArea from '../components/responseArea.vue';


// ws = new WebSocket('ws://127.0.0.1:8000/api/graph/ragstream');

const searchText = ref('');

</script>

<style>

.chat-box{
  width: 600px;
  position: absolute;
  bottom: 50px;
  border: 1px solid #d9d9d9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  max-height: 256px;
  min-height: 120px;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.chat-box > :first-child {
  padding: 16px;
}
.main-content{
  min-height: 100%;
  overflow: auto;
}
</style>