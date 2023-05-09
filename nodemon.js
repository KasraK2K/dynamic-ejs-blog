const nodemon = require('nodemon')

nodemon({ script: 'src/server.js' })
  .on('start', console.clear)
  .on('restart', console.clear)
  .on('crash', () => console.error('\nApplication has crashed!\n'))
  .on('quit', () => {
    console.log('\nApp has quit\n')
    process.kill(process.pid, 'SIGKILL')
    process.exit()
  })
