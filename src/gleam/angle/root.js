/*
| Angle root
*/
'use strict';


tim.define( module, ( def, angle ) => {


def.abstract = true;

const angle_ne = tim.require( './ne' );
const angle_nw = tim.require( './nw' );
const angle_n = tim.require( './n' );
const angle_e = tim.require( './e' );
const angle_se = tim.require( './se' );
const angle_s = tim.require( './s' );
const angle_sw = tim.require( './sw' );
const angle_w = tim.require( './w' );


/*
| Returns the (intermidiate) cardianal direction by
| index.
*/
def.static.iDirByIndex =
	( idx ) =>
{
	const g = angle._iDirIndex[ idx ];

/**/if( CHECK )
/**/{
/**/	if( !g ) throw new Error( );
/**/}

	return g;
};


/*
| North-west.
*/
def.staticLazy.nw = ( ) => angle_nw.singleton;


/*
| North.
*/
def.staticLazy.n = ( ) => angle_n.singleton;


/*
| North-east.
*/
def.staticLazy.ne = ( ) => angle_ne.singleton;


/*
| East.
*/
def.staticLazy.e = ( ) => angle_e.singleton;


/*
| South-east.
*/
def.staticLazy.se = ( ) => angle_se.singleton;


/*
| South.
*/
def.staticLazy.s = ( ) => angle_s.singleton;


/*
| South-west.
*/
def.staticLazy.sw = ( ) => angle_sw.singleton;


/*
| West.
*/
def.staticLazy.w = ( ) => angle_w.singleton;



/*
| (intermidate) cardinal directions by index.
*/
def.staticLazy._iDirIndex =
	( ) =>
[
	angle_e.singleton,
	angle_ne.singleton,
	angle_n.singleton,
	angle_nw.singleton,
	angle_w.singleton,
	angle_sw.singleton,
	angle_s.singleton,
	angle_se.singleton,
	angle_e.singleton,
];


} );
