/*
| FIXME remove.
*/
'use strict';


tim.define( module, ( def, trace_any ) => {


def.abstract = true;


const trace_root = tim.require( './root' );


/*
| Creates a trace from a tim.js path.
*/
def.static.createFromPath =
	function(
		path
	)
{
	let trace = trace_root.singleton;

	if( path.length === 0 ) return trace;

	switch( path.get( 0 ) )
	{
		case 'discs' : throw new Error( );

		case 'form' : throw new Error( );

		case 'space' : return trace_any.createFromPathSpace( trace, path.chop );
	}
};


/*
| Creates a space trace from a tim.js path.
*/
def.static.createFromPathSpace =
	function(
		trace,
		path
	)
{
	trace = trace.appendSpace;

	if( path.length === 0 ) return trace;

	if( path.get( 0 ) !== 'twig' ) throw new Error( );

	trace = trace.appendItem( path.get( 1 ) ); path = path.chop.chop;

	if( path.length === 0 ) return trace;

	if( path.get( 0 ) === 'twig' )
	{
		trace = trace.appendField( path.get( 1 ) ); path = path.chop;

		if( path.length !== 0 ) throw new Error( );

		return trace;
	}

	if( path.get( 0 ) !== 'doc' ) throw new Error( );

	trace = trace.appendDoc; path = path.chop;

	if( path.length === 0 ) return trace;

	if( path.get( 0 ) !== 'twig' ) throw new Error( );

	trace = trace.appendPara( path.get( 1 ) ); path = path.chop.chop;

	if( path.get( 0 ) === 'text' ) path = path.chop;

	if( path.length !== 0 ) throw new Error( );

	return trace;
};


} );
