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
	euclid,
	theme,
	visual;


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
	visual.Label.create(
		'pnw',
			euclid.point.zero,
		'fontsize',
			theme.note.fontsize, // FIXME
		'doc',
			visual.Doc.create(
				'twig:add',
				'1',
				visual.Para.create(
					'text',
						'Label'
				)
			)
	);


Stubs.emptyNote =
	visual.Note.create(
		'fontsize',
			theme.note.fontsize, // FIXME
		'zone',
			euclid.rect.create(
				'pnw',
					euclid.point.zero,
				'pse',
					euclid.point.zero
			),
		'doc',
			visual.Doc.create(
				'twig:add',
				'1',
				visual.Para.create(
					'text',
						''
				)
			)
	);


Stubs.emptyPortal =
	visual.Portal.create(
		'zone',
			euclid.rect.create(
				'pnw',
					euclid.point.zero,
				'pse',
					euclid.point.zero
			),
		'spaceUser',
			'',
		'spaceTag',
			''
	);


} )( );
