/*
| Config
*/


/*
| Config init.
*/
var config = module.exports = { };


/*
| an additional admin user
*/
config.admin = 'axel';


/*
| The interface to listen on,.
|   null       means listens on all interfaces.
*/
config.ip = null;


/*
| The port to listen on.
*/
config.port = 8833;


/*
| Host the mongodb database runs on
*/
config.database_host = '127.0.0.1';


/*
| Port the mongodb database runs on
*/
config.database_port = 27017;


/*
| Name of the mongodb database
*/
config.database_name = 'linkloom-1';


/*
| Runs in devel mode.
*/
config.devel = true;
//config.devel = false;


/*
| Provides the shell devel files.
*/
config.shell_devel = true;


/*
| Provide a bundle.
*/
config.shell_bundle = !config.devel;
//config.shell_bundle = true;


/*
| If true checking code is turned on in shell
*/
config.shell_check = config.devel;
//config.shell_check = true;


/*
| If true freezing objects is turned on in shell
*/
config.shell_freeze = config.devel;


/*
| If true checking code is turned on in server
*/
config.server_check = true;


/*
| If true freezing objects is turned on in server
|
| NOTE: this make the server very slow!
*/
config.server_freeze = false;


/*
| If the server is in devel mode,
| it will die on a command it considers unacceptable.
*/
config.server_devel = false;


/*
| Does not write stuff on server startup
*/
config.noWrite = false;


/*
| If true "uglifies" the javascript pack, minimizing its size.
*/
config.uglify = !config.devel;
//config.uglify = true;


/*
| If true does extra mangles on output compression
*/
config.extraMangle = config.shell_bundle;
//config.extraMangle = true;


/*
| If true "beautifies" uglify output.
*/
config.beautify = false;
//config.beautify = true;


/*
| Activates all hacks needed to debug the client with weinre.
| Set to false/null or the address of the weinre server
*/
config.weinre = false;


/*
| If set, accept only connections from these addresses
*/
config.whiteList = false;


/*
| enable specific logging categories
*/
config.log  = {
	all : false,
	ajax : false,
	debug : true,
	fail : true,
	start : true,
	web : true,
	warn : true
};

