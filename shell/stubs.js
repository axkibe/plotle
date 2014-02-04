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
	Euclid,
	shellverse,
	theme;


/*
| Capsule
*/
( function() {

'use strict';


/*
| Constructor.
*/
Stubs = { };


Stubs.emptyLabel =
	shellverse.grow(
		{
			'type' :
				'Label',

			'pnw' :
				Euclid.Point.zero,

			'fontsize' :
				theme.note.fontsize, // FIXME

			'doc' :
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
		}
	);


Stubs.emptyPortal =
	shellverse.grow(
		{
			'type' :
				'Portal',

			'zone' :
				{
					type :
						'Rect',

					pnw :
						Euclid.Point.zero,

					pse :
						Euclid.Point.zero
				},

			'spaceUser' :
				'',

			'spaceTag' :
				''
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
