/*
| A font face style.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Euclid;


Euclid =
	Euclid || { };


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
		name :
			'Font',
		unit :
			'Euclid',
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
	Euclid.Font.prototype,
	'css',
	function( )
	{
		return this.size + 'px ' + this.family;
	}
);

})( );
