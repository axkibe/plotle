/*
| Fixed tree stubs.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Stubs =
		null;

/*
| Imports
*/
var
	shellverse;


/*
| Capsule
*/
( function() {

'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
Stubs = { };


Stubs.labelDoc =
	shellverse.grow(
		{
			type:
				'Doc',

			twig :
				{
					'1' :
						{
							type :
								'Para',

							text :
								'Label'
						}
				},

			ranks :
				[
					'1'
				]
		}
	);


Stubs.emptyDoc =
	shellverse.grow(
		{
			type:
				'Doc',

			twig :
				{
					'1' :
						{
							type :
								'Para',

							text :
								''
						}
				},

			ranks :
				[
					'1'
				]
		}
	);


} )( );
