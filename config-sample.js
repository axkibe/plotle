/*
| Config
*/

module.exports = ( set ) => {


/*
|* GLOBAL SWITCHES
|* ===============
'*/

/*
| Shortcut for development mode switching several options below
*/
const devel = false;


/*
|* AMINISTRATOR
|* ============
'*/

/*
| The admin user.
| Note: you'll have to register the admin user using 'sign up' in the shell.
|
| Default: called "admin".
*/

// set( 'admin', 'admin' );


/*
|* NETWORK
|* =======
'*/

/*
| The interface to listen on.
|
| Default: null -> listens on all networks.
*/

// set( 'network', 'listen', '[IP]' );

/*
| The protocol used by the main server.
|
| Default: http
*/

// set( 'network', 'main', 'protocol', 'http' );

/*
| The port to listen on.
|
| Default: 0 -> 8833 when http, 443 when https
*/

// set( 'network', 'main', 'port', 0 );

/*
| Redirects http traffic. ('' or or 'http')
|
| Default: '' -> no redirect
*/

// set( 'network', 'redirect', 'protocol', '' );

/*
| Port for the redirector to listen on
|
| Default: 80
*/

// set( 'network', 'redirect', 'port', '80' );

/*
| Destination to redirect to.
|
| Default: 'https://'
*/

// set( 'network', 'redirect', 'destination', 'https://' );


/*
|* HTTPS
|* =====
'*/

/*
| The location of the https certificate..
| No defaults.
*/

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
|* SHELL BUNDLE
|* ============
|* the / and /index.html access and options active there.
'*/

/*
| Enables the shell bundle.
|
| Default: enabled
*/

set( 'shell', 'bundle', 'enable', !devel );

// set( 'shell', 'bundle', 'check', false );
// set( 'shell', 'bundle', 'freeze', false );

/*
| Shell error catching and producing a failScreen in such a case.
|
| When developing it is preferable to disable this, so errors
| are dropped to the console.
|
| Default: on for bundle
*/

// set( 'shell', 'bundle', 'failScreen', true );

/*
| Servers a sourceMap for the bundle.
|
| Default: enabled
*/

// set( 'shell', 'bundle', 'sourceMap', true );

/*
| If true minifies the javascript pack.
|
| Default: enabled
*/

// set( 'shell', 'bundle', 'minify', true );

/*
| If true beautifies minified output.
|
| Default: disabled
*/

// set( 'shell', 'bundle', 'beautify', false );


/*
|* SHELL DEVEL
|* ===========
|* the /devel.html access and options active there.
'*/

// set( 'shell', 'devel', 'enable', true );
// set( 'shell', 'devel', 'check', true );
// set( 'shell', 'devel', 'freeze', true );

/*
| Shell error catching and producing a failScreen in such a case.
|
| When developing it is preferable to disable this, so errors
| are dropped to the console.
|
| Default: off for devel
*/

// set( 'shell', 'devel', 'failScreen', false );


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
