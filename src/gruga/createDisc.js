/*
| Default design of the creation disc.
*/


var
	disc_createDisc,
	euclid_anchor_ellipse,
	euclid_anchor_point,
	euclid_anchor_rect,
	gleam_border,
	gleam_borderRay,
	gleam_color,
	gleam_facet,
	gleam_facetRay,
	gleam_gradient_colorStop,
	gleam_gradient_radial,
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

noteButtonPnw = dnw.create( 'x', 65, 'y', 180 );

labelButtonPnw = dnw.create( 'x', 81, 'y', 251 );

relationButtonPnw = dnw.create( 'x', 92, 'y', 322 );

portalButtonPnw = dnw.create( 'x', 99, 'y', 393 );

genericButtonSize = euclid_point.create( 'x', 70, 'y', 70 );

genericButtonFacets =
	gleam_facetRay.create(
		'ray:init',
		[
			// default state.
			gleam_facet.create( ),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill', gleam_color.rgba( 255, 235, 210, 0.7 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// down
			gleam_facet.create(
				'group:init', { 'down' : true },
				'fill', gleam_color.rgb( 255, 188, 88 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgba( 196, 94, 44, 0.4 )
					)
			),
			// down and hover
			gleam_facet.create(
				'group:init', { 'down' : true, 'hover' : true },
				'fill', gleam_color.rgb( 255, 188, 88 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgba( 196, 94, 44, 0.4 )
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
			gleam_borderRay.create(
				'ray:append',
				gleam_border.create(
					'distance', 1,
					'color', gleam_color.rgb( 255, 94, 44 )
				),
				'ray:append',
				gleam_border.create(
					'color', gleam_color.rgb( 94, 94, 0 )
				)
			),
		'designArea',
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
						'x', -2351,
						'y', -1175
					),
				'pse',
					euclid_anchor_point.e.create(
						'x', -1,
						'y', 1175
					),
				'gradientPC',
					euclid_anchor_point.e.create(
						'x', -600,
						'y', 0
					),
				'gradientR1', 650
			),
		'fill',
			gleam_gradient_radial.create(
				'ray:append',
				gleam_gradient_colorStop.create(
					'offset', 0,
					'color', gleam_color.rgba( 255, 255,  20, 0.955 )
				),
				'ray:append',
				gleam_gradient_colorStop.create(
					'offset', 1,
					'color', gleam_color.rgba( 255, 255, 205, 0.955 )
				)
			),
		'twig:add',
		'createNote',
			genericButtonModel.abstract(
				'text', 'Note',
				'designArea',
					euclid_anchor_rect.create(
						'pnw', noteButtonPnw,
						'pse', noteButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add',
		'createLabel',
			genericButtonModel.abstract(
				'text', 'Label',
				'designArea',
					euclid_anchor_rect.create(
						'pnw', labelButtonPnw,
						'pse', labelButtonPnw.add( genericButtonSize )
					),
				'shape', euclid_anchor_ellipse.fullSkewNW
			),
		'twig:add',
		'createRelation',
			genericButtonModel.abstract(
				'text', 'Rela-\ntion',
				'textNewline', 20,
				'designArea',
					euclid_anchor_rect.create(
						'pnw', relationButtonPnw,
						'pse', relationButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add',
		'createPortal',
			genericButtonModel.abstract(
				'text', 'Portal',
				'designArea',
					euclid_anchor_rect.create(
						'pnw', portalButtonPnw,
						'pse', portalButtonPnw.add( genericButtonSize )
					)
			)
	);


} )( );
