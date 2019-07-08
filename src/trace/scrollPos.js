/*
| A trace into a scrollPos.
*/
'use strict';


tim.define( module, ( def, trace_scrollPos ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './form', './forms', './item', './root', './space', './widget' ];

	def.json = './base';
}


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
			trace : [ '(o)offset', this.at ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'scrollPos';


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

	sub = sub.create( 'scrollPos', pos );

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
	return this.last.pick( tree ).scrollPos;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'scrollPos' );
};


} );
