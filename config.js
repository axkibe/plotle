// Meshcrafts
// easily editable configuration

module.exports = {
	// the interface to listen on, 
	//   null       means listens on all interfaces.
	//  '127.0.0.1' means localhost (IPV4)
	ip      : null,

	// the port to listen on
	port    : 8833,

	// development mode: none, client, server or both.
	//
	// this mainly means how much checking and complaining is going to happen
	// if things dont match. For example, if the server is in devel mode, it will
	// die on any command it considers unacceptable.
	devel   : 'client',

	// uglifies the javascript pack
	uglify  : false,

	// if true does messages and JSON with whitespace/newlines
	// TODO move to debug
	puffed  : false,

	// debugging facilities
	debug   : {
		// in case of doubt, if graphic caching seems faulty, just set this true and 
		// see if the errors vanish.
		noCache   : false,

		// if true draws boxes around all cockpits frames, to see if 
		// their size is just right.
		drawBoxes : false
	},

	// these enable specific logging categories for the console
	log     : {
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
	}
};
