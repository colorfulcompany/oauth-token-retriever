import Cliopts from './cliopts.js'
import Config from './config.js'
import AuthorizationReceiver from './authorization-receiver.js'

/**
 * main
 */
async function main () {
  const cliopts = new Cliopts()
  const config = new Config(cliopts.parse(process.argv.slice(1)))

  if (typeof config.provider.authorizeUrl !== 'undefined' &&
      typeof config.provider.tokenUrl !== 'undefined' &&
      typeof config.provider.clientId !== 'undefined' &&
      typeof config.provider.secret !== 'undefined') {
    const receiver = new AuthorizationReceiver(config)

    await receiver.invoke()
    const code = await receiver.code()
    const tokens = await receiver.token(code)
    console.log({ authorization_code: code, ...tokens })
  } else {
    console.log('\nOops !\nSomething wrong with `authorizeUrl\' or `tokenUrl\' or `clientId\' or `secret\'\n')
    cliopts.showHelp()
  }
}

;(async () => {
  await main()
})()
