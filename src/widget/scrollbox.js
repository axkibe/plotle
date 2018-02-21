/*
| A scrollbox.
*/
'use strict';


tim.define( module, 'widget_scrollbox', ( def, widget_scrollbox ) => {


const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_size = require( '../gleam/size' );

const shell_settings = require( '../shell/settings' );

const widget_scrollbar = require( './scrollbar' );

const widget_widget = require( './widget' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		// component hovered upon
		hover :
		{
			type : [ 'undefined', 'tim.js/path' ],
			prepare : 'self.concernsHover( hover, path )'
		},

		// the users mark
		mark :
		{
			type : tim.typemap( module, '../visual/mark/mark' ).concat( ['undefined' ] ),

			assign : ''
		},

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// scroll position
		// is defined by force in _init
		scrollPos : { type : [ 'undefined', '../gleam/point' ] },

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

	def.init = [ 'twigDup' ];

	def.twig = tim.typemap( module, './widget' );
}


/*
| Initializer.
*/
def.func._init =
	function(
		twigDup
	)
{
	if( !this.path ) return;

	// all components of the form
	const twig = twigDup ? this._twig : tim.copy( this._twig );

	const ranks = this._ranks;

	for( let r = 0, rZ = ranks.length; r < rZ; r++ )
	{
		const name = ranks[ r ];

		const w = twig[ name ];

		const path = w.path || this.path.append( 'twig' ).append( name );

		twig[ name ] =
			w.create(
				'path', path,
				'hover', this.hover,
				'mark', this.mark
			);
	}

	const innerSize = this.innerSize;

	const zone = this.zone;

	if(
		this.scrollPos === undefined
		|| innerSize.height <= zone.height
	)
	{
		this.scrollPos = gleam_point.zero;
	}
	else if( this.scrollPos.x < 0 || this.scrollPos.y < 0 )
	{
		this.scrollPos =
			this.scrollPos.create(
				'x', Math.max( 0, this.scrollPos.x ),
				'y', Math.max( 0, this.scrollPos.y )
			);
	}

	if(
		innerSize.height > zone.height
		&& this.scrollPos.y > innerSize.height - zone.height
	)
	{
		this.scrollPos =
			this.scrollPos.create(
				'y', innerSize.height - zone.height
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Deriving concerns stuff.
*/
def.static.concernsHover = widget_widget.concernsHover;


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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


/*:::::::::::.
:: Functions
'::::::::::::*/


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

	root.setPath(
		this.path.append( 'scrollPos' ),
		this.scrollPos.create(
			'y',
				this.scrollPos.y
				- dir * shell_settings.textWheelSpeed
		)
	);
};


} );
