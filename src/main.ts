import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import i18nPlugin from './i18n'

// 创建Vue应用
const app = createApp(App)

// 使用Element Plus
app.use(ElementPlus)

// 注册国际化插件
app.use(i18nPlugin)

// 挂载应用
app.mount('#app') 