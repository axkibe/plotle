/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .´       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--´

                             .-,--.
                              `|__/ ,-. ,-. ,-. . . ,-. ,-. ,-.
                              )| \  |-' `-. | | | | |   |   |-'
                              `'  ` `-' `-' `-' `-^ '   `-' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Something to be REST-served.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Capsule (just to make jshint happy)
*/
(function(){
"use strict";
if (typeof(require) === 'undefined') { throw new Error('this code requires node!'); }

/**
| Constructor.
|
| opts ... a string, a letter including says:
|
|   p ... include in pack
|   m ... keep in memory
|   c ... serve as cached
*/
var Resource = function(path, opts) {
	// the resource's path
	this.path = path;

	// served as binary or utf-u8
	this.code = null;

	// the compressed version of this code (if supported)
	this.gzip = null;

	// the mime-code of the resource
	this.mime = null;

	// the content to be served if held in memory
	this.data  = null;

	// the options for this resource
	this.opts   = {
		// tells the client to cache the resource
		cache  : opts.indexOf('c') >= 0,

		// the servers hold this resource in memory
		memory : opts.indexOf('m') >= 0,

		// the servers read this resource from the file on every access
		// (used for debugging resources)
		file : opts.indexOf('f') >= 0,

		// this resource is part of the bunlde
		bundle : opts.indexOf('b') >= 0
	};

	if (!this.opts.memory && !this.opts.file)
		{ throw new Error('resource "' + '" has neither memory or file set'); }

	var type = path.split('.')[1];

	switch (type) {
	case 'css' :
		// cascading style sheet
		this.code = 'utf-8';
		this.mime = 'text/css';
		break;

	case 'eot' :
		// some font
		this.code = 'binary';
		this.mime = 'font/eot';
		break;

	case 'html' :
		// hypertext
		this.code = 'utf-8';
		this.mime = 'text/html';
		break;

	case 'ico' :
		// icon
		this.code = 'binary';
		this.mime = 'image/x-icon';
		break;

	case 'js' :
		// javascript
		this.code = 'utf-8';
		this.mime = 'text/javascript';
		break;

	case 'otf'  :
		// some font
		this.code = 'binary';
		this.mime = 'font/otf';
		break;

	case 'svg'  :
		// some font
		this.code = 'utf-8';
		this.mime = 'image/svg+xml';
		break;

	case 'ttf'  :
		// some font
		this.code = 'binary';
		this.mime = 'font/ttf';
		break;

	case 'woff' :
		// some font
		this.code = 'binary';
		this.mime = 'application/x-font-woff';
		break;

	default :
		throw new Error('unknown file type: '+type);
	}
};

module.exports = Resource;

})();
