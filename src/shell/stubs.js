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
	theme,
	Visual;


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
	Visual.Label.create(
		'pnw',
			Euclid.Point.zero,
		'fontsize',
			theme.note.fontsize, // FIXME
		'doc',
			Visual.Doc.create(
				'twig:add',
				'1',
				Visual.Para.create(
					'text',
						'Label'
				)
			)
	);


Stubs.emptyNote =
	Visual.Note.create(
		'fontsize',
			theme.note.fontsize, // FIXME
		'zone',
			Euclid.Rect.create(
				'pnw',
					Euclid.Point.zero,
				'pse',
					Euclid.Point.zero
			),
		'doc',
			Visual.Doc.create(
				'twig:add',
				'1',
				Visual.Para.create(
					'text',
						''
				)
			)
	);


Stubs.emptyPortal =
	Visual.Portal.create(
		'zone',
			Euclid.Rect.create(
				'pnw',
					Euclid.Point.zero,
				'pse',
					Euclid.Point.zero
			),
		'spaceUser',
			'',
		'spaceTag',
			''
	);


} )( );
