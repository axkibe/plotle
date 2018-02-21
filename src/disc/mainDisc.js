/*
| The disc panel.
*/
'use strict';


tim.define( module, ( def ) => {


const action_select = require( '../action/select' );

const change_shrink = require( '../change/shrink' );

const disc_disc = require( './disc' );

const gleam_glint_border = require( '../gleam/glint/border' );

const gleam_glint_fill = require( '../gleam/glint/fill' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_window = require( '../gleam/glint/window' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_transform = require( '../gleam/transform' );

const result_hover = require( '../result/hover' );

const show_create = require( '../show/create' );

const show_form = require( '../show/form' );

const show_normal = require( '../show/normal' );

const show_zoom = require( '../show/zoom' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		// users access to current space
		access : { type : [ 'undefined', 'string' ] },

		// currently active action
		action :
		{
			type : tim.typemap( module, '../action/action' ).concat( [ 'undefined' ] )
		},

		// the current transform of controls
		controlTransform : { type : '../gleam/transform' },

		// facet of the disc
		facet : { type : '../gleam/facet' },

		// the widget hovered upon
		hover :
		{
			type : [ 'undefined', 'tim.js/path' ],
			prepare : 'self.concernsHover( hover, path )',
		},

		// the users mark
		mark :
		{
			type : tim.typemap( module, '../visual/mark/mark' ).concat( [ 'undefined' ] ),
		},

		// path of the disc
		path : { type : 'tim.js/path' },

		// shape of the disc
		shape : { type : '../gleam/ellipse' },

		// currently form/disc shown
		show : { type : tim.typemap( module, '../show/show' ) },

		// designed size
		size : { type : '../gleam/size' },

		// reference to current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// current view size
		viewSize : { type : '../gleam/size' }
	};

	def.init = [ 'inherit', 'twigDup' ];

	def.twig =
	[
		'../widget/button',
		'../widget/checkbox',
		'../widget/input',
		'../widget/label'
	];
}


/*
| Deriving concerns stuff.
*/
def.static.concernsHover = disc_disc.concernsHover;


/*
| Initializes the main disc.
*/
def.func._init =
	function(
		inherit,
		twigDup
	)
{
	const twig = twigDup ? this._twig : tim.copy( this._twig );

	const action = this.action;

	const show = this.show;

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const wname = this.getKey( r );

		let text = pass;

		let visible = pass;

		let down;

		switch( wname )
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

				down =
					show.timtype === show_form
					&& show.formName === 'login';

				break;

			case 'moveTo' :

				visible = true;

				down =
					show.timtype === show_form
					&& show.formName === 'moveTo';

				break;

			case 'normal' :

				visible = this.spaceRef !== undefined;

				if( show.timtype !== show_normal )
				{
					down = false;
				}
				else
				{
					down =
						action
						? action.normalButtonDown
						: true;
				}

				break;

			case 'remove' :

				visible =
					!!(
						this.access === 'rw'
						&& this.mark
						&& this.mark.itemPaths
					);

				down = false;

				break;

			case 'select' :

				visible =
					this.spaceRef !== undefined
					&& this.access === 'rw';

				down = action && action.timtype === action_select;

				break;

			case 'signUp' :

				visible = this.user ? this.user.isVisitor : true;

				down =
					show.timtype === show_form
					&& show.formName === 'signUp';

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

				down =
					show.timtype === show_form
					&& show.formName === 'space';

				break;

			case 'user' :

				text = this.user ? this.user.name : '';

				visible = true;

				down =
					show.timtype === show_form
					&& show.formName === 'user';

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

		twig[ wname ] =
			twig[ wname ].create(
				'hover', this.hover,
				'down', down,
				'path',
					twig[ wname ].path
					? pass
					: this.path.append( 'twig' ).append( wname ),
				'text', text,
				'visible', visible,
				'transform', this.controlTransform
			);
	}

	this._twig = twig;
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


/*:::::::::::.
:: Functions
'::::::::::::*/


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
	const discname = path.get( 2 );

/**/if( CHECK )
/**/{
/**/	if( discname !== 'mainDisc' ) throw new Error( );
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

		case 'select' :

			root.create(
				'action', action_select.create( ),
				'show', show_normal.create( )
			);

			break;

		case 'create' :

			root.create(
				'action', undefined,
				'show', show_create.create( )
			);

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
def.func.click =
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
def.func.dragStart =
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
| User is inputing text.
*/
def.func.input =
	function(
		// text
	)
{
	return;
};


/*
| Mouse wheel.
*/
def.func.mousewheel =
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
def.func.pointingHover =
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

	return result_hover.create( 'cursor', 'default' );
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
	// shortcut if p is not near the panel
	if( !this.tZone.within( p ) ) return;

	if( !this._tShape.within( p.sub( this.tZone.pos ) ) ) return;

	return 'atween';
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
	// nothing
};

} );
