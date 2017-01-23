/*
| Default design of the loading screen.
*/


var
	form_loading,
	gleam_point,
	gruga_loading,
	shell_fontPool,
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
	form_loading.abstract(
		'twig:add', 'headline',
			widget_label.abstract(
				'text', 'loading',
				'font', shell_fontPool.get( 28, 'ca' ),
				'pos', gleam_point.xy( 0, -56)
			),
		'twig:add', 'spaceText',
			widget_label.abstract(
				'text', 'ideoloom:home',
				'font', shell_fontPool.get( 28, 'ca' ),
				'pos', gleam_point.zero
			)
	);


} )( );
