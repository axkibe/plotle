/*
| A dynamic list of references to spaces.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'dynamic_refSpacesList',
		attributes :
		{
			current :
			{
				comment : 'the reference to the entity',
				type : 'ref_spaceList',
				json : true
			},
			seq :
			{
				comment : 'sequence number the dynamic is at',
				type : 'integer',
				defaultValue : '1',
				json : true
			},
			_changeWraps :
			{
				comment : 'changeWraps cached in RAM',
				type : 'change_wrapList',
				defaultValue : 'change_wrapList.create( )'
			}
		}
	};
}
	

var
	dynamic_refSpacesList;


/*
| Capsule
*/
( function( ) {
"use strict";


var
	change_list,
	change_wrap,
	prototype,
	session_uid;


if( NODE )
{
	dynamic_refSpacesList = require( 'jion' ).this( module, 'source' );

	change_list = require( '../change/list' );

	change_wrap = require( '../change/wrap' );

	session_uid = require( '../session/uid' );
}


prototype = dynamic_refSpacesList.prototype;


/*
| Returns the altered dynamic.
*/
prototype.alter =
	function(
		a1 // change, several changes or array of changes
		// // ...
	)
{
	var
		changeList,
		changeWrap;

	if( a1.reflect === 'change_list' )
	{
		changeList = a1;
	}
	else if( Array.isArray( a1 ) )
	{
		changeList = change_list.create( 'list:init', a1 );
	}
	else
	{
		changeList =
			change_list.create(
				'list:init',
				Array.prototype.slice.apply( arguments )
			);
	}

	changeWrap =
		change_wrap.create(
			'cid', session_uid( ),
			'changeList', changeList
		);

	return(
		this.create(
			'current', changeWrap.changeTree( this.current ),
			'_changeWraps', this._changeWraps.append( changeWrap ) 
		)
	);
};


}( ) );
