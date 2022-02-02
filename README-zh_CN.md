# MMRC - Main Method Renderer Call

mmrc 是用来方便的在 Electron 的渲染进程里调用主进程的方法/函数。mmrc 使用主 / 渲染进场间的异步消息，不存在使用 remote 可能带来的潜在问题。[英文文档在这里](https://github.com/echoldman/mmrc/blob/main/README.md)

## 安装

~~~bash
$ npm install --save mmrc
~~~

## 使用

#### 主进程

- 主进程里的提供给渲染进程调用的方法

  ~~~js
  async function hello (message) {
      return `hello: ${message}`
  }
  ~~~

  或者

  ~~~js
  function hello (message) {
      return new Promise((resolve, reject) => {
          resolve(`hello: ${message}`)
      })
  }
  ~~~

- 创建 mmrc-main 实例并注册
  
  ~~~js
  const { ipcMain } = require('electron')
  const MMRCMain = require('mmrc/main')
  // 完成创建 window 实例后
  const mmrcMain = new MMRCMain('mmrc.main.call.method', 'mmrc.renderer.done', 'mmrc.renderer.failed', ipcMain, win)
  mmrcMain.addMethod(hello, 'hello')
  ~~~

#### 渲染进程

- 创建 mmrc-renderer 实例并注册

  ~~~js
  const { ipcRenderer } = require('electron')
  const MMRCRenderer = require('mmrc/renderer')
  const mmrc = new MMRCRenderer('mmrc.main.call.method', 'mmrc.renderer.done', 'mmrc.rendere.failed', ipcRenderer)
  ~~~

- 调用主进程的 hello 方法

  ~~~js
  mmrc.callMainMethod('hello', 'this is from renderer.').then(message => {
      console.log(message)
  }).catch(error => {
      console.log(error)
  })
  ~~~

  会得到输出：hello: this is from renderer.

  mmrc.callMainMethod() 的第一次参数是要调用的方法名，后面的参数是要调用方法的参数，可以传入多个。

  可以使用 mmrc.C() 方法，是 mmrc.callMainMethod() 的简化名称。

