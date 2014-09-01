/*
| A font face style.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	euclid;


euclid = euclid || { };


/*
| Imports
*/
var
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
			'euclid.font',
		attributes :
			{
				size :
					{
						comment :
							'font size',
						type :
							'Number'
					},
				family :
					{
						comment :
							'font family',
						type :
							'String'
					},
				align :
					{
						comment :
							'horizonal alignment',
						type :
							'String'
					},
				fill :
					{
						comment :
							'font color',
						type :
							'String'
					},
				base :
					{
						comment :
							'vertical alignment',
						type :
							'String'
					}
			}
	};
}


/*
| The CSS-string for this font.
*/
jools.lazyValue(
	euclid.font.prototype,
	'css',
	function( )
	{
		return this.size + 'px ' + this.family;
	}
);

})( );
