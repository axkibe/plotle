/*
| A sequence of paragraphs.
*/


var
	fabric_doc,
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
		id : 'fabric_doc',
		attributes :
		{
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			}
		},
		init : [ 'twigDup' ],
		json : true,
		twig : [ 'fabric_para' ]
	};
}


if( NODE )
{
	jion = require( 'jion' );

	fabric_doc = jion.this( module, 'source' );
}


var
	prototype;

prototype = fabric_doc.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		twigDup
	)
{
	var
		key,
		twig,
		twigPath,
		r,
		ranks,
		rZ;

	ranks = this._ranks;

	twig = twigDup ? this._twig : jion.copy( this._twig );

	twigPath = this.path && this.path.append( 'twig' );

	for( r = 0, rZ = ranks.length; r < rZ; r++ )
	{
		key = ranks[ r ];

		twig[ key ] =
			twig[ key ].create(
				'path', twigPath && twigPath.appendNC( key )
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};



} )( );
