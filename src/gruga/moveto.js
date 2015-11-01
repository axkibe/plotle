/*
| Default design for the the move-to-form.
*/


var
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	euclid_facet,
	euclid_facetRay,
	euclid_border,
	euclid_color,
	form_moveTo,
	gruga_moveTo,
	portalButtonFacets,
	shell_fontPool,
	widget_button,
	widget_label;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	ideoloomHomeButton =
	{
		w : -145,
		n : -100,
		width : 130,
		height : 130
	},

	ideoloomSandboxButton =
	{
		w : 15,
		n : -100,
		width : 130,
		height : 130
	},

	userHomeButton =
	{
		w : -145,
		n : 60,
		width : 130,
		height : 130
	};


portalButtonFacets =
	euclid_facetRay.create(
		'ray:init',
		[
			// default state.
			euclid_facet.create(
				'group:init', { },
				'fill', euclid_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgb( 255, 141, 66 )
					)
			),
			// hover
			euclid_facet.create(
				'group:init', { 'hover' : true },
				'fill', euclid_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					euclid_border.create(
						'width', 1.5,
						'color', euclid_color.rgb( 255, 141, 66 )
					)
			),
			// focus
			euclid_facet.create(
				'group:init', { 'focus' : true },
				'fill', euclid_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 1.5,
						'color', euclid_color.rgb( 255, 99, 188 )
					)
			),
			// focus and hover
			euclid_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', euclid_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					euclid_border.create(
						'distance', 1,
						'width', 1.5,
						'color', euclid_color.rgb( 255, 99, 188 )
					)
			)
		]
	);


/*
| Layout
*/
gruga_moveTo =
	form_moveTo.create(
		'twig:add',
		'headline',
			widget_label.create(
				'text', 'move to another space',
				'font', shell_fontPool.get( 22, 'ca' ),
				'designPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -150
					)
			),
		'twig:add',
		'ideoloomHomeButton',
			widget_button.create(
				'facets', portalButtonFacets,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', ideoloomHomeButton.w,
								'y', ideoloomHomeButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x',
									ideoloomHomeButton.w
									+ ideoloomHomeButton.width,
								'y',
									ideoloomHomeButton.n
									+ ideoloomHomeButton.height
							)
					),
				'text', 'ideoloom\nhome',
				'textNewline', 25,
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', 0
					),
				'shape', euclid_anchor_ellipse.fullSkewNW
			),
		'twig:add',
		'ideoloomSandboxButton',
			widget_button.create(
				'facets', portalButtonFacets,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', ideoloomSandboxButton.w,
								'y', ideoloomSandboxButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x',
									ideoloomSandboxButton.w +
									ideoloomSandboxButton.width,
								'y',
									ideoloomSandboxButton.n +
									ideoloomSandboxButton.height
							)
					),
				'text', 'ideoloom\nsandbox',
				'textNewline', 25,
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', 0
					),
				'shape', euclid_anchor_ellipse.fullSkewNW
			),
		'twig:add',
		'userHomeButton',
			widget_button.create(
				'facets', portalButtonFacets,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', userHomeButton.w,
								'y', userHomeButton.n
							),
						'pse',
							euclid_anchor_point.create(
								'anchor', 'c',
								'x', userHomeButton.w + userHomeButton.width,
								'y', userHomeButton.n + userHomeButton.height
							)
					),
				'text', 'your\nhome',
				'textNewline', 25,
				'font', shell_fontPool.get( 14, 'cm' ),
				'textDesignPos',
					euclid_anchor_point.create(
						'anchor', 'c',
						'x', 0,
						'y', 0
					),
				'shape', euclid_anchor_ellipse.fullSkewNW
			)
	);

} )( );
