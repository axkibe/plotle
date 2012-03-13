// editable configuration
module.exports = {
	ip      : '127.0.0.1',
	port    : 8833,

	// development mode: none, client, server or both.
	devel   : 'both',

	//messages and JSON with whitespace/newlines for debugging.
	//puffed  : false,
	puffed  : false,

	log     : {
		//all:   true,
		alter:  true,
		ajax:   false,
		debug:  true,
		fail:   true,
		grow:   false,
		mm:     true,
		peer:   true,
		report: true,
		start:  true,
		shell:  true,
		te:     false,
		web:    true,
		warn:   true
	}
};
