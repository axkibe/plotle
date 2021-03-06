/*
| A paragraph.
|
| TODO consider using offset traces where offset ints are used
*/
'use strict';


tim.define( module, ( def, fabric_para ) => {


def.extend = './fiber';


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

		// point in north west
		// no json thus not saved or transmitted
		pos : { type : [ 'undefined', '../gleam/point' ] },

		// the paragraphs text
		text : { type : 'string', json : true },

		// the trace of the para
		// no json thus not saved or transmitted
		trace : { type : [ 'undefined', '../trace/para' ] },
	};

	def.json = 'para';

	def.alike =
	{
		alikeVisually :
		{
			ignores :
			{
				'pos' : true,
				'transform' : true,
				'mark' : true
			}
		}
	};
}

const change_insert = tim.require( '../change/insert' );
const change_join = tim.require( '../change/join' );
const change_list = tim.require( '../change/list' );
const change_remove = tim.require( '../change/remove' );
const change_split = tim.require( '../change/split' );
const flow_block = tim.require( '../flow/block' );
const flow_line = tim.require( '../flow/line' );
const flow_token = tim.require( '../flow/token' );
const gleam_font_root = tim.require( '../gleam/font/root' );
const gleam_glint_list = tim.require( '../gleam/glint/list' );
const gleam_glint_text = tim.require( '../gleam/glint/text' );
const gleam_glint_pane = tim.require( '../gleam/glint/pane' );
const gleam_glint_window = tim.require( '../gleam/glint/window' );
const gleam_point = tim.require( '../gleam/point' );
const gleam_size = tim.require( '../gleam/size' );
const gruga_fontFace = tim.require( '../gruga/fontFace' );
const mark_caret = tim.require( '../mark/caret' );
const mark_range = tim.require( '../mark/range' );
const session_uid = tim.require( '../session/uid' );


/*
| Maps keys to handlers.
*/
const _keyMap =
	Object.freeze( {
		backspace : '_keyBackspace',
		del       : '_keyDel',
		down      : '_keyDown',
		end       : '_keyEnd',
		enter     : '_keyEnter',
		left      : '_keyLeft',
		pagedown  : '_keyPageDown',
		pageup    : '_keyPageUp',
		pos1      : '_keyPos1',
		right     : '_keyRight',
		up        : '_keyUp'
	} );


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	const fs = this.fontsize;

	const descend = fs * gleam_font_root.bottomBox;

	const p = this.locateOffsetPoint( this.mark.caretOffset.at );

	const s = Math.round( p.y + descend );

	const n = s - Math.round( fs + descend );

	return this.pos.y + n;
};


/*
| Returns the mark if a para with 'trace' concerns about
| it.
*/
def.static.concernsMark =
	function(
		mark,
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/}

	if( !mark ) return;

	if( mark.encompasses( trace ) ) return mark;
};


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
	const fontFace = this.fontFace;
	const fontSize = fontFace.fontSize;

	// TODO go into subnodes
	const text = this.text;

	// width really used.
	let width = 0;

	// current x positon, and current x including last tokens width
	let x = 0;
	let y = fontSize.size;

	const space = fontFace.createToken( ' ' ).advanceWidth;

	const lines = [ ];

	let currentLineOffset = 0;

	let currentLineList = [ ];

	const reg = ( /(\S+\s*$|\s*\S+|^\s+$)(\s?)(\s*)/g );
	// !pre ? (/(\s*\S+|\s+$)\s?(\s*)/g) : (/(.+)()$/g);

	for( let ca = reg.exec( text ); ca; ca = reg.exec( text ) )
	{
		// a token is a word plus following hard spaces
		const tokenText = ca[ 1 ] + ca[ 3 ];
		const w = fontFace.createToken( tokenText ).advanceWidth;

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

				y += fontSize.size * ( 1 + gleam_font_root.bottomBox );

				currentLineOffset = ca.index;
			}
			else
			{
				// horizontal overflow
				// ('HORIZONTAL OVERFLOW'); // TODO
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
| The font face for this para.
*/
def.lazy.fontFace =
	function( )
{
	return gruga_fontFace.standard( this.fontsize );
};


/*
| Returns true if a flow and glint can be inherited.
*/
def.inherit.flow =
def.inherit._pane =
	function(
		inherit
	)
{
	if( !VISUAL ) return false;

	const itransform = inherit.transform;
	const ttransform = this.transform;

	if( !itransform || !ttransform ) return false;

	return inherit.alikeVisually( this ) && itransform.zoom === ttransform.zoom;
};


/*
| Returns the offset by an x coordinate in a flow.
*/
def.proto.getOffsetAt =
	function(
		ln,  // line number
		x    // x coordinate
	)
{
	const fontFace = this.fontFace;

	const flow = this.flow;

	const line = flow.get( ln );

	const llen = line.length;

	let token, tn;

	for( tn = 0; tn < llen; tn++ )
	{
		token = line.get( tn );

		if( x <= token.x + token.width ) break;
	}

	if( tn >= llen && llen > 0 ) token = line.get( --tn );

	if( !token ) return 0;

	const dx = x - token.x;

	const text = token.text;

	let x1 = 0;

	let x2 = 0;

	let a;

	for( a = 0; a <= text.length; a++ )
	{
		x1 = x2;

		x2 = fontFace.createToken( text.substr( 0, a ) ).advanceWidth;

		if( x2 >= dx ) break;
	}

	if( a > text.length ) a = text.length;

	if( dx - x1 < x2 - dx && a > 0 ) a--;

	return token.offset + a;
};


/*
| Returns the offset closest to a point.
*/
def.proto.getPointOffset =
	function(
		point     // the point to look for
	)
{
	const flow = this.flow;

	if( point.y < 0 ) return 0;

	let line;

	for( line = 0; line < flow.length; line++ )
	{
		if( point.y <= flow.get( line ).y ) break;
	}

	if( line >= flow.length ) line--;

	return this.getOffsetAt( line, point.x );
};


/*
| The para's glint.
*/
def.lazy.glint =
	function( )
{
	const transform = this.transform;

	return(
		gleam_glint_window.create(
			'pane', this._pane,
			'pos', this.pos.transform( transform.ortho ),
		)
	);
};


/*
| The height of the para.
*/
def.lazy.height =
	function( )
{
	return this.flow.height + Math.round( this.fontsize * gleam_font_root.bottomBox );
};


/*
| A text has been inputed.
*/
def.proto.input =
	function(
		text   // text inputed
	)
{
	const changes = [ ];

	const reg = /([^\n]+)(\n?)/g;

	let trace = this.trace.chopRoot;

	let at = this.mark.caretOffset.at;

	for( let rx = reg.exec( text ); rx; rx = reg.exec( text ) )
	{
		const line = rx[ 1 ];

		changes.push(
			change_insert.create(
				'val', line,
				'trace', trace.appendText,
				'at1', at,
				'at2', at + line.length
			)
		);

		if( rx[ 2 ] )
		{
			const trace2 = trace.last.appendPara( session_uid.newUid( ) );

			changes.push(
				change_split.create(
					'trace', trace.appendText,
					'trace2', trace2.appendText,
					'at1', at + line.length
				)
			);

			trace = trace2;

			at = 0;
		}
	}

	root.alter(
		'change', change_list.create( 'list:init', changes ),
		'clearRetainX', true
	);
};


/*
| True if the para is effectively empty or has only blank characters.
*/
def.lazy.isBlank =
	function( )
{
	return /^\s*$/.test( this.text );
};


/*
| Locates the line number of a given offset.
*/
def.lazyFunc.locateOffsetPoint =
	function(
		offset
	)
{
	this._locateOffset( offset );

	// this is not recursive, it returns
	// the aheaded value set by _locateOffset

	return this.locateOffsetPoint( offset );
};


/*
| Locates the line number of a given offset.
*/
def.lazyFunc.locateOffsetLine =
	function(
		offset
	)
{
	this._locateOffset( offset );

	// this is not recursive, it returns
	// the aheaded value set by _locateOffset

	return this.locateOffsetLine( offset );
};


/*
| Returns an offset trace into the text.
*/
def.proto.offsetTrace =
	function(
		at
	)
{
	return this.trace.appendText.appendOffset( at );
};


/*
| Handles a special key.
*/
def.proto.specialKey =
	function(
		key,
		doc,
		shift,
		ctrl
	)
{
	const mark = this.mark;

	let at, beginOffset, retainx;

	if( ctrl && key === 'a' )
	{
		const v0 = doc.atRank( 0 );

		const v1 = doc.atRank( doc.length - 1 );

		root.alter(
			'mark',
				mark_range.create(
					'doc', doc,
					'beginOffset', v0.offsetTrace( 0 ),
					'endOffset', v1.offsetTrace( v1.text.length )
				)
		);

		return true;
	}

	if( mark.caretOffset )
	{
		at = mark.caretOffset.at;

		retainx = mark.retainx;

		if( shift )
		{
			if( mark.timtype === mark_range ) beginOffset = mark.beginOffset;
			else beginOffset = mark.offset;
		}
	}

	const keyHandler = _keyMap[ key ];

	if( keyHandler ) { this[ keyHandler ]( doc, at, retainx, beginOffset ); }
};


/*
| Backspace pressed.
*/
def.proto._keyBackspace =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	if( at > 0 )
	{
		root.alter(
			'change',
				change_remove.create(
					'trace', this.trace.appendText.chopRoot,
					'at1', at - 1,
					'at2', at,
					'val', this.text.substring( at - 1, at )
				),
			'clearRetainX', true
		);

		return;
	}

	const r = doc.rankOf( this.key );

/**/if( CHECK )
/**/{
/**/	if( r < 0 ) throw new Error( );
/**/}

	if( r === 0 ) return;

	const ve = doc.atRank( r - 1 );

	root.alter(
		'change',
			change_join.create(
				'trace', ve.trace.appendText.chopRoot,
				'trace2', this.trace.appendText.chopRoot,
				'at1', ve.text.length
			),
		'clearRetainX', true
	);
};


/*
| Del-key pressed.
*/
def.proto._keyDel =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	if( at < this.text.length )
	{
		root.alter(
			'change',
				change_remove.create(
					'trace', this.trace.appendText.chopRoot,
					'at1', at,
					'at2', at + 1,
					'val', this.text.substring( at, at + 1 )
				),
			'clearRetainX', true
		);

		return;
	}

	const r = doc.rankOf( this.key );

/**/if( CHECK )
/**/{
/**/	if( r < 0 ) throw new Error( );
/**/}

	if( r >= doc.length - 1 ) return;

	root.alter(
		'change',
			change_join.create(
				'trace', this.trace.appendText.chopRoot,
				'trace2', doc.atRank( r + 1).trace.appendText.chopRoot,
				'at1', this.text.length
			),
		'clearRetainX', true
	);
};


/*
| Down arrow pressed.
*/
def.proto._keyDown =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	const flow = this.flow;

	const cPosLine = this.locateOffsetLine( at );

	const cPosP = this.locateOffsetPoint( at );

	const x = retainx !== undefined ? retainx : cPosP.x;

	if( cPosLine < flow.length - 1 )
	{
		// stays within this para
		this._setMark( this.getOffsetAt( cPosLine + 1, x ), x, beginOffset, doc );

		return;
	}

	// goto next para
	const r = doc.rankOf( this.key );

/**/if( CHECK )
/**/{
/**/	if( r < 0 ) throw new Error( );
/**/}

	if( r < doc.length - 1 )
	{
		const ve = doc.atRank( r + 1 );

		at = ve.getOffsetAt( 0, x );

		ve._setMark( at, x, beginOffset, doc );
	}
};


/*
| End-key pressed.
*/
def.proto._keyEnd =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	this._setMark( this.text.length, undefined, beginOffset, doc );
};


/*
| Enter-key pressed.
*/
def.proto._keyEnter =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	root.alter(
		'change',
			change_split.create(
				'trace', this.trace.appendText.chopRoot,
				'trace2', this.trace.last.appendPara( session_uid.newUid( ) ).appendText.chopRoot,
				'at1', at
			)
	);
};



/*
| Left arrow pressed.
*/
def.proto._keyLeft =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	if( at > 0 )
	{
		this._setMark( at - 1, undefined, beginOffset, doc );

		return;
	}

	const r = doc.rankOf( this.key );

/**/if( CHECK )
/**/{
/**/	if( r < 0 ) throw new Error( );
/**/}

	if( r > 0 )
	{
		const ve = doc.atRank( r - 1 );

		ve._setMark( ve.text.length, undefined, beginOffset, doc );
	}
	else
	{
		this._setMark( at, undefined, beginOffset, doc );
	}
};


/*
| PageDown key pressed.
*/
def.proto._keyPageDown =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	this._pageUpDown( +1, doc, at, retainx, beginOffset );
};


/*
| PageUp key pressed.
*/
def.proto._keyPageUp =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	this._pageUpDown( -1, doc, at, retainx, beginOffset );
};


/*
| Pos1-key pressed.
*/
def.proto._keyPos1 =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	this._setMark( 0, undefined, beginOffset, doc );
};


/*
| Right arrow pressed.
*/
def.proto._keyRight =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	if( at < this.text.length )
	{
		this._setMark( at + 1, undefined, beginOffset, doc );

		return;
	}

	const r = doc.rankOf( this.key );

/**/if( CHECK )
/**/{
/**/	if( r < 0 ) throw new Error( );
/**/}

	if( r < doc.length - 1 )
	{
		const ve = doc.atRank( r + 1 );

		ve._setMark( 0, undefined, beginOffset, doc );
	}
};


/*
| Up arrow pressed.
*/
def.proto._keyUp =
	function(
		doc,
		at,
		retainx,
		beginOffset
	)
{
	const cPosLine = this.locateOffsetLine( at );

	const cPosP = this.locateOffsetPoint( at );

	const x = retainx !== undefined ? retainx : cPosP.x;

	if( cPosLine > 0 )
	{
		// stay within this para
		at = this.getOffsetAt( cPosLine - 1, x );

		this._setMark( at, x, beginOffset, doc );

		return;
	}

	// goto prev para
	const r = doc.rankOf( this.key );

/**/if( CHECK )
/**/{
/**/	if( r < 0 ) throw new Error( );
/**/}

	if( r > 0 )
	{
		const ve = doc.atRank( r - 1 );

		at = ve.getOffsetAt( ve.flow.length - 1, x );

		ve._setMark( at, x, beginOffset, doc );
	}
};


/*
| Sets the aheadValues for point and line of a given offset.
*/
def.proto._locateOffset =
	function(
		offset    // the offset to get the point from.
	)
{
	const fontFace = this.fontFace;
	const text = this.text;
	const flow = this.flow;

	// determines which line this offset belongs to

	let lineN;

	const fLen = flow.length - 1;

	for( lineN = 0; lineN < fLen; lineN++ )
	{
		if( flow.get( lineN + 1 ).offset > offset ) break;
	}

	const line = flow.get( lineN );
	let tokenN;
	const lLen = line.length - 1;

	for( tokenN = 0; tokenN < lLen; tokenN++ )
	{
		if( line.get( tokenN + 1 ).offset > offset ) break;
	}

	let p;

	if( tokenN < line.length )
	{
		const token = line.get( tokenN );

		p =
			gleam_point.createXY(
				Math.round(
					token.x
					+ fontFace.createToken( text.substring( token.offset, offset ) ).advanceWidth
				),
				line.y
			);
	}
	else
	{
		p = gleam_point.createXY( 0, line.y );
	}

	tim.aheadFunction( this, 'locateOffsetLine', offset, lineN );
	tim.aheadFunction( this, 'locateOffsetPoint', offset, p );
};


/*
| User pressed page up or down
|
| TODO maintain relative scroll pos
*/
def.proto._pageUpDown =
	function(
		dir,      // +1 for down, -1 for up
		doc,
		at,
		retainx,
		beginOffset
	)
{
/**/if( CHECK )
/**/{
/**/	if( dir !== 1 && dir !== -1 ) throw new Error( );
/**/}

	const p = this.locateOffsetPoint( at );

	const size = doc.clipsize;

	const tp =
		this.pos.add(
			retainx !== undefined ? retainx : p.x,
			p.y + size.height * dir
		);

	const tpara =
		doc.getParaAtPoint( tp )
		|| doc.atRank( dir > 0 ? doc.length - 1 : 0 );

	const tpos = doc.get( tpara.key ).pos;

	at = tpara.getPointOffset( tp.sub( tpos ) );

	tpara._setMark( at, retainx, beginOffset, doc );
};


/*
| The para's pane.
|
| It is independent of it's pos.
*/
def.lazy._pane =
	function( )
{
	const tFontFace = this._tFontFace;
	const transform = this.transform.ortho;
	const dpr = this.devicePixelRatio;

	const a = [ ];

	for( let line of this.flow )
	{
		for( let token of line )
		{
			a.push(
				gleam_glint_text.create(
					'devicePixelRatio', dpr,
					'fontFace', tFontFace,
					'text', token.text,
					'p',
						gleam_point.createXY(
							transform.x( token.x ),
							transform.y( line.y )
						)
				)
			);
		}
	}

	return(
		gleam_glint_pane.create(
			'devicePixelRatio', this.devicePixelRatio,
			'glint', gleam_glint_list.create( 'list:init', a ),
			'size',
				gleam_size.createWH(
					transform.scale( this.flow.width ) + 1,
					transform.scale( this.height ) + 1
				),
			'tag', 'para(' + this.key + ')'
		)
	);
};


/*
| Sets the users caret or range
*/
def.proto._setMark =
	function(
		at,          // position to mark caret (or end of range)
		retainx,     // retains this x position when moving up/down
		beginOffset, // begin offset when marking a range
		doc          // range mark need this
	)
{
	const offset = this.offsetTrace( at );

	root.alter(
		'mark',
			!beginOffset
			? mark_caret.create( 'offset', offset, 'retainx', retainx )
			: mark_range.create(
				'doc', doc,
				'beginOffset', beginOffset,
				'endOffset', offset,
				'retainx', retainx
			)
	);
};


/*
| The font for current transform.
*/
def.lazy._tFontFace =
	function( )
{
	return gruga_fontFace.standard( this.transform.scale( this.fontsize ), 'a' );
};


} );
