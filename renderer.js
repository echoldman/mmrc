// mmrc - main method call

function generateMID () {
  let d = (new Date()).getTime()
  const mid = 'xxxx-xx-3xx-yxxx-xxxx'.replace(/[xy]/g, (c) => {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return mid
}

class Renderer {
  constructor (
                ipcRenderer,
                mainCallMethodEventName = 'mmrc.main.call.method',
                rendererDoneEventName = 'mmrc.renderer.done',
                rendererFailedEventName = 'mmrc.renderer.failed'
                ) {
    this.mainMethodCallbackMap = {}

    this.ipcRenderer = ipcRenderer
    this.mainCallMethodEventName = mainCallMethodEventName

    ipcRenderer.on(rendererDoneEventName, (event, mid, result) => {
      const resolve = this.mainMethodCallbackMap[mid].resolve
      resolve(result)
      delete this.mainMethodCallbackMap[mid]
    })

    ipcRenderer.on(rendererFailedEventName, (event, mid, error) => {
      const reject = this.mainMethodCallbackMap[mid].reject
      reject(error)
      delete this.mainMethodCallbackMap[mid]
    })
  }

  callMainMethod (methodName, ...params) {
    const mid = generateMID()
    return new Promise((resolve, reject) => {
      this.mainMethodCallbackMap[mid] = { resolve, reject }
      this.ipcRenderer.send(this.mainCallMethodEventName, methodName, mid, ...params)
    })
  }

  C (methodName, ...params) {
    return this.callMainMethod(methodName, ...params)
  }
}

module.exports = Renderer
