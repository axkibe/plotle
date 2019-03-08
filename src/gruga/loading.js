/*
| Default design of the loading screen.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = require( '../gleam/point' );

const layout_form = require( '../layout/form' );

const layout_label = require( '../layout/label' );

const shell_fontPool = require( '../shell/fontPool' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add', 'headline',
			layout_label.create(
				'align', 'center',
				'font', shell_fontPool.get( 28, 'a' ),
				'pos', gleam_point.xy( 0, -56 ),
				'text', 'loading'
			),
		'twig:add', 'spaceText',
			layout_label.create(
				'align', 'center',
				'font', shell_fontPool.get( 28, 'a' ),
				'pos', gleam_point.zero,
				'text', 'plotle:home'
			)
	);


} );
