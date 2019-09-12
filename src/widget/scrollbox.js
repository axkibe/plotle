/*
| A scrollbox.
*/
'use strict';


tim.define( module, ( def, widget_scrollbox ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// component hovered upon
		hover : { type : [ 'undefined', '< ../trace/hover-types' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// scroll position
		scrollPos : { type : '../gleam/point' },

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


const gleam_glint_list = tim.require( '../gleam/glint/list' );
const gleam_glint_pane = tim.require( '../gleam/glint/pane' );
const gleam_glint_window = tim.require( '../gleam/glint/window' );
const gleam_point = tim.require( '../gleam/point' );
const gleam_size = tim.require( '../gleam/size' );
const layout_scrollbox = tim.require( '../layout/scrollbox' );
const shell_settings = tim.require( '../shell/settings' );
const widget_factory = tim.require( './factory' );
const widget_scrollbar = tim.require( './scrollbar' );


/*
| Returns the hover if a 'trace'd button concerns about it.
*/
def.static.concernsHover =
def.proto.concernsHover =
	function(
		hover,
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/}

	if( hover && hover.hasTrace( trace ) ) return hover;
};


/*
| Creates an actual widget from a layout.
*/
def.static.createFromLayout =
	function(
		layout,     // of type layout_label
		trace,      // trace of the widget
		transform,  // visual transformation
		devicePixelRatio  // display's device pixel ratio
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/	if( layout.timtype !== layout_scrollbox ) throw new Error( );
/**/	if( typeof( devicePixelRatio ) !== 'number' ) throw new Error( );
/**/}

	const twig = { };

	for( let wKey of layout.keys )
	{
		twig[ wKey ] =
			widget_factory.createFromLayout(
				layout.get( wKey ),
				trace.appendWidget( wKey ),
				transform,
				devicePixelRatio
			);
	}

	return(
		widget_scrollbox.create(
			'devicePixelRatio', devicePixelRatio,
			'scrollbarYOffset', layout.scrollbarYOffset,
			'scrollPos', gleam_point.zero,
			'trace', trace,
			'transform', transform,
			'zone', layout.zone,
			'twig:init', twig, layout.keys
		)
	);
};


/*
| Adjusts widgets.
*/
def.adjust.get =
	function(
		name,
		widget
	)
{
	let trace = widget.trace;

	if( !trace && this.trace ) trace = this.trace.appendWidget( name );

	const hover = widget.concernsHover( this.hover, trace );

	return(
		widget.create(
			'hover', hover,
			'mark', this.mark,
			'trace', trace
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

	const zone = this._zone;

	let glint =
		gleam_glint_window.create(
			'pane',
				gleam_glint_pane.create(
					'devicePixelRatio', this.devicePixelRatio,
					'glint', gleam_glint_list.create( 'list:init', arr ),
					'offset', this.scrollPos.negate,
					'size', zone.size,
					'tag', 'scrollbox(' + this.trace.key + ')'
				),
			'pos', zone.pos
		);

	const sbary = this.scrollbarY;

	if( sbary ) glint = gleam_glint_list.create( 'list:init', [ glint, sbary.glint ] );

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
	if( !this.hasScrollbarY ) return;

	const innerSize = this.innerSize;

	const scrollbarYOffset = this.scrollbarYOffset;

	const zone = this.zone;

	return(
		widget_scrollbar.create(
			'aperture', zone.height,
			'max', innerSize.height,
			'pos',
				zone.pos.add(
					zone.width + scrollbarYOffset.x,
					scrollbarYOffset.y
				),
			'scrollPos', this.scrollPos.y,
			'size', zone.height,
			'trace', this.trace.appendWidget( 'scrollbarY' ),
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
def.proto.click =
	function(
		p,
		shift,
		ctrl
	)
{
	p =
		gleam_point.createXY(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( let widget of this )
	{
		const bubble = widget.click( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}
};


/*
| Starts an operation with the pointing device held down.
*/
def.proto.dragStart =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	const sbary = this.scrollbarY;

	if( sbary )
	{
		const bubble = sbary.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

	p =
		gleam_point.createXY(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( let widget of this )
	{
		const bubble = widget.click( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}
};


/*
| User is hovering his/her pointer (mouse move).
*/
def.proto.pointingHover =
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
		gleam_point.createXY(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( let widget of this )
	{
		const bubble = widget.pointingHover( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}
};


/*
| Mouse wheel is being turned.
*/
def.proto.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	if( !this._zone.within( p ) ) return;

	p =
		gleam_point.createXY(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( let widget of this )
	{
		const bubble = widget.mousewheel( p, dir, shift, ctrl );

		if( bubble ) return bubble;
	}

	let y = this.scrollPos.y - dir * shell_settings.textWheelSpeed;

	if( y < 0 ) y = 0;

	root.alter( this.trace.appendScrollPos, this.scrollPos.create( 'y', y ) );
};


/*
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	const sp = this.scrollPos;
/**/
/**/	if( sp.x < 0 || sp.y < 0 ) throw new Error( );
/**/}
};


} );
