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
	Visual.Label.Create(
		'pnw',
			Euclid.Point.zero,
		'fontsize',
			theme.note.fontsize, // FIXME
		'doc',
			Visual.Doc.Create(
				'twig:add',
				'1',
				Visual.Para.Create(
					'text',
						'Label'
				)
			)
	);


Stubs.emptyNote =
	Visual.Note.Create(
		'fontsize',
			theme.note.fontsize, // FIXME
		'zone',
			Euclid.Rect.Create(
				'pnw',
					Euclid.Point.zero,
				'pse',
					Euclid.Point.zero
			),
		'doc',
			Visual.Doc.Create(
				'twig:add',
				'1',
				Visual.Para.Create(
					'text',
						''
				)
			)
	);


Stubs.emptyPortal =
	Visual.Portal.Create(
		'zone',
			Euclid.Rect.Create(
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
