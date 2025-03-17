# Canvas Editor Toolbar

一个基于[@hufe921/canvas-editor](https://github.com/Hufe921/canvas-editor)的富文本编辑器工具栏组件，为Vue 3应用提供丰富的文本编辑功能。

## 功能特点

- 完整的文本格式化工具（加粗、斜体、下划线、删除线等）
- 段落样式设置（对齐方式、行间距、列表等）
- 字体样式管理（字体、字号、颜色等）
- 插入功能（图片、超链接、LaTeX公式等）
- 自动保存和导出为Word文档
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
  <EditorToolbar :editor="editor" @save="handleSave" />
</template>
```

## 完整示例

### 创建医疗文档编辑器

```vue
<template>
  <div class="page">
    <EditorToolbar v-if="editorReady" :editor="editor" @save="handleSave" />
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

| 属性名 | 类型 | 说明 |
| --- | --- | --- |
| editor | Editor | Canvas Editor实例，必须传入 |

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
    <EditorToolbar :editor="editor" @save="onSave" />
  </div>
</template>
```

## 依赖项

- Vue 3.3+
- Element Plus 2.9+
- @hufe921/canvas-editor 0.9+

## 许可证

MIT
