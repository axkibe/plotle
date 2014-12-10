/*
| Fixed tree stubs.
*/


var
	euclid_point,
	euclid_rect,
	fabric_note,
	fabric_portal,
	shell_stubs,
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
shell_stubs = { };


shell_stubs.emptyLabel =
	visual.label.create(
		'pnw',
			euclid_point.zero,
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


shell_stubs.emptyNote =
	fabric_note.create(
		'fontsize',
			theme.note.fontsize, // FIXME
		'zone',
			euclid_rect.create(
				'pnw', euclid_point.zero,
				'pse', euclid_point.zero
			),
		'doc',
			visual.doc.create(
				'twig:add', '1', visual.para.create( 'text', '' )
			)
	);


shell_stubs.emptyPortal =
	fabric_portal.create(
		'zone',
			euclid_rect.create(
				'pnw', euclid_point.zero,
				'pse', euclid_point.zero
			),
		'spaceUser',
			'',
		'spaceTag',
			''
	);


} )( );
