/*
| Default form background.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_gradient_askew = require( '../gleam/gradient/askew' );

const gleam_gradient_colorStop = require( '../gleam/gradient/colorStop' );


def.staticLazy.model = ( ) =>
	gleam_facet.create(
		'fill',
			gleam_gradient_askew.create(
				'list:append',
				gleam_gradient_colorStop.create(
					'offset', 0,
					'color', gleam_color.rgb( 255, 255, 248 )
				),
				'list:append',
				gleam_gradient_colorStop.create(
					'offset', 1,
					'color', gleam_color.rgb( 255, 255, 210 )
				)
			)
	);


} );

