/*
| The dotracker manages the undo and redo stacks.
*/


var
	change_wrapRay,
	config,
	root,
	shell_doTracker;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'shell_doTracker',
		attributes :
			{
				_undo :
					{
						comment :
							'the undo stack',
						type :
							'change_wrapRay',
						defaultValue :
							'null'
					},
				_redo :
					{
						comment :
							'the redo stack',
						type :
							'change_wrapRay',
						defaultValue :
							'null'
					}
			}
	};
}


/*
| Flushes the stacks.
*/
shell_doTracker.flush =
	function(

	)
{
	root.create(
		'doTracker',
			shell_doTracker.create(
				'_undo', change_wrapRay.create( ),
				'_redo', change_wrapRay.create( )
			)
	);
};


/*
| Reporting the doTracker something has been altered.
| It will track it on the undo stack.
*/
shell_doTracker.prototype.track =
	function(
		changeWrap
	)
{
	var
		undo;

	undo = this._undo;

	undo = undo.append( changeWrap );

	if( undo.length > config.maxUndo )
	{
		undo = undo.remove( 0 );
	}

	// FIXME
	root.doTracker =
		this.create(
			'_undo', undo,
			'_redo', change_wrapRay.create( )
		);
};


/*
| Received server updates.
|
| These contain updates from this sessions own changes
| now enriched with sequence ids as well as genuine updates
| from others.
*/
shell_doTracker.prototype.update =
	function(
		changeWrapRay
	)
{
	var
		a,
		aZ,
		cw,
		undo,
		redo;

/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	if( changeWrapRay.length === 0 )
	{
		// nothing to do

		return this;
	}

	undo = this._undo;

	redo = this._redo;

	// Adapts the doTracker stacks

	for(
		a = 0, aZ = undo.length;
		a < aZ;
		a++
	)
	{
		cw = undo.get( a );

		cw = changeWrapRay.transform( cw );

		// the change vanished by transformation
		if( cw === null )
		{
			undo = undo.remove( a-- );

			aZ--;

			continue;
		}

		undo = undo.set( a, cw );
	}

	for(
		a = 0, aZ = redo.length;
		a < aZ;
		a++
	)
	{
		cw = redo.get( a );

		cw = changeWrapRay.transform( cw );

		// the change vanished by transformation
		if( cw === null )
		{
			redo = redo.remove( a-- );

			aZ--;

			continue;
		}

		redo = redo.set( a, cw );
	}

	return this.create( '_undo', undo, '_redo', redo );
};


/*
| Reverts actions from the undo stack.
*/
shell_doTracker.prototype.undo =
	function( )
{
	var
		changeWrap,
		undo;

/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	undo = this._undo;

	if( undo.length === 0 )
	{
		return;
	}

	changeWrap = undo.get( undo.length - 1 );

	undo = undo.remove( undo.length - 1 );

	changeWrap = changeWrap.createInvert( );

	root.doTracker =
		this.create(
			'_undo', undo,
			'_redo', this._redo.append( changeWrap )
		);

	root.link.alter( changeWrap );
};


/*
| Reverts undos from the redo stack.
*/
shell_doTracker.prototype.redo =
	function( )
{
	var
		changeWrap,
		redo;

/**/if( CHECK )
/**/{
/**/	if( root.doTracker !== this )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	redo = this._redo;

	if( redo.length === 0 )
	{
		return;
	}

	changeWrap = redo.get( redo.length - 1 );

	changeWrap = changeWrap.createInvert( );

	redo = redo.remove( redo.length - 1 );

	root.doTracker =
		this.create(
			'_redo', redo,
			'_undo', this._undo.append( changeWrap )
		);

	root.link.alter( changeWrap );
};


} )( );
