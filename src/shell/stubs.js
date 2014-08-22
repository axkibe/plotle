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
	visual.label.create(
		'pnw',
			euclid.point.zero,
		'fontsize',
			theme.note.fontsize, // FIXME
		'doc',
			visual.doc.create(
				'twig:add',
				'1',
				visual.para.create(
					'text',
						'Label'
				)
			)
	);


Stubs.emptyNote =
	visual.note.create(
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
			visual.doc.create(
				'twig:add',
				'1',
				visual.para.create(
					'text',
						''
				)
			)
	);


Stubs.emptyPortal =
	visual.portal.create(
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
