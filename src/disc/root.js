/*
| The disc root is the master of all discs.
*/
'use strict';


tim.define( module, 'disc_root', ( def, disc_root ) => {


const gleam_glint_list = require( '../gleam/glint/list' );

const show_create = require( '../show/create' );

const show_zoom = require( '../show/zoom' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
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
		hover :
		{
			// the widget hovered upon
			type : [ 'undefined', 'tim$path' ]
		},
		mark :
		{
			// the users mark
			// FIXXME
			prepare : 'self.concernsMark( mark )',
			type :
				require( '../visual/mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		path :
		{
			// path of the disc
			type : 'tim$path'
		},
		show :
		{
			// currently form/disc shown
			type : require ( '../show/typemap' )
		},
		spaceRef :
		{
			// currently loaded space
			type : [ 'undefined', 'ref_space' ]
		},
		user :
		{
			// currently logged in user
			type : [ 'undefined', 'user_creds' ]
		},
		viewSize :
		{
			// current view size
			type : 'gleam_size'
		}
	};

	def.init = [ 'twigDup' ];

	// FUTURE make a group instead of a twig
	def.twig =
	[
		'disc_mainDisc',
		'disc_createDisc',
		'disc_zoomDisc',
	];
}


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Returns the mark if the disc root concerns a mark.
*/
def.static.concernsMark =
	function(
		mark
	)
{
	// discs concerns about all, since they provide
	// additional information.

	return mark;
};


/*
| Returns the hover path if the disc root concerns about it.
*/
def.static.concernsHover =
	function(
		hover
	)
{
	// FUTURE beautify
	return(
		hover && hover.get( 0 ) === 'disc'
		? hover
		: undefined
	);
};


/*
| Initializes the disc root.
*/
def.func._init =
	function(
		twigDup
	)
{
	const hover = this.hover;

/**/if( CHECK )
/**/{
/**/	if( hover && hover.isEmpty ) throw new Error( );
/**/}

	const ranks = this._ranks;

	const twig = twigDup ? this._twig : tim.copy( this._twig );

	const action = this.action;

	const access = this.access;

	const show = this.show;

	const controlTransform = this.controlTransform;

	const mark = this.mark;

	const spaceRef = this.spaceRef;

	const user = this.user;

	const viewSize = this.viewSize;

	for( let a = 0, aZ = ranks.length; a < aZ; a++ )
	{
		const key = ranks[ a ];

		let disc = twig[ key ];

		if( disc.isAbstract )
		{
			for( let b = 0, bZ = disc.length; b < bZ; b++ )
			{
				disc =
					disc.abstract(
						'twig:set',
						disc.getKey( b ),
						disc.atRank( b ).create(
							'transform', controlTransform
						)
					);
			}
		}

		twig[ key ] =
			disc.create(
				'access', access,
				'action', action,
				'controlTransform', controlTransform,
				'hover', hover,
				'mark', mark,
				'show', show,
				'spaceRef', spaceRef,
				'user', user,
				'viewSize', viewSize
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| Updates the glint twig.
*/
def.lazy.glint =
	function( )
{
	const arr = [ ];

	switch( this.show.timtype )
	{
		case show_create : arr.push( this.get( 'createDisc' ).glint ); break;

		case show_zoom : arr.push( this.get( 'zoomDisc' ).glint ); break;
	}

	arr.push( this.get( 'mainDisc' ).glint );

	return gleam_glint_list.create( 'list:init', arr );
};


/*:::::::::::.
:: Functions
'::::::::::::*/


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
	let bubble = this.get( 'mainDisc' ).dragMove( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).dragMove( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).dragMove( p, shift, ctrl );
	}
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
	let bubble = this.get( 'mainDisc' ).dragStart( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).dragStart( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).dragStart( p, shift, ctrl );
	}
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
	let bubble = this.get( 'mainDisc' ).dragStop( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).dragStop( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).dragStop( p, shift, ctrl );
	}
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
	let bubble = this.get( 'mainDisc' ).mousewheel( p, dir, shift, ctrl );

	if( bubble ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).mousewheel( p, dir, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).mousewheel( p, dir, shift, ctrl );
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
	let hover = this.get( 'mainDisc' ).pointingHover( p, shift, ctrl );

	if( hover ) return hover;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).pointingHover( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).pointingHover( p, shift, ctrl );
	}
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
	let bubble = this.get( 'mainDisc' ).probeClickDrag( p, shift, ctrl );

	if( bubble !== undefined ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).probeClickDrag( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).probeClickDrag( p, shift, ctrl );
	}
};


/*
| Returns true if some disc accepted the click.
*/
def.func.click =
	function(
		p,
		shift,
		ctrl
	)
{
	let bubble = this.get( 'mainDisc' ).click( p, shift, ctrl );

	if( bubble ) return bubble;

	switch( this.show.timtype )
	{
		case show_create : return this.get( 'createDisc' ).click( p, shift, ctrl );

		case show_zoom : return this.get( 'zoomDisc' ).click( p, shift, ctrl );
	}
};


/*
| A button of the main disc has been pushed.
*/
def.func.dragStartButton =
	function(
		path,
		shift,
		ctrl
	)
{
	const discName = path.get( 2 );

	return this.get( discName ).dragStartButton( path, shift, ctrl );
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
	const discName = path.get( 2 );

	return this.get( discName ).pushButton( path, shift, ctrl );
};


} );
