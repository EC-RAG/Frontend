import './style.css'
import 'ant-design-vue/dist/reset.css';

import App from './App.vue'
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import router from './router'

// highlight 的样式，依赖包，组件
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'

const app = createApp(App)
app.use(Antd);
app.use(router)
app.use(hljsVuePlugin)
app.mount('#app')