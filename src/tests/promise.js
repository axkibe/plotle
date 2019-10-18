'use strict';

const { EventEmitter } = require('events');

const test =
	function( )
{
	return 'muhkuh';
};


const run =
	async function( )
{
	console.log( await test( ) );
};

run( ).catch( ( error ) => { throw error; } );

const wait = new EventEmitter( ).on( 'event', ( e ) =>
{
	console.log( 'exiting' );
} );

setTimeout( ( ) => wait.emit( 'event', 'fired!' ), 4000 );
