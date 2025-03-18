<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type Editor from '@hufe921/canvas-editor'
import { ListType, RowFlex, ListStyle, ElementType, TextDecorationStyle, TitleLevel } from '@hufe921/canvas-editor'
import { ElMessage, ElMessageBox } from 'element-plus'
import HyperlinkDialog from './HyperlinkDialog.vue'
import { t, setLocale } from '@/i18n'

// 导入本地SVG图标
import UndoIcon from '@/assets/images/undo.svg'
import RedoIcon from '@/assets/images/redo.svg'
import PainterIcon from '@/assets/images/painter.svg'
import ClearFormatIcon from '@/assets/images/format.svg'
import FontSizeAddIcon from '@/assets/images/size-add.svg'
import FontSizeMinusIcon from '@/assets/images/size-minus.svg'
import BoldIcon from '@/assets/images/bold.svg'
import ItalicIcon from '@/assets/images/italic.svg'
import UnderlineIcon from '@/assets/images/underline.svg'
import StrikeoutIcon from '@/assets/images/strikeout.svg'
import ColorIcon from '@/assets/images/color.svg'
import HighlightIcon from '@/assets/images/highlight.svg'
import LeftIcon from '@/assets/images/left.svg'
import CenterIcon from '@/assets/images/center.svg'
import RightIcon from '@/assets/images/right.svg'
import RowMarginIcon from '@/assets/images/row-margin.svg'
import SaveIcon from '@/assets/images/save.svg'  // 导入保存图标
import ExportIcon from '@/assets/images/export.svg'  // 导入导出图标


import ImageIcon from '@/assets/images/image.svg'
import HyperlinkIcon from '@/assets/images/hyperlink.svg'
import SuperscriptIcon from '@/assets/images/superscript.svg'
import SubscriptIcon from '@/assets/images/subscript.svg'
import ListIcon from '@/assets/images/list.svg'
import LaTexIcon from '@/assets/images/latex.svg'  // 导入LaTeX图标


interface Props {
  editor?: Editor
  locale?: string // 添加locale属性，用于外部控制语言
}

const props = defineProps<Props>()
const emit = defineEmits(['save'])  // 定义保存事件

// 监听locale属性变化，切换语言
watch(() => props.locale, (newLocale) => {
  if (newLocale) {
    setLocale(newLocale)
  } else {
    // 默认使用中文
    setLocale('zh-CN')
  }
}, { immediate: true })

// 当前选中的字体和字号
const currentFont = ref('Microsoft YaHei')
const currentSize = ref(16)

// 定义fileInput的ref
const imageInput = ref<HTMLInputElement | null>(null)

// 字体列表，参考canvas-editor的实现
const fontFamilies = [
  { label: '微软雅黑', value: 'Microsoft YaHei' },
  { label: '宋体', value: 'SimSun' },
  { label: '黑体', value: 'SimHei' },
  { label: '楷体', value: 'KaiTi' },
  { label: '仿宋', value: 'FangSong' },
  { label: '华文宋体', value: '华文宋体' },
  { label: '华文黑体', value: '华文黑体' },
  { label: '华文仿宋', value: '华文仿宋' },
  { label: '华文楷体', value: '华文楷体' },
  { label: '华文琥珀', value: '华文琥珀' },
  { label: '华文隶书', value: '华文隶书' },
  { label: '华文新魏', value: '华文新魏' },
  { label: '华文行楷', value: '华文行楷' },
  { label: '华文中宋', value: '华文中宋' },
  { label: '华文彩云', value: '华文彩云' },
  { label: 'Arial', value: 'Arial' },
  { label: 'Segoe UI', value: 'Segoe UI' },
  { label: 'Ink Free', value: 'Ink Free' },
  { label: 'Fantasy', value: 'Fantasy' }
]

// 字号列表
const fontSizes = [
  { label: '初号', value: 56 },
  { label: '小初', value: 48 },
  { label: '一号', value: 34 },
  { label: '小一', value: 32 },
  { label: '二号', value: 29 },
  { label: '小二', value: 24 },
  { label: '三号', value: 21 },
  { label: '小三', value: 20 },
  { label: '四号', value: 18 },
  { label: '小四', value: 16 },
  { label: '五号', value: 14 },
  { label: '小五', value: 12 },
  { label: '六号', value: 10 },
  { label: '小六', value: 8 },
  { label: '七号', value: 7 },
  { label: '八号', value: 6 }
]

// 下划线样式选项
const underlineStyles = [
  { label: '实线', value: TextDecorationStyle.SOLID },
  { label: '双线', value: TextDecorationStyle.DOUBLE },
  { label: '虚线', value: TextDecorationStyle.DASHED },
  { label: '点线', value: TextDecorationStyle.DOTTED },
  { label: '波浪线', value: TextDecorationStyle.WAVY }
]

// 标题选项
const titleOptions = [
  { label: '正文', value: 'normal', fontSize: '16px' },
  { label: '标题1', value: TitleLevel.FIRST, fontSize: '26px' },
  { label: '标题2', value: TitleLevel.SECOND, fontSize: '24px' },
  { label: '标题3', value: TitleLevel.THIRD, fontSize: '22px' },
  { label: '标题4', value: TitleLevel.FOURTH, fontSize: '20px' },
  { label: '标题5', value: TitleLevel.FIFTH, fontSize: '18px' },
  { label: '标题6', value: TitleLevel.SIXTH, fontSize: '16px' }
]

// 行间距选项
const lineHeightOptions = [
  { label: '1', value: 1 },
  { label: '1.25', value: 1.25 },
  { label: '1.5', value: 1.5 },
  { label: '1.75', value: 1.75 },
  { label: '2', value: 2 },
  { label: '2.5', value: 2.5 },
  { label: '3', value: 3 }
]

// 列表选项
const listOptions = [
  { label: '取消列表', value: 'none' },
  { label: '有序列表', value: 'ordered', style: ListStyle.DECIMAL },
  { label: '复选框列表', value: 'checkbox', style: ListStyle.CHECKBOX },
  { label: '实心圆点列表', value: 'disc', style: ListStyle.DISC },
  { label: '空心圆点列表', value: 'circle', style: ListStyle.CIRCLE },
  { label: '空心方块列表', value: 'square', style: ListStyle.SQUARE }
]

// 添加颜色相关的响应式变量
const fontColor = ref('#333333')
const highlightColor = ref('#F8F54A')
const currentTitle = ref<string | TitleLevel>('normal')
const currentUnderlineStyle = ref<TextDecorationStyle>(TextDecorationStyle.SOLID)
const isSaving = ref(false)  // 保存状态

// 添加更多状态变量
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const isStrikeout = ref(false)
const isSuperscript = ref(false)
const isSubscript = ref(false)
const currentAlignment = ref<RowFlex | null>(RowFlex.LEFT)
const currentLineHeight = ref(1)
const currentListType = ref<ListType | null>(null)
const currentListStyle = ref<ListStyle | null>(null)

// 点击其他区域关闭颜色选择器的逻辑也可以移除
onMounted(() => {
  console.log('props.editor', props.editor)
  if (props.editor) {
    // 监听编辑器样式变化
    props.editor.eventBus.on('rangeStyleChange', (payload) => {
      console.log('payload', payload)
      // 如果type为null，则不进行更新
      if (payload.type === null) {
        return
      }

      // 更新字体
      if (payload.font) {
        currentFont.value = payload.font
      }

      // 更新字号
      if (payload.size) {
        currentSize.value = payload.size
      }

      // 更新颜色
      if (payload.color) {
        fontColor.value = payload.color
      }

      // 更新高亮色
      if (payload.highlight) {
        highlightColor.value = payload.highlight
      }

      // 更新标题
      if (payload.level) {
        currentTitle.value = payload.level
      } else {
        currentTitle.value = 'normal'
      }

      // 更新加粗状态
      isBold.value = Boolean(payload.bold)

      // 更新斜体状态
      isItalic.value = Boolean(payload.italic)

      // 更新下划线状态
      isUnderline.value = payload.underline === true
      if (payload.underline && payload.textDecoration) {
        // 类型转换，确保类型兼容
        if (typeof payload.textDecoration === 'string') {
          currentUnderlineStyle.value = payload.textDecoration as TextDecorationStyle
        }
      }

      // 更新删除线状态
      isStrikeout.value = payload.strikeout === true

      // 更新上标/下标状态
      isSuperscript.value = payload.type === 'superscript'
      isSubscript.value = payload.type === 'subscript'

      // 更新对齐方式
      if (payload.rowFlex !== undefined) {
        console.log('payload.rowFlex', payload.rowFlex)
        currentAlignment.value = payload.rowFlex
      }

      // 更新行间距
      if (payload.rowMargin !== undefined) {
        currentLineHeight.value = payload.rowMargin
      }

      // 更新列表类型和样式
      if (payload.listType !== undefined) {
        currentListType.value = payload.listType
        if (payload.listStyle !== undefined) {
          currentListStyle.value = payload.listStyle
        }
      } else {
        currentListType.value = null
        currentListStyle.value = null
      }
    })
  }
})

// 撤销/重做
const handleUndo = () => {
  if (!props.editor) return
  props.editor.command.executeUndo()
}

const handleRedo = () => {
  if (!props.editor) return
  props.editor.command.executeRedo()
}

// 格式刷
const handleFormatPainter = () => {
  if (!props.editor) return
  props.editor.command.executePainter({ isDblclick: false })
}

// 清除格式
const handleClearFormat = () => {
  if (!props.editor) return
  props.editor.command.executeFormat()
}

// 保存文档内容
const handleSave = async () => {
  if (!props.editor) return

  try {
    isSaving.value = true
    // 获取编辑器内容
    const content = props.editor.command.getValue()

    // 触发保存事件，将内容传给父组件处理
    emit('save', content)

    // 提示成功
    ElMessage.success(t('toolbar.saveSuccess'))
  } catch (error) {
    console.error('保存文档失败:', error)
    ElMessage.error(t('toolbar.saveFailed'))
  } finally {
    isSaving.value = false
  }
}

// 导出Word文档
const handleExportWord = () => {
  if (!props.editor) return

  try {
    // 弹出对话框让用户输入文件名
    ElMessageBox.prompt(t('toolbar.exportPrompt'), t('toolbar.exportTitle'), {
      confirmButtonText: t('dialog.hyperlink.confirm'),
      cancelButtonText: t('dialog.hyperlink.cancel'),
      inputPattern: /^[\w\u4e00-\u9fa5\-_]+$/,
      inputErrorMessage: t('toolbar.fileNameError')
    }).then(({ value }) => {
      // 执行导出命令
      // @ts-ignore 插件方法在类型定义中不存在，但实际可用
      props.editor?.command.executeExportDocx({
        fileName: value || '文档'
      })
      ElMessage.success(t('toolbar.exportSuccess'))
    }).catch(() => {
      // 用户取消操作
    })
  } catch (error) {
    console.error('导出文档失败:', error)
    ElMessage.error(t('toolbar.saveFailed'))
  }
}

// 字体设置
const handleFontFamily = (family: string) => {
  if (!props.editor) return
  props.editor.command.executeFont(family)
}

// 字号设置
const handleFontSize = (size: number) => {
  if (!props.editor) return
  props.editor.command.executeSize(size)
}

const handleFontSizeAdd = () => {
  if (!props.editor) return
  props.editor.command.executeSizeAdd()
}

const handleFontSizeMinus = () => {
  if (!props.editor) return
  props.editor.command.executeSizeMinus()
}
// 加粗/斜体/下划线
const handleBold = () => {
  props.editor?.command.executeBold()
}

const handleItalic = () => {
  props.editor?.command.executeItalic()
}

const handleUnderline = (style?: TextDecorationStyle) => {
  if (!props.editor) return
  if (style) {
    currentUnderlineStyle.value = style
    props.editor.command.executeUnderline({
      style
    })
  } else {
    props.editor.command.executeUnderline()
  }
}

const handleStrikeout = () => {
  if (!props.editor) return
  props.editor.command.executeStrikeout()
}

// 对齐方式
const handleAlignment = (align: 'left' | 'center' | 'right') => {
  if (!props.editor) return

  // 设置当前对齐方式
  if (align === 'left') {
    currentAlignment.value = RowFlex.LEFT
    props.editor.command.executeRowFlex(RowFlex.LEFT)
  } else if (align === 'center') {
    currentAlignment.value = RowFlex.CENTER
    props.editor.command.executeRowFlex(RowFlex.CENTER)
  } else if (align === 'right') {
    currentAlignment.value = RowFlex.RIGHT
    props.editor.command.executeRowFlex(RowFlex.RIGHT)
  }
}

// 图片上传
const handleImageUpload = (event: Event) => {
  if (!props.editor) return
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      // 计算宽高
      const image = new Image()
      image.src = base64
      image.onload = function () {
        props.editor?.command.executeImage({
          value: base64,
          width: image.width,
          height: image.height
        })
      }
    }
    reader.readAsDataURL(file)
  }
}

// 处理图片按钮点击
const handleImageButtonClick = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

// 新增的处理方法
const handleSuperscript = () => {
  if (!props.editor) return
  props.editor.command.executeSuperscript()
  // 如果上标激活，则下标取消激活
  if (isSuperscript.value) {
    isSubscript.value = false
  }
}

const handleSubscript = () => {
  if (!props.editor) return
  props.editor.command.executeSubscript()
  // 如果下标激活，则上标取消激活
  if (isSubscript.value) {
    isSuperscript.value = false
  }
}

const handleColor = (color: string) => {
  if (!props.editor) return
  props.editor.command.executeColor(color)
}

const handleHighlight = (color: string) => {
  if (!props.editor) return
  props.editor.command.executeHighlight(color)
}

const handleTitle = (level: string | TitleLevel) => {
  if (!props.editor) return
  props.editor.command.executeTitle(level === 'normal' ? null : level as TitleLevel)
}

const handleLineHeight = (height: number) => {
  if (!props.editor) return
  props.editor.command.executeRowMargin(height)
}

interface ListCommand {
  type: string;
  style: ListStyle;
}

const handleList = (command: ListCommand) => {
  if (!props.editor) return
  if (command.type === 'none') {
    props.editor.command.executeList(null)
  } else {
    const listType = command.type === 'ordered' ? ListType.OL : ListType.UL
    props.editor.command.executeList(
      listType,
      command.style
    )
  }
}

// 处理超链接功能
const handleHyperlink = () => {
  if (!props.editor) return

  // 获取选中的文本
  const selectedText = props.editor.command.getRangeText() || ''

  // 显示超链接对话框
  linkDialogVisible.value = true
  selectedLinkText.value = selectedText
}

// 超链接对话框状态
const linkDialogVisible = ref(false)
const selectedLinkText = ref('')

// 处理超链接确认
const handleLinkConfirm = (data: { text: string, url: string }) => {
  if (!props.editor) return

  const splitText = (text: string) => {
    return text.split('');
  }

  props.editor.command.executeHyperlink({
    type: ElementType.HYPERLINK,
    value: '',
    url: data.url,
    valueList: splitText(data.text).map(t => ({
      value: t,
      size: currentSize.value
    }))
  })

  // 关闭对话框
  linkDialogVisible.value = false
}

// 处理超链接取消
const handleLinkCancel = () => {
  linkDialogVisible.value = false
}

// 处理LaTeX公式插入
const handleLaTeX = () => {
  if (!props.editor) return

  // 弹出对话框让用户输入LaTeX公式
  ElMessageBox.prompt(t('toolbar.latexPrompt'), t('toolbar.latexTitle'), {
    confirmButtonText: t('dialog.hyperlink.confirm'),
    cancelButtonText: t('dialog.hyperlink.cancel'),
    inputType: 'textarea',
    inputPlaceholder: t('toolbar.latexPlaceholder'),
    roundButton: true,
    customClass: 'latex-dialog'
  }).then(({ value }) => {
    if (!value || !props.editor) return

    // 执行插入LaTeX公式命令
    props.editor.command.executeInsertElementList([
      {
        type: ElementType.LATEX,
        value
      }
    ])

    ElMessage.success(t('toolbar.insertSuccess'))
  }).catch(() => {
    // 用户取消操作
  })
}

// 添加保持焦点的函数
const preserveFocus = (event: MouseEvent) => {
  // 阻止默认行为，防止编辑器失去焦点
  event.preventDefault()
}
</script>

<template>
  <div class="editor-toolbar">
    <!-- 基础操作组 -->
    <el-button-group>
      <!-- 保存按钮 -->
      <el-button
        @click="handleSave"
        @mousedown="preserveFocus"
        :title="t('toolbar.save')"
        :loading="isSaving"
        type="primary"
      >
        <img :src="SaveIcon" class="icon" :alt="t('toolbar.save')" />
        <span class="save-text">{{ t('toolbar.save') }}</span>
      </el-button>

      <!-- 导出Word按钮 -->
      <el-button
        @click="handleExportWord"
        @mousedown="preserveFocus"
        :title="t('toolbar.export')"
        type="primary"
      >
        <img :src="ExportIcon" class="icon" :alt="t('toolbar.export')" />
        <span class="export-text">{{ t('toolbar.export') }}</span>
      </el-button>

      <el-button @click="handleUndo" @mousedown="preserveFocus" :title="t('toolbar.undo')">
        <img :src="UndoIcon" class="icon" :alt="t('toolbar.undo')" />
      </el-button>

      <el-button @click="handleRedo" @mousedown="preserveFocus" :title="t('toolbar.redo')">
        <img :src="RedoIcon" class="icon" :alt="t('toolbar.redo')" />
      </el-button>
      <el-button @click="handleFormatPainter" @mousedown="preserveFocus" :title="t('toolbar.formatPainter')">
        <img :src="PainterIcon" class="icon" :alt="t('toolbar.formatPainter')" />
      </el-button>
      <el-button @click="handleClearFormat" @mousedown="preserveFocus" :title="t('toolbar.clearFormat')">
        <img :src="ClearFormatIcon" class="icon" :alt="t('toolbar.clearFormat')" />
      </el-button>

    <el-divider direction="vertical" />

    <!-- 字体样式组 -->
      <el-select
        v-model="currentFont"
        size="small"
        class="font-select"
        @change="handleFontFamily"
        :title="t('toolbar.font')"
        popper-class="font-select-dropdown"
        :popper-append-to-body="true"
        filterable
      >
        <el-option
          v-for="font in fontFamilies"
          :key="font.value"
          :label="font.label"
          :value="font.value"
        >
          <span :style="{ fontFamily: font.value }">{{ font.label }}</span>
        </el-option>
      </el-select>

      <el-select
        v-model="currentSize"
        size="small"
        class="size-select"
        @change="handleFontSize"
        :title="t('toolbar.fontSize')"
        popper-class="size-select-dropdown"
        :popper-append-to-body="true"
        filterable
      >
        <el-option
          v-for="size in fontSizes"
          :key="size.value"
          :label="size.label"
          :value="size.value"
        >
          <span>{{ size.label }} ({{ size.value }})</span>
        </el-option>
      </el-select>
      <!-- 放大字体 -->
      <el-button @click="handleFontSizeAdd" @mousedown="preserveFocus" :title="t('toolbar.increaseFontSize')">
        <img :src="FontSizeAddIcon" class="icon" :alt="t('toolbar.increaseFontSize')" />
      </el-button>
      <!-- 缩小字体 -->
      <el-button @click="handleFontSizeMinus" @mousedown="preserveFocus" :title="t('toolbar.decreaseFontSize')">
        <img :src="FontSizeMinusIcon" class="icon" :alt="t('toolbar.decreaseFontSize')" />
      </el-button>
      <!-- 加粗 -->
      <el-button
        @click="handleBold"
        @mousedown="preserveFocus"
        :title="t('toolbar.bold')"
        :class="{ 'is-active-button': isBold }"
      >
        <img :src="BoldIcon" class="icon" :alt="t('toolbar.bold')" />
      </el-button>
      <!-- 斜体 -->
      <el-button
        @click="handleItalic"
        @mousedown="preserveFocus"
        :title="t('toolbar.italic')"
        :class="{ 'is-active-button': isItalic }"
      >
        <img :src="ItalicIcon" class="icon" :alt="t('toolbar.italic')" />
      </el-button>

      <!-- 下划线 -->
      <el-dropdown @command="handleUnderline" trigger="click">
        <el-button @mousedown="preserveFocus" :title="t('toolbar.underline')" :class="{ 'is-active-button': isUnderline }">
          <img :src="UnderlineIcon" class="icon" :alt="t('toolbar.underline')" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="undefined">
              <span>{{ t('toolbar.underline') }}</span>
            </el-dropdown-item>
            <el-dropdown-item
              v-for="style in underlineStyles"
              :key="style.value"
              :command="style.value"
            >
              <span :style="`text-decoration: underline ${style.value}`">
                {{ t(`underlineStyles.${style.value}`) }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 删除线 -->
      <el-button
        @click="handleStrikeout"
        @mousedown="preserveFocus"
        :title="t('toolbar.strikeout')"
        :class="{ 'is-active-button': isStrikeout }"
      >
        <img :src="StrikeoutIcon" class="icon" :alt="t('toolbar.strikeout')" />
      </el-button>

      <!-- 添加新的字体样式组 -->
      <el-button
        @click="handleSuperscript"
        @mousedown="preserveFocus"
        :title="t('toolbar.superscript')"
        :class="{ 'is-active-button': isSuperscript }"
      >
        <img :src="SuperscriptIcon" class="icon" :alt="t('toolbar.superscript')" />
      </el-button>
      <el-button
        @click="handleSubscript"
        @mousedown="preserveFocus"
        :title="t('toolbar.subscript')"
        :class="{ 'is-active-button': isSubscript }"
      >
        <img :src="SubscriptIcon" class="icon" :alt="t('toolbar.subscript')" />
      </el-button>

      <!-- 字体颜色 -->
      <div class="color-picker-wrapper">
        <el-button class="color-button" @mousedown="preserveFocus" :title="t('toolbar.fontColor')">
          <div class="color-button-content word-style">
            <img :src="ColorIcon" class="icon" :alt="t('toolbar.fontColor')" />
            <div class="color-indicator" :style="{ backgroundColor: fontColor }"></div>
          </div>
          <el-color-picker
            v-model="fontColor"
            size="small"
            popper-class="color-picker-dropdown"
            @change="handleColor"
            :predefine="['#000000', '#FF0000', '#0000FF', '#008000', '#FFA500', '#800080', '#A52A2A', '#808080']"
          />
        </el-button>
      </div>

      <!-- 高亮颜色 -->
      <div class="color-picker-wrapper">
        <el-button class="color-button" @mousedown="preserveFocus" :title="t('toolbar.highlight')">
          <div class="color-button-content word-style">
            <img :src="HighlightIcon" class="icon" :alt="t('toolbar.highlight')" />
            <div class="color-indicator" :style="{ backgroundColor: highlightColor }"></div>
          </div>
          <el-color-picker
            v-model="highlightColor"
            size="small"
            popper-class="color-picker-dropdown"
            @change="handleHighlight"
            :predefine="['#FFFF00', '#00FFFF', '#FF00FF', '#90EE90', '#FFD700', '#87CEFA', '#F08080', '#E6E6FA']"
          />
        </el-button>
      </div>

    <el-divider direction="vertical" />

    <!-- 标题和段落样式组 -->
      <!-- 标题选择 -->
      <el-select
        v-model="currentTitle"
        size="small"
        class="title-select"
        @change="handleTitle"
        :title="t('toolbar.title')"
        popper-class="title-select-dropdown"
        :popper-append-to-body="true"
        filterable
      >
        <el-option
          v-for="title in titleOptions"
          :key="title.value"
          :label="title.value === 'normal' ? t('titleOptions.normal') : t(`titleOptions.title${title.value === TitleLevel.FIRST ? 1 : title.value === TitleLevel.SECOND ? 2 : title.value === TitleLevel.THIRD ? 3 : title.value === TitleLevel.FOURTH ? 4 : title.value === TitleLevel.FIFTH ? 5 : 6}`)"
          :value="title.value"
        >
          <span :style="{ fontSize: title.fontSize }">{{ title.value === 'normal' ? t('titleOptions.normal') : t(`titleOptions.title${title.value === TitleLevel.FIRST ? 1 : title.value === TitleLevel.SECOND ? 2 : title.value === TitleLevel.THIRD ? 3 : title.value === TitleLevel.FOURTH ? 4 : title.value === TitleLevel.FIFTH ? 5 : 6}`) }}</span>
        </el-option>
      </el-select>
      <!-- 对齐方式 -->
      <el-button
        @click="handleAlignment('left')"
        @mousedown="preserveFocus"
        :title="t('toolbar.alignLeft')"
        :class="{ 'is-active-button': currentAlignment === RowFlex.LEFT }"
      >
        <img :src="LeftIcon" class="icon" :alt="t('toolbar.alignLeft')" />
      </el-button>
      <el-button
        @click="handleAlignment('center')"
        @mousedown="preserveFocus"
        :title="t('toolbar.alignCenter')"
        :class="{ 'is-active-button': currentAlignment === RowFlex.CENTER }"
      >
        <img :src="CenterIcon" class="icon" :alt="t('toolbar.alignCenter')" />
      </el-button>

      <el-button
        @click="handleAlignment('right')"
        @mousedown="preserveFocus"
        :title="t('toolbar.alignRight')"
        :class="{ 'is-active-button': currentAlignment === RowFlex.RIGHT }"
      >
        <img :src="RightIcon" class="icon" :alt="t('toolbar.alignRight')" />
      </el-button>

      <!-- 行间距 -->
      <el-dropdown @command="handleLineHeight">
        <el-button @mousedown="preserveFocus" :title="t('toolbar.lineHeight')" :class="{ 'is-active-button': currentLineHeight !== 1 }">
          <img :src="RowMarginIcon" class="icon" :alt="t('toolbar.lineHeight')" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="option in lineHeightOptions"
              :key="option.value"
              :command="option.value"
              :class="{ 'is-active': currentLineHeight === option.value }"
            >
              {{ option.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 列表样式 -->
      <el-dropdown @command="handleList">
        <el-button @mousedown="preserveFocus" :title="t('toolbar.list')" :class="{ 'is-active-button': currentListType !== null }">
          <img :src="ListIcon" class="icon" :alt="t('toolbar.list')" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="option in listOptions"
              :key="option.value"
              :command="{ type: option.value, style: option.style }"
              :class="{
                'is-active': option.value === 'none' ? currentListType === null :
                  (option.value === 'ordered' ? currentListType === ListType.OL && currentListStyle === option.style :
                  currentListType === ListType.UL && currentListStyle === option.style)
              }"
            >
              <span :style="`list-style-type: ${option.style}`">{{ t(`listOptions.${option.value}`) }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    <el-divider direction="vertical" />

    <!-- 插入功能组 -->
    <el-button @click="handleImageButtonClick" @mousedown="preserveFocus" :title="t('toolbar.image')">
      <img :src="ImageIcon" class="icon" :alt="t('toolbar.image')" />
      <input
        ref="imageInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleImageUpload"
      >
    </el-button>

    <el-button @click="handleHyperlink" @mousedown="preserveFocus" :title="t('toolbar.hyperlink')">
      <img :src="HyperlinkIcon" class="icon" :alt="t('toolbar.hyperlink')" />
    </el-button>

    <!-- 添加LaTeX公式按钮 -->
    <el-button @click="handleLaTeX" @mousedown="preserveFocus" :title="t('toolbar.latex')">
      <img :src="LaTexIcon" class="icon" :alt="t('toolbar.latex')" />
    </el-button>
    </el-button-group>
  </div>

  <!-- 超链接对话框 -->
  <HyperlinkDialog
    v-model:visible="linkDialogVisible"
    :initial-text="selectedLinkText"
    @confirm="handleLinkConfirm"
    @cancel="handleLinkCancel"
  />
</template>

<style scoped>
.editor-toolbar {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.el-button-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.el-button {
  padding: 8px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
}

/* 保存按钮样式 */
.el-button[type="primary"] {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  min-width: 32px;
}

.el-button[type="primary"]:hover {
  background-color: #66b1ff;
}

.el-button[type="primary"] .icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.el-button:hover {
  background-color: #f5f7fa;
  border-color: transparent;
}

.save-text {
  display: none;  /* 隐藏文字，只显示图标 */
}

.export-text {
  display: none;  /* 隐藏文字，只显示图标 */
}

.icon {
  width: 16px;
  height: 16px;
  display: block;
}

/* 下拉框样式调整 */
.font-select {
  width: 120px;
  margin: 0 4px;
}

.size-select {
  width: 80px;
  margin: 0 4px;
}

.title-select {
  width: 100px;
  margin: 0 4px;
}

:deep(.el-input__wrapper) {
  padding: 0 8px;
  height: 32px;
  line-height: 32px;
}

:deep(.el-input__inner) {
  height: 32px;
  line-height: 32px;
  padding: 0;
  font-size: 14px;
}

:deep(.el-select .el-input.el-input--small .el-input__wrapper) {
  height: 32px;
  line-height: 32px;
}

:deep(.el-input--small .el-input__wrapper) {
  height: 32px !important;
}

/* 修复下拉框位置 */
:deep(.el-select__popper) {
  margin-top: 4px !important;
}

/* 字体下拉框样式 */
:global(.font-select-dropdown) {
  max-height: 300px !important;
  overflow-y: auto !important;
  z-index: 9999 !important;
}

:global(.font-select-dropdown .el-select-dropdown__item) {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  font-size: 14px;
}

:global(.font-select-dropdown .el-select-dropdown__item span) {
  display: block;
  width: 100%;
}

/* 字号下拉框样式 */
:global(.size-select-dropdown) {
  max-height: 300px !important;
  overflow-y: auto !important;
  z-index: 9999 !important;
}

:global(.size-select-dropdown .el-select-dropdown__item) {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  font-size: 14px;
}

/* 标题下拉框样式 */
:global(.title-select-dropdown) {
  max-height: 300px !important;
  overflow-y: auto !important;
  z-index: 9999 !important;
}

:global(.title-select-dropdown .el-select-dropdown__item) {
  padding: 0 10px;
  font-size: 14px;
}

:global(.title-select-dropdown .el-select-dropdown__item span) {
  display: block;
  width: 100%;
  padding: 5px 0;
}

/* 隐藏文件输入框但保持可访问性 */
input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.el-color-picker {
  margin: 0 4px;
}

.el-dropdown {
  margin: 0;
}

:deep(.el-dropdown .el-button) {
  padding: 8px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
}

:deep(.el-dropdown .el-button:hover) {
  background-color: #f5f7fa;
  border-color: transparent;
}

/* 颜色按钮样式 */
.color-button-content {
  display: flex;
  align-items: center;
  gap: 0px;
}

/* Word风格的颜色按钮 - 纵向排列 */
.color-button-content.word-style {
  flex-direction: column;
  gap: 0px;
  padding-bottom: 2px;
}

.color-button-content.word-style .icon {
  margin-bottom: -2px;
}

.color-button-content.word-style .color-indicator {
  width: 16px;
  height: 4px;
  border-radius: 0;
  border-top: none;
}

.color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 0px;
  border: 1px solid #dcdfe6;
}

/* 颜色选择器包装器样式 */
.color-picker-wrapper {
  position: relative;
  display: inline-block;
}

.color-button {
  position: relative;
  overflow: visible;
}

/* 隐藏颜色选择器的触发元素，但保持功能可用 */
.color-picker-wrapper :deep(.el-color-picker) {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

/* 确保选择器下拉框正常显示 */
:global(.color-picker-dropdown) {
  z-index: 9999 !important;
}

/* 列表样式预览 */
.el-dropdown-item span {
  display: inline-block;
  padding-left: 20px;
}

:deep(.el-divider--vertical) {
  height: 32px;
  margin: 0 8px;
}

/* 颜色选择器弹出框样式 */
:global(.color-popover) {
  padding: 12px;
}

:global(.color-popover .el-popover__title) {
  margin-bottom: 8px;
}

:global(.el-dropdown-menu .el-dropdown-item.is-active) {
  color: #409eff;
  font-weight: bold;
  background-color: #ecf5ff;
}

.el-button.is-active-button {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #d9ecff;
}

.el-button.is-active-button .icon {
  filter: invert(45%) sepia(99%) saturate(1485%) hue-rotate(199deg) brightness(100%) contrast(98%);
}

/* LaTeX对话框样式 */
:global(.latex-dialog .el-message-box__input textarea) {
  min-height: 100px;
  font-family: monospace;
}
</style>
