/*
| A paragraph.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'fabric_para',
		attributes :
		{
			path :
			{
				comment : 'the path of the para',
				type : [ 'undefined', 'jion$path' ]
			},
			text :
			{
				comment : 'the paragraphs text',
				json : true,
				type : 'string'
			}
		}
	};
}


var
	fabric_para,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	fabric_para = jion.this( module, 'source' );

	return;
}


prototype = fabric_para.prototype;


/*
| Shortcut to the para's key.
| It is the last path entry.
*/
jion.lazyValue(
	prototype,
	'key',
	function( )
	{
		return this.path.get( -1 );
	}
);


/*
| The path to the .text attribute
*/
jion.lazyValue(
	prototype,
	'textPath',
	function( )
	{
		return this.path && this.path.append( 'text' );
	}
);


} )( );
