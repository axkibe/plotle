/*
| Default design of the loading screen.
*/


var
	design_point,
	shell_fontPool,
	form_loading,
	gruga_loading,
	widget_label;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Layout
*/
gruga_loading =
	form_loading.create(
		'twig:add', 'headline',
			widget_label.create(
				'text', 'loading',
				'font', shell_fontPool.get( 28, 'ca' ),
				'designPos',
					design_point.create(
						'anchor', 'c',
						'x', 0,
						'y', -56
					)
			),
		'twig:add', 'spaceText',
			widget_label.create(
				'text', 'ideoloom:home',
				'font', shell_fontPool.get( 28, 'ca' ),
				'designPos',
					design_point.create(
						'anchor', 'c',
						'x', 0,
						'y', 0
					)
			)
	);


} )( );
