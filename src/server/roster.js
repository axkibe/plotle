/*
| The roster of all resources.
*/
'use strict';


const server_resource = require( './resource' );

const server_resourceList = require( './resourceList' );

const stringList = require( 'tim.js/src/string/list' ).stringList;


module.exports =
server_resourceList.create(
	'list:init',
	[
	server_resource.create(
		'filePath', 'import/opentype.js',
		'maxage', 'long',
		'postProcessor', 'opentype'
	),
	server_resource.create(
		'filePath', 'import/opentype.min.js',
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
		'data', tim.browserSource,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-proto.js' ] ),
		'coding', 'utf-8',
		'data', tim.proto.source,
		'mime', 'text/javascript',
		'inBundle', true,
		'inTestPad', true
	),
	server_resource.create(
		'aliases', stringList( [ 'tim-common.js' ] ),
		'coding', 'utf-8',
		'data', tim.commonSource,
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
		'aliases', stringList( [ 'tim-catalog-browser.js' ] ),
		// FIXME dirty Hack!
		'filePath', 'node_modules/tim.js/src/browser/catalog.js',
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

