/*
| Default design for the space form.
*/


var
	euclid_anchor_ellipse,
	euclid_point,
	euclid_rect,
	form_space,
	gruga_genericButton,
	gruga_space,
	shell_fontPool,
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
gruga_space =
	form_space.abstract(
		'twig:add', 'headline',
			widget_label.abstract(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', euclid_point.xy( 0, -120 )
			),
		'twig:add', 'message1',
			widget_label.abstract(
				'text', 'In future space settings can be altered here.',
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
