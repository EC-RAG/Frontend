<template>
  <a-layout-content class="main-content">
    <a-card title="数据列表"  style="width: 100%" id="title">
      <a-layout-content class="search-box">
        <a-input-search
          v-model:value="searchValue"
          :placeholder="'请输入数据名称'"
          :allow-clear="true"
          :enter-button="true"
          @search="onSearch"
          style="width: 300px; margin-bottom: 20px; flex:1">
        </a-input-search>
        <a-button type="primary" @click="onAdd" style="margin-left: 10px;">添加数据</a-button>
        <a-button type="primary" @click="flushTable" style="margin-left: 10px;">
          <ReloadOutlined />
        </a-button>
        <a-modal v-model:open="openCreatebox" title="编辑" @ok="handleCreateOk" width="800px" cancelText="取消" okText="提交">
          <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-form-item label="表名">
              <a-input v-model:value="formState.table_name" />
            </a-form-item>
            <a-form-item label="表定义">
              <a-textarea :rows="10" v-model:value="formState.table_define_sql" />
            </a-form-item>
            <a-form-item label="字段解释">
              <a-textarea :rows="10" v-model:value="formState.table_field_info" />
            </a-form-item>
          </a-form>
        </a-modal>
      </a-layout-content>
    </a-card>
    <a-card style="width: 100%">
      <a-table :columns="columns" :data-source="data" :loading="loading">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'edit'">
            <a-button type="link" @click="showEditbox(record)" size="small">编辑</a-button>
            <a-modal v-model:open="openEditbox" title="编辑" @ok="handleOk" width="800px" cancelText="取消" okText="提交">
              <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-item label="表名">
                  <a-input v-model:value="formState.table_name" />
                </a-form-item>
                <a-form-item label="表定义">
                  <a-textarea :rows="10" v-model:value="formState.table_define_sql" />
                </a-form-item>
                <a-form-item label="字段解释">
                  <a-textarea :rows="10" v-model:value="formState.table_field_info" />
                </a-form-item>
              </a-form>
            </a-modal>
            <a-popconfirm title="确定要删除这条数据吗？" cancel-text="取消" ok-text="提交" @confirm="onDelete(record)">
              <a-button type="link" size="small" danger>删除</a-button>
            </a-popconfirm>
        </template>
        </template>
        
      </a-table>
    </a-card>
  </a-layout-content>
</template>

<script setup>
import { theme } from 'ant-design-vue';
const { useToken } = theme;
const { token } = useToken();
import { h, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { ReloadOutlined } from '@ant-design/icons-vue';

const columns = [
  {
    title: '表名',
    dataIndex: 'table_name',
    key: 'table_name',
    width: 160,
  },
  {
    title: '表定义',
    dataIndex: 'table_define_sql',
    key: 'table_define_sql',
    ellipsis: true,
  },
  {
    title: '字段解释',
    dataIndex: 'table_field_info',
    key: 'table_field_info',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'edit',
    key: 'edit',
    width: 120,
  },
];

const flushTable = () => {
  loading.value = true;
  data.value = [];
  axiosInstance.get('/api/data/all').then((response) => {
    data.value = response.data;
    loading.value = false;
  });
};

const data = ref([]);
import axiosInstance from '../services/axiosinstance';
import { onMounted } from 'vue';
onMounted(() => {
  flushTable();
});


const loading = ref(true);
const openEditbox = ref(false);
const showEditbox = (record) => {
  formState.table_name = record.table_name;
  formState.table_define_sql = record.table_define_sql;
  formState.table_field_info = record.table_field_info;
  openEditbox.value = true;
};

const wrapperCol = {
  span: 24,
};

const labelCol = {
  style: {
    width: '80px',
  },
};

const formState = reactive({
  table_name: '',
  table_define_sql: '',
  table_field_info: '',
});

const openCreatebox = ref(false);

const onAdd = () => {
  formState.table_name = '';
  formState.table_define_sql = '';
  formState.table_field_info = '';
  openCreatebox.value = true;
};

const handleCreateOk = () => {
  if (formState.table_name === '') {
    message.error('表名不能为空');
    return;
  }

  axiosInstance.post('/api/data/addtable', formState).then((response) => {;
    if (response.data === true) {
      message.success('添加成功');
      flushTable();
      openCreatebox.value = false;
    } else {
      message.error('添加失败，请检查表名是否重复');
    }
  });
}

const onDelete = (record) => {
  axiosInstance.get('/api/data/rmtable', {params:{table_name: record.table_name}}).then((response) => {
    if (response.data === true) {
      message.success('删除成功');
      flushTable();
    } else {
      message.error('删除失败，请检查表名是否重复');
    }
  });
};

const handleOk = () => {
  if (formState.table_name === '') {
    message.error('表名不能为空');
    return;
  }
  axiosInstance.post('/api/data/edittable', formState).then((response) => {
    if (response.data === true) {
      flushTable();
      message.success('编辑成功');
      openEditbox.value = false;
    } else {
      message.error('编辑失败，请检查表名是否重复');
    }
  });
};

const searchValue = ref('');

const onSearch = () => {
  if (searchValue.value === '') {
    flushTable();
    return;
  }
  loading.value = true;
  data.value = [];
  axiosInstance.get('/api/data/gettable', {params:{table_name: searchValue.value}}).then((response) => {
    data.value = response.data;
    loading.value = false;
  });
};

</script>

<style lang="css" scoped>
#title {
  text-align: left;
}

.search-box {
  display: flex;
  justify-content: flex-start;
}
</style>