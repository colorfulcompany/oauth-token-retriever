class Config {
  /**
   * @param {object} opts
   */
  constructor (opts = undefined) {
    this.app = {
      verbose: false
    }
    this.catcher = {
      port: 4321
    }
    this.provider = {
      grantType: 'authorization_code',
      authorizeUrl: undefined,
      tokenUrl: undefined,
      clientId: undefined,
      secret: undefined
    }

    if (typeof opts !== 'undefined') this.set(opts)
  }

  /**
   * @param {object} opts
   */
  set (opts) {
    this.setPort(opts.port)
    this.setUrl(opts)
    this.provider.clientId = opts.clientId
    this.provider.secret = opts.secret
  }

  /**
   * @param {number} port
   * @return {number|boolean}
   */
  setPort (port) {
    if (typeof port === 'number' && !Number.isNaN(port)) {
      this.catcher.port = port
      return port
    } else {
      return false
    }
  }

  /**
   * @param {object} opts
   * @return {object|boolean}
   */
  setUrl (opts) {
    if (typeof opts.url !== 'undefined') {
      this.provider.authorizeUrl = opts.url
      this.provider.tokenUrl = opts.url
    } else if (typeof opts.authorizeUrl !== 'undefined' && typeof opts.tokenUrl !== 'undefined') {
      this.provider.authorizeUrl = opts.authorizeUrl
      this.provider.tokenUrl = opts.tokenUrl
    }

    if (typeof this.provider.authorizeUrl !== 'undefined' &&
        typeof this.provider.tokenUrl !== 'undefined') {
      return {
        authorizeUrl: this.provider.authorizeUrl,
        tokenUrl: this.provider.tokenUrl
      }
    } else {
      return false
    }
  }
}

module.exports = Config
