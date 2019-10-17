const core = require('@actions/core')

function main () {
  try {
    const os = core.getInput('os')
    const platform = os.replace(/-[\S]+$/, '').toLowerCase()

    core.setOutput('name', (platform === 'ubuntu') ? 'linux' : platform)
  } catch (e) {
    core.setFailed(e.message)
  }
}

main()
