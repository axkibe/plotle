/*
| A scrollbox.
*/
'use strict';


tim.define( module, ( def, widget_scrollbox ) => {


if( TIM )
{
	def.attributes =
	{
		// component hovered upon
		hover : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// scroll position
		scrollPos : { type : '../gleam/point' },

		// the transform
		transform : { type : '../gleam/transform' },

		// offset of the scrollbar
		scrollbarYOffset :
		{
			type : '../gleam/point',
			defaultValue : 'require( "../gleam/point" ).zero'
		},

		// designed zone
		zone : { type : '../gleam/rect' },
	};

	def.twig = [ '< ./types' ];
}


const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_size = require( '../gleam/size' );

const layout_scrollbox = require( '../layout/scrollbox' );

const shell_settings = require( '../shell/settings' );

const widget_scrollbar = require( './scrollbar' );

const widget_widget = require( './widget' );


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.func._check =
/**/		function( )
/**/	{
/**/		const sp = this.scrollPos;
/**/
/**/		if( sp.x < 0 || sp.y < 0 ) throw new Error( );
/**/	};
/**/}


/*
| Returns the hover path if the width with 'path' concerns about the hover.
*/
def.static.concernsHover =
def.func.concernsHover =
	function(
		hover,
		path
	)
{
	return hover && path.subPathOf( hover ) ? hover : undefined;
};


/*
| Returns the mark if the widget with 'path' concerns about the mark.
*/
def.func.concernsMark =
def.static.concernsMark =
	function(
		mark,
		path
	)
{
	return mark && mark.containsPath( path ) ? mark : undefined;
};


/*
| Creates an actual widget from a layout.
*/
def.static.createFromLayout =
	function(
		layout,     // of type layout_label
		path,       // path of the widget
		transform   // visual transformation
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/
/**/	if( layout.timtype !== layout_scrollbox ) throw new Error( );
/**/}

	const twig = { };

	for( let a = 0, aZ = layout.length; a < aZ; a++ )
	{
		const key = layout.getKey( a );

		const iLayout = layout.get( key );

		const item =
			widget_widget.createFromLayout(
				iLayout,
				path.append( 'twig' ).append( key ),
				transform
			);

		twig[ key ] = item;
	}

	return(
		widget_scrollbox.create(
			'twig:init', twig, layout._ranks,
			'path', path,
			'scrollbarYOffset', layout.scrollbarYOffset,
			'scrollPos', gleam_point.zero,
			'transform', transform,
			'zone', layout.zone
		)
	);
};


/*
| Transforms widgets.
*/
def.transform.get =
	function(
		name,
		widget
	)
{
	let path = widget.path;

	if( !path && this.path ) path = this.path.append( 'twig' ).append( name );

	return(
		widget.create(
			'path', path,
			'hover', this.hover,
			'mark', this.mark
		)
	);
};


/*
| Prepares the scroll position to fit innerSize/zone parameters
*/
def.static.prepareScrollPos =
	function(
		scrollPos,
		innerSize,
		zone
	)
{
	if( scrollPos === undefined || innerSize.height <= zone.height )
	{
		return gleam_point.zero;
	}

	if( scrollPos.x < 0 || scrollPos.y < 0 )
	{
		scrollPos =
			scrollPos.create(
				'x', Math.max( 0, this.scrollPos.x ),
				'y', Math.max( 0, this.scrollPos.y )
			);
	}

	if(
		innerSize.height > zone.height
		&& scrollPos.y > innerSize.height - zone.height
	)
	{
		scrollPos = scrollPos.create( 'y', innerSize.height - zone.height );
	}

	return scrollPos;
};


/*
| The widget's glint.
*/
def.lazy.glint =
	function( )
{
	const arr = [ ];

	for( let r = this.length - 1; r >= 0; r-- )
	{
		const w = this.atRank( r );

		const sg = w.glint;

		if( sg ) arr.push( sg );
	}

	let glint =
		gleam_glint_window.create(
			'glint', gleam_glint_list.create( 'list:init', arr ),
			'rect', this._zone,
			'offset', gleam_point.xy( -this.scrollPos.x, -this.scrollPos.y )
		);

	const sbary = this.scrollbarY;

	if( sbary )
	{
		glint = gleam_glint_list.create( 'list:init', [ glint, sbary.glint ] );
	}

	return glint;
};


/*
| The widget's inner height and width
*/
def.lazy.innerSize =
	function( )
{
	let w = 0;

	let h = 0;

	for( let r = this.length - 1; r >= 0; r-- )
	{
		const widget = this.atRank( r );

		const pse = widget.zone.pse;

		if( pse.x > w ) w = pse.x;

		if( pse.y > h ) h = pse.y;
	}

	return gleam_size.wh( w, h );
};


/*
| The transformed zone.
*/
def.lazy._zone =
	function( )
{
	return this.zone.transform( this.transform );
};


/*
| Is true when the scrollbox has a vertical bar.
*/
def.lazy.hasScrollbarY =
	function( )
{
	return this.innerSize.height > this.zone.height;
};


def.lazy.scrollbarY =
	function( )
{
	if( !this.hasScrollbarY ) return undefined;

	const innerSize = this.innerSize;

	const scrollbarYOffset = this.scrollbarYOffset;

	const zone = this.zone;

	return(
		widget_scrollbar.create(
			'aperture', zone.height,
			'max', innerSize.height,
			'path', this.path.append( 'scrollbarY' ),
			'pos',
				zone.pos.add(
					zone.width + scrollbarYOffset.x,
					scrollbarYOffset.y
				),
			'scrollpos', this.scrollPos.y,
			'size', zone.height,
			'transform', this.transform
		)
	);
};


/*
| Returns a fixed scrollPos if
| current is out of bonds.
|
| Used by parents transformative getter.
*/
def.lazy.fixScrollPos =
	function( )
{
	const y = this.scrollPos.y;

	let maxY = this.innerSize.height - this.zone.height;

	if( maxY < 0 ) maxY = 0;

	if( y <= maxY ) return pass;

	return this.scrollPos.create( 'y', maxY );
};


/*
| User clicked.
*/
def.func.click =
	function(
		p,
		shift,
		ctrl
	)
{
	p =
		gleam_point.xy(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const res = this.atRank( r ).click( p, shift, ctrl );

		if( res !== undefined ) return res;
	}

	return undefined;
};


/*
| Starts an operation with the pointing device held down.
*/
def.func.dragStart =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const sbary = this.scrollbarY;

	if( sbary )
	{
		const bubble = sbary.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

	p =
		gleam_point.xy(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const res = this.atRank( r ).click( p, shift, ctrl );

		if( res !== undefined ) return res;
	}

	return undefined;
};


/*
| User is hovering his/her pointer (mouse move).
*/
def.func.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	const sbary = this.scrollbarY;

	if( sbary )
	{
		const bubble = sbary.pointingHover( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

	p =
		gleam_point.xy(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const bubble = this.atRank( r ).pointingHover( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

	return undefined;
};


/*
| Mouse wheel is being turned.
*/
def.func.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	if( !this._zone.within( p ) ) return;

	p =
		gleam_point.xy(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const res = this.atRank( r ).mousewheel( p, dir, shift, ctrl );

		if( res ) return res;
	}

	let y = this.scrollPos.y - dir * shell_settings.textWheelSpeed;

	if( y < 0 ) y = 0;

	root.setPath(
		this.path.append( 'scrollPos' ),
		this.scrollPos.create( 'y', y )
	);
};


} );
