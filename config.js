// editable configuration
module.exports = {
	ip      : '127.0.0.1',
	port    : 8833,

	// development mode: none, client, server or both.
	devel   : 'client',

	//messages and JSON with whitespace/newlines for debugging.
	puffed  : false,
	//puffed  : true,

	log     : {
		//all:   true,

		ajax:   true,
		change: true,
		debug:  true,
		fail:   true,
		grow:   false,
		peer:   true,
		report: true,
		start:  true,
		shell:  true,
		tfx:    true,
		web:    true,
		warn:   true
	}
};
