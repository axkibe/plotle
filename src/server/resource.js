/*
| Something to be REST-served.
*/
'use strict';


tim.define( module, ( def, server_resource ) => {


if( TIM )
{
	def.attributes =
	{
		// the list of aliases this is served under
		// by default determined from filePath
		aliases : { type : [ 'undefined', 'tim.js/stringList' ] },

		// "binary" or "utf-8"
		// by default determined from file extension
		coding : { type : [ 'undefined', 'string' ] },

		// cached or auto generated data
		data : { type : [ 'undefined', 'protean', 'string' ] },

		// if true is only loaded in devel mode
		devel : { type : 'boolean', defaultValue : 'false' },

		// path of the resources file
		filePath : { type : [ 'undefined', 'string' ] },

		// true if this resource is a typed immutable
		hasTim : { type : 'boolean', defaultValue : 'false' },

		// true if this has json
		hasJson : { type : 'boolean', defaultValue : 'false' },

		// true if this resource is in the bundle
		inBundle : { type : 'boolean', defaultValue : 'false' },

		// true if this resource is in the testpad
		inTestPad : { type : 'boolean', defaultValue : 'false' },

		// "none", "short" or "long"
		maxage : { type : 'string', defaultValue : '"none"' },

		// mime type
		// by default determined from file extension
		mime : { type : [ 'undefined', 'string' ] },

		// post processor replacing stuff
		postProcessor : { type : [ 'undefined', 'string' ] },

		// realpath of the resource base
		realpath : { type : [ 'undefined', 'string' ] },

		// the resource of a sourcemap if applicable
		sourceMap : { type : [ 'undefined', './resource' ] },

		// in devel mode timestamp when resource cached
		timestamp : { type : [ 'undefined', 'date' ] },

		// the resource a tim is genereated from
		timHolder : { type : [ 'undefined', './resource' ] },

		// cached or auto generated zip data
		_cache : { type : 'protean', defaultValue : '{ }' },
	};
}


const resume = require( 'suspend' ).resume;

const server_fileTypes = require( './fileTypes' );

const stringList = require( 'tim.js/src/string/list' ).stringList;

const zlib = require( 'zlib' );


/*
| Returns the default alias for a filePath
*/
def.static.filePathAlias =
	function(
		filePath
	)
{
	return filePath.replace( /\//g, '-' );
};


/*
| The alias is are the paths the file is served as
| directories are replaced with hypens to ease debugging
*/
def.adjust.aliases =
	function(
		aliases
	)
{
	return aliases || stringList( [ server_resource.filePathAlias( this.filePath ) ] );
};


/*
| The file coding is either specified manually
| or derived from file extension.
*/
def.adjust.coding =
	function(
		coding
	)
{
	return coding || server_fileTypes.coding( this.fileExt );
};


/*
| The file extension.
*/
def.lazy.fileExt =
	function( )
{
	const fp = this.filePath;

	if( !fp ) return;

	return fp.substr( fp.lastIndexOf( '.' ) + 1 );
};


/*
| Returns the gzipped data.
*/
def.proto.gzip =
	function*( )
{
	const cache = this._cache;

	let cg = cache.gzip;

	if( cg && cache.data === this.data ) return cg;

	cache.data = undefined;

	cg = cache.gzip = yield zlib.gzip( this.data, resume( ) );

	cache.data = this.data;

	return cg;
};


/*
| The mime is either specified manually
| or derived from file extension.
*/
def.adjust.mime =
	function(
		mime
	)
{
	return mime || server_fileTypes.mime( this.fileExt );
};


} );
