// mmrc - main method renderer call

class Main {
  constructor (
                ipcMain, window,
                mainCallMethodEventName = 'mmrc.main.call.method',
                rendererDoneEventName = 'mmrc.renderer.done',
                rendererFailedEventName = 'mmrc.renderer.failed'
                ) {
    this.methodMap = {}

    ipcMain.on(mainCallMethodEventName, (event, methodName, mid, ...params) => {
      const pass_result = (result) => {
        window.webContents.send(rendererDoneEventName, mid, result)
      }
      const pass_error = (error) => {
        window.webContents.send(rendererFailedEventName, mid, error)
      }

      if (Object.prototype.hasOwnProperty.call(this.methodMap, methodName)) {
        const method = this.methodMap[methodName]
        method(...params).then(result => pass_result(result)).catch(error => pass_error(error))
      } else {
        pass_error(new Error(`Unregistered method: ${methodName}`))
      }
    })
  }

  addMethod (method, name) {
    if ((typeof name === 'string') && (name.length > 0)) {
      this.methodMap[name] = method
    } else {
      throw new Error('invalid-method-name')
    }
  }
}

module.exports = Main
