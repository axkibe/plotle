/*
| Abstract parent of disc panels
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


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

		// display's device pixel ratio
		devicePixelRatio : { type : 'number' },

		// facet of the disc
		facet : { type : '../gleam/facet' },

		// the widget hovered upon
		hover : { type : [ 'undefined', '< ../trace/hover-types' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// shape of the disc',
		shape : { type : '../gleam/ellipse' },

		// form/disc currently shown
		// default doesn't care
		show : { type : 'undefined' },

		// designed size
		size : { type : '../gleam/size' },

		// reference to current space
		// default doesn't care
		spaceRef : { type : 'undefined' },

		// trace of the disc
		trace : { type : '../trace/disc' },

		// currently logged in user
		// default doesn't care
		user : { type : 'undefined' },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.twig = [ '< ../widget/types' ];
}

const action_none = tim.require( '../action/none' );
const gleam_glint_border = tim.require( '../gleam/glint/border' );
const gleam_glint_fill = tim.require( '../gleam/glint/fill' );
const gleam_glint_list = tim.require( '../gleam/glint/list' );
const gleam_glint_pane = tim.require( '../gleam/glint/pane' );
const gleam_glint_window = tim.require( '../gleam/glint/window' );
const gleam_rect = tim.require( '../gleam/rect' );
const gleam_size = tim.require( '../gleam/size' );
const gleam_transform = tim.require( '../gleam/transform' );
const layout_disc = tim.require( '../layout/disc' );
const trace_root = tim.require( '../trace/root' );
const widget_factory = tim.require( '../widget/factory' );


/*
| Creates an actual disc from a layout.
*/
def.static.createFromLayout =
	function(
		layout,          // of type layout_disc
		key,             // key of the disc
		transform,       // visual transformation
		show,            // currently show disc/form
		viewSize,        // viewSize
		devicePixelRatio // display's device pixel ratio
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 6 ) throw new Error( );
/**/	if( layout.timtype !== layout_disc ) throw new Error( );
/**/	if( viewSize.timtype !== gleam_size ) throw new Error( );
/**/    if( typeof( devicePixelRatio ) !== 'number' ) throw new Error( );
/**/}

	const trace = trace_root.singleton.appendDiscs.appendDisc( key );

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
		this.create(
			'twig:init', twig, layout.keys,
			'action', action_none.singleton,
			'controlTransform', transform,
			'devicePixelRatio', devicePixelRatio,
			'facet', layout.facet,
			'shape', layout.shape,
			'show', this.concernsShow( show ),
			'size', layout.size,
			'trace', trace,
			'viewSize', viewSize
		)
	);
};


/*
| Returns the hover when a 'trace'd disc concerns about it.
*/
def.static.concernsHover =
def.proto.concernsHover =
	function(
		hover,  // hover
		trace   // trace of the disc
	)
{
	if( !hover ) return;

	if( hover.hasTrace( trace ) ) return hover;
};


/*
| By default doesn't care about show.
*/
def.static.concernsShow =
def.proto.concernsShow =
	( ) => undefined;


/*
| By default doesn't care about spaceRef.
*/
def.static.concernsSpaceRef =
def.proto.concernsSpaceRef =
	( ) => undefined;


/*
| By default doesn't care about user.
*/
def.static.concernsUser =
def.proto.concernsUser =
	( ) => undefined;


/*
| Checks if the user clicked something on the panel
*/
def.proto.click =
	function(
		p,
		shift,
		ctrl
	)
{
	const tZone = this.tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	const pp = p.sub( tZone.pos );

	if( !this.tShape.within( pp ) ) return;

	// this is on the disc
	for( let widget of this )
	{
		const bubble = widget.click( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	return true;
};


/*
| Move during a dragging operation.
*/
def.proto.dragMove =
	function(
		p,
		shift,
		ctrl
	) { };


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
	const tZone = this.tZone;

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
		trace
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
	const a = [ gleam_glint_fill.createFacetShape( this.facet, this.tShape ) ];

	for( let widget of this )
	{
		const g = widget.glint;

		if( g ) a.push( g );
	}

	a.push( gleam_glint_border.createFacetShape( this.facet, this.tShape ) );

	const zone = this.tZone.funnel( 1 );

	// FUTURE GLINT inherit
	return(
		gleam_glint_window.create(
			'pane',
				gleam_glint_pane.create(
					'devicePixelRatio', devicePixelRatio,
					'glint', gleam_glint_list.create( 'list:init', a ),
					'size', zone.size,
					'tag', 'disc(' + this.key + ')'
				),
			'pos', zone.pos
		)
	);
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
	const tZone = this.tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	if( !this.tShape.within( p.sub( tZone.pos ) ) ) return;

	return true;
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
	const tZone = this.tZone;

	// shortcut if p is not near the panel
	if( !tZone.within( p ) ) return;

	const pp = p.sub( tZone.pos );

	// if p is not on the panel
	if( !this.tShape.within( pp ) ) return;

	return 'atween';
};


/*
| User is pressing a special key.
*/
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	// nothing
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
| The disc's transformed zone.
*/
def.lazy.tZone =
	function( )
{
	const ctz = this.controlTransform.zoom;

	const size = this.size;

	const vsr = this.viewSize.zeroRect;

	return(
		gleam_rect.create(
			'pos', vsr.pw.add( 0, -size.height * ctz / 2 ),
			'width', size.width * ctz,
			'height', size.height * ctz
		)
	);
};


} );
