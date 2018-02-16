/*
| Something to be REST-served.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


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
		data : { type : [ 'undefined', 'protean' ] },

		// if true is only loaded in devel mode
		devel : { type : 'boolean', defaultValue : 'false' },

		// path of the resources file
		filePath : { type : [ 'undefined', 'string' ] },

		// cached or auto generated zip data
		gzip : { type : [ 'undefined', 'protean' ] },

		// true if this resource is a typed immutable
		hasTim : { type : 'boolean', defaultValue : 'false' },

		// true if this has json
		hasJson : { type : 'boolean', defaultValue : 'false' },

		// true if this resource is in the bundle
		inBundle : { type : 'boolean', defaultValue : 'false' },

		// true if this resource is in the testpad
		inTestPad : { type : 'boolean', defaultValue : 'false' },

		// true if this a timtree leaf but not a tim.
		isLeaf : { type : 'boolean', defaultValue : 'false' },

		// "none", "short" or "long"
		maxage : { type : 'string', defaultValue : '"none"' },

		// mime type
		// by default determined from file extension
		mime : { type : [ 'undefined', 'string' ] },

		// post processor replacing stuff
		postProcessor : { type : [ 'undefined', 'string' ] },

		// realpath of the resource base
		realpath : { type : [ 'undefined', 'string' ] },

		// in devel mode timestamp when resource cached
		timestamp : { type : [ 'undefined', 'date' ] },

		// the resource a tim is genereated from
		timHolder : { type : [ 'undefined', './resource' ] },

		// if hasTim the tim id string
		timId : { type : [ 'undefined', 'string' ] },
	};

	def.init = [ ];
}


const server_fileTypes = require( './fileTypes' );

const stringList = tim.import( 'tim.js', 'stringList' ).stringList;


/*
| Initializer.
*/
def.func._init =
	function( )
{
	const filePath = this.filePath;

	// the alias is are the paths the file is served as
	// directories are replaced with hypens to ease debugging
	if( !this.aliases )
	{
		this.aliases = stringList( [ filePath.replace( /\//g, '-' ) ] );
	}

	if( !this.coding )
	{
		this.coding = server_fileTypes.coding( this.fileExt );
	}

	if( !this.mime )
	{
		this.mime = server_fileTypes.mime( this.fileExt );
	}
};


/*
| The file extension
*/
def.lazy.fileExt =
	function( )
{
	const fp = this.filePath;

	if( !fp ) return;

	return fp.substr( fp.lastIndexOf( '.' ) + 1 );
};


} );

