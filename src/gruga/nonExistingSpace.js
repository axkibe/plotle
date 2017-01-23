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

var
	// 'no' control
	noButton =
	{
		width : 75,
		height : 75,
		w : -100,
		n : 28
	},

	// yes control
	yesButton =
	{
		width : 75,
		height : 75,
		w : 25,
		n : 28
	};


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
				'area',
					gleam_rect.create(
						'pnw',
							gleam_point.xy( noButton.w, noButton.n ),
						'pse',
							gleam_point.xy(
								noButton.w + noButton.width,
								noButton.n + noButton.height
							)
					),
				'text', 'No',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'yesButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'area',
					gleam_rect.create(
						'pnw',
							gleam_point.xy( yesButton.w, yesButton.n ),
						'pse',
							gleam_point.xy(
								yesButton.w + yesButton.width,
								yesButton.n + yesButton.height
							)
					),
				'text', 'Yes',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);

} )( );
