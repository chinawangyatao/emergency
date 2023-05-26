import { checkSystem } from '@/plugin/helper'

// 兼容 安卓机 键盘输入时 挡住 input
if (checkSystem() === 'android') {
  window.addEventListener('resize', () => {
    const el = document.activeElement
    if (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        window.setTimeout(() => {
          el.scrollIntoViewIfNeeded()
        }, 0)
      }
    }
  })
}
