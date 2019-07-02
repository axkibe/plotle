/*
| FIXME remove.
*/
'use strict';


tim.define( module, ( def, trace_any ) => {


def.abstract = true;


const trace_root = tim.require( './root' );

const trace_space = tim.require( './space' );


/*
| Creates a trace from a tim.js path.
| FIXME remove
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

		case 'hasGrid' :
		case 'hasSnapping' :
		case 'twig' :

			return trace_any.createFromPathSpace( undefined, path );

		default : throw new Error( );
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
	if( trace )
	{
		trace = trace.appendSpace;
	}
	else
	{
		trace = trace_space.create( );
	}

	if( path.length === 0 ) return trace;


	switch( path.get( 0 ) )
	{
		case 'hasGrid' :

			trace = trace.appendHasGrid; path = path.chop;

			if( path.length !== 0 ) throw new Error( );

			return trace;

		case 'hasSnapping' :

			trace = trace.appendHasSnapping; path = path.chop;

			if( path.length !== 0 ) throw new Error( );

			return trace;

		case 'twig' : break;

		default : throw new Error( );
	}

	trace = trace.appendItem( path.get( 1 ) ); path = path.chop.chop;

	if( path.length === 0 ) return trace;

	if( path.get( 0 ) === 'twig' ) throw new Error( );

	if( path.get( 0 ) === 'doc' )
	{
		trace = trace.appendDoc; path = path.chop;

		if( path.length === 0 ) return trace;

		if( path.get( 0 ) !== 'twig' ) throw new Error( );

		trace = trace.appendPara( path.get( 1 ) ); path = path.chop.chop;

		if( path.get( 0 ) === 'text' )
		{
			trace = trace.appendText;

			path = path.chop;
		}

		if( path.length !== 0 ) throw new Error( );

		return trace;
	}

	if( path.get( 0 ) === 'zone' )
	{
		trace = trace.appendZone; path = path.chop;

		if( path.length === 0 ) return trace;

		if( path.get( 0 ) === 'pos' )
		{
			trace = trace.appendPos; path = path.chop;

			if( path.length === 0 ) return trace;
		}

		if( path.length !== 0 ) throw new Error( );

		return trace;
	}

	trace = trace.appendField( path.get( 0 ) ); path = path.chop;

	if( path.length > 0 && path.get( 0 ) === 'text' )
	{
		trace = trace.appendText;

		path = path.chop;
	}

	if( path.length !== 0 ) throw new Error( );

	return trace;
};


} );
