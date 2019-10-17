const EventEmitter = require('events')
const express = require('express')

class RedirectCatcher {
  /**
   * @param {number} port
   */
  constructor (port = 3000) {
    this.app = express()
    this.server = undefined
    this._port = port
    this.code = undefined

    this.emitter = new EventEmitter()
  }

  /**
   * @param {string} event
   * @param {Function} callback
   */
  on (event, callback) {
    this.emitter.on(event, callback)
  }

  /**
   * @return {number}
   */
  port () {
    return this._port
  }

  /**
   * @return {string}
   */
  url () {
    return `http://localhost:${this.port()}`
  }

  /**
   * @return {string}
   */
  authorizationCode () {
    return this.code
  }

  /**
   * @return {object} http.Server
   */
  async run () {
    const port = this.port()

    this.app.get('/', async (req, res, next) => {
      this.code = req.query.code.repeat(1)
      res.status(200).send('')
      await this.close()
      this.emitter.emit('codeCaught', this.code)
    })

    console.log(`start server on http://localhost:${port}`)
    this.server = this.app.listen(port)

    return this.server
  }

  /**
   * @return {boolean}
   */
  isRunning () {
    return typeof this.server !== 'undefined'
  }

  async close () {
    if (this.isRunning()) {
      await this.server.close()
      this.server = undefined
    }
  }
}

module.exports = RedirectCatcher
