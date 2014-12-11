/*
| Fixed tree stubs.
*/


var
	euclid_point,
	euclid_rect,
	fabric_doc,
	fabric_label,
	fabric_note,
	fabric_para,
	fabric_portal,
	shell_stubs,
	theme;


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
	fabric_label.create(
		'pnw', euclid_point.zero,
		'fontsize', theme.note.fontsize, // FIXME
		'doc',
			fabric_doc.create(
				'twig:add',
				'1',
				fabric_para.create(
					'text', 'Label'
				)
			)
	);


shell_stubs.emptyNote =
	fabric_note.create(
		'fontsize', theme.note.fontsize, // FIXME
		'zone',
			euclid_rect.create(
				'pnw', euclid_point.zero,
				'pse', euclid_point.zero
			),
		'doc',
			fabric_doc.create(
				'twig:add', '1', fabric_para.create( 'text', '' )
			)
	);


shell_stubs.emptyPortal =
	fabric_portal.create(
		'zone',
			euclid_rect.create(
				'pnw', euclid_point.zero,
				'pse', euclid_point.zero
			),
		'spaceUser', '',
		'spaceTag', ''
	);


} )( );
