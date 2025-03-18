<script setup lang="ts">
import { ref, watch } from 'vue'
import { Document, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { t } from '@/i18n'

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
    ElMessage.warning(t('dialog.hyperlink.warning.emptyFields'))
    return
  }

  // 验证URL格式
  if (!isValidUrl(linkUrl.value)) {
    ElMessage.warning(t('dialog.hyperlink.warning.invalidUrl'))
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
    :title="t('dialog.hyperlink.title')"
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
      <el-form-item :label="t('dialog.hyperlink.text')" prop="linkText">
        <el-input
          v-model="linkText"
          :placeholder="t('dialog.hyperlink.textPlaceholder')"
          clearable
        >
          <template #prefix>
            <el-icon><Document /></el-icon>
          </template>
        </el-input>
        <div class="form-item-help">{{ t('dialog.hyperlink.textHelp') }}</div>
      </el-form-item>
      <el-form-item :label="t('dialog.hyperlink.url')" prop="linkUrl">
        <el-input
          v-model="linkUrl"
          :placeholder="t('dialog.hyperlink.urlPlaceholder')"
          clearable
        >
          <template #prefix>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
        <div class="form-item-help">{{ t('dialog.hyperlink.urlHelp') }}</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button class="cancel-btn" @click="cancelAddLink">{{ t('dialog.hyperlink.cancel') }}</el-button>
        <el-button class="confirm-btn" type="primary" @click="confirmAddLink">{{ t('dialog.hyperlink.confirm') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
