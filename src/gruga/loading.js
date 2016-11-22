/*
| Default design of the loading screen.
*/


var
	euclid_point,
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
	form_loading.abstract(
		'twig:add', 'headline',
			widget_label.abstract(
				'text', 'loading',
				'font', shell_fontPool.get( 28, 'ca' ),
				'pos', euclid_point.xy( 0, -56)
			),
		'twig:add', 'spaceText',
			widget_label.abstract(
				'text', 'ideoloom:home',
				'font', shell_fontPool.get( 28, 'ca' ),
				'pos', euclid_point.zero
			)
	);


} )( );
