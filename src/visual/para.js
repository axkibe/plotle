/*
| A paragraph.
*/
'use strict';



tim.define( module, 'visual_para', ( def, visual_para ) => {


const change_insert = require( '../change/insert' );

const change_join = require( '../change/join' );

const change_remove = require( '../change/remove' );

const change_split = require( '../change/split' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_text = require( '../gleam/glint/text' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const flow_block = require( '../flow/block' );

const flow_line = require( '../flow/line' );

const flow_token = require( '../flow/token' );

const visual_mark_caret = require( '../visual/mark/caret' );

const visual_mark_range = require( '../visual/mark/range' );

const session_uid = require( '../session/uid' );

const shell_fontPool = require( '../shell/fontPool' );

const shell_settings = require( '../shell/settings' );

const visual_mark_text = require( '../visual/mark/text' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		fabric :
		{
			// the para fabric
			type : 'fabric_para'
		},
		flowWidth :
		{
			// width the flow can fill
			type : [ 'undefined', 'number' ]
		},
		fontsize :
		{
			// size of the font
			type : [ 'undefined', 'number' ]
		},
		mark :
		{
			// the users mark
			prepare : 'visual_para.concernsMark( mark, path )',
			type :
				require( './mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		path :
		{
			// the path of the para',
			type : [ 'undefined', 'tim$path' ]
		},
		pos :
		{
			// point in north west
			type : 'gleam_point'
		},
		transform :
		{
			// the current space transform
			type : 'gleam_transform'
		}
	};

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

	def.init = [ 'inherit' ];
}


/*
| Initializer.
*/
def.func._init =
	function(
		inherit
	)
{
	if(
		inherit
		&& inherit.alikeVisually( this )
		&& inherit.transform.zoom === this.transform.zoom
	)
	{
		if( tim.hasLazyValueSet( inherit, 'flow' ) )
		{
			tim.aheadValue( this, 'flow', inherit.flow );
		}

		if( tim.hasLazyValueSet( inherit, 'glint' ) )
		{
			this._inheritedGlint = inherit.glint;
		}
		else
		{
			this._inheritedGlint = inherit._inheritedGlint;
		}
	}
};


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
def.static.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark ) return mark;

	if( mark.timtype === visual_mark_range )
	{
		return(
			mark.containsPath( path.limit( 3 ) )
			? mark
			: undefined
		);
	}

	return(
		mark.containsPath( path )
		? mark
		: undefined
	);
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	const fs = this.fontsize;

	const descend = fs * shell_settings.bottombox;

	const p = this.locateOffsetPoint( this.mark.caret.at );

	const s = Math.round( p.y + descend );

	const n = s - Math.round( fs + descend );

	return this.pos.y + n;
};


/*
| The para's flow, the position of all chunks.
*/
def.lazy.flow =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( !this.fontsize ) throw new Error( );
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

				y += font.size * ( 1 + shell_settings.bottombox );

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

	return(
		flow_block.create(
			'list:init', lines,
			'height', y,
			'width', width
		)
	);
};


/*
| The font for this para.
*/
def.lazy.font =
	function( )
{
	return shell_fontPool.get( this.fontsize, 'la' );
};


/*
| Path to a text value.
*/
def.lazy.textPath =
	function( )
{
	return this.path.append( 'text' );
};


/*
| The font for current transform.
*/
def.lazy.tFont =
	function( )
{
	return(
		shell_fontPool.get(
			this.transform.scale( this.fontsize ),
			'la'
		)
	);
};


/*
| The para's glint.
*/
def.lazy.glint =
	function( )
{
	const transform = this.transform;

	return(
		( this._inheritedGlint || gleam_glint_window )
		.create(
			'glint', this._glint,
			'rect',
				gleam_rect.create(
					'pos', this.pos.transform( transform.ortho ),
					'height', transform.scale( this.height ) + 1,
					'width', transform.scale( this.flow.width ) + 1
				),
			'offset', gleam_point.zero
		)
	);
};


/*
| The height of the para.
*/
def.lazy.height =
	function( )
{
	return this.flow.height + Math.round( this.fontsize * shell_settings.bottombox );
};


/*
| Shortcut to the para's key.
| It is the last path entry.
| FIXME remove
*/
def.lazy.key =
	function( )
{
	return this.path.get( -1 );
};


/*
| Forwards fabric settings.
*/
def.lazy.text =
	function( )
{
	return this.fabric.text;
};


/*
| The para's glint without window.
*/
def.lazy._glint =
	function( )
{
	const flow = this.flow;

	const tFont = this.tFont;

	const arr = [ ];

	const transform = this.transform.ortho;

	// draws text into the display

	for( let a = 0, aZ = flow.length; a < aZ; a++ )
	{
		const line = flow.get( a );

		for( let b = 0, bZ = line.length; b < bZ; b++ )
		{
			const token = line.get( b );

			arr.push(
				gleam_glint_text.create(
					'font', tFont,
					'p',
						gleam_point.create(
							'x', transform.x( token.x ),
							'y', transform.y( line.y )
						),
					'text', token.text
				)
			);
		}
	}

	return gleam_glint_list.create( 'list:init', arr );
};


/*::::::::::::::::.
:: Lazy Functions
':::::::::::::::::*/


/*
| Locates the line number of a given offset.
*/
def.lazyFuncInt.locateOffsetPoint =
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
def.lazyFuncInt.locateOffsetLine =
	function(
		offset
	)
{
	this._locateOffset( offset );

	// this is not recursive, it returns
	// the aheaded value set by _locateOffset

	return this.locateOffsetLine( offset );
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns the offset by an x coordinate in a flow.
*/
def.func.getOffsetAt =
	function(
		ln,  // line number
		x    // x coordinate
	)
{
	const font = this.font;

	const flow = this.flow;

	const line = flow.get( ln );

	const lZ = line.length;

	let token, tn;

	for( tn = 0; tn < lZ; tn++ )
	{
		token = line.get( tn );

		if( x <= token.x + token.width ) break;
	}

	if( tn >= lZ && lZ > 0 )
	{
		token = line.get( --tn );
	}

	if( !token ) return 0;

	const dx = x - token.x;

	const text = token.text;

	let x1 = 0;

	let x2 = 0;

	let a;

	for( a = 0; a <= text.length; a++ )
	{
		x1 = x2;

		x2 = font.getAdvanceWidth( text.substr( 0, a ) );

		if( x2 >= dx ) break;
	}

	if( a > text.length ) a = text.length;

	if( dx - x1 < x2 - dx && a > 0 ) a--;

	return token.offset + a;
};


/*
| Returns the offset closest to a point.
*/
def.func.getPointOffset =
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
| A text has been inputed.
*/
def.func.input =
	function(
		text   // text inputed
	)
{
	const changes = [ ];

	const reg = /([^\n]+)(\n?)/g;

	let textPath = this.textPath;

	let at = this.mark.caret.at;

	for( let rx = reg.exec( text ); rx; rx = reg.exec( text ) )
	{
		const line = rx[ 1 ];

		changes.push(
			change_insert.create(
				'val', line,
				'path', textPath.chop,
				'at1', at,
				'at2', at + line.length
			)
		);

		if( rx[ 2 ] )
		{
			const textPath2 = textPath.set( -2, session_uid.newUid( ) );

			changes.push(
				change_split.create(
					'path', textPath.chop,
					'path2', textPath2.chop,
					'at1', at + line.length
				)
			);

			textPath = textPath2;

			at = 0;
		}
	}

	root.alter( changes );

	root.clearRetainX( );
};


/*
| Handles a special key.
*/
def.func.specialKey =
	function(
		key,
		doc,
		shift,
		ctrl
	)
{
	const mark = this.mark;

	let at, beginMark, retainx;

	if( ctrl )
	{
		switch( key )
		{
			case 'a' :

				const v0 = doc.atRank( 0 );

				const v1 = doc.atRank( doc.length - 1 );

				root.create(
					'mark',
						visual_mark_range.create(
							'doc', doc.fabric,
							'beginMark',
								visual_mark_text.create(
									'path', v0.textPath,
									'at', 0
								),
							'endMark',
								visual_mark_text.create(
									'path', v1.textPath,
									'at', v1.text.length
								)
						)
				);

				return true;
		}
	}

	switch( mark.timtype )
	{
		case visual_mark_caret :

/**/		if( CHECK )
/**/		{
/**/			if( !this.path.subPathOf( mark.caret.path ) ) throw new Error( );
/**/		}

			at = mark.caret.at;

			retainx = mark.retainx;

			if( shift ) beginMark = mark.textMark;

			break;

		case visual_mark_range :

/**/		if( CHECK )
/**/		{
/**/			if( !this.path.subPathOf( mark.caret.path ) ) throw new Error( );
/**/		}

			at = mark.caret.at;

			retainx = mark.retainx;

			if( shift ) beginMark = mark.beginMark;

			break;
	}

	const keyHandler = _keyMap[ key ];

	if( keyHandler )
	{
		this[ keyHandler ]( doc, at, retainx, beginMark );
	}
};


// FIXME
const _keyMap =
{
	'backspace' : '_keyBackspace',
	'del' : '_keyDel',
	'down' : '_keyDown',
	'end' : '_keyEnd',
	'enter' : '_keyEnter',
	'left' : '_keyLeft',
	'pagedown' : '_keyPageDown',
	'pageup' : '_keyPageUp',
	'pos1' : '_keyPos1',
	'right' : '_keyRight',
	'up' : '_keyUp'
};

if( FREEZE ) Object.freeze( _keyMap );


/*
| Backspace pressed.
*/
def.func._keyBackspace =
	function(
		doc,
		at
		// retainx,
		// beginMark
	)
{
	if( at > 0 )
	{
		root.alter(
			change_remove.create(
				'path', this.textPath.chop,
				'at1', at - 1,
				'at2', at,
				'val', this.text.substring( at - 1, at )
			)
		);

		root.clearRetainX( );

		return;
	}

	const r = doc.rankOf( this.key );

	if( r === 0 ) return;

	const ve = doc.atRank( r - 1 );

	root.alter(
		change_join.create(
			'path', ve.textPath.chop,
			'path2', this.textPath.chop,
			'at1', ve.text.length
		)
	);

	root.clearRetainX( );
};


/*
| Del-key pressed.
*/
def.func._keyDel =
	function(
		doc,
		at
		// retainx,
		// beginMark
	)
{
	if( at < this.text.length )
	{
		root.alter(
			change_remove.create(
				'path', this.textPath.chop,
				'at1', at,
				'at2', at + 1,
				'val', this.text.substring( at, at + 1 )
			)
		);

		root.clearRetainX( );

		return;
	}

	const r = doc.rankOf( this.key );

	if( r >= doc.length - 1 ) return;

	root.alter(
		change_join.create(
			'path', this.textPath.chop,
			'path2', doc.atRank( r + 1).textPath.chop,
			'at1', this.text.length
		)
	);

	root.clearRetainX( );
};


/*
| Down arrow pressed.
*/
def.func._keyDown =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	const flow = this.flow;

	const cPosLine = this.locateOffsetLine( at );

	const cPosP = this.locateOffsetPoint( at );

	const x = retainx !== undefined ? retainx : cPosP.x;

	if( cPosLine < flow.length - 1 )
	{
		// stays within this para
		this._setMark(
			this.getOffsetAt( cPosLine + 1, x ),
			x,
			beginMark,
			doc
		);

		return;
	}

	// goto next para
	const r = doc.rankOf( this.key );

	if( r < doc.length - 1 )
	{
		const ve = doc.atRank( r + 1 );

		at = ve.getOffsetAt( 0, x );

		ve._setMark( at, x, beginMark, doc );
	}
};


/*
| End-key pressed.
*/
def.func._keyEnd =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	this._setMark( this.text.length, undefined, beginMark, doc );
};


/*
| Enter-key pressed
*/
def.func._keyEnter =
	function(
		doc,
		at
		// retainx,
		// beginMark
	)
{
	const tpc = this.textPath.chop;

	root.alter(
		change_split.create(
			'path', tpc,
			'path2', tpc.set( -2, session_uid.newUid( ) ),
			'at1', at
		)
	);
};


/*
| Left arrow pressed.
*/
def.func._keyLeft =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	if( at > 0 )
	{
		this._setMark( at - 1, undefined, beginMark, doc );

		return;
	}

	const r = doc.rankOf( this.key );

	if( r > 0 )
	{
		const ve = doc.atRank( r - 1 );

		ve._setMark( ve.text.length, undefined, beginMark, doc );
	}
	else
	{
		this._setMark( at, undefined, beginMark, doc );
	}
};


/*
| User pressed page up or down
|
| FUTURE maintain relative scroll pos
*/
def.func._pageUpDown =
	function(
		dir,      // +1 for down, -1 for up
		doc,
		at,
		retainx,
		beginMark
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

	tpara._setMark( at, retainx, beginMark, doc );
};


/*
| PageDown key pressed.
*/
def.func._keyPageDown =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	this._pageUpDown( +1, doc, at, retainx, beginMark );
};


/*
| PageUp key pressed.
*/
def.func._keyPageUp =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	this._pageUpDown( -1, doc, at, retainx, beginMark );
};


/*
| Pos1-key pressed.
*/
def.func._keyPos1 =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	this._setMark( 0, undefined, beginMark, doc );
};


/*
| Right arrow pressed.
*/
def.func._keyRight =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	if( at < this.text.length )
	{
		this._setMark( at + 1, undefined, beginMark, doc );

		return;
	}

	const r = doc.rankOf( this.key );

	if( r < doc.length - 1 )
	{
		const ve = doc.atRank( r + 1 );

		ve._setMark( 0, undefined, beginMark, doc );
	}
};


/*
| Up arrow pressed.
*/
def.func._keyUp =
	function(
		doc,
		at,
		retainx,
		beginMark
	)
{
	const cPosLine = this.locateOffsetLine( at );

	const cPosP = this.locateOffsetPoint( at );

	const x = retainx !== undefined ? retainx : cPosP.x;

	if( cPosLine > 0 )
	{
		// stay within this para
		at = this.getOffsetAt( cPosLine - 1, x );

		this._setMark( at, x, beginMark, doc );

		return;
	}

	// goto prev para
	const r = doc.rankOf( this.key );

	if( r > 0 )
	{
		const ve = doc.atRank( r - 1 );

		at = ve.getOffsetAt( ve.flow.length - 1, x );

		ve._setMark( at, x, beginMark, doc );
	}
};


/*
| Sets the aheadValues for point and line of a given offset.
*/
def.func._locateOffset =
	function(
		offset    // the offset to get the point from.
	)
{
	const font = this.font;

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
			gleam_point.create(
				'x',
					Math.round(
						token.x
						+ font.getAdvanceWidth( text.substring( token.offset, offset ) )
					),
				'y', line.y
			);
	}
	else
	{
		p = gleam_point.create( 'x', 0, 'y', line.y );
	}

	tim.aheadFunctionInteger( this, 'locateOffsetLine', offset, lineN );

	tim.aheadFunctionInteger( this, 'locateOffsetPoint', offset, p );
};


/*
| Sets the users caret or range
*/
def.func._setMark =
	function(
		at,        // position to mark caret (or endMark of range)
		retainx,   // retains this x position when moving up/down
		beginMark, // beginMark when marking a range
		doc        // range mark need this
	)
{
	root.create(
		'mark',
			!beginMark
			? visual_mark_caret.create(
				'path', this.textPath,
				'at', at,
				'retainx', retainx
			)
			: visual_mark_range.create(
				'doc', doc.fabric,
				'beginMark', beginMark,
				'endMark',
					visual_mark_text.create(
						'path', this.textPath,
						'at', at
					),
				'retainx', retainx
			)
	);
};


} );
