import EditorToolbar from './components/EditorToolbar.vue'
import HyperlinkDialog from './components/HyperlinkDialog.vue'
import type { App } from 'vue'

// 导出组件
export { EditorToolbar, HyperlinkDialog }

// 默认导出，支持Vue.use()安装
export default {
  install(app: App) {
    app.component('EditorToolbar', EditorToolbar)
    app.component('HyperlinkDialog', HyperlinkDialog)
  }
} 