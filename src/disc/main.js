/*
| The disc panel.
*/
'use strict';


tim.define( module, ( def, disc_main ) => {


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
		hover : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// path of the disc
		path : { type : 'tim.js/src/path/path' },

		// shape of the disc
		shape : { type : '../gleam/ellipse' },

		// currently form/disc shown
		show : { type : [ '< ../show/types' ] },

		// designed size
		size : { type : '../gleam/size' },

		// reference to current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.twig =
	[
		'../widget/button',
		'../widget/checkbox',
		'../widget/input',
		'../widget/label'
	];
}


const action_none = require( '../action/none' );

const action_select = require( '../action/select' );

const change_shrink = require( '../change/shrink' );

const gleam_glint_border = require( '../gleam/glint/border' );

const gleam_glint_fill = require( '../gleam/glint/fill' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_transform = require( '../gleam/transform' );

const layout_disc = require( '../layout/disc' );

const result_hover = require( '../result/hover' );

const show_create = require( '../show/create' );

const show_form = require( '../show/form' );

const show_normal = require( '../show/normal' );

const show_zoom = require( '../show/zoom' );

const widget_factory = require( '../widget/factory' );



/*
| Does(!) care about show.
*/
def.static.concernsShow =
def.proto.concernsShow =
	( show ) => show;


/*
| Does(!) care about spaceRef.
*/
def.static.concernsSpaceRef =
def.proto.concernsSpaceRef =
	( spaceRef ) => spaceRef;


/*
| Does(!) care about user.
*/
def.static.concernsUser =
def.proto.concernsUser =
	( user ) => user;


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
			widget_factory.createFromLayout(
				iLayout,
				path.append( 'twig' ).append( key ),
				transform
			);

		twig[ key ] = item;
	}

	return(
		disc_main.create(
			'twig:init', twig, layout._ranks,
			'action', action_none.create( ),
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
| Adjusts widgets.
*/
def.adjust.get =
	function(
		name,
		widget
	)
{
	const action = this.action;

	const show = this.show;

	let text = pass;

	let visible = pass;

	let down;

	switch( name )
	{
		case 'create' :

			visible = this.access === 'rw' && this.spaceRef !== undefined;

			down = show.timtype === show_create;

			break;

		case 'login' :

			visible = true;

			text =
				!this.user || this.user.isVisitor
				? 'log\nin'
				: 'log\nout';

			down = show.timtype === show_form && show.formName === 'login';

			break;

		case 'moveTo' :

			visible = true;

			down = show.timtype === show_form && show.formName === 'moveTo';

			break;

		case 'normal' :

			visible = this.spaceRef !== undefined;

			down = show.timtype !== show_normal ? false : action.normalButtonDown;

			break;

		case 'remove' :

			visible = !!( this.access === 'rw' && this.mark && this.mark.itemPaths );

			down = false;

			break;

		case 'select' :

			visible = this.spaceRef !== undefined && this.access === 'rw';

			down = action && action.timtype === action_select;

			break;

		case 'signUp' :

			visible = this.user ? this.user.isVisitor : true;

			down = show.timtype === show_form && show.formName === 'signUp';

			break;

		case 'space' :

			if( this.spaceRef )
			{
				text = this.spaceRef.fullname;

				visible = true;
			}
			else
			{
				visible = false;
			}

			down = show.timtype === show_form && show.formName === 'space';

			break;

		case 'user' :

			text = this.user ? this.user.name : '';

			visible = true;

			down = show.timtype === show_form && show.formName === 'user';

			break;

		case 'zoom' :

			visible = this.spaceRef !== undefined;

			down = show.timtype === show_zoom;

			break;

		default :

			visible = true;

			down = false;

			break;
	}

	const path = widget.path || this.path.append( 'twig' ).append( name );

	const hover = widget.concernsHover( this.hover, path );

	return(
		widget.create(
			'hover', hover,
			'down', down,
			'path', path,
			'text', text,
			'visible', visible,
			'transform', this.controlTransform
		)
	);
};


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
			'rect', this.tZone.enlarge1,
			'offset', gleam_point.zero
		)
	);
};


/*
| Returns the panel's inner glint.
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
def.proto.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
	const discname = path.get( 2 );

/**/if( CHECK )
/**/{
/**/	if( discname !== 'main' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	if(
		buttonName === 'login'
		&& this.user && !this.user.isVisitor
	)
	{
		root.logout( );

		return;
	}

	switch( buttonName )
	{
		case 'normal' :

			root.showHome( );

			break;

		case 'remove' :
		{
			const paths = this.mark.itemPaths;

			const changes = [ ];

			const ranks = [ ];

			for( let p = 0, pZ = paths.length; p < pZ; p++ )
			{
				const pi = paths.get( p );

				const rank = root.spaceFabric.rankOf( pi.get( 2 ) );

				let rc = 0;

				for( let r = 0, rZ = ranks.length; r < rZ; r++ )
				{
					if( ranks[ r ] <= rank ) rc++;
				}

				ranks.push( rank );

				changes[ p ] =
					change_shrink.create(
						'path', pi.chop,
						'prev', root.spaceFabric.getPath( pi.chop ),
						'rank', rank - rc
					);

			}

			root.alter( changes );

			break;
		}

		case 'select' :

			root.create(
				'action', action_select.create( ),
				'show', show_normal.create( )
			);

			break;

		case 'create' :

			root.create( 'action', action_none.create( ), 'show', show_create.create( ) );

			break;

		case 'login' :
		case 'moveTo' :
		case 'signUp' :
		case 'space' :
		case 'user' :

			root.create( 'show', show_form[ buttonName ] );

			break;

		case 'zoom' :

			root.create( 'show', show_zoom.create( ) );

			break;

		default : throw new Error( );
	}
};


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
	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	const pp = p.sub( this.tZone.pos );

	if( !this._tShape.within( pp ) ) return;

	// this is on the disc
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		this.atRank( r ).click( pp, shift, ctrl );
	}

	return true;
};


/*
| Start of a dragging operation.
*/
def.proto.dragStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	if(
		!this._tShape.within(
			p.sub( this.tZone.pos )
		)
	)
	{
		return;
	}

	// the dragging operation is on the panel
	// but it denies it.
	return false;
};


/*
| Move during a dragging operation.
*/
def.proto.dragMove =
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
def.proto.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	return;
};



/*
| User is inputing text.
*/
def.proto.input =
	function(
		// text
	)
{
	return;
};


/*
| Mouse wheel.
*/
def.proto.mousewheel =
	function(
		p
		// dir,
		// shift,
		// ctrl
	)
{
	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	if(
		!this._tShape.within(
			p.sub( this.tZone.pos )
		)
	)
	{
		return;
	}

	return true;
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
	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	const pp = p.sub( this.tZone.pos );

	if( !this._tShape.within( pp ) ) return;

	// this is on the disc
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const bubble =
			this.atRank( r )
			.pointingHover( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	return result_hover.cursorDefault;
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
	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	if( !this._tShape.within( p.sub( this.tZone.pos ) ) ) return;

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

} );