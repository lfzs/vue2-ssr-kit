// element-ui 组件按需加载, 需要手动添加
// 所有组件 https://github.com/ElemeFE/element/blob/master/components.json , 导入命名采用 大驼峰
// 仅替换主题色 到 https://elementui.github.io/theme-chalk-preview 下载，替换 theme 文件夹即可。更深层次的自定义使用 https://github.com/ElementUI/element-theme 工具

import Vue from 'vue'
import {
  Button,
} from 'element-ui'

const components = [
  Button,
]

components.forEach(component => Vue.use(component))
