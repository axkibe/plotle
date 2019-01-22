/*
| Default label.
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_facet = require( '../gleam/facet' );

const gleam_facetList = require( '../gleam/facetList' );

const gleam_margin = require( '../gleam/margin' );

const gruga_highlight = require( './highlight' );


def.staticLazy.facets = ( ) =>
	gleam_facetList.create(
		'list:append',
		// default
		gleam_facet.create(
		// 'border',
		//		gleam_border.create(
		//			'color', gleam_color.rgba( 100, 100, 0, 0.1 )
		//		)
		),
		'list:append', gruga_highlight.facet
	);


def.static.defaultFontsize = 13;


def.staticLazy.innerMargin = ( ) =>
	gleam_margin.create( 'n', 1, 'e', 1, 's', 1, 'w', 1 );


} );

