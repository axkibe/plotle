/*
| Config
|
| Default values are commented out.
*/

module.exports = ( set ) => {


/*
|* GLOBAL SWITCHES
|* ===============
'*/

// shortcut for development mode switching several options below
const devel = true;
//const devel = false;


/*
|* AMINISTRATOR
|* ============
'*/

// the admin user
set( 'admin', 'axel' );


/*
|* NETWORK
|* =======
'*/

/* the interface to listen on, default listens to all networks */

// set( 'network', 'listen', '[IP]' );

/* the protocol and port for the main server */

set( 'network', 'main', 'protocol', 'http' );
set( 'network', 'main', 'port', 8833 );

/* redirects http traffic */

// set( 'network', 'redirect', 'protocol', 'http' );
// set( 'network', 'redirect', 'port', '80' );
// set( 'network', 'redirect', 'destination', 'https://' );


/*
|* HTTPS
|* =====
'*/

/* the location of the https certificate */

// set( 'https', 'cert', '[PATH TO CERT]' );
// set( 'https', 'key', '[PATH TO KEY]' );


/*
|* DATABASE BACKEND
|* ================
|* mongodb database connection
'*/

// set( 'database', 'host', '127.0.0.1' );
// set( 'database', 'port', 27017 );
// set( 'database', 'name', 'plotle-15' );

/*
|* SHELL DEVEL
|* ===========
|* the /devel.html access and options active there.
'*/

// set( 'shell', 'devel', 'enable', true );
// set( 'shell', 'devel', 'check', true );
// set( 'shell', 'devel', 'freeze', true );

/*
| Enables shell error catching and producing a failScreen
| when developing it is preferable to disable this, so errors
| are dropped to the console.
*/

// set( 'shell', 'devel', 'failScreen', true );


/*
|* SHELL BUNDLE
|* ============
|* the / and /index.html access and options active there.
'*/

// set( 'shell', 'bundle', 'check', false );
// set( 'shell', 'bundle', 'freeze', false );
// set( 'shell', 'bundle', 'failScreen', false );

/*
| If true "uglifies" the javascript pack, minimizing its size.
*/

// set( 'shell', 'bundle', 'uglify', true );

/*
| if true does extra mangles on output compression
| FIXME currently broken
*/

// set( 'shell', 'bundle', 'extraMangle', false );

/*
| If true "beautifies" uglify output.
*/

// set( 'shell', 'bundle', 'beautify', false );


/*
|* SERVER SETTINGS
|* ===============
'*/

/*
| Checking is by default turned on on server.
*/

// set( 'server', 'check', true );

/*
| Freezing is by default turned off on server
*/

// set( 'server', 'freeze', false );

/*
| If true the server will die on invalid commands.
*/

set( 'server', 'sensitive', devel );

/*
| Server will check for changed ressources on every request.
| FIXME rename
*/
set( 'server', 'update', devel );

/*
| If false the server tells each client not to cache http requests.
| FIXME move to http/s
*/
set( 'server', 'cache', false );

/*
| If true writes the sourcemap and manglemap.
*/
set( 'server', 'report', !devel );

/*
| If set, accepts only connections from these addresses
*/

// set( 'server', 'whileList', '[ADDRESSES]' );


/*
|* WEINRE DEBUGGING
|* ================
|* Activates all hacks needed to debug the client with weinre.
|* Defaults to false (deactiveted)
|* Set the address of the weinre server to enable
'*/

// set( 'weinre', '[WEINRE SERVER' ] );

};
