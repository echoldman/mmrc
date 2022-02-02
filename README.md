# MMRC - Main Method Renderer Call

mmrc is used to conveniently call methods/functions of the main process from within Electron's rendering process. mmrc uses asynchronous messages between the main/rendering feeds, without the potential problems associated with using remote. [中文文档在这里](https://github.com/echoldman/mmrc/blob/main/README-zh_CN.md)

## Install

~~~bash
$ npm install --save mmrc
~~~

## Usage

#### Main Process

- Methods provided in the master process for the rendering process to call

  ~~~js
  async function hello (message) {
      return `hello: ${message}`
  }
  ~~~

  Or

  ~~~js
  function hello (message) {
      return new Promise((resolve, reject) => {
          resolve(`hello: ${message}`)
      })
  }
  ~~~

- Create an instance of mmrc-main and register
  
  ~~~js
  const { ipcMain } = require('electron')
  const MMRCMain = require('mmrc/main')
  // After you have finished creating the window instance
  const mmrcMain = new MMRCMain('mmrc.main.call.method', 'mmrc.renderer.done', 'mmrc.renderer.failed', ipcMain, win)
  mmrcMain.addMethod(hello, 'hello')
  ~~~

#### Renderer Process

- Create an instance of mmrc-renderer and register

  ~~~js
  const { ipcRenderer } = require('electron')
  const MMRCRenderer = require('mmrc/renderer')
  const mmrc = new MMRCRenderer('mmrc.main.call.method', 'mmrc.renderer.done', 'mmrc.rendere.failed', ipcRenderer)
  ~~~

- Call the hello method of the main process

  ~~~js
  mmrc.callMainMethod('hello', 'this is from renderer.').then(message => {
      console.log(message)
  }).catch(error => {
      console.log(error)
  })
  ~~~

  Will get the output, hello: this is from renderer.

  The first argument to mmrc.callMainMethod() is the name of the method to be called, the subsequent arguments are the parameters of the method to be called, and multiple arguments can be passed in.
  
  mmrc.C() method, which is a simplified name for mmrc.callMainMethod()

