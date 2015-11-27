/*
| A position in a text.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_mark_text',
		attributes :
		{
			path :
			{
				comment : 'path of the mark',
				type : 'jion$path'
			},
			at :
			{
				comment : 'offset of the mark',
				type : 'integer'
			}
		},
		init : [ ]
	};
}


var
	change_mark_text;


/*
| Capsule
*/
(function() {
'use strict';


var
	prototype;


if( NODE )
{
	change_mark_text = require( 'jion' ).this( module, 'source' );
}


prototype = change_mark_text.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( this.path.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( this.at < 0 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

};


} )( );
