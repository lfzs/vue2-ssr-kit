# Vue SSR 脚手架

## 使用

`yarn start`

## 说明

路由组件的 `asyncFetchData` 方法为服务端调用入口。
客户端组件通过混入 `mounted` 生命周期将服务端 `asyncFetchData` 结果赋值到 `this.asyncData`

## TODO

使用 PM2 管理程序（热更新，日志）
