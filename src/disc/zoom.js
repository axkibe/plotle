/*
| The zoom disc.
*/
'use strict';


tim.define( module, ( def, disc_zoom ) => {


def.extend = './disc';


if( TIM )
{
	def.attributes =
	{
		// users access to current space
		access : { type : [ 'undefined', 'string' ] },

		// currently active action
		action : { type : [ '< ../action/types' ] },

		// the current transform of controls
		controlTransform : { type : '../gleam/transform' },

		// facet of the disc
		facet : { type : '../gleam/facet' },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

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


const action_none = tim.require( '../action/none' );

const action_zoomButton = tim.require( '../action/zoomButton' );

const gleam_glint_border = tim.require( '../gleam/glint/border' );

const gleam_glint_fill = tim.require( '../gleam/glint/fill' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_pane = tim.require( '../gleam/glint/pane' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_transform = tim.require( '../gleam/transform' );

const layout_disc = tim.require( '../layout/disc' );

const widget_factory = tim.require( '../widget/factory' );


/*
| Doesn't care about show.
*/
def.static.concernsShow =
def.proto.concernsShow =
	( ) => undefined;


/*
| Doesn't care about spaceRef.
*/
def.static.concernsSpaceRef =
def.proto.concernsSpaceRef =
	( ) => undefined;


/*
| Doesn't care about user.
*/
def.static.concernsUser =
def.proto.concernsUser =
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

	for( let key of layout.keys )
	{
		twig[ key ] =
			widget_factory.createFromLayout(
				layout.get( key ),
				path.append( 'twig' ).append( key ),
				transform
			);
	}

	return(
		disc_zoom.create(
			'twig:init', twig, layout.keys,
			'action', action_none.singleton,
			'controlTransform', transform,
			'facet', layout.facet,
			'path', path,
			'shape', layout.shape,
			'show', disc_zoom.concernsShow( show ),
			'size', layout.size,
			'viewSize', viewSize
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
	const path = widget.path || this.path.append( 'twig' ).append( name );

	const hover = widget.concernsHover( this.hover, path );

	return(
		widget.create(
			'path', path,
			'hover', hover,
			'down', disc_zoom._isActiveButton( this.action, name ),
			'transform', this.controlTransform
		)
	);
};


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


/*
| The discs glint.
*/
def.lazy.glint =
	function( )
{
	const zone = this._tZone.enlarge1;

	// FUTURE GLINT inherit
	return(
		gleam_glint_window.create(
			'pane',
				gleam_glint_pane.create(
					'glint', this._glint,
					'size', zone.size
				),
			'pos', zone.pos
		)
	);
};


/*
| The disc's inner glint.
*/
def.lazy._glint =
	function( )
{
	const arr = [ gleam_glint_fill.createFacetShape( this.facet, this.tShape) ];

	for( let widget of this )
	{
		const g = widget.glint;

		if( g ) arr.push( g );
	}

	arr.push( gleam_glint_border.createFacetShape( this.facet, this.tShape ) );

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
def.lazy.tShape =
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
def.proto.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'zoom' ) throw new Error( );
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
def.proto.pointingHover =
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

	if( !this.tShape.within( pp ) ) return;

	// it's on the disc
	for( let widget of this )
	{
		const bubble = widget.pointingHover( pp, shift, ctrl );

		if( bubble ) return bubble;
	}
};


/*
| Checks if the user clicked something on the panel.
*/
def.proto.click =
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

	if( !this.tShape.within( pp ) ) return;

	for( let widget of this )
	{
		// this is on the disc
		const bubble = widget.click( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	return false;
};


/*
| User is inputing text.
*/
def.proto.input =
	function(
		text
	)
{
	return;
};


/*
| Cycles the focus
*/
def.proto.cycleFocus =
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
def.proto.probeClickDrag =
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
	if( !this.tShape.within( pp ) ) return;

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
def.proto.specialKey =
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
def.proto.dragMove =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	const action = this.action;

	if( action.timtype !== action_zoomButton ) return;

	return false;
};


/*
| Start of a dragging operation.
*/
def.proto.dragStart =
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

	if( !this.tShape.within( pp ) ) return;

	// it's on the disc
	for( let widget of this )
	{
		const bubble = widget.dragStart( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	// the dragging operation is on the panel
	// but it denies it.

	return false;
};


/*
| A button has been dragStarted.
*/
def.proto.dragStartButton =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'zoom' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'zoomIn' :

			root.alter( 'action', action_zoomButton.createZoom( 1 ) );

			root.changeSpaceTransformCenter( 1 );

			return;

		case 'zoomOut' :

			root.alter( 'action', action_zoomButton.createZoom( -1 ) );

			root.changeSpaceTransformCenter( -1 );

			return;
	}
};


/*
| Stop of a dragging operation.
*/
def.proto.dragStop =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	const action = this.action;

	if( action.timtype !== action_zoomButton ) return;

	root.alter( 'action', action_none.singleton );

	return false;
};


/*
| Mouse wheel.
*/
def.proto.mousewheel =
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

	if( !this.tShape.within( p.sub( tZone.pos ) ) ) return;

	return true;
};



} );
