// editable configuration
module.exports = {
	ip      : '127.0.0.1',
	port    : 8833,

	// development mode: client, server or both.
	devel   : 'client',

	//messages and JSON with whitespace/newlines for debugging.
	puffed  : false,

	log     : {
		//all:   true,
		alter:  false,
		ajax:   false,
		debug:  true,
		event:  false,
		fail:   true,
		grow:   true,
		mm:     true,
		start:  true,
		shell:  true,
		te:     false,
		web:    true,
		warn:   true,
	}
}
