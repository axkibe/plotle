/*
| A trace into a scrollPos.
*/
'use strict';


tim.define( module, ( def, trace_zone ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './item', './root', './space' ];

	def.json = './base';
}


const trace_base = tim.require( './base' );

const trace_pos = tim.require( './pos' );

const gleam_rect = tim.require( '../gleam/rect' );


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'zone';


/*
| Returns a trace with a scrollPos appended.
*/
def.lazy.appendPos =
	function( )
{
	return trace_pos.create( 'list:init', this, 'list:append', this );
};


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		pos
	)
{
/**/if( CHECK )
/**/{
/**/	if( pos.timtype !== gleam_rect ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'zone', pos );

	return this.last.graft( tree, sub );
};


/*
| Picks the traced leaf.
*/
def.proto.pick =
	function(
		tree
	)
{
	return this.last.pick( tree ).zone;
};


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)zone' ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| Creates one step from the a JSON.
*/
def.static.createFromJSONStep =
	function(
		trace, // the json trace
		pos    // the position in the trace
	)
{
	if( CHECK )
/**/{
/**/	if( trace[ pos ] !== '(o)zone' ) throw new Error( );
/**/}

	return trace_base.createFromJSONTrace( trace, pos + 1 ).appendZone;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'zone' );
};


} );
