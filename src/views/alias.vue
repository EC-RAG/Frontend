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
          ></a-select>
          <a-button type="primary" @click="onSearch" style="margin-left: 10px;" :disabled="value == ''">查询</a-button>
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
    <a-card style="width: 100%">
      <a-table :columns="columns" :data-source="data" :loading="loading">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'embedding'">
              <span class="copy" title="点击复制" :style="{'--hover-color':token.colorPrimaryTextHover}" @click='onCopy(text)'>{{ text }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'metadata'">
              <span class="copy" title="点击复制" :style="{'--hover-color':token.colorPrimaryTextHover}" @click='onCopy(text)'>{{ text }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'edit'">
            <a-popconfirm title="确定要删除这条数据吗？" cancel-text="取消" ok-text="提交" @confirm="onDelete(record)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

  </a-layout-content>
  <!-- 创建新的别名项 -->
  <a-modal v-model:open="openCreatebox" title="添加" @ok="handleCreateOk" width="500px" cancelText="取消" okText="提交" >
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :style="{'margin-top': '30px', 'margin-bottom': '30px'}">
      <a-form-item label="表名">
        <a-input v-model:value="formState.table_name" />
      </a-form-item>
      <a-form-item label="别名">
        <a-input v-model:value="formState.table_alias" />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- 测试按钮 -->
  <a-modal v-model:open="openTestbox" title="测试" width="800px"  :footer="null" >
    <a-layout-content class="test-search-box noselect">
      <a-input-search
        v-model:value="searchValue"
        :placeholder="'请输入查询'"
        :allow-clear="true"
        :enter-button="true"
        @search="onSearchTest"
        style="width: 300px; margin-bottom: 20px; flex:1; margin-top: 20px;">
      </a-input-search>
      <a-layout-content>
        <span> 结果数 </span>
      </a-layout-content>
      <a-select
        ref="select"
        v-model:value="testNtopValue"
        style="width: 80px"
        :options="Testoptions"
      ></a-select>
    </a-layout-content>
    <a-table :columns="Testcolumns" :data-source="Testdata" :loading="Testloading"></a-table>
  </a-modal>
</template>

<script setup>

import { ReloadOutlined } from '@ant-design/icons-vue'
import axiosInstance from '../services/axiosinstance';

import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';

import { theme } from 'ant-design-vue';
const { useToken } = theme;
const { token } = useToken();

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

const columns = [
  {
    title: '表名',
    dataIndex: 'document',
    key: 'document',
    width: 200,
  },
  {
    title: '别名',
    dataIndex: 'id',
    key: 'id',
    width: 168,
  },
  {
    title: '嵌入向量',
    dataIndex: 'embedding',
    key: 'embedding',
    ellipsis: true,
  },
  {
    title: '元数据',
    dataIndex: 'metadata',
    key: 'metadata',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'edit',
    key: 'edit',
    width: 120,
  },
];

const data = ref([]);

const onSearch = () => {
  loading.value = true;
  axiosInstance.get('/api/data/gettablealias', { params: { table_name: value.value } }).then((response) => {
    console.log(response.data);
    data.value = response.data;
    data.value.forEach((item) => {
      item.embedding = JSON.stringify(item.embedding, null, 2);
      item.metadata = JSON.stringify(item.metadata, null, 2);
    });
    message.success('查询成功');
    loading.value = false;
  })
  .catch((error) => {
    console.error(error);
    message.error('查询失败');
    loading.value = false;
  });
}

const loading = ref(false);

const onCopy = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('成功复制到剪切板');
  }).catch((error) => {
    console.error('复制失败:', error);
    message.error('复制失败');
  });
}

const openCreatebox = ref(false);

const formState = reactive({
  table_name: '',
  table_alias: ''
});

const wrapperCol = {
  span: 18,
};

const labelCol = {
  style: {
    width: '80px',
  },
};

const onAdd = () => {
  openCreatebox.value = true;
}

const handleCreateOk = () => {
  if (formState.table_name === '') {
    message.error('表名不能为空');
    return;
  }
  if (formState.table_alias === '') {
    message.error('别名不能为空');
    return;
  }
  loading.value = true;
  axiosInstance.get('/api/data/addalias', {params:{table_name:formState.table_name, table_alias:formState.table_alias}}).then((response) => {
    message.success('添加成功');
    formState.table_name = '';
    formState.table_alias = '';
    getTags();
    openCreatebox.value = false;
    loading.value = false;
  })
  .catch((error) => {
    console.error(error);
    message.error('添加失败');
    loading.value = false;
  });
}

const onDelete = (record) => {
  loading.value = true;
  axiosInstance.get('/api/data/rmalias', {params:{table_name: record.id}}).then((response) => {
    if (response.data === true) {
      message.success('删除成功');
      getTags();
      onSearch();
    } else {
      message.error('删除失败，请检查表名是否重复');
    }
    loading.value = false;
  })
  .catch((error) => {
    console.error(error);
    message.error('删除失败');
    loading.value = false;
  });
}

const flushTable = () => {
  loading.value = true;
  data.value = [];
  getTags();
  value.value = '';
  loading.value = false;
}

const openTestbox = ref(false);

const onTest = ()=>{
  testNtopValue.value = 1;
  searchValue.value = '';
  Testdata.value = [];
  openTestbox.value = true;
}

const testNtopValue = ref(1);
const Testoptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
];

const Testcolumns = [
{
    title: '别名',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '表名',
    dataIndex: 'document',
    key: 'document',
  },
  {
    title: '相似度',
    dataIndex: 'distance',
    key: 'distance',
    width: 128,
  }
];

const Testdata = ref([]);
const Testloading = ref(false);
const searchValue = ref('');

const onSearchTest = () => {
  Testloading.value = true;
  Testdata.value = [];
  axiosInstance.get('/api/data/aliasquery', { params: { top_k: testNtopValue.value, query: searchValue.value } }).then((response) => {
    console.log(response.data);
    Testdata.value = response.data;
    message.success('查询成功');
    Testloading.value = false;
  })
  .catch((error) => {
    console.error(error);
    message.error('查询失败');
    Testloading.value = false;
  });
}
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

.copy {
  cursor: pointer;
  transition: color 0.3s ease; 
}

.copy:hover {
  color: var(--hover-color);
}

.test-search-box{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.noselect {
  user-select: none;
}
</style>