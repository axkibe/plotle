/*
| Default design for the welcome form.
*/


var
	design_ellipse,
	design_point,
	design_rect,
	shell_fontPool,
	form_welcome,
	gruga_genericButtonFacets,
	gruga_welcome,
	widget_button,
	widget_label;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	/*
	| Close control
	*/
	closeButton =
	{
		width : 50,
		height : 50,
		w : 180,
		n : 38
	};


/*
| Layout
*/
gruga_welcome =
	form_welcome.create(
		'twig:add', 'headline',
			widget_label.create(
				'text', 'welcome',
				'font', shell_fontPool.get( 22, 'ca' ),
				'designPos',
					design_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -120
					)
			),
		'twig:add', 'message1',
			widget_label.create(
				'text', 'Your registration was successful :-)',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					design_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add', 'closeButton',
			widget_button.create(
				'facets', gruga_genericButtonFacets,
				'designFrame',
					design_rect.create(
						'pnw',
							design_point.create(
								'anchor', 'c',
								'x', closeButton.w,
								'y', closeButton.n
							),
						'pse',
							design_point.create(
								'anchor', 'c',
								'x', closeButton.w + closeButton.width,
								'y', closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', design_point.c,
				'shape', design_ellipse.fullSkewNW
			)
	);


} )( );
