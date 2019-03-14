/*
| The roster of all resources.
*/
'use strict';


tim.define( module, ( def ) => {


const server_resource = tim.require( './resource' );

const server_resourceList = tim.require( './resourceList' );

const stringList = tim.require( 'tim.js/stringList', 'NOW' ).stringList;


def.staticLazy.roster = ( ) =>
server_resourceList.create(
	'list:init',
	[
	server_resource.create(
		'aliases', stringList( [ 'opentype.js' ] ),
		'filePath', 'node_modules/opentype.js/dist/opentype.js',
		'maxage', 'long',
		'postProcessor', 'opentype'
	),
	server_resource.create(
		'aliases', stringList( [ 'opentype.min.js' ] ),
		'filePath', 'node_modules/opentype.js/dist/opentype.min.js',
		'maxage', 'long',
		'postProcessor', 'opentypeMin'
	),
	server_resource.create(
		'aliases', stringList( [ 'plotle.html', 'index.html', '' ] ),
		'filePath', 'media/plotle.html',
		'maxage', 'short',
		'postProcessor', 'indexHtml'
	),
	server_resource.create(
		'aliases', stringList( [ 'devel.html' ] ),
		'filePath', 'media/devel.html',
		'devel', true,
		'postProcessor', 'develHtml'
	),
	server_resource.create(
		'aliases', stringList( [ 'favicon.ico', 'media-favicon.ico' ] ),
		'filePath', 'media/favicon.ico',
		'maxage', 'long'
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-browser-init.js' ] ),
		'coding', 'utf-8',
		'data', tim.source.browserInit,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-proto.js' ] ),
		'coding', 'utf-8',
		'data', tim.source.proto,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-common.js' ] ),
		'coding', 'utf-8',
		'data', tim.source.common,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-catalog-init.js' ] ),
		'coding', 'utf-8',
		'data', undefined,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-browser-catalog.js' ] ),
		'coding', 'utf-8',
		'data', tim.source.browserCatalog,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'filePath', 'media/cursor.css',
		'maxage', 'long'
	),
	server_resource.create(
		'filePath', 'font/DejaVuSans-Regular.ttf',
		'maxage', 'long'
	),
	server_resource.create(
		'aliases', stringList( [ 'testpad.html' ] ),
		'filePath', 'media/testpad.html',
		'devel', true,
		'postProcessor', 'testPadHtml'
	),
	]
);


} );

