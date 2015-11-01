/*
| Default design of the creation disc.
*/


var
	disc_createDisc,
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	euclid_border,
	euclid_borderRay,
	euclid_color,
	euclid_facet,
	euclid_facetRay,
	euclid_gradient_colorStop,
	euclid_gradient_radial,
	euclid_point,
	gruga_createDisc,
	shell_fontPool,
	widget_button;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	dnw,
	genericButtonFacets,
	genericButtonModel,
	genericButtonSize,
	labelButtonPnw,
	noteButtonPnw,
	portalButtonPnw,
	relationButtonPnw;


dnw = euclid_anchor_point.nw;

noteButtonPnw = dnw.create( 'x', 62, 'y', 216 );

labelButtonPnw = dnw.create( 'x', 81, 'y', 284 );

portalButtonPnw = dnw.create( 'x', 101, 'y', 425 );

relationButtonPnw = dnw.create( 'x', 94, 'y', 354 );

genericButtonSize = euclid_point.create( 'x', 70, 'y', 70 );

genericButtonFacets =
	euclid_facetRay.create(
		'ray:init',
		[
			// default state.
			euclid_facet.create( ),
			// hover
			euclid_facet.create(
				'group:init',
					{ 'hover' : true },
				'fill',
					euclid_color.rgba( 255, 235, 210, 0.7 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// down
			euclid_facet.create(
				'group:init',
					{ 'down' : true },
				'fill',
					euclid_color.rgb( 255, 188, 88 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// down and hover
			euclid_facet.create(
				'group:init',
					{ 'down' : true, 'hover' : true },
				'fill',
					euclid_color.rgb( 255, 188, 88 ),
				'border',
					euclid_border.create(
						'color', euclid_color.rgba( 196, 94, 44, 0.4 )
					)
			)
		]
	);


genericButtonModel =
	widget_button.abstract(
		'facets', genericButtonFacets,
		'font', shell_fontPool.get( 16, 'cm' ),
		'shape', euclid_anchor_ellipse.fullSkewNW,
		'textDesignPos', euclid_anchor_point.c
	);


gruga_createDisc =
	disc_createDisc.abstract(
		'border',
			euclid_borderRay.create(
				'ray:append',
				euclid_border.create(
					'distance', 1,
					'color', euclid_color.rgb( 255, 94, 44 )
				),
				'ray:append',
				euclid_border.create(
					'color', euclid_color.rgb( 94, 94, 0 )
				)
			),
		'designFrame',
			euclid_anchor_rect.create(
				'pnw',
					euclid_anchor_point.w.create( 'x', 0, 'y', -505 ),
				'pse',
					euclid_anchor_point.w.create( 'x', 176, 'y', 505 )
			),
		'shape',
			euclid_anchor_ellipse.create(
				'pnw',
					euclid_anchor_point.e.create(
						'x', -1651,
						'y', -850
					),
				'pse',
					euclid_anchor_point.e.create(
						'x', -1,
						'y', 850
					),
				'gradientPC',
					euclid_anchor_point.e.create(
						'x', -600,
						'y', 0
					),
				'gradientR1', 650
			),
		'fill',
			euclid_gradient_radial.create(
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 0,
					'color', euclid_color.rgba( 255, 255,  20, 0.955 )
				),
				'ray:append',
				euclid_gradient_colorStop.create(
					'offset', 1,
					'color', euclid_color.rgba( 255, 255, 205, 0.955 )
				)
			),
		'twig:add',
		'createNote',
			genericButtonModel.create(
				'text', 'Note',
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', noteButtonPnw,
						'pse', noteButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add',
		'createLabel',
			genericButtonModel.create(
				'text', 'Label',
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', labelButtonPnw,
						'pse', labelButtonPnw.add( genericButtonSize )
					),
				'shape', euclid_anchor_ellipse.fullSkewNW
			),
		'twig:add',
		'createRelation',
			genericButtonModel.create(
				'text', 'Rela-\ntion',
				'textNewline', 20,
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', relationButtonPnw,
						'pse', relationButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add',
		'createPortal',
			genericButtonModel.create(
				'text', 'Portal',
				'designFrame',
					euclid_anchor_rect.create(
						'pnw', portalButtonPnw,
						'pse', portalButtonPnw.add( genericButtonSize )
					)
			)
	);


} )( );
