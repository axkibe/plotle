/*
| The zoom disc.
*/
'use strict';


// FIXME
var
	action_zoomButton,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_list,
	gleam_glint_window,
	gleam_point,
	gleam_rect,
	gleam_transform;


tim.define( module, 'disc_zoomDisc', ( def, disc_zoomDisc ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		access :
		{
			// users access to current space
			type : [ 'undefined', 'string' ]
		},
		action :
		{
			// currently active action
			type :
				require( '../action/typemap' )
				.concat( [ 'undefined' ] )
		},
		controlTransform :
		{
			// the current transform of controls
			type : 'gleam_transform'
		},
		facet :
		{
			// facet of the disc
			type : 'gleam_facet'
		},
		hover :
		{
			// the widget hovered upon
			type : [ 'undefined', 'jion$path' ],
			prepare : 'disc_disc.concernsHover( hover, path )'
		},
		mark :
		{
			// the users mark
			type :
				require( '../visual/mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		path :
		{
			// path of the disc
			type : 'jion$path'
		},
		shape :
		{
			// shape of the disc',
			type : 'gleam_ellipse'
		},
		show :
		{
			// form/disc currently shown
			type : require ( '../show/typemap' ),
			assign: ''
		},
		size :
		{
			// designed size
			type : 'gleam_size'
		},
		spaceRef :
		{
			// reference to current space
			type : [ 'undefined', 'ref_space' ],
			assign : ''
		},
		user :
		{
			// currently logged in user
			type : [ 'undefined', 'user_creds' ],
			assign : ''
		},
		viewSize :
		{
			// current view size
			type : 'gleam_size'
		}
	};

	def.init = [ 'inherit', 'twigDup' ];

	def.twig = require( '../form/typemap-widget' );
}


/*
| Initializes the create disc.
*/
def.func._init =
	function(
		inherit,
		twigDup
	)
{
	const twig = twigDup ? this._twig : tim.copy( this._twig );

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const wname = this.getKey( r );

		twig[ wname ] =
			twig[ wname ].create(
				'path',
					 twig[ wname ].path
					 ? pass
					 : this.path.append( 'twig' ).append( wname ),
				'hover', this.hover,
				'down',
					disc_zoomDisc._isActiveButton( this.action, wname ),
				'transform', this.controlTransform
			);
	}

	this._twig = twig;
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
/**/	if( path.get( 2 ) !== this.reflectName ) throw new Error( );
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

	if( !action || action.reflect !== 'action_zoomButton' ) return;

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
/**/	if( path.get( 2 ) !== this.reflectName ) throw new Error( );
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

	if( !action || action.reflect !== 'action_zoomButton' ) return;

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
