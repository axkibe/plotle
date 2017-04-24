/*
| A text glint for gleam.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_glint_text',
		attributes :
		{
			font :
			{
				comment : 'the font to display the text in',
				type : 'gleam_font'
			},
			p :
			{
				comment : 'where to draw it',
				type : 'gleam_point'
			},
			text :
			{
				comment : 'text to display',
				type : 'string'
			},
			rotate :
			{
				comment : 'if defined rotation in radiant',
				type : [ 'undefined', 'number' ]
			}
		}
	};
}


var
	gleam_glint_text,
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
	require( 'jion' ).this( module, 'source' );

	return;
}


prototype = gleam_glint_text.prototype;


jion.lazyValue(
	prototype,
	'cacheKey',
	function( )
{
	if( !this.rotate ) return this.font.size + ':' + this.text;

	return this.font.size + ':' + this.rotate + ':' + this.text;
}
);


} )( );
