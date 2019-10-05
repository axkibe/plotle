/*
| Config
*/

module.exports = ( set ) => {

set( 'admin', 'axel' );
set( 'network', 'main', 'protocol', 'https' );
set( 'network', 'redirect', 'protocol', 'http' );
set( 'network', 'redirect', 'port', 80 );
set( 'network', 'redirect', 'destination', 'https://' );
set( 'https', 'cert', '/etc/letsencrypt/live/plotle.org/cert.pem' );
set( 'https', 'key', '/etc/letsencrypt/live/plotle.org/privkey.pem' );
set( 'shell', 'bundle', 'enable', true );
set( 'server', 'update', false );
set( 'server', 'cache', true );
set( 'server', 'report', true );

};
