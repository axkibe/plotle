/*
| Connector using the nano driver
| to access a plotle repository on couchDB.
*/
'use strict';


tim.define( module, ( def ) => {

def.abstract = true;

const pouchdb = tim.require( 'pouchdb' );
const express = tim.require( 'express' );
const expressPouchDB = tim.require( 'express-pouchdb' );

const config = tim.require( '../config/intf' );
const log = tim.require( '../server/log' );

def.static.start =
	async function( )
{
	log.log( 'starting pouchdb server' );
	const app = express( );
	const port = config.get( 'database', 'pouchdb', 'port' );
	const host = config.get( 'database', 'pouchdb', 'host' );
	const dir = config.get( 'database', 'pouchdb', 'dir' );
	log.log( '  host: ' + host );
	log.log( '  dir: ' + dir );
	log.log( '  port: ' + port );
	app.listen( port, host );
	const db = pouchdb.defaults( { prefix: dir } );
	app.use( '/', expressPouchDB( db ) );
};


} );
