import { ref, computed } from 'vue'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

// 定义类型
type MessageSchema = typeof zhCN
type LocaleMessages = {
  [key: string]: MessageSchema
}

// 支持的语言列表
export const supportedLocales = [
  { code: 'zh-CN', name: '中文' },
  { code: 'en-US', name: 'English' }
]

// 所有语言包
const messages: LocaleMessages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 尝试从localStorage读取语言设置，默认为中文
const getDefaultLocale = (): string => {
  const savedLocale = localStorage.getItem('userLocale')
  if (savedLocale && Object.keys(messages).includes(savedLocale)) {
    return savedLocale
  }
  // 尝试获取浏览器语言
  const browserLang = navigator.language
  if (browserLang && Object.keys(messages).includes(browserLang)) {
    return browserLang
  }
  // 默认为中文
  return 'zh-CN'
}

// 当前语言
export const currentLocale = ref(getDefaultLocale())

// 当前语言包
export const currentMessages = computed(() => {
  return messages[currentLocale.value] || messages['zh-CN']
})

// 切换语言方法
export const setLocale = (locale: string) => {
  if (Object.keys(messages).includes(locale)) {
    currentLocale.value = locale
    localStorage.setItem('userLocale', locale)
  }
}

// 翻译方法
export const t = (key: string): string => {
  const keys = key.split('.')
  let result: any = currentMessages.value
  
  for (const k of keys) {
    if (result && Object.prototype.hasOwnProperty.call(result, k)) {
      result = result[k]
    } else {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
  }
  
  return typeof result === 'string' ? result : key
}

// 创建语言菜单组件
export default {
  install: (app: any) => {
    // 全局注入翻译方法
    app.config.globalProperties.$t = t
    
    // 全局注入语言相关方法和属性
    app.provide('i18n', {
      locale: currentLocale,
      messages: currentMessages,
      t,
      setLocale,
      supportedLocales
    })
  }
} 