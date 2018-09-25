/*
| Default design for the space form.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gruga_genericButton = require( './genericButton' );

const layout_button = require( '../layout/button' );

const layout_form = require( '../layout/form' );

const layout_label = require( '../layout/label' );

const shell_fontPool = require( '../shell/fontPool' );


/*
| Layout
*/
def.staticLazy.layout = ( ) =>
	layout_form.create(
		'twig:add',
		'headline',
			layout_label.create(
				'text', 'Hello',
				'font', shell_fontPool.get( 22, 'ca' ),
				'pos', gleam_point.xy( 0, -120 )
			),
		'twig:add',
		'visitor1',
			layout_label.create(
				'text', 'You\'re currently an anonymous visitor!',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add',
		'visitor2',
			layout_label.create(
				'text', 'Click on "sign up" or "log in"',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.zero
			),
		'twig:add',
		'visitor3',
			layout_label.create(
				'text', 'on the control disc to the left',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, 20 )
			),
		'twig:add',
		'visitor4',
			layout_label.create(
				'text', 'to register as an user.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, 40 )
			),
		'twig:add',
		'greeting1',
			layout_label.create(
				'text', 'This is your profile page!',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -50 )
			),
		'twig:add',
		'greeting2',
			layout_label.create(
				'text', 'In future you will be able to do stuff here,',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, -10 )
			),
		'twig:add',
		'greeting3',
			layout_label.create(
				'text', 'like for example change your password.',
				'font', shell_fontPool.get( 16, 'ca' ),
				'pos', gleam_point.xy( 0, 10 )
			),
		'twig:add',
		'closeButton',
			layout_button.create(
				'facets', gruga_genericButton.facets,
				'zone',
					gleam_rect.create(
						'pos', gleam_point.xy( 180, 38 ),
						'width', 50,
						'height', 50
					),
				'text', 'close',
				'font', shell_fontPool.get( 14, 'cm' ),
				'shape', 'ellipse'
			)
	);


} );

