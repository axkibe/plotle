/*
| Models
*/


var
	euclid_point,
	euclid_view,
	fabric_doc,
	fabric_label,
	fabric_para,
	gruga_label,
	jion,
	shell_models,
	visual_label;


/*
| Capsule
*/
( function() {

'use strict';


/*
| Constructor.
*/
shell_models = { };


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


} )( );
