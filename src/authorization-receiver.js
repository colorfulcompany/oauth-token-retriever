import { URL } from 'node:url'
import { OAuth2 } from 'oauth'
import open from 'open'

import RedirectCatcher from './redirect-catcher.js'

export default class AuthorizationReceiver {
  /**
   * @param {object} config
   */
  constructor (config = {}) {
    this.config = config
    this.catcher = undefined

    if (Object.entries(config).length > 0) {
      this.setClient(config)
    }
  }

  /**
   * @param {object} config
   */
  setClient (config) {
    const provider = config.provider
    const [baseSite, authorizePath] = this.separateSiteAndPath(provider.authorizeUrl)
    const [, accessTokenPath] = this.separateSiteAndPath(provider.tokenUrl)

    this.client = new OAuth2(
      provider.clientId,
      provider.secret,
      baseSite,
      authorizePath,
      accessTokenPath
    )
  }

  /**
   * @param  {string} url
   * @return {Array}
   */
  separateSiteAndPath (url) {
    const parsed = new URL(url)

    return [parsed.origin, parsed.pathname]
  }

  async invokeCatcher () {
    this.catcher = new RedirectCatcher(this.config.catcher.port)
    await this.catcher.run()
  }

  /**
   * @param  {object} opts
   * @return {object}
   */
  authorizeParams (opts = {}) {
    const catcher = this.catcher
    const provider = this.config.provider

    return {
      redirect_uri: (typeof catcher !== 'undefined') ? catcher.url() : undefined,
      client_secret: (typeof provider !== 'undefined') ? provider.secret : undefined,
      ...opts
    }
  }

  async invoke () {
    if (typeof this.catcher === 'undefined') {
      await this.invokeCatcher()
    }

    await this.openBrowser(
      this.client.getAuthorizeUrl(
        this.authorizeParams({
          response_type: 'code'
        })
      )
    )
  }

  /**
   * @param {string} url
   */
  async openBrowser (url) {
    if (this.config.app.verbose) {
      console.log('open URL below')
      console.log(url)
    }
    await open(url)
  }

  /**
   * @return {Promise<string>}
   */
  code () {
    return new Promise((resolve) => {
      this.catcher.on('codeCaught', (code) => {
        resolve(code)
      })
    })
  }

  /**
   * @param {string} code
   * @return {Promise<object>}
   */
  token (code) {
    return new Promise((resolve) => {
      this.client.getOAuthAccessToken(
        code,
        this.authorizeParams({
          grant_type: this.config.provider.grantType
        }),
        (_none, _access_token, refresh_token, result) => { // eslint-disable-line
          resolve(this.mergeRefreshTokenAndResult(refresh_token, result)) // eslint-disable-line
        }
      )
    })
  }

  /**
   * @param {string} refresh_token
   * @param {object} result
   * @return {object}
   */
  mergeRefreshTokenAndResult (refresh_token, result) { // eslint-disable-line
    return {
      ...result,
      refresh_token // eslint-disable-line camelcase
    }
  }
}
