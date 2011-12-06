// editable configuration
module.exports = {
	// devel: client, server or both. 
	devel   : 'client',
	
	ip      : '127.0.0.1',
	
	port    : 8833,
	
	//seperator for JSON messages (to be more easily readable)
	jspacon : false,

	log     : {
		//all:   true,
		alter:  true,
		ajax:   false,
		debug:  true,
		fail:   true,
		mm:     true,
		start:  true,
		te:     true,
		web:    true,
	}
}
