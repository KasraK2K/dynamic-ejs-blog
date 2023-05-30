//================================================================================================================
//
//  #####   ###    ###   ####         #####   ####   #####    ####  ##    ##   ####  ######  #####  ###    ###
//  ##  ##  ## #  # ##  #    #        ##     ##     ##   ##  ##      ##  ##   ##       ##    ##     ## #  # ##
//  #####   ##  ##  ##     ##         #####  ##     ##   ##   ###     ####     ###     ##    #####  ##  ##  ##
//  ##      ##      ##   ##           ##     ##     ##   ##     ##     ##        ##    ##    ##     ##      ##
//  ##      ##      ##  ######        #####   ####   #####   ####      ##     ####     ##    #####  ##      ##
//
//================================================================================================================

// NOTE: To run typescript file install this `pm2 install typescript`
module.exports = {
  apps: [
    {
      name: process.env.NAME,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      script: process.env.NODE_ENV === 'development' ? 'build/server.js' : 'build/server.js',
      watch: process.env.NODE_ENV === 'development',
      time: true,
      instance_var: 'blog.gen_api',
      instances: process.env.NODE_ENV === 'development' ? '1' : 'max',
      exec_mode: 'cluster',
      error_file: '/var/pm2-logs/apppair/blog/err.log',
      out_file: '/var/pm2-logs/apppair/blog/out.log',
      log_file: '/var/pm2-logs/apppair/blog/combined.log',

      // default variables
      env: {
        IS_ON_SERVER: true,
      },

      // development environment
      env_development: {
        NODE_ENV: 'development',
        JWT_SECRET: '',
        PORT: process.env.PORT || '6110',
      },

      // production environment
      env_production: {
        NODE_ENV: 'production',
        JWT_SECRET: '',
        PORT: process.env.PORT || '6110',
      },
    },
  ],
}
