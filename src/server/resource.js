/*
| Something to be REST-served.
|
| Authors: Axel Kittenberger
*/

/*
| Capsule (to make jshint happy)
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Resource',
		attributes :
			{
				opstr :
					{
						comment :
							'options string',
						type :
							'String',
						assign :
							null
					},
				maxage :
					{
						comment :
							'"none", "short" or "long"',
						type :
							'String',
						defaultVal :
							'\'none\''
					},
				filepath :
					{
						comment :
							'path of the resources file',
						type :
							'String'
					},
				hasJoobj :
					{
						comment :
							'true if this resource has a joobj def.',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				inBundle :
					{
						comment :
							'true if this resource is in the bundle',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
				permanent :
					{
						comment :
							'if true tells browser to cache for a while',
						type :
							'Boolean',
						defaultVal :
							'false'
					},
			},
		node :
			true,
		init :
			[
				'opstr'
			]
	};
}


/*
| Imports
*/
var
	Jools =
		require( '../jools/jools' ),

	Resource =
		require( '../joobj/this' )( module );


/*
| Initializer
|
| opstr ... a string, a letter including says:
|
|   b ... included in the bundle
|   c ... serve as cached
|   f ... serve from file
|   j ... includes a joobj definition
|   m ... keep in memory
*/
Resource.prototype._init =
	function(
		opstr
	)
{
	var
		filepath =
			this.filepath;

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
		// the server reads this resource from the file on every access
		// (used for debugging resources)
		file :
			opstr.indexOf( 'f' ) >= 0,

		// the servers hold this resource in memory
		memory :
			opstr.indexOf( 'm' ) >= 0
	};

	if( this.opts.file )
	{
		// the alias is the path the file is served as
		// this replaces directories with hypens to ease
		// debugging
		this.alias =
			filepath.replace( /\//g, '-' );
	}
	else
	{
		this.alias =
			filepath;
	}


	if( !this.opts.memory && !this.opts.file )
	{
		throw new Error(
			'resource "' + '" has neither memory or file set'
		);
	}

	var
		type =
			filepath.split( '.' )[ 1 ];

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
| The alias the joobj is served under (if)
*/
Jools.lazyValue(
	Resource.prototype,
	'joobjAlias',
	function( )
	{
		return (
			this.hasJoobj
				?
				( 'joobj-' + this.alias )
				:
				null
		);
	}
);


/*
| Node export
*/
module.exports =
	Resource;



} )( );
