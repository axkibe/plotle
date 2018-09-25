/*
| The creation disc.
*/
'use strict';


tim.define( module, ( def, disc_createDisc ) => {


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

		// the widget hovered upon',
		hover :
		{
			type : [ 'undefined', 'tim.js/path' ],
			prepare : 'self.concernsHover( hover, path )'
		},

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// path of the disc
		path : { type : 'tim.js/path' },

		// shape of the disc
		shape : { type : '../gleam/ellipse' },

		// currently form/disc shown
		show : { type : [ '< ../show/types' ], assign: '' },

		// designed size
		size : { type : '../gleam/size' },

		// reference to current space
		spaceRef : { type : [ 'undefined', '../ref/space' ], assign : '' },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ], assign : '' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.twig = [ '< ../widget/types' ];
}


const action_createGeneric = require( '../action/createGeneric' );

const action_createRelation = require( '../action/createRelation' );

const disc_disc = require( './disc' );

const gleam_glint_border = require( '../gleam/glint/border' );

const gleam_glint_fill = require( '../gleam/glint/fill' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_transform = require( '../gleam/transform' );

const layout_disc = require( '../layout/disc' );

const visual_label = require( '../visual/label' );

const visual_note = require( '../visual/note' );

const visual_portal = require( '../visual/portal' );

const widget_widget = require( '../widget/widget' );


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
		disc_createDisc.create(
			'twig:init', twig, layout._ranks,
			'controlTransform', transform,
			'facet', layout.facet,
			'path', path,
			'shape', layout.shape,
			'show', show,
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
	return(
		widget.create(
			'path',
				 widget.path
				 ? pass
				 : this.path.append( 'twig' ).append( name ),
			'hover', this.hover,
			'down', disc_createDisc._isActiveButton( this.action, name ),
			'transform', this.controlTransform
		)
	);
};


/*
| Deriving concerns stuff.
*/
def.static.concernsHover = disc_disc.concernsHover;


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
	if( !action ) return false;

	switch( action.timtype )
	{
		case action_createGeneric :

			switch( action.itemType )
			{
				case visual_note   : return wname === 'createNote';

				case visual_label  : return wname === 'createLabel';

				case visual_portal : return wname === 'createPortal';
			}

			return false;

		case action_createRelation :

			return wname === 'createRelation';

		default :

			return false;
	}
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
	const arr =
		[
			gleam_glint_fill.create(
				'facet', this.facet,
				'shape', this._tShape
			)
		];

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const g = this.atRank( r ).glint;

		if( g ) arr.push( g );
	}

	arr.push(
		gleam_glint_border.create(
			'facet', this.facet,
			'shape', this._tShape
		)
	);

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


/*:::::::::::.
:: Functions
'::::::::::::*/


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

	return 'atween';
};


/*
| A button of the main disc has been pushed.
*/
def.func.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'createDisc' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'createLabel' :

			root.create(
				'action',
					action_createGeneric.create(
						'itemType', visual_label
					)
			);

			return;

		case 'createNote' :

			root.create(
				'action',
					action_createGeneric.create(
						'itemType', visual_note
					)
			);

			return;

		case 'createPortal' :

			root.create(
				'action',
					action_createGeneric.create(
						'itemType', visual_portal
					)
			);

			return;

		case 'createRelation' :

			root.create(
				'action',
					action_createRelation.create(
						'relationState', 'start'
					)
			);

			return;

		default :

			throw new Error( );
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

	if( !this._tShape.within( p.sub( tZone.pos ) ) ) return;

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
	return false;
};


/*
| Move during a dragging operation.
*/
def.func.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	return;
};


/*
| Stop of a dragging operation.
*/
def.func.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	return;
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


/*
| User is pressing a special key.
*/
def.func.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	// not implemented
};


} );

