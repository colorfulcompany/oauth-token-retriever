import { describe, it, beforeEach, afterEach } from 'mocha'

import RedirectCatcher from '../src/redirect-catcher.js'

import ky from 'ky'
import assert from 'power-assert'

describe('RedirectCatcher', () => {
  describe('#authorizationCode', () => {
    var catcher

    /**
     * @return {string}
     */
    function url () {
      return `http://localhost:${catcher.port()}/?code=abc`
    }

    beforeEach(async () => { // eslint-disable-line
      catcher = new RedirectCatcher()
      await catcher.run()
    })

    afterEach(() => { // eslint-disable-line
      catcher.close()
    })

    it('#authorizationCode', async () => {
      await ky(url())

      assert.equal('abc', catcher.authorizationCode())
    })

    it('codeCaught event emitted', async () => {
      catcher.on('codeCaude', (code) => {
        assert(true)
      })
      await ky(url())
    })
  })
})
