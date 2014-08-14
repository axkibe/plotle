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
			euclid.point.zero,
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
			euclid.rect.create(
				'pnw',
					euclid.point.zero,
				'pse',
					euclid.point.zero
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
