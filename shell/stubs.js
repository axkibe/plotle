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
	Meshverse,
	Tree;


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
	new Tree(
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
		},

		Meshverse
	);


Stubs.emptyDoc =
	new Tree(
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
		},

		Meshverse
	);

} )( );
