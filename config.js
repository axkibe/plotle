/*
| Config.
*/

// shortcut for development mode
// switching several options below
const devel = true;
//const devel = false;

// init
const config = module.exports = { };

// if enabled http requests will be forwarded to https
config.https = !devel;

// the admin user
config.admin = 'axel';

// the interface to listen on,.
// null       means listens on all interfaces.
config.ip = null;

// the port to listen on.
config.port = config.https ? 443 : 8833;

// the location of the https certificate
config.https_cert = '/etc/letsencrypt/live/linkloom.org/cert1.pem';

// the location of the https key
config.https_privkey = '/etc/letsencrypt/live/linkloom.org/privkey.pem';

// host the mongodb database runs on
config.database_host = '127.0.0.1';

// port the mongodb database runs on
config.database_port = 27017;

// name of the mongodb database
config.database_name = 'linkloom-1';

// Provides the shell devel files.
config.shell_devel = true;

// provides the shell bundle.
config.shell_bundle = !devel;

// if true checking code is turned on in shell
config.shell_check = devel;

// if true freezing objects is turned on in shell
config.shell_freeze = devel;

// if true checking code is turned on in server
config.server_check = true;

// if true freezing objects is turned on in server
config.server_freeze = false;

// if the server is in devel mode
// * it will die on a command it considers unacceptable.
// * also it will check for changed ressources on every request.
config.server_devel = devel;

// if false to server tells each client is told not to cache http
// requests.
config.http_cache = devel;

// if true writes manglemap and sourcemap.
config.report = !devel;

// if true "uglifies" the javascript pack, minimizing its size.
config.uglify = !devel;

// if true does extra mangles on output compression
// FIXME currently broken
config.extraMangle = false;

// if true "beautifies" uglify output.
config.beautify = false;

// activates all hacks needed to debug the client with weinre.
// Set to false/null or the address of the weinre server
config.weinre = false;

// if set, accepts only connections from these addresses
config.whiteList = false;
