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
          <a-button type="primary" @click="onAdd" >添加别名</a-button>
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
            <!-- <a-button type="link" size="small" :disabled="record.level == 'system'" @click="onEdit(record)">编辑</a-button> -->
            <a-popconfirm title="确定要删除这条数据吗？" cancel-text="取消" ok-text="提交" @confirm="onDelete(record)">
              <a-button type="link" size="small" :disabled="record.level == 'system'" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-layout-content>

  <a-modal v-model:open="openCreatebox" title="添加别名" @ok="handleOk" width="800px" cancelText="取消" okText="提交" :okButtonProps="{loading: submitLoading}">
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="表名">
        <a-input v-model:value="formState.table_name" />
      </a-form-item>
      <a-form-item label="别名">
        <a-input v-model:value="formState.table_alias" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>

import { onMounted, ref, h } from 'vue';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import axiosInstance from '../services/axiosinstance';

const value = ref('')
const options = ref([])

const flushTableTag = () => {
  axiosInstance.get('/api/data/tabletags').then((response) => {
    options.value = response.data.map((item) => {
      return {
        label: item,
        value: item,
      }
    })
  }).catch((error) => {
    console.log(error)
    message.error('获取表名失败')
  })
}

onMounted(() => {
  flushTableTag()
})

const loading = ref(false)
const data = ref([])
const columns = ref([
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '表名',
    dataIndex: 'table_name',
    key: 'table_name',
    // width: ,
  },
  {
    title: '别名',
    dataIndex: 'table_alias',
    key: 'table_alias',
    // width: ,
  },
  {
    title: '操作',
    dataIndex: 'edit',
    key: 'edit',
    width: 120,
  },
])

const reflashTable = () => {
  data.value = []
  loading.value = true
  value.value = ''
  axiosInstance.get('/api/data/allalias').then((response) => {
    data.value = response.data
    loading.value = false
  }).catch((error) => {
    console.log(error)
    message.error('获取数据失败，请稍后重试！')
    loading.value = false
  })
}

const onFlush = () => {
  reflashTable()
}

onMounted(() => {
  reflashTable()
})

const onSearch = () => {
  loading.value = true
  data.value = []
  axiosInstance.get('/api/data/getalias', { params: { table_name: value.value } }).then((response) => {
    data.value = response.data
    loading.value = false
  }).catch((error) => {
    console.log(error)
    message.error('获取数据失败，请稍后重试！')
    loading.value = false
  })
}

const wrapperCol = {
  span: 24,
};

const labelCol = {
  style: {
    width: '80px',
  },
};

const formState = ref({
  table_name: '',
  table_alias: '',
})

const openCreatebox = ref(false)

const onAdd = () => {
  openCreatebox.value = true
}

const submitLoading = ref(false)

const handleOk = () => {
  submitLoading.value = true
  if (formState.value.table_name === '') {
    message.error('表名不能为空')
    submitLoading.value = false
    return
  }
  if (formState.value.table_alias === '') {
    message.error('别名不能为空')
    submitLoading.value = false
    return
  }
  axiosInstance.post('/api/data/addalias', formState.value).then((response) => {
    if (response.data == true) {
      message.success('添加成功！')
      openCreatebox.value = false
      reflashTable()
    } else {
      message.error('添加失败，请稍后重试！')
    }
    submitLoading.value = false
  }).catch((error) => {
    console.log(error)
    message.error('添加失败，请稍后重试！')
    submitLoading.value = false
  })
}

const onDelete = (record) => {
  axiosInstance.get('/api/data/rmalias', { params: { id: record.id } }).then((response) => {
    if (response.data == true) {
      message.success('删除成功！')
      reflashTable()
    } else {
      message.error('删除失败，请稍后重试！')
    }
  }).catch((error) => {
    console.log(error)
    message.error('删除失败，请稍后重试！')
  })
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

</style>