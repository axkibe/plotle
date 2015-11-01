/*
| Default design for no-access-to-space form.
*/


var
<<<<<<< HEAD
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
=======
	design_ellipse,
	design_rect,
	euclid_anchor_point,
>>>>>>> 6832d631c3ece815944b6ef2754ad99c8386f317
	form_noAccessToSpace,
	gruga_genericButtonFacets,
	gruga_noAccessToSpace,
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
	okButton =
	{
		width : 50,
		height : 50,
		w : 180,
		n : 38
	};


/*
| Layout
*/
gruga_noAccessToSpace =
	form_noAccessToSpace.create(
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
				'text', 'Sorry, you cannot port to this space or create it.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -50
					)
			),
		'twig:add', 'okButton',
			widget_button.create(
				'facets', gruga_genericButtonFacets,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', okButton.w,
								'y', okButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', okButton.w + okButton.width,
								'y', okButton.n + okButton.height
							)
					),
				'text', 'ok',
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos', euclid_anchor_point.c,
<<<<<<< HEAD
				'shape', euclid_anchor_ellipse.fullSkewNW
=======
				'shape', design_ellipse.fullSkewNW
>>>>>>> 6832d631c3ece815944b6ef2754ad99c8386f317
			)
	);


} )( );
