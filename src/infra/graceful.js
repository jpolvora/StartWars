import GracefulShutdown from 'http-graceful-shutdown'

async function onPreShutdown() {
  console.log('onPreShutdown')
}

function onShutdown(signal, callback) {
  return new Promise(async (resolve) => {
    console.log(`... called signal: ${signal}`)
    console.log('... in cleanup')
    await callback(signal)
    setTimeout(function () {
      console.log('... cleanup finished')
      resolve()
    }, 1000)
  })
}

function onFinally() {
  console.log('Server gracefulls shutted down.....')
}

export function configureGracefulShutdown(httpServer, nodeEnv, callback) {
  return GracefulShutdown(httpServer, {
    forceExit: false, // triggers process.exit() at the end of shutdown process
    //development: nodeEnv === 'development',
    signals: 'SIGINT SIGTERM',
    timeout: 30000,
    forceExit: true,
    preShutdown: onPreShutdown,
    onShutdown: (signal) => onShutdown(signal, callback), // shutdown function (async) - e.g. for cleanup DB, ...
    finally: onFinally, // finally function (sync) - e.g. for logging
  })
}
