/*
| Models
*/


var
	euclid_point,
	euclid_rect,
	euclid_view,
	fabric_doc,
	fabric_label,
	fabric_para,
	fabric_portal,
	gruga_label,
	jion,
	shell_models,
	visual_label,
	visual_portal;


/*
| Capsule
*/
( function() {

'use strict';


/*
| Constructor.
*/
shell_models = { };


/*
| The label model.
*/
jion.lazyStaticValue(
	shell_models,
	'label',
	function( )
{
	return(
		visual_label.create(
			'fabric',
				fabric_label.create(
					'pnw', euclid_point.zero,
					'fontsize', gruga_label.defaultFontsize,
					'doc',
						fabric_doc.create(
							'twig:add', '1',
							fabric_para.create( 'text', 'Label' )
						)
				),
			'view', euclid_view.proper
		)
	);
}
);


/*
| The portal model.
*/
jion.lazyStaticValue(
	shell_models,
	'portal',
	function( )
{
	return(
		visual_portal.create(
			'fabric',
				fabric_portal.create(
					'zone',
						euclid_rect.create(
							'pnw', euclid_point.zero,
							'pse', euclid_point.zero
						),
					'spaceUser', '',
					'spaceTag', ''
				),
			'view', euclid_view.proper
		)
	);
}
);


} )( );
