import yargs from 'yargs/yargs'

export default class Cliopts {
  constructor () {
    this.error = undefined
    this.argv = undefined
  }

  /**
   * @param {Array} argv
   * @param {object} ctx
   * @return {object}
   */
  parse (argv = process.argv.slice(1), ctx = {}) {
    return this.config().parse(argv, ctx, this.parsedReceiver.bind(this))
  }

  /**
   * @param {Error} err
   * @param {object} parsed
   * @param {object} output
   * @return {object}
   */
  parsedReceiver (err, parsed, output) {
    if (err) { this.error = err; return err }
    if (parsed) { this.argv = parsed; return parsed }
  }

  /**
   * @return {object}
   */
  config () {
    return yargs()
      .option('g', {
        alias: 'grant-type',
        default: 'authorization_code',
        describe: 'grant type'
      })
      .option('p', {
        alias: 'port',
        describe: 'port number of redirect uri ( localhost )',
        type: 'number'
      })
      .option('u', {
        alias: 'url',
        describe: 'authorization server url',
        type: 'string'
      })
      .option('a', {
        alias: 'authorize-url',
        describe: 'URL for authorization code',
        type: 'string'
      })
      .option('t', {
        alias: 'token-url',
        describe: 'URL for access token and referesh token',
        type: 'string'
      })
      .option('i', {
        alias: 'client-id',
        describe: 'Client ID',
        type: 'string',
        require: true
      })
      .option('s', {
        alias: 'secret',
        describe: 'Secret',
        type: 'string',
        require: true
      })
      .option('v', {
        alias: 'verbose',
        describe: 'print more information',
        type: 'boolean'
      })
  }

  showHelp () {
    this.config().showHelp()
  }
}
