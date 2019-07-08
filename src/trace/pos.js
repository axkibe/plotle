/*
| A trace into a pos.
*/
'use strict';


tim.define( module, ( def, trace_pos ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './item', './root', './space', './zone' ];

	def.json = './base';
}


const gleam_point = tim.require( '../gleam/point' );

const trace_base = tim.require( './base' );


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)pos' ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'pos';



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
/**/	if( trace[ pos ] !== '(o)pos' ) throw new Error( );
/**/}

	return trace_base.createFromJSONTrace( trace, pos + 1 ).appendPos;
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
/**/	if( pos.timtype !== gleam_point ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'pos', pos );

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
	return this.last.pick( tree ).pos;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'pos' );
};


} );
