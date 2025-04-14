<template>
  <a-card style="width: 100%;" class="card-box">
    <p class="type-p" style="width: 100%;">查询：{{ props.query }}</p>
    <div v-if="tableNameText !== ''" style="width: 100%;">
      <p class="type-p">{{ tableNameText }}</p>
    </div>
    <div v-show="sqlText !== ''" style="text-align: left; width: 100%;" >
      <p class="type-p">SQL查询语句：</p>
      <highlightjs  :autodetect="true" :code="sqlText"></highlightjs>
    </div>
    <a-spin v-if="loading" :tip="loadingText"></a-spin>
    <div id="plotly-chart" ref="chartRef" :style="{ width: '100%', Height: '500px', textAlign: 'center' }" v-show="showGraph"></div>
  </a-card>
  
</template>

<script setup>
const props = defineProps({
  query: {
    type: String,
    default: '查询奥利奥官方旗舰店的日销售额'
  },
})

import { onMounted, ref} from 'vue';

import Plotly from 'plotly.js-dist';

let ws = null;
const chartRef = ref(null);

const showGraph = ref(false);
const loading = ref(true);
const loadingText = ref('正在获取表名...');

import hljs from 'highlight.js/lib/core'
import sql from 'highlight.js/lib/languages/sql'
// 注册 SQL 语言支持
hljs.registerLanguage('sql', sql)


const tableNameText = ref('');
const sqlText = ref('');

const type = (text, target, timeout=50, callback) => {
  if (text !== null && text != ''){
    target.value += text[0];
    setTimeout(() => {
      type(text.slice(1), target, timeout);
    }, timeout); 
  }
}


onMounted(()=>{
  ws = new WebSocket("ws://172.16.5.15:8000/api/graph/ragstream");

  ws.onopen = function() {
    console.log("WebSocket is open now.");
    ws.send(props.query);
  };

  ws.onmessage = (event) => {
    const obj = JSON.parse(event.data);
    console.log(obj);
    if (obj.type === 'table_name'){
      type('表名：' + obj.data, tableNameText, 50);
      loadingText.value = '正在获取sql查询...';
    } else if (obj.type === 'sql'){
      type(obj.data, sqlText, 20);
      loadingText.value = '正在生成图表...';
    } else if (obj.type === 'graph'){
      showGraph.value = true;
      Plotly.newPlot(chartRef.value, obj.data.data, {
        ...obj.data.layout,  
        width: '100%', 
      });
      loading.value = false;
    }
  }
})

</script>

<style scoped lang="css">

.type-p {
  text-align: left;
  white-space: pre-wrap;
  font-size: 18px;
}

.card-box > :first-child {
  width: 100%;
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center;
  padding: 24px 48px;
}

</style>