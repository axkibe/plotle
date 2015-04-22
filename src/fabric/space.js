/*
| A space.
*/

var
	fabric_space,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'fabric_space',
		attributes :
		{
			path :
			{
				comment : 'the path of the space',
				type : [ 'undefined', 'jion$path' ]
			},
			ref :
			{
				comment : 'reference to this space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			}
		},
		json : true,
		init : [ 'inherit', 'twigDup' ],
		twig :
		[
			'fabric_note',
			'fabric_label',
			'fabric_relation',
			'fabric_portal'
		]
	};
}


var
	prototype;


if( NODE )
{
	fabric_space = require( 'jion' ).this( module, 'source' );

	fabric_space.prototype._init = function( ){ };

	return;
}


prototype = fabric_space.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		k,
		path,
		twig;

	if( !this.path )
	{
		this.path = jion.path.empty.append( 'space' );
	}

	twig = twigDup ? this._twig : jion.copy( this._twig );

	for( k in twig )
	{
		path = twig[ k ].path;

		if( !path )
		{
			path = this.path.append( 'twig' ).appendNC( k );
		}

		twig[ k ] = twig[ k ].create( 'path', path );
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


} )( );

