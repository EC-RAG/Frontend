<template>
  <a-layout-content class="main-content">
    <div id="plotly-chart" ref="chartRef" :style="{ width: '100%', height: '500px' }"></div>

    <a-card class="chat-box">
      <a-layout-content style="overflow-y: auto; max-height: 200px; min-height: 80px;">
        <a-textarea
          v-model:value="value2"
          placeholder="请输入任何问题"
          :auto-size="{ minRows: 2}"
          :bordered="false"
          size="large"
          style="height: 100%;"
        />
      </a-layout-content>

      <a-layout-content style="text-align: right;">
        <a-tooltip title="搜索">
          <a-button shape="circle" :icon="h(ArrowUpOutlined)" />
        </a-tooltip>
      </a-layout-content>
    </a-card>
  </a-layout-content>
  
</template>

<script setup>
import { onMounted, ref, h } from 'vue';
import Plotly from 'plotly.js-dist';

import { ArrowUpOutlined } from '@ant-design/icons-vue';

import responseArea from '../components/responseArea.vue';

const chartRef = ref(null);

onMounted(() => {
  const trace = {
    x: [1, 2, 3, 4],
    y: [10, 11, 12, 13],
    z: [1, 2, 3, 4],
    mode: 'markers',
    marker: {
      size: 12,
      color: [1, 2, 3, 4],
      colorscale: 'Viridis',
      opacity: 0.8
    }
  };

  const layout = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    scene: {
      xaxis: {
        title: 'X',
      },
      yaxis: {
        title: 'Y',
      },
      zaxis: {
        title: 'Z',
      }
    }
  };

  const data = [trace];

  Plotly.newPlot(chartRef.value, data, layout);
});
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

</style>