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

		// facet of the disc
		facet : { type : '../gleam/facet' },

	};
}


const gleam_glint_border = tim.require( '../gleam/glint/border' );

const gleam_glint_fill = tim.require( '../gleam/glint/fill' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_pane = tim.require( '../gleam/glint/pane' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_transform = tim.require( '../gleam/transform' );


/*
| Returns the hover path when a disc
| is concerned about it.
*/
def.static.concernsHover =
def.proto.concernsHover =
	function(
		hover,  // hover path
		path    // path of the disc
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.get( 0 ) !== 'disc' || path.get( 1 ) !== 'twig' ) throw new Error( );
/**/}

	return(
		(
			hover
			&& hover.length > 2
			&& hover.get( 0 ) === 'disc'
			&& hover.get( 2 ) === path.get( 2 )
		)
		? hover
		: undefined
	);
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

	const zone = this.tZone.enlarge1;

	// FUTURE GLINT inherit
	return(
		gleam_glint_window.create(
			'pane',
				gleam_glint_pane.create(
					'glint', gleam_glint_list.create( 'list:init', a ),
					'size', zone.size
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
