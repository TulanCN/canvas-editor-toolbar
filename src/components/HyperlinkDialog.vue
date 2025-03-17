<script setup lang="ts">
import { ref, watch } from 'vue'
import { Document, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Props {
  visible: boolean
  initialText?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const linkText = ref('')
const linkUrl = ref('')

// 监听对话框可见性变化
const dialogVisible = ref(props.visible)

// 同步props.visible和dialogVisible
const updateVisible = (val: boolean) => {
  dialogVisible.value = val
  emit('update:visible', val)
}

// 监听props.visible变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal && props.initialText) {
    linkText.value = props.initialText
  }
})

// 监听initialText变化
watch(() => props.initialText, (newVal) => {
  if (newVal && dialogVisible.value) {
    linkText.value = newVal
  }
})

// 确认添加超链接
const confirmAddLink = () => {
  if (!linkText.value || !linkUrl.value) {
    ElMessage.warning('请填写链接文本和地址')
    return
  }

  // 验证URL格式
  if (!isValidUrl(linkUrl.value)) {
    ElMessage.warning('请输入有效的链接地址')
    return
  }

  emit('confirm', {
    text: linkText.value,
    url: linkUrl.value
  })

  // 重置表单
  resetForm()
}

// 验证URL格式
const isValidUrl = (url: string) => {
  // 如果没有协议，自动添加http://
  if (!/^https?:\/\//i.test(url)) {
    linkUrl.value = `http://${url}`
    return true
  }

  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

// 取消添加超链接
const cancelAddLink = () => {
  emit('cancel')
  resetForm()
}

// 重置表单
const resetForm = () => {
  linkText.value = ''
  linkUrl.value = ''
}

// 初始化
if (props.visible && props.initialText) {
  linkText.value = props.initialText
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="插入超链接"
    width="480px"
    :modal="true"
    :append-to-body="true"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :show-close="true"
    class="modern-hyperlink-dialog"
    @update:modelValue="updateVisible"
  >
    <el-form :model="{ linkText, linkUrl }" label-position="top" class="hyperlink-form">
      <el-form-item label="链接文本" prop="linkText">
        <el-input
          v-model="linkText"
          placeholder="请输入链接显示的文本"
          clearable
        >
          <template #prefix>
            <el-icon><Document /></el-icon>
          </template>
        </el-input>
        <div class="form-item-help">链接在文档中显示的文字</div>
      </el-form-item>
      <el-form-item label="链接地址" prop="linkUrl">
        <el-input
          v-model="linkUrl"
          placeholder="请输入链接地址，例如：https://example.com"
          clearable
        >
          <template #prefix>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
        <div class="form-item-help">如未添加协议，将自动添加 http://</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="cancel-btn" @click="cancelAddLink">取消</el-button>
        <el-button class="confirm-btn" type="primary" @click="confirmAddLink">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
