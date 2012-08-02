/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                   ,-. ,-. ,-. ," . ,-.
                                   |   | | | | |- | | |
                                   `-' `-' ' ' |  ' `-|
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                     `'
 Meshcrafts easily editable configuration.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var config = module.exports = {};

/**
| an additional admin user
*/
config.admin = 'axel';

/**
| The interface to listen on,.
|   null       means listens on all interfaces.
|  '127.0.0.1' means localhost (IPV4)
*/
config.ip = null;

/**
| The port to listen on.
*/
config.port = 8833;

/**
| Database settings (mongodb)
*/
config.database = {};

/**
| Host the database runs on
*/
config.database.host = '127.0.0.1';

/**
| Port the database runs on
*/
config.database.port = 27017;

/**
| Name of the database
*/
config.database.name = 'meshcraft03';

/**
| development mode
|    none, shell, server or both.
|
| determines the amound of checking and complaining if things go wrong.
|
| For example, if the server is in devel mode,
| it will die on a command it considers unacceptable.
*/
config.devel = 'shell';

/**
| If true uglifies the javascript pack, that is minizing its size.
*/
config.uglify = false;

/**
| Max. number of events queued.
*/
config.maxUndo = 5000;

/**
| debugging facilities
*/
config.debug = {
	/**
	| In case of doubt, if graphic caching seems faulty, just set this true and
	| see if the errors vanish.
	*/
	noCache : false,

	/**
	| If true draws boxes around all cockpits frames, to see if
	| their size is just right.
	*/
	drawBoxes : false,

	/**
	| If true does messages and JSON with whitespace/newlines
	*/
	puffed : true,

	/**
	| If true ensures that objects that should not be immutable
	| are made immutable. Turned off on releases simply for performance.
	*/
	immute : false
};


/**
| these enable specific logging categories for the console
*/
config.log  = {
	//all:   true,
	ajax:   false,
	change: false,
	debug:  true,
	fail:   true,
	grow:   false,
	iface:  true,
	peer:   true,
	report: false,
	start:  true,
	shell:  true,
	tfx:    false,
	web:    true,
	warn:   true
};

/**
| redirects for VHOSTS
*/
config.redirect = {
	'twitterpolitik.net'        : 'http://www.univie.ac.at/twitterpolitik',
	'www.twitterpolitik.net'    : 'http://www.univie.ac.at/twitterpolitik',
	'twitterpolitik.net:80'     : 'http://www.univie.ac.at/twitterpolitik',
	'www.twitterpolitik.net:80' : 'http://www.univie.ac.at/twitterpolitik'
};
