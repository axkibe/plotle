/*
| Default design for the space form.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gruga_font = tim.require( './font' );

const gruga_genericButton = tim.require( './genericButton' );

const layout_button = tim.require( '../layout/button' );

const layout_form = tim.require( '../layout/form' );

const layout_label = tim.require( '../layout/label' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add',
		'headline',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 22 ),
				'pos', gleam_point.createXY( 0, -120 ),
				'text', 'Hello'
			),
		'twig:add',
		'visitor1',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( 0, -50 ),
				'text', 'You\'re currently an anonymous visitor!'
			),
		'twig:add',
		'visitor2',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.zero,
				'text', 'Click on "sign up" or "log in"'
			),
		'twig:add',
		'visitor3',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( 0, 20 ),
				'text', 'on the control disc to the left'
			),
		'twig:add',
		'visitor4',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( 0, 40 ),
				'text', 'to register as an user.'
			),
		'twig:add',
		'greeting1',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( 0, -50 ),
				'text', 'This is your profile page!'
			),
		'twig:add',
		'greeting2',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( 0, -10 ),
				'text', 'In future you will be able to do stuff here,'
			),
		'twig:add',
		'greeting3',
			layout_label.create(
				'align', 'center',
				'font', gruga_font.standard( 16 ),
				'pos', gleam_point.createXY( 0, 10 ),
				'text', 'like for example change your password.'
			),
		'twig:add',
		'closeButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'font', gruga_font.standard( 14 ),
				'shape', 'ellipse',
				'text', 'close',
				'zone',
					gleam_rect.create(
						'pos', gleam_point.createXY( 180, 38 ),
						'width', 50,
						'height', 50
					)
			)
	);


} );
