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
| development mode
|    none, client, server or both.
|
| this mainly means how much checking and complaining is going to happen
| if things dont match. For example, if the server is in devel mode, it will
| die on any command it considers unacceptable.
*/
config.devel = 'client';

/**
| If true uglifies the javascript pack, that is minizing its size.
*/
config.uglify = false;


/**
| debugging facilities
*/
config.debug = {};

/**
| In case of doubt, if graphic caching seems faulty, just set this true and
| see if the errors vanish.
*/
config.debug.noCache = false;

/**
| If true draws boxes around all cockpits frames, to see if
| their size is just right.
*/
config.debug.drawBoxes = false;

/**
| If true does messages and JSON with whitespace/newlines
*/
config.debug.puffed = false;

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
	iface:  false,
	peer:   false,
	report: false,
	start:  true,
	shell:  true,
	tfx:    false,
	web:    false,
	warn:   true
};
