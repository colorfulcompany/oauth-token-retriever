/* global describe, it */

const Config = require('config')
const AuthorizationReceiver = require('authorization-receiver')

const assert = require('power-assert')
const sinon = require('sinon')

describe('AuthorizationReceiver', () => {
  const AUTHORIZE_URL = 'http://localhost/auth'
  const TOKEN_URL = 'http://localhost/token'

  var authReceiver, config

  function authorizeParams () { // eslint-disable-line
    return {
      client_secret: 'def',
      redirect_uri: 'http://localhost:3000',
      grant_type: 'authorization_code'
    }
  }

  describe('#separateSiteAndPath', () => {
    beforeEach(() => { // eslint-disable-line
      authReceiver = new AuthorizationReceiver()
    })

    it('valid url', () => {
      assert.deepEqual(
        authReceiver.separateSiteAndPath('https://api.example.com/oauth'),
        ['https://api.example.com', '/oauth']
      )
    })

    it('invalid url', () => {
      try {
        authReceiver.separateSiteAndPath('abc')
      } catch (e) {
        assert.equal(e.name, 'TypeError')
      }
    })
  })

  describe('#authorizeParams', () => {
    it('no params', () => {
      assert.deepEqual(
        authReceiver.authorizeParams(),
        {
          redirect_uri: undefined,
          client_secret: undefined
        }
      )
    })

    it('add grant_type', () => {
      assert.deepEqual(
        authReceiver.authorizeParams({ grant_type: 'authorization_code' }),
        {
          redirect_uri: undefined,
          client_secret: undefined,
          grant_type: 'authorization_code'
        }
      )
    })
  })

  describe.skip('fetch indeed authorization code', () => {
    beforeEach(function () { // eslint-disable-line
      this.timeout(10000)

      config = new Config({
        authorizeUrl: AUTHORIZE_URL,
        tokenUrl: TOKEN_URL,
        clientId: '',
        secret: ''
      })
      authReceiver = new AuthorizationReceiver(config)
    })

    it('got authorization code and tokens', async () => {
      await authReceiver.invoke()
      const code = await authReceiver.code()
      const tokens = await authReceiver.token(code)
      console.log({ authorization_code: code, ...tokens })
    })
  })

  describe('with mock', () => {
    var mockReceiver

    beforeEach(async () => { // eslint-disable-line
      config = new Config({
        authorizeUrl: AUTHORIZE_URL,
        tokenUrl: TOKEN_URL,
        clientId: '',
        secret: ''
      })
      authReceiver = new AuthorizationReceiver(config)

      mockReceiver = sinon.mock(authReceiver)
      mockReceiver.expects('openBrowser').once()
    })

    describe('#code', () => {
      beforeEach(async () => { // eslint-disable-line
        mockReceiver.expects('authorizeParams').once().callsFake(authorizeParams)

        await authReceiver.invoke()

        setTimeout(() => {
          authReceiver.catcher.emitter.emit('codeCaught', 'abc')
        }, 10)
      })

      afterEach(async () => { // eslint-disable-line
        await authReceiver.catcher.close()
        mockReceiver.restore()
      })

      it('#isRunnig', () => {
        assert(authReceiver.catcher.isRunning())
      })

      it('assert equal on code', async () => {
        assert.equal(await authReceiver.code(), 'abc')
      })

      it('mock verify', async () => {
        await authReceiver.code()
        mockReceiver.verify()
      })
    })

    describe('#token', () => {
      beforeEach(async () => { // eslint-disable-line
        mockReceiver.expects('authorizeParams').twice().callsFake(authorizeParams)

        await authReceiver.invoke()

        setTimeout(() => {
          authReceiver.catcher.emitter.emit('codeCaught', 'abc')
        }, 10)
      })

      afterEach(async () => { // eslint-disable-line
        await authReceiver.catcher.close()
        mockReceiver.restore()
      })

      it('assert equal to object', async () => {
        const code = await authReceiver.code()
        assert.equal(typeof await authReceiver.token(code), 'object')
        mockReceiver.verify()
      })
    })
  })

  describe('#mergeRefreshTokenAndResult', () => {
    it('just refresh_token', () => {
      assert.deepEqual(
        authReceiver.mergeRefreshTokenAndResult('abc', {}),
        {
          refresh_token: 'abc'
        }
      )
    })

    it('flast access_token and refresh_token', () => {
      assert.deepEqual(
        authReceiver.mergeRefreshTokenAndResult('abc', { access_token: 'def' }),
        {
          access_token: 'def',
          refresh_token: 'abc'
        }
      )
    })
  })
})
