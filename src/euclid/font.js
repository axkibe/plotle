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
	Jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
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
			},

		hasJSON :
			true
	};
}


/*
| The CSS-string for this font.
*/
Jools.lazyValue(
	Euclid.Font.prototype,
	'css',
	function( )
	{
		return this.size + 'px ' + this.family;
	}
);

})( );
