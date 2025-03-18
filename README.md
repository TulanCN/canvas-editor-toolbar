# Canvas Editor Toolbar

一个基于[@hufe921/canvas-editor](https://github.com/Hufe921/canvas-editor)的富文本编辑器工具栏组件，为Vue 3应用提供丰富的文本编辑功能。

## 功能特点

- 完整的文本格式化工具（加粗、斜体、下划线、删除线等）
- 段落样式设置（对齐方式、行间距、列表等）
- 字体样式管理（字体、字号、颜色等）
- 插入功能（图片、超链接、LaTeX公式等）
- 自动保存和导出为Word文档
- 内置中英文国际化支持
- 响应式设计，支持移动设备

## 安装

```bash
# 安装编辑器工具栏
npm install @tulancn/canvas-editor-toolbar

# 安装必要的依赖包
npm install @hufe921/canvas-editor element-plus
```

## 使用方法

### 方式一：局部导入（推荐）

```vue
<template>
  <div class="editor-container">
    <!-- locale参数可选，默认为中文 -->
    <EditorToolbar v-if="editorReady" :editor="editor" @save="handleSave" />
    <div ref="editorContainer" class="editor-content"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CanvasEditor from '@hufe921/canvas-editor'
import { EditorToolbar } from '@tulancn/canvas-editor-toolbar'

const editorContainer = ref(null)
const editor = ref(null)
const editorReady = ref(false)
// 如需切换语言，可以使用如下代码
// const currentLocale = ref('zh-CN') // 默认使用中文

onMounted(() => {
  if (editorContainer.value) {
    // 创建编辑器实例
    editor.value = new CanvasEditor(
      editorContainer.value,
      { main: [] },  // 初始内容
      {
        defaultType: 'canvas',
        defaultFont: 'Microsoft YaHei',
        defaultSize: 16,
        width: 794,  // A4纸宽度
        height: 1123,  // A4纸高度
        margins: [100, 120, 100, 120], // [上, 右, 下, 左]
        pageNumber: {
          bottom: 50,
          format: '{{page}} / {{pages}}',
          rowFlex: 'center'
        }
      }
    )
    
    // 编辑器准备完成
    editorReady.value = true
  }
})

// 切换语言的方法（可选）
// const switchLanguage = (locale) => {
//   currentLocale.value = locale // 'zh-CN' 或 'en-US'
// }

const handleSave = (content) => {
  console.log('文档内容已保存:', content)
  // 这里可以添加保存到服务器的逻辑
}
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.editor-content {
  flex: 1;
  overflow: auto;
}
</style>
```

### 方式二：全局注册

```js
// main.js 或 main.ts
import { createApp } from 'vue'
import App from './App.vue'
import CanvasEditorToolbar from '@tulancn/canvas-editor-toolbar'
import 'element-plus/dist/index.css'  // Element Plus样式

const app = createApp(App)
app.use(CanvasEditorToolbar)  // 全局注册组件
app.mount('#app')
```

然后就可以在任何组件中直接使用：

```vue
<template>
  <!-- locale参数可选，默认为中文 -->
  <EditorToolbar :editor="editor" @save="handleSave" />
  
  <!-- 如需使用英文 -->
  <!-- <EditorToolbar :editor="editor" @save="handleSave" locale="en-US" /> -->
</template>
```

## 国际化支持

工具栏内置了中文和英文的支持，默认使用中文。可以通过`locale`属性来控制当前使用的语言：

```vue
<template>
  <!-- 默认使用中文，不需要设置locale属性 -->
  <EditorToolbar :editor="editor" />
  
  <!-- 明确指定使用中文 -->
  <EditorToolbar :editor="editor" locale="zh-CN" />
  
  <!-- 使用英文 -->
  <EditorToolbar :editor="editor" locale="en-US" />
  
  <!-- 动态切换语言 -->
  <div class="language-switcher">
    <button @click="switchToZhCN">中文</button>
    <button @click="switchToEnUS">English</button>
  </div>
  <EditorToolbar :editor="editor" :locale="currentLocale" />
</template>

<script setup>
import { ref } from 'vue'

// 默认为中文
const currentLocale = ref('zh-CN')

const switchToZhCN = () => {
  currentLocale.value = 'zh-CN'
}

const switchToEnUS = () => {
  currentLocale.value = 'en-US'
}
</script>
```

### 支持的语言

目前支持的语言有：

- 中文：`zh-CN`
- 英文：`en-US`

### 添加更多语言

如果需要添加更多语言支持，可以通过fork本项目并添加新的语言文件来实现。

## 完整示例

### 创建医疗文档编辑器

```vue
<template>
  <div class="page">
    <!-- 添加自定义语言切换按钮 -->
    <div class="language-switcher">
      <el-button size="small" @click="switchLanguage('zh-CN')">中文</el-button>
      <el-button size="small" @click="switchLanguage('en-US')">English</el-button>
    </div>
  
    <!-- 通过locale属性控制语言，不设置时默认为中文 -->
    <EditorToolbar v-if="editorReady" :editor="editor" @save="handleSave" :locale="currentLocale" />
    <div class="container">
      <div ref="editorContainer" class="canvas-editor"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CanvasEditor from '@hufe921/canvas-editor'
import { EditorToolbar } from '@tulancn/canvas-editor-toolbar'
import { ElMessage } from 'element-plus'

const editorContainer = ref(null)
const editor = ref(null)
const editorReady = ref(false)
const currentLocale = ref('zh-CN')

// 语言切换方法
const switchLanguage = (locale) => {
  currentLocale.value = locale
}

onMounted(() => {
  if (editorContainer.value) {
    // 创建编辑器实例
    editor.value = new CanvasEditor(
      editorContainer.value,
      { main: [] },
      {
        defaultType: 'canvas',
        defaultFont: 'Microsoft YaHei',
        defaultSize: 16,
        width: 794,
        height: 1123,
        margins: [100, 120, 100, 120],
        pageNumber: {
          bottom: 50,
          format: '{{page}} / {{pages}}',
          rowFlex: 'center'
        }
      }
    )

    // 加载初始内容
    loadInitialContent()
    
    editorReady.value = true
  }
})

// 加载初始内容示例
const loadInitialContent = () => {
  if (!editor.value) return

  const initialContent = {
    main: [
      {
        value: "第一人民医院",
        size: 24,
        bold: true,
        rowFlex: 'center'
      },
      {
        value: "\n"
      },
      {
        value: "门诊病历",
        size: 18,
        rowFlex: 'center'
      },
      {
        value: "\n\n"
      },
      {
        value: "主诉：",
        bold: true
      },
      {
        value: "\n"
      },
      {
        value: "现病史：",
        bold: true
      },
      {
        value: "\n"
      },
      {
        value: "既往史：",
        bold: true
      }
    ]
  }

  editor.value.command.executeSetValue(initialContent)
}

// 处理保存事件
const handleSave = (content) => {
  console.log('保存文档内容:', content)
  ElMessage.success('文档已保存')
  // 这里可以添加保存到服务器的逻辑
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.language-switcher {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  gap: 8px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.container {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  overflow: auto;
}

.canvas-editor {
  width: 794px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
```

## API

### Props

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| editor | Editor | - | Canvas Editor实例，必须传入 |
| locale | string | 'zh-CN' | 【可选】控制工具栏的语言，支持 'zh-CN'(中文) 和 'en-US'(英文)，默认为中文 |

### Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| save | content | 当用户点击保存按钮时触发，返回编辑器内容 |

## 常见问题

### 1. 如何自定义工具栏样式？

您可以通过CSS变量或直接覆盖样式来自定义工具栏的外观：

```css
/* 在您的全局样式或组件中 */
.editor-toolbar {
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* 自定义按钮样式 */
.editor-toolbar .el-button {
  border-radius: 4px;
}
```

### 2. 如何获取编辑器内容？

除了监听save事件外，您还可以直接通过editor实例获取内容：

```js
const getContent = () => {
  if (editor.value) {
    const content = editor.value.command.getValue()
    console.log('当前内容:', content)
    return content
  }
}
```

### 3. 如何进行二次开发？

如果需要对工具栏进行扩展，建议Fork本项目后进行修改，或者创建一个新的组件包装现有工具栏：

```vue
<template>
  <div class="custom-toolbar">
    <div class="custom-buttons">
      <button @click="handleCustomAction">自定义按钮</button>
    </div>
    <!-- locale属性可选，不设置时默认为中文 -->
    <EditorToolbar :editor="editor" @save="onSave" />
  </div>
</template>
```

### 4. 如何添加新的语言支持？

要添加新的语言支持，需要按照以下步骤进行：

1. 创建新的语言文件，参照 `src/i18n/locales/zh-CN.ts` 的结构
2. 在 `src/i18n/index.ts` 中注册新的语言
3. 在使用时将 `locale` 属性设置为新添加的语言代码

## 依赖项

- Vue 3.3+
- Element Plus 2.9+
- @hufe921/canvas-editor 0.9+

## 许可证

MIT
