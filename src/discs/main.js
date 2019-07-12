/*
| The disc panel.
*/
'use strict';


tim.define( module, ( def, discs_main ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// currently form/disc shown
		show : { type : [ '< ../show/types' ] },

		// reference to current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },
	};
}


const action_none = tim.require( '../action/none' );

const action_select = tim.require( '../action/select' );

const change_list = tim.require( '../change/list' );

const change_shrink = tim.require( '../change/shrink' );

const result_hover = tim.require( '../result/hover' );

const show_create = tim.require( '../show/create' );

const show_form = tim.require( '../show/form' );

const show_normal = tim.require( '../show/normal' );

const show_zoom = tim.require( '../show/zoom' );


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

			visible = !!( this.access === 'rw' && this.mark && this.mark.itemsMark );

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

	const trace = widget.trace || this.trace.appendWidget( name );

	const hover = widget.concernsHover( this.hover, trace );

	return(
		widget.create(
			'hover', hover,
			'down', down,
			'text', text,
			'trace', trace,
			'visible', visible,
			'transform', this.controlTransform
		)
	);
};


/*
| A button of the main disc has been pushed.
*/
def.proto.pushButton =
	function(
		trace
		// shift,
		// ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( trace.traceDisc.key !== 'main' ) throw new Error( );
/**/}

	const buttonKey = trace.traceWidget.key;

	if( buttonKey === 'login' && this.user && !this.user.isVisitor )
	{
		root.logout( );

		return;
	}

	switch( buttonKey )
	{
		case 'normal' : root.showHome( ); break;

		case 'remove' :
		{
			const itemsMark = this.mark.itemsMark;

			const change = [ ];

			const ranks = [ ];

			for( let itemTrace of itemsMark )
			{
				const rank = root.space.rankOf( itemTrace.key );

				let rc = 0;

				for( let r of ranks )
				{
					if( r <= rank ) rc++;
				}

				ranks.push( rank );

				change.push(
					change_shrink.create(
						'trace', itemTrace.chopRoot,
						'prev', itemTrace.pick( root ),
						'rank', rank - rc
					)
				);
			}

			root.alter( 'change', change_list.create( 'list:init', change ) );

			break;
		}

		case 'select' :

			root.alter(
				'action', action_select.create( ),
				'show', show_normal.singleton
			);

			break;

		case 'create' :

			root.alter( 'action', action_none.singleton, 'show', show_create.singleton );

			break;

		case 'login' :
		case 'moveTo' :
		case 'signUp' :
		case 'space' :
		case 'user' :

			root.alter( 'show', show_form[ buttonKey ] );

			break;

		case 'zoom' :

			root.alter( 'show', show_zoom.singleton );

			break;

		default : throw new Error( );
	}
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

	if( !this.tShape.within( pp ) ) return;

	// this is on the disc
	for( let widget of this )
	{
		const bubble = widget.pointingHover( pp, shift, ctrl );

		if( bubble ) return bubble;
	}

	return result_hover.cursorDefault;
};



} );
