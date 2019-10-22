/*
| Connector using the nano driver
| to access a plotle repository on couchDB.
*/
'use strict';


tim.define( module, ( def, database_pouchdb ) => {


if( TIM )
{
	def.attributes =
	{
		// the express app
		_app : { type : 'function' },

		// the express server (returned by listen)
		_server : { type : 'protean' },
	};
}

const killable = tim.require( 'killable' );
const pouchdb = tim.require( 'pouchdb' );
const express = tim.require( 'express' );
const expressPouchDB = tim.require( 'express-pouchdb' );

const config = tim.require( '../config/intf' );
const log = tim.require( '../server/log' );


/*
| Starts a pouchdb server.
*/
def.static.start =
	function( )
{
	log.log( 'starting pouchdb server' );
	const app = express( );
	const port = config.get( 'database', 'pouchdb', 'port' );
	const host = config.get( 'database', 'pouchdb', 'host' );
	const dir = config.get( 'database', 'pouchdb', 'dir' );
	log.log( '  host: ' + host );
	log.log( '  dir: ' + dir );
	log.log( '  port: ' + port );
	const server = app.listen( port, host );
	killable( server );
	const db = pouchdb.defaults( { prefix: dir } );
	app.use( '/', expressPouchDB( db ) );
	return database_pouchdb.create( '_app', app, '_server', server );
};


/*
| Shuts down a pouchdb server.
*/
def.proto.shutdown =
	function( )
{
	log.log( 'shutting down pouchdb server' );
	this._server.kill( );
};


} );
