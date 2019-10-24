/*
| A user is creating a new relation.
*/
'use strict';


tim.define( module, ( def, action_createRelation ) => {


def.extend = './base';

if( TIM )
{
	def.attributes =
	{
		// the item the relation goes from
		fromItemTrace : { type : [ 'undefined', '../trace/item' ] },

		// offset when panning during creation
		offset : { type : [ 'undefined', '../gleam/point' ] },

		// the item the relation goes to
		toItemTrace : { type : [ 'undefined', '../trace/item' ] },

		// the arrow destination while its floating
		toPoint : { type : [ 'undefined', '../gleam/point' ] },

		// TODO make a defined state list
		// the state of the relation creation
		relationState : { type : 'string' },

		// mouse down point on drag creation
		startPoint : { type : [ 'undefined', '../gleam/point' ] },
	};
}


const action_none = tim.require( './none' );
const change_list = tim.require( '../change/list' );
const change_grow = tim.require( '../change/grow' );
const fabric_doc = tim.require( '../fabric/doc' );
const fabric_label = tim.require( '../fabric/label' );
const fabric_para = tim.require( '../fabric/para' );
const fabric_stroke = tim.require( '../fabric/stroke' );
const fabric_space = tim.require( '../fabric/space' );
const gleam_line = tim.require( '../gleam/line' );
const gleam_rect = tim.require( '../gleam/rect' );
const gruga_relation = tim.require( '../gruga/relation' );
const mark_caret = tim.require( '../mark/caret' );
const result_hover = tim.require( '../result/hover' );
const session_uid = tim.require( '../session/uid' );
const trace_root = tim.require( '../trace/root' );


/*
| Returns true if an item is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	const trace = item.trace;
	return trace.equals( this.fromItemTrace ) || trace.equals( this.toItemTrace );
};


/*
| Drag moves.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	// this action only makes sense on spaces
	if( screen.timtype !== fabric_space ) return;

	if( this.relationState === 'pan' )
	{
		// panning while creating a relation
		const pd = p.sub( this.startPoint );

		// FIXME this is an akward call.
		root.alter(
			'spaceTransform', screen.transform.create( 'offset', this.offset.add( pd ) )
		);

		return;
	}

	// Looks if this action is dragging over an item
	for( let item of screen )
	{
		if( item.tZone.within( p ) )
		{
			root.alter( 'action', this.create( 'toItemTrace', item.trace ) );
			return;
		}
	}

	root.alter( 'action', this.create( 'toItemTrace', undefined, 'toPoint', p ) );
};


/*
| Starts a drag.
*/
def.proto.dragStart =
	function(
		p,     // cursor point
		screen, // the screen for this operation
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	// this action only makes sense on spaces
	if( screen.timtype !== fabric_space ) return;

	// see if one item was targeted
	for( let item of screen )
	{
		if( !item.pointWithin( p ) ) continue;
		root.alter(
			'action',
				this.create(
					'fromItemTrace', item.trace,
					'relationState', 'hadSelect',
					'toPoint', p
				)
		);
		return;
	}

	root.alter(
		'action',
			this.create(
				'offset', screen.transform.offset,
				'relationState', 'pan',
				'startPoint', p
			)
	);
};


/*
| Stops a drag.
*/
def.proto.dragStop =
	function(
		p,      // point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	switch( this.relationState )
	{
		case 'hadSelect' :

			if( this.toItemTrace ) this._spawnRelation( screen );
			root.alter(
				'action',
				shift
				? action_createRelation.create( 'relationState', 'start' )
				: action_none.singleton
			);
			return;

		case 'start' :

			root.alter( 'action', action_none.singleton );
			return;

		case 'pan' :

			root.alter( 'action', this.create( 'relationState', 'start' ) );
			return;

		default : throw new Error( );
	}
};


/*
| Returns true if the item should be highlighted.
| Default, don't highlight items.
*/
def.proto.highlightItem = function( item ) { return this.affectsItem( item ); };


/*
| Mouse hover.
|
| Returns a result_hover with hovering trace and cursor to show.
*/
def.proto.pointingHover =
	function(
		p,     // cursor point
		screen, // the screen for this operation
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	if( this.relationState === 'start' )
	{
		for( let a = 0, al = screen.length; a < al; a++ )
		{
			const item = screen.atRank( a );
			if( item.pointWithin( p ) )
			{
				root.alter( 'action', this.create( 'fromItemTrace', item.trace ) );
				return result_hover.cursorDefault;
			}
		}

		root.alter( 'action', this.create( 'fromItemTrace', undefined ) );
		return result_hover.cursorDefault;
	}

	// otherwise forwards the pointingHover to the screen like action_none
	return screen.pointingHover( p, shift, ctrl );
};


/*
| Creates a new relation by specifing its relates.
*/
def.proto._spawnRelation =
	function(
		screen
	)
{
	const item1 = screen.get( this.fromItemTrace.key );
	const item2 = screen.get( this.toItemTrace.key );

	const line = gleam_line.createConnection( item1.shape, item2.shape );
	const pos = line.pc.sub( gruga_relation.spawnOffset );

	const traceSpace = trace_root.singleton.appendSpace;
	const traceLabel = traceSpace.appendItem( session_uid.newUid( ) );
	const traceLine = traceSpace.appendItem( session_uid.newUid( ) );
	const traceArrow = traceSpace.appendItem( session_uid.newUid( ) );

	const valLabel =
		fabric_label.create(
			'zone', gleam_rect.createPosWidthHeight( pos, 0, 0 ),
			'doc',
				fabric_doc.create(
					'twig:add', '1',
					fabric_para.create( 'text', 'relates to' )
				),
			'fontsize', 20,
			'trace', traceLabel
		);

	const valLine =
		fabric_stroke.create(
			'j1', item1.trace,
			'j2', traceLabel,
			'js1', 'none',
			'js2', 'none',
			'trace', traceLine
		);

	const valArrow =
		fabric_stroke.create(
			'j1', traceLabel,
			'j2', item2.trace,
			'js1', 'none',
			'js2', 'arrow',
			'trace', traceArrow
		);

	let change =
		change_list.createWithElements(
			change_grow.create( 'val', valLabel, 'trace', traceLabel.chopRoot, 'rank', 0 ),
			change_grow.create( 'val', valLine, 'trace', traceLine.chopRoot, 'rank', 0 ),
			change_grow.create( 'val', valArrow, 'trace', traceArrow.chopRoot, 'rank', 0 ),
		)
		.appendList( valLine.ancillaryByJPS( item1.shape, valLabel.shape ) )
		.appendList( valArrow.ancillaryByJPS( valLabel.shape, item2.shape ) );

	root.alter(
		'change', change,
		'mark',
			mark_caret.create(
				'offset', traceLabel.appendDoc.appendPara( '1' ).appendText.appendOffset( 0 )
			)
	);
};




} );
