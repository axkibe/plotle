/*
| A font face style.
*/


var
	euclid_font,
	jools;


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
	return {
		id :
			'euclid_font',
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
						type : [ 'string', 'euclid_color' ]  // FIXME
					},
				base :
					{
						comment : 'vertical alignment',
						type : 'string'
					}
			}
	};
}


/*
| The CSS-string for this font.
*/
jools.lazyValue(
	euclid_font.prototype,
	'css',
	function( )
	{
		return this.size + 'px ' + this.family;
	}
);

})( );
