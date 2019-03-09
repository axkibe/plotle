/*
| Default design of the loading screen.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = require( '../gleam/point' );

const gruga_font = require( './font' );

const layout_form = require( '../layout/form' );

const layout_label = require( '../layout/label' );



/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add', 'headline',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 28 ),
				'pos', gleam_point.xy( 0, -56 ),
				'text', 'loading'
			),
		'twig:add', 'spaceText',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 28 ),
				'pos', gleam_point.zero,
				'text', 'plotle:home'
			)
	);


} );
