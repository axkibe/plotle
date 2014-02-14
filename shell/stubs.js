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
	meshverse,
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
	meshverse.grow(
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


Stubs.emptyNote =
	meshverse.grow(
		{
			'type' :
				'Note',

			'fontsize' :
				theme.note.fontsize, // FIXME

			'zone' :
				{
					type :
						'Rect',

					pnw :
						Euclid.Point.zero,

					pse :
						Euclid.Point.zero
				},

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
									''
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
	meshverse.grow(
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


} )( );
