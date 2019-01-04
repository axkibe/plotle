/*
| Config.
*/

module.exports = ( set ) => {

// shortcut for development mode
// switching several options below
const devel = true;
//const devel = false;

// the admin user
set( 'admin', 'axel' );

// the interface to listen on, default listens to all networks
//     set( 'network', 'listen', '[IP]' );

// the protocol and port for the main server
set( 'network', 'main', 'protocol', 'http' );
set( 'network', 'main', 'port', 8833 );

// redirects http traffic
//     set( 'network', 'redirect', 'protocol', 'http' );
//     set( 'network', 'redirect', 'port', '80' );
//     set( 'network', 'redirect', 'destination', 'https://' );

// the location of the https certificate
//     set( 'https', 'cert', '[PATH TO CERT]' );
//     set( 'https', 'key', '[PATH TO KEY]' );

// mongodb database connection
//     set( 'database', 'host', '127.0.0.1' );
//     set( 'database', 'port', 27017 );
//     set( 'database', 'name', 'plotle-15' );

// the /devel.html access.
//     set( 'shell', 'devel', 'enable', true );
//     set( 'shell', 'devel', 'check', true );
//     set( 'shell', 'devel', 'freeze', true );

// the default / or /index.html access
set( 'shell', 'bundle', 'enable', !devel );

//     set( 'shell', 'bundle', 'check', false );
//     set( 'shell', 'bundle', 'freeze', false );

// if true "uglifies" the javascript pack, minimizing its size.
//     set( 'shell', 'bundle', 'uglify', true );

// if true does extra mangles on output compression
// FIXME currently broken
//     set( 'shell', 'bundle', 'extraMangle', false );

// if true "beautifies" uglify output.
//     set( 'shell', 'bundle', 'beautify', false );

// checking is turned on on server
//     set( 'server', 'check', true );

// freezing is turned off on server
//     set( 'server', 'freeze', false );

// if true the server will die on unaccepptable commands
set( 'server', 'sensitive', devel );

// server will check for changed ressources on every request.
set( 'server', 'update', devel );

// if false to server tells each client is told not to cache http requests.
set( 'server', 'cache', false );

// if true writes manglemap and sourcemap.
set( 'server', 'report', !devel );

// activates all hacks needed to debug the client with weinre.
// Set to false/null or the address of the weinre server
//     set( 'weinre', '[WEINRE SERVER' ] );

// if set, accepts only connections from these addresses
//     set( 'server', 'whileList', '[ADDRESSES]' );

};
