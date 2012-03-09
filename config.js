// editable configuration
module.exports = {
	ip      : '127.0.0.1',
	port    : 8833,

	// development mode: client, server or both.
	devel   : 'both',

	//messages and JSON with whitespace/newlines for debugging.
	//puffed  : false,
	puffed  : true,

	log     : {
		//all:   true,
		alter:  true,
		ajax:   false,
		debug:  true,
		event:  false,
		fail:   true,
		grow:   false,
		mm:     true,
		peer:   true,
		start:  true,
		shell:  true,
		te:     true,
		web:    true,
		warn:   true
	}
}
