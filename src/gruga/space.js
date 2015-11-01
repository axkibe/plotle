/*
| Default design for the space form.
*/


var
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	form_space,
	gruga_genericButtonFacets,
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
	form_space.create(
		'twig:add', 'headline',
			widget_label.create(
				'text', '',
				'font', shell_fontPool.get( 22, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -120
					)
			),
		'twig:add', 'message1',
			widget_label.create(
				'text', 'In future space settings can be altered here.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add', 'closeButton',
			widget_button.create(
				'facets', gruga_genericButtonFacets,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', closeButton.w,
								'y', closeButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', closeButton.w + closeButton.width,
								'y', closeButton.n + closeButton.height
							)
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
				'shape', euclid_anchor_ellipse.fullSkewNW
			)
	);

} )( );
