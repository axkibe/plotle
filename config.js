/*
| Central configuration file.
*/

module.exports = ( set ) => {

let devel = true;

set( 'admin', 'axel' );
set( 'network', 'main', 'protocol', 'http' );
set( 'shell', 'bundle', 'enable', !devel );
set( 'server', 'sensitive', devel );
set( 'server', 'update', devel );
set( 'server', 'cache', false );
set( 'server', 'report', !devel );

};
