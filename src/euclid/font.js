/*
| A font face style.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'euclid_font',
		hasAbstract : true,
		attributes :
		{
			size :
			{
				comment : 'font size',
				type : 'number'
			},
			family :
			{
				comment : 'font family',
				type : 'string'
			},
			align :
			{
				comment : 'horizonal alignment',
				type : 'string'
			},
			fill :
			{
				comment : 'font color',
				type : 'gleam_color'
			},
			base :
			{
				comment : 'vertical alignment',
				type : 'string'
			}
		}
	};
}


var
	euclid_font,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


/*
| The CSS-string for this font.
*/
jion.lazyValue(
	euclid_font.prototype,
	'css',
	function( )
{
	return this.size + 'px ' + this.family;
}
);


})( );
