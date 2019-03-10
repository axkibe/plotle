/*
| A paragraph.
*/
'use strict';


tim.define( module, ( def, fabric_para ) => {


if( TIM )
{
	def.attributes =
	{
		// width the flow can fill
		// no json thus not saved or transmitted
		flowWidth : { type : [ 'undefined', 'number' ] },

		// size of the font
		// no json thus not saved or transmitted
		fontsize : { type : [ 'undefined', 'number' ] },

		// the path of the para
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		// the paragraphs text
		text : { type : 'string', json : true }
	};

	// FIXME change to 'para'
	def.json = 'fabric_para';
}


const flow_block = require( '../flow/block' );

const flow_line = require( '../flow/line' );

const flow_token = require( '../flow/token' );

const gleam_font_font = require( '../gleam/font/font' );

const gruga_font = require( '../gruga/font' );


/*
| The para's flow, the position of all chunks.
*/
def.lazy.flow =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.fontsize === undefined ) throw new Error( );
/**/}

	// width the flow can fill
	// 0 means infinite
	const flowWidth = this.flowWidth;

	const font = this.font;

	// FUTURE go into subnodes
	const text = this.text;

	// width really used.
	let width = 0;

	// current x positon, and current x including last tokens width
	let x = 0;

	let y = font.size;

	const space = font.getAdvanceWidth( ' ' );

	const lines = [ ];

	let currentLineOffset = 0;

	let currentLineList = [ ];

	const reg = ( /(\S+\s*$|\s*\S+|^\s+$)(\s?)(\s*)/g );
	// !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);

	for( let ca = reg.exec( text ); ca; ca = reg.exec( text ) )
	{
		// a token is a word plus following hard spaces
		const tokenText = ca[ 1 ] + ca[ 3 ];

		const w = font.getAdvanceWidth( tokenText );

		if( flowWidth > 0 && x + w > flowWidth )
		{
			if( x > 0 )
			{
				// soft break
				lines.push(
					flow_line.create(
						'list:init', currentLineList,
						'y', y,
						'offset', currentLineOffset
					)
				);

				x = 0;

				currentLineList = [ ];

				y += font.size * ( 1 + gleam_font_font.bottomBox );

				currentLineOffset = ca.index;
			}
			else
			{
				// horizontal overflow
				// ('HORIZONTAL OVERFLOW'); // FUTURE
			}
		}

		currentLineList.push(
			flow_token.create(
				'x', x,
				'width', w,
				'offset', ca.index,
				'text', tokenText
			)
		);

		if( width < x + w ) { width = x + w; }

		x = x + w + space;
	}

	lines.push(
		flow_line.create(
			'list:init', currentLineList,
			'offset', currentLineOffset,
			'y', y
		)
	);

	return flow_block.create( 'list:init', lines, 'height', y, 'width', width );
};


/*
| The font for this para.
*/
def.lazy.font =
	function( )
{
	return gruga_font.standard( this.fontsize );
};


/*
| Shortcut to the para's key.
| It is the last path entry.
*/
def.lazy.key =
	function( )
{
	return this.path.get( -1 );
};


/*
| The path to the .text attribute
*/
def.lazy.textPath =
	function( )
{
	return this.path && this.path.append( 'text' );
};


/*
| True if the para is effectively empty or has only blank characters.
*/
def.lazy.isBlank =
	function( )
{
	return /^\s*$/.test( this.text );
};


} );
