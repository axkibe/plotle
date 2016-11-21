/*
| Default design for the welcome form.
*/


var
	euclid_anchor_ellipse,
	euclid_point,
	euclid_rect,
	shell_fontPool,
	form_welcome,
	gruga_genericButton,
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
	form_welcome.abstract(
		'twig:add', 'headline',
			widget_label.abstract(
				'text', 'welcome',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', euclid_point.xy( 0, -120 )
			),
		'twig:add', 'message1',
			widget_label.abstract(
				'text', 'Your registration was successful :-)',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', euclid_point.xy( 0, -50 )
			),
		'twig:add', 'closeButton',
			widget_button.abstract(
				'facets', gruga_genericButton.facets,
				'area',
					euclid_rect.create(
						'pnw',
							euclid_point.xy(
								closeButton.w,
								closeButton.n
							),
						'pse',
							euclid_point.xy(
								closeButton.w + closeButton.width,
								closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', euclid_anchor_ellipse.fullSkewNW
			)
	);


} )( );
