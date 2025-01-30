import { describe, it, beforeEach } from 'mocha'

import RedirectCatcher from '../src/redirect-catcher.js'

import ky from 'ky'
import assert from 'power-assert'

describe('RedirectCatcher', () => {
  describe('#authorizationCode', () => {
    let catcher

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

    it('#authorizationCode', async () => {
      await ky(url())

      assert.equal('abc', catcher.authorizationCode())
    })

    it('codeCaught event emitted', async () => {
      catcher.on('codeCaude', (_code) => {
        assert(true)
      })
      await ky(url())
    })
  })
})
