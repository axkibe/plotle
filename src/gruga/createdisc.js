/*
| Default design of the creation disc.
*/


var
	design_anchorEllipse,
	design_anchorPoint,
	design_anchorRect,
	design_facet,
	design_facetRay,
	disc_createDisc,
	euclid_border,
	euclid_borderRay,
	euclid_color,
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


dnw = design_anchorPoint.nw;

noteButtonPnw = dnw.create( 'x', 62, 'y', 216 );

labelButtonPnw = dnw.create( 'x', 81, 'y', 284 );

portalButtonPnw = dnw.create( 'x', 101, 'y', 425 );

relationButtonPnw = dnw.create( 'x', 94, 'y', 354 );

genericButtonSize = euclid_point.create( 'x', 70, 'y', 70 );

genericButtonFacets =
	design_facetRay.create(
		'ray:init',
		[
			// default state.
			design_facet.create( ),
			// hover
			design_facet.create(
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
			design_facet.create(
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
			design_facet.create(
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
		'shape', design_anchorEllipse.fullSkewNW,
		'textDesignPos', design_anchorPoint.c
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
					design_anchorRect.create(
						'pnw', noteButtonPnw,
						'pse', noteButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add',
		'createLabel',
			genericButtonModel.create(
				'text', 'Label',
				'designFrame',
					design_anchorRect.create(
						'pnw', labelButtonPnw,
						'pse', labelButtonPnw.add( genericButtonSize )
					),
				'shape', design_anchorEllipse.fullSkewNW
			),
		'twig:add',
		'createRelation',
			genericButtonModel.create(
				'text', 'Rela-\ntion',
				'textNewline', 20,
				'designFrame',
					design_anchorRect.create(
						'pnw', relationButtonPnw,
						'pse', relationButtonPnw.add( genericButtonSize )
					)
			),
		'twig:add',
		'createPortal',
			genericButtonModel.create(
				'text', 'Portal',
				'designFrame',
					design_anchorRect.create(
						'pnw', portalButtonPnw,
						'pse', portalButtonPnw.add( genericButtonSize )
					)
			)
	);


} )( );
