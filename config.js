/*
| Config
*/


/*
| Config infrastructure.
|
| Don't change this.
*/
var config =
module.exports =
	{
		debug : { }
	};


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
config.database_name = 'ideoloom-8';


/*
| Determines the amount of checking and complaining if things go wrong.
*/
config.develShell = false;


/*
| Do not provide a bundle.
| Only to be used with develShell
*/
config.develNoBundle = false;


/*
| If true checking code is turned on in shell
*/
config.shell_check = false;


/*
| If true freezing objects is turned on in shell
*/
config.shell_freeze = false;


/*
| If true checking code is turned on in shell
*/
config.server_check = true;


/*
| If true freezing objects is turned on in shell
|
| NOTE: this make the server very slow!
*/
config.server_freeze = false;


/*
| If the server is in devel mode,
| it will die on a command it considers unacceptable.
*/
config.develServer = false;


/*
| Does not write stuff on server startup
*/
config.noWrite = false;


/*
| If true "uglifies" the javascript pack, minimizing its size.
*/
config.uglify = true;


/*
| If true does extra mangles on output compression
*/
config.extraMangle = true;


/*
| If true "beautifies" uglify output.
*/
config.beautify = false;


/*
| Max. number of undo events queued.
*/
config.maxUndo = 1000;


/*
| If true formats messages and JSON with whitespace/newlines
*/
config.debug.puffed = false;


/*
| Activates all hacks needed to debug the client with weinre.
| Set to false/null or the address of the weinre server
*/
config.debug.weinre = false;
//config.debug.weinre = '192.168.77.1:8080';


/*
| If set, accept only connections from these addresses
*/
config.whiteList = null;
	/*
	{
		'127.0.0.1' : true,
		'::ffff:127.0.0.1' : true,
		'131.130.188.200' : true,
		'::ffff:131.130.188.224' : true
	};
	*/

/*
| enable specific logging categories
*/
config.log  = {
	all : false,
	ajax : false,
	change : false,
	news : false,
	debug : true,
	fail : true,
	genjion : true,
	twig : false,
	peer : false,
	report : false,
	start : true,
	shell : true,
	tfx : false,
	tree : false,
	web : true,
	warn : true
};

