<template>
  <a-layout-content class="main-content">
    <a-card title="规则管理"  style="width: 100%" id="title">
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
          <a-button type="primary" @click="onAdd" >创建规则</a-button>
          <!-- <a-button type="primary" @click="onTest" >测试</a-button> -->
          <a-button type="primary" @click="onFlush">
            <ReloadOutlined />
          </a-button>
        </a-layout-content>
      </a-layout-content>
    </a-card>

    <a-card style="width: 100%">
      <a-table :columns="columns" :data-source="data" :loading="loading">
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'content'">
              <div class="left">{{ text }}</div>
          </template>
          <template v-else-if="column.dataIndex === 'edit'">
            <a-button type="link" size="small" :disabled="record.level == 'system'" @click="onEdit(record)">编辑</a-button>
            <a-popconfirm title="确定要删除这条数据吗？" cancel-text="取消" ok-text="提交" @confirm="onDelete(record)">
              <a-button type="link" size="small" :disabled="record.level == 'system'" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

  </a-layout-content>
  <a-modal v-model:open="openCreatebox" title="创建规则" @ok="handleOk" width="600px" cancelText="取消" okText="提交" :okButtonProps="{loading: submitLoading}">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-top: 25px;">
      <a-form-item label="规则类型">
        <a-select v-model:value="formState.step_type" style="width: 50%" placeholder="规则类型" :options="options"></a-select>
      </a-form-item>
      <a-form-item label="规则内容">
        <a-textarea :rows="5" v-model:value="formState.content" placeholder="规则内容"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal v-model:open="openEditbox" title="修改规则" @ok="handleEditOk" width="600px" cancelText="取消" okText="提交" :okButtonProps="{loading: submitLoading}">
    <a-form :model="formStateEdit" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-top: 25px;">
      <a-form-item label="规则类型">
        <a-select v-model:value="formStateEdit.step_type" style="width: 50%" placeholder="规则类型" :options="options" disabled></a-select>
      </a-form-item>
      <a-form-item label="规则内容">
        <a-textarea :rows="5" v-model:value="formStateEdit.content" placeholder="规则内容"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { onMounted, ref, h } from 'vue';

import { ReloadOutlined } from '@ant-design/icons-vue'
import axiosInstance from '../services/axiosinstance';
import message from 'ant-design-vue/es/message';

const options = ref([
  {
    label: '表名识别',
    value: 'tablename'
  },
  {
    label: 'SQL生成',
    value: 'sql'
  },
  {
    label: '图表生成',
    value: 'graph'
  }
]);

const value = ref('tablename');

const openCreatebox = ref(false);
const openEditbox = ref(false);

const wrapperCol = {
  span: 24,
};

const labelCol = {
  style: {
    width: '80px',
  },
};

const submitLoading = ref(false);

const columns = [
  {
    title: '规则id',
    dataIndex: 'id',
    key: 'id',
    width: 108,
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'step_type',
    key: 'step_type',
    // ellipsis: true,
    width: 120,
    align: 'center',
  },
  {
    title: '等级',
    dataIndex: 'level',
    key: 'level',
    // ellipsis: true,
    width: 120,
    align: 'center',
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'edit',
    key: 'edit',
    width: 120,
    align: 'center',
  },
];

const data = ref([]);
const loading = ref(false);

const reflashTable = () => {
  data.value = [];
  loading.value = true;
  axiosInstance.get('/api/data/allrules').then((response)=>{
    data.value = response.data;
    loading.value = false;
  }).catch((error)=>{
    console.log(error);
    message.error('获取数据失败，请稍后重试！');
    loading.value = false;
  });
}

onMounted(() => {
  reflashTable();
});

const onFlush = () => {
  reflashTable();
}

const onSearch = () => {
  loading.value = true;
  data.value = [];
  axiosInstance.get('/api/data/getrule', {
    params: {
      step_type: value.value
    }
  }).then((response)=>{
    data.value = response.data;
    loading.value = false;
  }).catch((error)=>{
    console.log(error);
    message.error('获取数据失败，请稍后重试！');
    loading.value = false;
  });
}

const onAdd = () => {
  openCreatebox.value = true;
}

const formState = ref({
  step_type: '',
  content: '',
});

const handleOk = () => {
  submitLoading.value = true;
  axiosInstance.post('/api/data/addrule', formState.value).then((response)=>{
    if (response.data == true) {
      message.success('添加成功！');
      openCreatebox.value = false;
      reflashTable();
    } else {
      message.error('添加失败，请稍后重试！');
    }
    submitLoading.value = false;
  }).catch((error)=>{
    console.log(error);
    message.error('添加失败，请稍后重试！');
    submitLoading.value = false;
  });
}

const formStateEdit = ref({
  id: '',
  step_type: '',
  content: '',
});

const onEdit = (record) => {
  formStateEdit.value.id = record.id;
  formStateEdit.value.step_type = record.step_type;
  formStateEdit.value.content = record.content;
  openEditbox.value = true;
}

const handleEditOk = () => {
  submitLoading.value = true;
  axiosInstance.post('/api/data/editrule', formStateEdit.value).then((response)=>{
    if (response.data == true) {
      message.success('修改成功！');
      openEditbox.value = false;
      reflashTable();
    } else {
      message.error('修改失败，请稍后重试！');
    }
    submitLoading.value = false;
  }).catch((error)=>{
    console.log(error);
    message.error('修改失败，请稍后重试！');
    submitLoading.value = false;
  });
}

const onDelete = (record) => {
  axiosInstance.get('/api/data/rmrule', {params:{rule_id: record.id}}).then((response) => {
    if (response.data == true) {
      message.success('删除成功！');
      reflashTable();
    } else {
      message.error('删除失败，请稍后重试！');
    }
  }).catch((error)=>{
    console.log(error);
    message.error('删除失败，请稍后重试！');
  });
}
</script>

<style lang="css" scoped>
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

.center{
  text-align: center;
  width: 100%;
}

.left{
  text-align: left;
  width: 100%;
  white-space: nowrap;         /* 不换行 */
  overflow: hidden;            /* 超出部分隐藏 */
  text-overflow: ellipsis; 
}

</style>