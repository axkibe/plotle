// editable configuration
module.exports = {
	//ip      : 'meshcraft.net',
	//ip      : '127.0.0.1',
	ip      : null,
	port    : 8833,

	// development mode: none, client, server or both.
	devel   : 'client',

	//messages and JSON with whitespace/newlines for debugging.
	puffed  : false,
	//puffed  : true,

	log     : {
		//all:   true,

		ajax:   false,
		change: false,
		debug:  true,
		fail:   true,
		grow:   false,
		peer:   false,
		report: false,
		start:  true,
		shell:  true,
		tfx:    false,
		web:    false,
		warn:   true
	}
};
