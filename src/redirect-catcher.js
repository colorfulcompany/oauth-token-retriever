import EventEmitter from 'node:events'
import express from 'npm:express'

export default class RedirectCatcher {
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
   * @return {Promise<object>} http.Server
   */
  run () {
    return new Promise((resolve, reject) => {
      if (this.isRunning()) {
        reject(new Error('already running'))
      } else {
        const port = this.port()

        this.app.get('/', async (req, res, _next) => {
          this.code = req.query.code.repeat(1)
          res.status(200).send('')
          await this.close()
          this.emitter.emit('codeCaught', this.code)
        })

        console.log(`start server on http://localhost:${port}`)

        this.server = this.app.listen(port)
        this.server.on('listening', () => {
          resolve(this.server)
        })
      }
    })
  }

  /**
   * @return {boolean}
   */
  isRunning () {
    return typeof this.server !== 'undefined'
  }

  /**
   * @return {Promise<true>}
   */
  close () {
    return new Promise((resolve, reject) => {
      if (this.isRunning()) {
        this.server.on('close', () => {
          this.server = undefined
          resolve(true)
        })
        this.server.close()
      } else {
        reject(new Error('no running server'))
      }
    })
  }
}
