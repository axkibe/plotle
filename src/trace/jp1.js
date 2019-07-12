/*
| A trace into a scrollPos.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './item', './root', './space' ];

	def.json = './base';
}


const trace_base = tim.require( './base' );

const gleam_point = tim.require( '../gleam/point' );


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)jp1' ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'jp1';


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
/**/	if( trace[ pos ] !== '(o)jp1' ) throw new Error( );
/**/}

	return trace_base.createFromJSONTrace( trace, pos + 1 ).appendJP1;
};


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		p
	)
{
/**/if( CHECK )
/**/{
/**/	if( p.timtype !== gleam_point ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'jp1', p );

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
	return this.last.pick( tree ).jp1;
};


} );
