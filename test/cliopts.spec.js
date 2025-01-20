const { describe, it, beforeEach } = require('mocha')

const assert = require('power-assert')
const _ = require('lodash')

const Cliopts = require('cliopts')

describe('Cliopts', () => {
  var opts

  /**
   * @param  {Array} argv
   * @return {Array}
   */
  function fillInRequiredOpts (argv) {
    return [
      ...argv,
      '-i', '',
      '-s', ''
    ]
  }

  beforeEach(() => { // eslint-disable-line
    opts = new Cliopts()
  })

  describe('#parse', () => {
    describe('no argv', () => {
      beforeEach(() => { // eslint-disable-line
        opts.parse()
      })

      it('error exist', () => {
        assert(opts.error)
      })

      it('error name is YError', () => {
        assert.equal(opts.error.name, 'YError')
      })

      it('argv is undefined', () => {
        assert.equal(opts.argv, undefined)
      })
    })

    describe('empty argv', () => {
      beforeEach(() => { // eslint-disable-line
        opts.parse([])
      })

      it('error name', () => {
        assert.equal(opts.error.name, 'YError')
      })

      it('error message', () => {
        assert(opts.error.message.includes(': i, s'))
      })
    })

    describe('required is filled', () => {
      var given = ['-i', 'abc', '-s', 'def']

      beforeEach(() => { // eslint-disable-line
        opts.parse(given)
      })

      it('error nothing', () => {
        assert.equal(opts.error, undefined)
      })

      it('can fetch from parsed argv', () => {
        _.forEach(_.fromPairs(_.chunk(given, 2)), (v, k) => {
          const opt = k.replace('-', '')
          assert.equal(opts.argv[opt], v)
        })
      })
    })

    describe('type mismatch', () => {
      var parsed

      describe('valid port type number', () => {
        beforeEach(() => { // eslint-disable-line
          parsed = opts.parse(fillInRequiredOpts([
            '--port', '3000'
          ]))
        })

        it('returned yargs object', () => {
          assert.equal(parsed.port, 3000)
        })
      })

      describe('invalid port type string', () => {
        beforeEach(() => { // eslint-disable-line
          parsed = opts.parse(fillInRequiredOpts([
            '--port', 'abc'
          ]))
        })

        it('returned yargs object', () => {
          assert(Number.isNaN(parsed.port))
        })
      })
    })
  })
})
