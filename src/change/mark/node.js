/*
| A node mark.
*/


var
	change_mark_node;


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
		id : 'change_mark_node',
		attributes :
		{
			path :
			{
				comment : 'path of the mark',
				type : 'jion$path'
			}
		},
		init : [ ]
	};
}


var
	prototype;


if( NODE )
{
	change_mark_node = require( 'jion' ).this( module, 'source' );
}


prototype = change_mark_node.prototype;


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
/**/}

};


} )( );
