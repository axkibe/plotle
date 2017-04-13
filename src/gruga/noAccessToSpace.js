/*
| Default design for no-access-to-space form.
*/


var
	form_noAccessToSpace,
	gleam_point,
	gleam_rect,
	gruga_genericButton,
	gruga_noAccessToSpace,
	shell_fontPool,
	widget_button,
	widget_label;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Layout
*/
gruga_noAccessToSpace =
	form_noAccessToSpace.abstract(
		'twig:add', 'headline',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add', 'message1',
			widget_label.abstract(
				'text', 'Sorry, you cannot port to this space or create it.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add', 'okButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 38 ),
						'width', 50,
						'height', 50
					),
				'text', 'ok',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


if( FREEZE ) Object.freeze( gruga_noAccessToSpace );


} )( );
