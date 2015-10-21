/*
| Default design for the non-existing-space form.
*/


var
	design_ellipse,
	design_point,
	design_rect,
	form_nonExistingSpace,
	gruga_genericButtonFacets,
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
	form_nonExistingSpace.create(
		'twig:add',
		'headline',
			widget_label.create(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'designPos',
					design_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -120
					)
			),
		'twig:add',
		'message1',
			widget_label.create(
				'text',
					'Do you want to create it?',
				'font',
					shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add',
		'noButton',
			widget_button.create(
				'facets', gruga_genericButtonFacets,
				'designFrame',
					design_rect.create(
						'pnw',
							design_point.create(
								'anchor', 'c',
								'x', noButton.w,
								'y', noButton.n
							),
						'pse',
							design_point.create(
								'anchor', 'c',
								'x', noButton.w + noButton.width,
								'y', noButton.n + noButton.height
							)
					),
				'text', 'No',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_point.c,
				'shape', design_ellipse.fullSkewNW
			),
		'twig:add',
		'yesButton',
			widget_button.create(
				'facets', gruga_genericButtonFacets,
				'designFrame',
					design_rect.create(
						'pnw',
							design_point.create(
								'anchor', 'c',
								'x', yesButton.w,
								'y', yesButton.n
							),
						'pse',
							design_point.create(
								'anchor', 'c',
								'x', yesButton.w + yesButton.width,
								'y', yesButton.n + yesButton.height
							)
					),
				'text', 'Yes',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_point.c,
				'shape', design_ellipse.fullSkewNW
			)
	);

} )( );
