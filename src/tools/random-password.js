var
	jools;

GLOBAL.SERVER = true;

jools = require( '../jools/jools.js' );

console.log( jools.randomPassword( 10 ) );
