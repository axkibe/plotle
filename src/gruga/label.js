/*
| Default label.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_facet = tim.require( '../gleam/facet' );

const gleam_facetList = tim.require( '../gleam/facetList' );

const gleam_margin = tim.require( '../gleam/margin' );

const gruga_highlight = tim.require( './highlight' );


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

