/*
| Default design for the welcome form.
*/


var
	shell_fontPool,
	form_welcome,
	gleam_point,
	gleam_rect,
	gruga_genericButton,
	gruga_welcome,
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
gruga_welcome =
	form_welcome.abstract(
		'twig:add', 'headline',
			widget_label.abstract(
				'text', 'welcome',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add', 'message1',
			widget_label.abstract(
				'text', 'Your registration was successful :-)',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add', 'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 38 ),
						'width', 50,
						'height', 50
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


if( FREEZE ) Object.freeze( gruga_welcome );


} )( );
