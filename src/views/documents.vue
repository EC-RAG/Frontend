<template>
  <a-layout-content class="main-content">
    <a-card title="文档管理"  style="width: 100%" id="title">
      <a-layout-content class="search-box">
        <a-layout-content class="left-box">
          <a-input-search
            v-model:value="searchValue"
            :placeholder="'请输入文档名称'"
            :allow-clear="true"
            :enter-button="true"
            @search="onSearch"
            style="width: 300px;  flex:1">
          </a-input-search>
        </a-layout-content>
        <a-layout-content class="right-box">
          <a-button type="primary" @click="onAdd" >创建文档</a-button>
          <a-button type="primary" @click="onTest" >测试搜索</a-button>
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
            <a-button type="link" size="small" @click="onShowContent(record)">查看分片</a-button>
          </template>
          <template v-else-if="column.dataIndex === 'edit'">
            <a-popconfirm title="确定要删除这条数据吗？" cancel-text="取消" ok-text="提交" @confirm="onDelete(record)">
              <a-button type="link" size="small" :disabled="record.level == 'system'" danger>删除</a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-layout-content>

  <a-modal v-model:open="openContentBox" title="文档内容" width="600px" :footer="null">
    <a-list size="large" bordered :data-source="contentData" :loading="contentListLoading">
      <template #renderItem="{ item }">
        <a-list-item>{{ item.content }}</a-list-item>
      </template>
      <template #header>
        <div> {{ currentRecord.title }} </div>
      </template>
    </a-list>
  </a-modal>

  <a-modal v-model:open="openCreatebox" title="添加文档" @ok="handleOk" width="800px" cancelText="取消" okText="提交" :okButtonProps="{loading: submitLoading}">
    <a-form :model="createFormState" :label-col="labelCol" :wrapper-col="wrapperCol" style="margin-top: 25px;">
      <a-form-item label="文档标题">
        <a-input v-model:value="createFormState.title" />
      </a-form-item>
      <a-form-item label="文档内容">
        <a-textarea :rows="10" v-model:value="createFormState.document" />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal v-model:open="openTestbox" title="测试" width="800px"  :footer="null" >
    <a-layout-content class="test-search-box noselect">
      <a-input-search
        v-model:value="testSearchValue"
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
import { ref, onMounted, h } from 'vue'
import axiosInstance from '../services/axiosinstance';
import message from 'ant-design-vue/es/message';

const columns = [
  {
    title: '文档名称',
    dataIndex: 'title',
    key: 'title',
    align: 'center',
  },
  {
    title: '分片数目',
    dataIndex: 'slice_cnt',
    key: 'slice_cnt',
    align: 'center',
  },
  {
    title: '文档内容',
    dataIndex: 'content',
    key: 'content',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'edit',
    key: 'edit',
    align: 'center',
  }
]

const searchValue = ref('')
const data = ref([])
const loading = ref(false)
const contentData = ref([])
const currentRecord = ref(null) 
const contentListLoading = ref(false)

const flushTable = () => {
  loading.value = true
  data.value = []
  axiosInstance.get('/api/vdb/alldoc').then((response) => {
    data.value = response.data
    loading.value = false
  })
}

onMounted(() => {
  flushTable()
})

const onFlush = () => {
  flushTable()
}

const openContentBox = ref(false)

const onShowContent = (record) => {
  contentListLoading.value = true
  openContentBox.value = true
  currentRecord.value = record
  axiosInstance.get('/api/vdb/doc', { params: { title: record.title } }).then((response) => {
    contentData.value = response.data
    contentListLoading.value = false
  })
}

const openCreatebox = ref(false)
const createFormState = ref({
  title: '',
  document: ''
})

const labelCol = {
  style: {
    width: '80px',
  },
}
const wrapperCol = {
  span: 24,
}

const onAdd = () => {
  createFormState.value.title = ''
  createFormState.value.document = ''
  openCreatebox.value = true
}

const submitLoading = ref(false)

const handleOk = () => {
  submitLoading.value = true
  if (createFormState.value.title === '') {
    message.error('文档标题不能为空')
    submitLoading.value = false
    return
  }
  if (createFormState.value.document === '') {
    message.error('文档内容不能为空')
    submitLoading.value = false
    return
  }
  axiosInstance.post('/api/vdb/adddoc', createFormState.value).then((response) => {
    if (response.data === true) {
      message.success('添加成功')
      flushTable()
      openCreatebox.value = false
    } else {
      message.error('添加失败，请检查文档标题是否重复')
    }
  }).catch((error) => {
    console.log(error)
    message.error('添加失败，请稍后重试')
  }).finally(() => {
    submitLoading.value = false
  })
}

const onDelete = (record) => {
  axiosInstance.get('/api/vdb/rmdoc', { params: { title: record.title } }).then((response) => {
    if (response.data === true) {
      message.success('删除成功')
      flushTable()
    } else {
      message.error('删除失败，请稍后重试')
    }
  }).catch((error) => {
    console.log(error)
    message.error('删除失败，请稍后重试')
  })
}

const openTestbox = ref(false)
const testSearchValue = ref('')

const onTest = () => {
  openTestbox.value = true
  testSearchValue.value = ''
}
const testNtopValue = ref(1)

const Testoptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
];

const Testcolumns = [
{
    title: '文档名',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '分片序号',
    dataIndex: 'index',
    key: 'index',
    width: 128,
  },
  {
    title: '分片内容',
    dataIndex: 'content',
    key: 'content',
    // width: 300,
  },
  {
    title: '相似度',
    dataIndex: 'distance',
    key: 'distance',
    width: 128,
  }
];

const Testdata = ref([])
const Testloading = ref(false)

const onSearchTest = () => {
  Testloading.value = true
  Testdata.value = []
  if (testSearchValue.value === '') {
    message.error('查询内容不能为空')
    Testloading.value = false
    return
  }
  axiosInstance.get('/api/vdb/querydoc', { params: { top_k: testNtopValue.value, query: testSearchValue.value } }).then((response) => {
    console.log(response.data)
    Testdata.value = response.data
    message.success('查询成功')
    Testloading.value = false
  })
  .catch((error) => {
    console.log(error)
    message.error('查询失败，请稍后重试')
    Testloading.value = false
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