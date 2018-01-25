/*
| Default design of the loading screen.
*/
'use strict';


tim.define( module, 'gruga_loading', ( def, gruga_loading ) => {


const form_loading = require( '../form/loading' );

const gleam_point = require( '../gleam/point' );

const shell_fontPool = require( '../shell/fontPool' );

const widget_label = require( '../widget/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
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


} );

