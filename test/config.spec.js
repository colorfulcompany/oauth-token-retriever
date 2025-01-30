import { describe, it, beforeEach } from 'mocha'

import Config from '../src/config.js'
import assert from 'power-assert'

describe('Config', () => {
  let config

  beforeEach(() => { // eslint-disable-line
    config = new Config()
  })

  describe('#set', () => {
    describe('valid config', () => {
      it('applied', () => {
        config.set({
          port: 3000,
          url: 'https://api.example.com',
          clientId: '',
          secret: ''
        })

        assert.equal(config.catcher.port, 3000)
      })
    })

    describe('object, but invalid config', () => {
      it('through option', () => {
        config.set({})

        assert.equal(config.catcher.port, 4321)
      })
    })

    it('not object', () => {
      try {
        config.set(null)
      } catch (_e) {
        // cannot work
        assert(true)
      }
    })
  })

  describe('#setPort', () => {
    it('given number', () => {
      assert.equal(config.setPort(2000), 2000)
    })

    it('given string', () => {
      assert.equal(config.setPort('abc'), false)
    })
  })

  describe('#setUrl', () => {
    describe('only url', () => {
      it('delivered to authorizeUrl and tokenUrl', () => {
        assert.deepEqual(
          {
            authorizeUrl: 'http://example.com',
            tokenUrl: 'http://example.com'
          },
          config.setUrl({ url: 'http://example.com' })
        )
      })
    })

    it('only authorizeUrl', () => {
      assert.equal(
        config.setUrl(
          {
            authorizeUrl: 'http://example.com'
          }),
        false
      )
    })
  })
})
