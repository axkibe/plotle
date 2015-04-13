/*
| A poition in a text.
*/


var
	mark_text;


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'mark_text',
		attributes :
		{
			path :
			{
				comment : 'path of the caret',
				type : 'jion$path'
			},
			at :
			{
				comment : 'offset of the caret',
				type : 'integer'
			}
		},
		init : [ ]
	};
}


var
	prototype;


if( NODE )
{
	mark_text = require( 'jion' ).this( module, 'source' );
}


prototype = mark_text.prototype;


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
