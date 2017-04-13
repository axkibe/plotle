/*
| Default design for the non-existing-space form.
*/


var
	form_nonExistingSpace,
	gleam_point,
	gleam_rect,
	gruga_genericButton,
	gruga_nonExistingSpace,
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
gruga_nonExistingSpace =
	form_nonExistingSpace.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add',
		'message1',
			widget_label.abstract(
				'text', 'Do you want to create it?',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add',
		'noButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -100, 28 ),
						'width', 75,
						'height', 75
					),
				'text', 'No',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'yesButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 25, 28 ),
						'width', 75,
						'height', 75
					),
				'text', 'Yes',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


if( FREEZE ) Object.freeze( gruga_nonExistingSpace );


} )( );
