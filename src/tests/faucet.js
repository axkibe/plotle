/*
| Json faucet tests
*/
'use strict';


const JsonFaucet = require( './stream/JsonFaucet' );
const { EventEmitter } = require('events');

let f;

const run =
	async function( )
{
	f = new JsonFaucet( );
	await f.beginDocument( );
	for( let a = 0; a < 100; a++ )
	{
		await f.writeAttribute( 'a' + a, a );
	}
	await f.endDocument( );
};

run( ).catch( ( error ) => { throw error; } );

const ev1 = new EventEmitter( ).on( 'event', ( e ) =>
	{
		console.log( 'piping' );
		f.pipe( process.stdout );
	}
);

const ev2 = new EventEmitter( ).on( 'event', ( e ) =>
	{
		console.log( 'exiting' );
	}
);

setTimeout( ( ) => ev1.emit( 'event', 'fired!' ), 1000 );
setTimeout( ( ) => ev2.emit( 'event', 'fired!' ), 4000 );
