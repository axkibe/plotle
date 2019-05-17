/*
| Default design of the loading screen.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_point = tim.require( '../gleam/point' );

const gruga_font = tim.require( './font' );

const layout_form = tim.require( '../layout/form' );

const layout_label = tim.require( '../layout/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add', 'headline',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 28 ),
				'pos', gleam_point.createXY( 0, -56 ),
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
