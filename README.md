# Vue SSR 脚手架

## 使用

`yarn start`

## 说明

- 路由组件的 `asyncData` 方法为服务端调用入口。
客户端组件通过混入 `beforeMount` 生命周期将服务端 `asyncData` 结果赋值到 `this.asyncData`
