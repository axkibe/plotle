/*
| Default design for the the move-to-form.
*/


var
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_facetList,
	gleam_point,
	gleam_rect,
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


portalButtonFacets =
	gleam_facetList.create(
		'list:init',
		[
			// default state.
			gleam_facet.create(
				'group:init', { },
				'fill', gleam_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					gleam_border.create(
						'color', gleam_color.rgb( 255, 141, 66 )
					)
			),
			// hover
			gleam_facet.create(
				'group:init', { 'hover' : true },
				'fill', gleam_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					gleam_border.create(
						'width', 1.5,
						'color', gleam_color.rgb( 255, 141, 66 )
					)
			),
			// focus
			gleam_facet.create(
				'group:init', { 'focus' : true },
				'fill', gleam_color.rgba( 255, 237, 210, 0.5 ),
				'border',
					gleam_border.create(
						'distance', 1,
						'width', 1.5,
						'color', gleam_color.rgb( 255, 99, 188 )
					)
			),
			// focus and hover
			gleam_facet.create(
				'group:init', { 'focus' : true, 'hover' : true },
				'fill', gleam_color.rgba( 255, 188, 88, 0.7 ),
				'border',
					gleam_border.create(
						'distance', 1,
						'width', 1.5,
						'color', gleam_color.rgb( 255, 99, 188 )
					)
			)
		]
	);


/*
| Layout
*/
gruga_moveTo =
	form_moveTo.abstract(
		'twig:add',
		'headline',
			widget_label.abstract(
				'text', 'move to another space',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -150 )
			),
		'twig:add',
		'ideoloomHomeButton',
			widget_button.abstract(
				'facets', portalButtonFacets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -145, -100 ),
						'width', 130,
						'height', 130
					),
				'text', 'ideoloom\nhome',
				'textNewline', 25,
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'ideoloomSandboxButton',
			widget_button.abstract(
				'facets', portalButtonFacets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 15, -100 ),
						'width', 130,
						'height', 130
					),
				'text', 'ideoloom\nsandbox',
				'textNewline', 25,
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			),
		'twig:add',
		'userHomeButton',
			widget_button.abstract(
				'facets', portalButtonFacets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( -145, 60 ),
						'width', 130,
						'height', 130
					),
				'text', 'your\nhome',
				'textNewline', 25,
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


if( FREEZE ) Object.freeze( gruga_moveTo );


} )( );
