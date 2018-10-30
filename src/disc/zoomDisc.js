/*
| The zoom disc.
*/
'use strict';


tim.define( module, ( def, disc_zoomDisc ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// users access to current space
		access : { type : [ 'undefined', 'string' ] },

		// currently active action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the current transform of controls
		controlTransform : { type : '../gleam/transform' },

		// facet of the disc
		facet : { type : '../gleam/facet' },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// path of the disc
		path : { type : 'tim.js/path' },

		// shape of the disc',
		shape : { type : '../gleam/ellipse' },

		// form/disc currently shown
		show : { type : 'undefined' },

		// designed size
		size : { type : '../gleam/size' },

		// reference to current space
		spaceRef : { type : 'undefined' },

		// currently logged in user
		user : { type : 'undefined' },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.twig = [ '< ../widget/types' ];
}


const action_zoomButton = require( '../action/zoomButton' );

const gleam_glint_border = require( '../gleam/glint/border' );

const gleam_glint_fill = require( '../gleam/glint/fill' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_transform = require( '../gleam/transform' );

const layout_disc = require( '../layout/disc' );

const widget_widget = require( '../widget/widget' );


/*
| Doesn't care about show.
*/
def.static.concernsShow =
def.func.concernsShow =
	( ) => undefined;


/*
| Doesn't care about spaceRef.
*/
def.static.concernsSpaceRef =
def.func.concernsSpaceRef =
	( ) => undefined;


/*
| Doesn't care about user.
*/
def.static.concernsUser =
def.func.concernsUser =
	( ) => undefined;


/*
| Creates an actual disc from a layout.
*/
def.static.createFromLayout =
	function(
		layout,     // of type layout_disc
		path,       // path of the widget
		transform,  // visual transformation
		show,       // currently show disc/form
		viewSize    // viewSize
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 5 ) throw new Error( );
/**/
/**/	if( layout.timtype !== layout_disc ) throw new Error( );
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
		disc_zoomDisc.create(
			'twig:init', twig, layout._ranks,
			'controlTransform', transform,
			'facet', layout.facet,
			'path', path,
			'shape', layout.shape,
			'show', disc_zoomDisc.concernsShow( show ),
			'size', layout.size,
			'viewSize', viewSize
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
	const path = widget.path || this.path.append( 'twig' ).append( name );

	const hover = widget.concernsHover( this.hover, path );

	return(
		widget.create(
			'path', path,
			'hover', hover,
			'down', disc_zoomDisc._isActiveButton( this.action, name ),
			'transform', this.controlTransform
		)
	);
};


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Returns true if the button called 'wname'
| should be highlighted for current 'action'
*/
def.static._isActiveButton =
	function(
		action,  // the action
		wname    // the widget name
	)
{
	return false;
};



/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The discs glint.
*/
def.lazy.glint =
	function( )
{
	// FUTURE GLINT inherit
	return(
		gleam_glint_window.create(
			'glint', this._glint,
			'rect', this._tZone.enlarge1,
			'offset', gleam_point.zero
		)
	);
};


/*
| The disc's inner glint.
*/
def.lazy._glint =
	function( )
{
	const arr = [ gleam_glint_fill.createFS( this.facet, this._tShape) ];

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const g = this.atRank( r ).glint;

		if( g ) arr.push( g );
	}

	arr.push( gleam_glint_border.createFS( this.facet, this._tShape ) );

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| The disc's transformed zone.
*/
def.lazy._tZone =
	function( )
{
	const ctz = this.controlTransform.zoom;

	const size = this.size;

	const vsr = this.viewSize.zeroRect;

	return(
		gleam_rect.create(
			'pos', vsr.pw.add( 0, -size.height * ctz / 2 ),
			'width', size.width * ctz + 1,
			'height', size.height * ctz + 1
		)
	);
};


/*
| The disc's transformed shape.
*/
def.lazy._tShape =
	function( )
{
	return(
		this.shape
		.transform(
			gleam_transform.create(
				'offset', this.size.zeroRect.pw,
				'zoom', 1
			)
		)
		.transform( this.controlTransform )
	);
};


/*
| A button of the main disc has been pushed.
*/
def.func.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'zoomDisc' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	// zoomIn and zoomOut are handled
	// via "dragging" operations so holding
	// makes multiple events

	switch( buttonName )
	{
		case 'zoomAll' : root.changeSpaceTransformAll( ); return;

		case 'zoomHome' : root.changeSpaceTransformHome( ); return;

		default : throw new Error( );
	}

};


/*
| Returns true if point is on the disc panel.
*/
def.func.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	const tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	const pp = p.sub( tZone.pos );

	if( !this._tShape.within( pp ) ) return;

	// it's on the disc
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const bubble = this.atRank( r ).pointingHover( pp, shift, ctrl );

		if( bubble ) return bubble;
	}
};


/*
| Checks if the user clicked something on the panel.
*/
def.func.click =
	function(
		p,
		shift,
		ctrl
	)
{
	const tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	const pp = p.sub( tZone.pos );

	if( !this._tShape.within( pp ) ) return;

	// this is on the disc
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const bubble = this.atRank( r ).click( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	return false;
};


/*
| User is inputing text.
*/
def.func.input =
	function(
		text
	)
{
	return;
};


/*
| Cycles the focus
*/
def.func.cycleFocus =
	function(
		dir
	)
{
	throw new Error( );
};


/*
| The pointing device just went down.
| Probes if the system ought to wait if it's
| a click or can initiate a drag right away.
*/
def.func.probeClickDrag =
	function(
		p,
		shift,
		ctrl
	)
{
	const tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	const pp = p.sub( tZone.pos );

	// if p is not on the panel
	if( !this._tShape.within( pp ) ) return;

	if(
		this.get( 'zoomIn' ).within( pp )
		|| this.get( 'zoomOut' ).within( pp )
	)
	{
		return 'drag';
	}

	return 'atween';
};


/*
| User is pressing a special key.
*/
def.func.specialKey =
	function(
	//	key,
	//	shift,
	//	ctrl
	)
{
	// not implemented
};


/*
| Move during a dragging operation.
*/
def.func.dragMove =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	const action = this.action;

	if( !action || action.timtype !== action_zoomButton ) return;

	return false;
};


/*
| Start of a dragging operation.
*/
def.func.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	const tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	const pp = p.sub( tZone.pos );

	if( !this._tShape.within( pp ) ) return;

	// it's on the disc
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const bubble = this.atRank( r ).dragStart( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	// the dragging operation is on the panel
	// but it denies it.

	return false;
};


/*
| A button has been dragStarted.
*/
def.func.dragStartButton =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'zoomDisc' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'zoomIn' :

			root.create(
				'action', action_zoomButton.createZoom( 1 )
			);

			root.changeSpaceTransformCenter( 1 );

			return;

		case 'zoomOut' :

			root.create(
				'action', action_zoomButton.createZoom( -1 )
			);

			root.changeSpaceTransformCenter( -1 );

			return;
	}
};


/*
| Stop of a dragging operation.
*/
def.func.dragStop =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	const action = this.action;

	if( !action || action.timtype !== action_zoomButton ) return;

	root.create( 'action', action.create( 'refire', false ) );

	return false;
};


/*
| Mouse wheel.
*/
def.func.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	const tZone = this._tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	if( !this._tShape.within( p.sub( tZone.pos ) ) ) return;

	return true;
};



} );
