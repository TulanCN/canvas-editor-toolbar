<template>
  <div class="page">
    <EditorToolbar v-if="editorReady && editor" :editor="editor" @save="handleSave" />
    <div ref="editorContainer" class="canvas-editor"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CanvasEditor from '@hufe921/canvas-editor'
import { EditorToolbar } from '../index'
import type { Editor, IEditorData } from '@hufe921/canvas-editor'
import { ElMessage } from 'element-plus'
import { RowFlex } from '@hufe921/canvas-editor'

// 创建编辑器容器的ref
const editorContainer = ref<HTMLDivElement | null>(null)
// 创建编辑器实例的ref
const editor = ref<Editor>()
const editorReady = ref(false)

// 初始化编辑器
onMounted(() => {
  if (editorContainer.value) {
    // 创建编辑器实例
    editor.value = new CanvasEditor(
      editorContainer.value,
      { main: [] },  // 创建一个空文档
      {
        defaultType: 'canvas',
        defaultFont: 'Microsoft YaHei',
        defaultSize: 16,
        width: 794,
        height: 1123,
        margins: [100, 120, 100, 120], // [top, right, bottom, left]
      }
    )

    // 加载示例内容
    loadSampleContent()

    editorReady.value = true
  }
})

// 加载示例内容
const loadSampleContent = () => {
  if (!editor.value) return

  const sampleData: IEditorData = {
    main: [
      {
        value: "这是一个Canvas Editor测试页面",
        size: 24,
        bold: true,
        color: "#1D34B4"
      },
      {
        value: "\n"
      },
      {
        value: "你可以在这里测试工具栏的各种功能：",
        size: 16
      },
      {
        value: "\n"
      },
      {
        value: "• 文本格式化",
        size: 16,
        bold: true
      },
      {
        value: "：加粗、斜体、下划线、删除线",
        size: 16
      },
      {
        value: "\n"
      },
      {
        value: "• 段落样式",
        size: 16,
        bold: true
      },
      {
        value: "：对齐方式、行间距、列表",
        size: 16
      },
      {
        value: "\n"
      },
      {
        value: "• 插入功能",
        size: 16,
        bold: true
      },
      {
        value: "：图片、超链接、LaTeX公式",
        size: 16
      },
      {
        value: "\n"
      },
      {
        value: "请尝试编辑这个文档，体验富文本编辑功能！",
        size: 16,
        italic: true,
        color: "#D61F06"
      }
    ]
  }

  editor.value.command.executeSetValue(sampleData)
}

// 处理保存事件
const handleSave = (content: any) => {
  console.log('保存内容:', content)
  ElMessage.success('内容已保存到控制台')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.canvas-editor {
  width: 794px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}
</style> 