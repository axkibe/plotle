/*
| Default design of the loading screen.
*/
'use strict';


tim.define( module, ( def ) => {


const form_loading = require( '../form/loading' );

const gleam_point = require( '../gleam/point' );

const layout_label = require( '../layout/label' );

const shell_fontPool = require( '../shell/fontPool' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	form_loading.abstract(
		'twig:add', 'headline',
			layout_label.create(
				'text', 'loading',
				'font', shell_fontPool.get( 28, 'ca' ),
				'pos', gleam_point.xy( 0, -56)
			),
		'twig:add', 'spaceText',
			layout_label.create(
				'text', 'linkloom:home',
				'font', shell_fontPool.get( 28, 'ca' ),
				'pos', gleam_point.zero
			)
	);


} );

