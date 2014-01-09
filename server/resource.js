/*
| Something to be REST-served.
|
| FIXME: immute
|
| Authors: Axel Kittenberger
*/

/*
| Capsule (to make jshint happy)
*/
(function( ) {
'use strict';


if( typeof( require ) === 'undefined' )
{
	throw new Error(
		'this code requires node!'
	);
}


/*
| Constructor.
|
| opts ... a string, a letter including says:
|
|   b ... included in the bundle
|   c ... serve as cached
|   f ... serve from file
|   m ... keep in memory
*/
var
Resource =
	function(
		path,
		opts
	)
{
	// the resource's path
	this.path =
		path;

	// served as binary or utf-u8
	this.code =
		null;

	// the compressed version of this code (if supported)
	this.gzip =
		null;

	// the mime-code of the resource
	this.mime =
		null;

	// the content to be served if held in memory
	this.data  =
		null;

	// the options for this resource
	this.opts   =
	{
		// tells the client to cache the resource
		cache :
			opts.indexOf( 'c' ) >= 0,

		// the servers hold this resource in memory
		memory :
			opts.indexOf( 'm' ) >= 0,

		// the server reads this resource from the file on every access
		// (used for debugging resources)
		file :
			opts.indexOf( 'f' ) >= 0,

		// this resource is part of the bunlde
		bundle :
			opts.indexOf( 'b' ) >= 0
	};

	if( this.opts.file )
	{
		// the alias is the path the file is served as
		// this replaces directories with hypens to ease
		// debugging
		this.alias =
			path.replace( /\//g, '-' );
	}
	else
	{
		this.alias =
			path;
	}


	if( !this.opts.memory && !this.opts.file )
	{
		throw new Error(
			'resource "' + '" has neither memory or file set'
		);
	}

	var
		type =
			path.split( '.' )[ 1 ];

	switch( type )
	{
		case 'css' :
			// cascading style sheet

			this.code =
				'utf-8';

			this.mime =
				'text/css';

			break;

		case 'eot' :
			// some font

			this.code =
				'binary';

			this.mime =
				'font/eot';

			break;

		case 'html' :
			// hypertext

			this.code =
				'utf-8';

			this.mime =
				'text/html';

			break;

		case 'ico' :
			// icon

			this.code =
				'binary';

			this.mime =
				'image/x-icon';

			break;

		case 'js' :
			// javascript

			this.code =
				'utf-8';

			this.mime =
				'text/javascript';

			break;

		case 'otf'  :
			// some font

			this.code =
				'binary';

			this.mime =
				'font/otf';

			break;

		case 'svg'  :
			// some font

			this.code =
				'utf-8';

			this.mime =
				'image/svg+xml';

			break;

		case 'ttf'  :
			// some font

			this.code =
				'binary';

			this.mime =
				'font/ttf';

			break;

		case 'woff' :
			// some font

			this.code =
				'binary';

			this.mime =
				'application/font-woff';

			break;

		default :
			throw new Error(
				'unknown file type: ' + type
			);
	}
};


/*
| Node export
*/
module.exports =
	Resource;

} )( );
