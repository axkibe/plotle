/*
| Config
*/


/*
| Config infrastructure.
| Don't change this.
*/
var config =
module.exports =
	{
		database :
			{ },

		debug :
			{ }
	};


/*
| an additional admin user
*/
config.admin =
	'axel';


/*
| The interface to listen on,.
|   null       means listens on all interfaces.
|  '127.0.0.1' means localhost (IPV4)
*/
config.ip =
	//'127.0.0.1';
	//'192.168.88.1';
	null;


/*
| The port to listen on.
*/
config.port =
	8833;


/*
| Host the mongodb database runs on
*/
config.database.host =
	'127.0.0.1';


/*
| Port the mongodb database runs on
*/
config.database.port =
	27017;


/*
| Name of the mongodb database
*/
config.database.name =
	'meshcraft04';


/*
| Determines the amound of checking and complaining if things go wrong.
*/
config.develShell =
	true;

/*
| If the server is in devel mode,
| it will die on a command it considers unacceptable.
*/
config.develServer =
	false;


/*
| Does not write stuff on server startup
*/
config.noWrite =
	false;

/*
| If true "uglifies" the javascript pack, minimizing its size.
*/
config.uglify =
	false;


/*
| If true does extra mangles on output compression
*/
config.extraMangle =
	true;


/*
| If true "beautifies" uglify output.
*/
config.beautify =
	false;


/*
| Max. number of undo events queued.
*/
config.maxUndo =
	5000;


/*
| If true formats messages and JSON with whitespace/newlines
*/
config.debug.puffed =
	true;


/*
| If true ensures that objects that should not be immutable
| are made immutable. Turned off on releases for performance.
*/
config.debug.immute =
	false;


/*
| Activates all hacks needed to debug the client with weinre.
| Set to false/null or the address of the weinre server
*/
config.debug.weinre =
	false &&
	'192.168.77.1:8080';

/*
| enable specific logging categories
*/
config.log  = {
	all :
		false
		&&
		true,
	ajax :
		false,
	change :
		false,
	news :
//		true ||
		false,
	debug :
		true,
	fail :
		true,
	twig :
		false,
	iface :
		false,
	peer :
		false,
	report :
		false,
	start :
		true,
	shell :
		true,
	tfx :
		false,
	tree :
		false,
	web :
		true,
	warn :
		true
};

