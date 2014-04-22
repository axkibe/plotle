/*
| Generates jooled objects from a jools definition.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Gen',
		node :
			true,
		attributes :
			{
				'joobj' :
					{
						comment :
							'the joobj definition',
						type :
							'Object'
					}
			},
		init :
			[ ]
	};
}


var
	Gen =
		require( '../joobj/this' )( module ),
	Code =
		require( '../code/shorthand' ),
	Validator =
		require( './validator' );


/*
| Converts a camel case string to a dash seperated string.
*/
var
camelCaseToDash =
	function( s )
{
	return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase( );
};


/*
| Initializes a generator.
*/
Gen.prototype._init =
	function( )
{
	var
		assign,
		attr,
		attributes =
			{ },
		attrList,
		constructorList =
			[ ],
		jAttr,
		joobj =
			this.joobj,
		ut,
		name,
		// twigs to be recognized
		subParts,
		twig =
			{ },
		// twigs sorted alphabetically
		twigList,
		// units sorted alphabetically
		unitList,
		// units used
		units =
			{ };

	this.hasJSON =
		!!joobj.json;

	this.init =
		joobj.init;

	this.name =
		joobj.name;

	this.node =
		!!joobj.node;

	this.singleton =
		!!joobj.singleton;

	this.subclass =
		joobj.subclass;

	if( this.subclass )
	{
		subParts =
			this.subclass.split( '.' );

		if( subParts.length >=  2 )
		{
			if( !units[ subParts[ 0 ] ] )
			{
				units[ subParts[ 0 ] ] =
					{ };
			}

			units[ subParts[ 0 ] ][ subParts[ 1 ] ] =
				true;
		}
	}

	this.tag =
		8833; // XXX TODO
//		Math.floor( Math.random( ) * 1000000000 );

	this.unit =
		joobj.unit;

	for( name in joobj.attributes || { } )
	{
		jAttr =
			joobj.attributes[ name ];

		if( jAttr.json )
		{
			this.hasJSON =
				true;
		}

		if( jAttr.unit )
		{
			if( !units[ jAttr.unit ] )
			{
				units[ jAttr.unit ] =
					{ };
			}

			units[ jAttr.unit ][ jAttr.type ] =
				true;
		}

		assign =
			jAttr.assign !== undefined ?
				jAttr.assign
				:
				name;

		if(
			assign !== null
			||
			(
				this.init
				&&
				this.init.indexOf( name ) >= 0
			)
		)
		{
			constructorList.push( name );
		}

		attr =
		attributes[ name ] =
			Object.freeze( {
				allowsNull :
					jAttr.allowsNull
					||
					jAttr.defaultValue === 'null',
				allowsUndefined :
					jAttr.allowsUndefined
					||
					jAttr.defaultValue === 'undefined',
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns,
				defaultValue :
					jAttr.defaultValue,
				json :
					jAttr.json,
				name :
					name,
				type :
					jAttr.type,
				unit :
					jAttr.unit,
				vName :
					'v_' + name
			} );
	}

	attrList =
		Object.keys( attributes ).sort ( );

	this.attrList =
		Object.freeze( attrList );

	this.attributes =
		Object.freeze( attributes );

	constructorList.sort( );

	if( joobj.twig )
	{
		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
	}

	if( joobj.init )
	{
		var
			// sorted init list
			inits =
				joobj.init.slice( ).sort( );

		for(
			var a = inits.length - 1;
			a >= 0;
			a--
		)
		{
			name =
				joobj.init[ a ];

			if( attributes[ name ] )
			{
				continue;
			}

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					constructorList.unshift( name );

					break;

				default :

					throw new Error(
						'invalid init value: ' + name
					);
			}
		}
	}

	constructorList.unshift( 'tag' );

	this.constructorList =
		Object.freeze( constructorList );

	if( joobj.twig )
	{
		for( name in joobj.twig )
		{
			ut =
				joobj.twig[ name ].split( '.' );

			if( ut.length !== 2 )
			{
				throw new Error(
					'invalid twig unit.type: ' + name
				);
			}

			if( !units[ ut[ 0 ] ] )
			{
				units[ ut[ 0 ] ] =
					{ };
			}

			units[ ut[ 0 ] ][ ut[ 1 ] ] =
				true;

			twig[ name ] =
				Object.freeze( {
					unit :
						ut[ 0 ],
					type :
						ut[ 1 ]
				} );
		}

		this.twig =
			Object.freeze( twig );
	}
	else
	{
		twig =
		this.twig =
			null;
	}

	unitList =
		Object.keys( units ).sort( );

	this.unitList =
		Object.freeze( unitList );

	this.units =
		Object.freeze( units );

	if( twig )
	{
		twigList =
			Object.keys( twig ).sort( );

		this.twigList =
			twigList;
	}

	this.reference =
		( joobj.unit === joobj.name ) ?
			joobj.name + 'Obj'
			:
			joobj.name;

	this.equals =
		joobj.equals;
};


/*
| Generates the imports.
*/
Gen.prototype.genImports =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.Comment( 'Imports.' );

	capsule =
		capsule
		.VarDec( 'JoobjProto' )
		.VarDec( 'Jools' );

	// FUTURE when type checking is there this might become needed
	// without jsons
	if( this.hasJSON )
	{
		for(
			var a = 0, aZ = this.unitList.length;
			a < aZ;
			a++
		)
		{
			capsule =
				capsule
				.VarDec( this.unitList[ a ] );
		}
	}

	return capsule;
};


/*
| Generates the node include.
*/
Gen.prototype.genNodeIncludes =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		block,
		typeName,
		types,
		unitName,
		unit;

	capsule =
		capsule.Comment(
			'Node includes.'
		);

	block =
		Code.Block( )
		.Assign(
			Code.Term( 'JoobjProto' ),
			Code.Term( 'require( \'../../src/joobj/proto\' )' )
		)
		.Assign(
			Code.Term( 'Jools' ),
			Code.Term( 'require( \'../../src/jools/jools\' )' )
		);

	// generates the unit objects

	for(
		a = 0, aZ = this.unitList.length;
		a < aZ;
		a++
	)
	{
		block =
			block
			.Assign(
				Code.Term( this.unitList[ a ] ),
				Code.ObjLiteral( )
			);
	}

	for(
		a = 0, aZ = this.unitList.length;
		a < aZ;
		a++
	)
	{
		unitName =
			this.unitList[ a ];

		unit =
			this.units[ this.unitList[ a ] ];

		types =
			Object.keys( unit );

		types.sort( );

		for(
			b = 0, bZ = types.length;
			b < bZ;
			b++
		)
		{
			typeName =
				types[ b ];

			block =
				block
				.Assign(
					Code.Term( unitName + '.' + typeName ),
					Code.Call(
						Code.Term( 'require' ),
						Code.Term(
							'\'../../src/' +
								camelCaseToDash( unitName ) +
								'/' +
								camelCaseToDash( typeName ) +
								'\''
						)
					)
				);
		}
	}

	capsule =
		capsule.If(
			Code.Term( 'SERVER' ),
			block
		);

	return capsule;
};


/*
| Generates the constructor.
*/
Gen.prototype.genConstructor =
	function(
		capsule // block to append to
	)
{
	var
		a,
		assign,
		aZ,
		attr,
		block,
		constructor,
		initCall,
		name;

	capsule =
		capsule.Comment(
			'Constructor.'
		);

	// checks the tag
	block =
		Code.Block( )
		.Check(
			Code.Block( ).
			If(
				Code.Term( 'tag !== ' + this.tag ),
				Code.Block( )
				.Fail( )
			)
		);

	// assigns the variables
	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ],
		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		assign =
			Code.Assign(
				Code.Term( 'this.' + attr.assign ),
				Code.Term( attr.vName )
			);

		if( !attr.allowsUndefined )
		{
			block =
				block.Append( assign );
		}
		else
		{
			block =
				block
				.If(
					Code.Term( attr.vName + ' !== undefined' ),
					Code.Block( )
					.Append(
						assign
					)
				);
		}
	}

	if( this.twig )
	{
		block =
			block
			.Assign(
				Code.Term( 'this.twig' ),
				Code.Term( 'twig' )
			)
			.Assign(
				Code.Term( 'this.ranks' ),
				Code.Term( 'ranks' )
			);
	}

	// calls the initializer
	if( this.init )
	{
		initCall =
			Code.Call(
				Code.Term( 'this._init' )
			);

		for(
			a = 0, aZ = this.init.length;
			a < aZ;
			a++
		)
		{
			name =
				this.init[ a ];

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					initCall =
						initCall.Append(
							Code.Term( this.init[ a ] )
						);

					continue;
			}

			attr =
				this.attributes[ name ];

			if( !attr )
			{
				throw new Error(
					'invalid parameter to init: ' + name
				);
			}

			initCall =
				initCall.Append(
					Code.Term( attr.vName )
				);
		}

		block =
			block.Append(
				initCall
			);
	}

	// immutes the new object
	block =
		block
		.Call(
			Code.Term( 'Jools.immute' ),
			Code.Term( 'this' )
		);

	if( this.twig )
	{
		block =
			block
			.Call(
				Code.Term( 'Jools.immute' ),
				Code.Term( 'twig' )
			)
			.Call(
				Code.Term( 'Jools.immute' ),
				Code.Term( 'ranks' )
			);
	}

	constructor =
		Code.Func( block );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				constructor =
					constructor.Arg(
						'inherit',
						'inheritance'
					);

				break;

			case 'ranks' :

				constructor =
					constructor.Arg(
						'ranks',
						'twig ranks'
					);

				break;

			case 'tag' :

				constructor =
					constructor.Arg(
						'tag',
						'magic cookie'
					);

				break;

			case 'twig' :

				constructor =
					constructor.Arg(
						'twig',
						'twig'
					);

				break;

			case 'twigDup' :

				constructor =
					constructor.Arg(
						'twigDup',
						'true if twig is already been duplicated'
					);

				break;
			default :

				attr =
					this.attributes[ name ];

				constructor =
					constructor.Arg(
						attr.vName,
						attr.comment
					);
		}
	}

	if( this.unit )
	{
		capsule =
			capsule.VarDec(
				this.reference,
				Code
				.Assign(
					Code.Term(
						this.unit + '.' + this.name
					),
					constructor
				)
			);
	}
	else
	{
		capsule =
			capsule
			.Assign(
				Code.Term(
					this.name
				),
				constructor
			);
	}

	return capsule;
};



/*
| Generates the singleton decleration.
*/
Gen.prototype.genSingleton =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.Comment(
			'Singleton'
		)
		.VarDec(
			'_singleton',
			Code.Term( 'null' )
		)
	);
};



/*
| Generates the subclass.
*/
Gen.prototype.genSubclass =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.Comment(
			'Subclass.'
		)
		.Call(
			Code.Term( 'Jools.subclass' ),
			Code.Term( this.reference ),
			Code.Term( this.subclass )
		)
	);
};



/*
| Generates the creators variable list.
*/
Gen.prototype.genCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].vName );
	}

	varList.push( 'inherit' );

	if( this.twig )
	{
		varList.push(
			'key',
			'rank',
			'ranks',
			'twig',
			'twigDup'
		);
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.VarDec( varList[ a ] );
	}

	return block;
};


/*
| Generates the creators inheritance receiver.
*/
Gen.prototype.genCreatorInheritanceReceiver =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		thisCheck,
		name,
		receiver =
			Code.Block( )
			.Assign(
				Code.Term( 'inherit' ),
				Code.Term( 'this' )
			);

	if( this.twig )
	{
		receiver =
			receiver
			.Assign(
				Code.Term( 'twig' ),
				Code.Term( 'inherit.twig' )
			)
			.Assign(
				Code.Term( 'ranks' ),
				Code.Term( 'inherit.ranks' )
			)
			.Assign(
				Code.Term( 'twigDup' ),
				Code.Term( 'false' )
			);
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver
			.Assign(
				Code.Term( attr.vName ),
				Code.Term( 'this.' + attr.assign )
			);
	}

	thisCheck =
		Code
		.If(
			Code.Term( 'this !== ' + this.reference ),
			receiver
		);

	if( this.twig )
	{
		thisCheck =
			thisCheck
			.Elsewise(
				Code.Block( )
				.Assign(
					Code.Term( 'twig' ),
					Code.ObjLiteral( )
				)
				.Assign(
					Code.Term( 'ranks' ),
					Code.Term( '[ ]' )
				)
				.Assign(
					Code.Term( 'twigDup' ),
					Code.Term( 'true' )
				)
			);
	}

	return block.Append( thisCheck );
};


/*
| Generates the creators free strings parser.
*/
Gen.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		attr,
		loop,
		name,
		switchExpr;

	if( !this.twig && this.attrList.length === 0 )
	{
		// no free strings parses needed
		// FIXME check for no arguments
		return block;
	}

	loop =
		Code.Block( )
		.VarDec(
			'arg',
			Code.Term( 'arguments[ a + 1 ]' )
		);

	switchExpr =
		Code
		.Switch(
			Code.Term( 'arguments[ a ]' )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		switchExpr =
			switchExpr
			.Case(
				Code.Term( '\'' + name + '\'' ),
				Code.Block( )
				.If(
					Code.Term( 'arg !== undefined' ),
					Code.Block( )
					.Assign(
						Code.Term( attr.vName ),
						Code.Term( 'arg' )
					)
				)
			);
	}

	if( this.twig )
	{
		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.Case(
				Code.Term ( '\'twig:add\'' ),
				Code.Block( )
				.If(
					Code.Term( '!twigDup' ),
					Code.Block( )
					.Assign(
						Code.Term( 'twig' ),
						Code.Call(
							Code.Term( 'Jools.copy' ),
							Code.Term( 'twig' )
						)
					)
					.Assign(
						Code.Term( 'ranks' ),
						Code.Call(
							Code.Term( 'ranks.slice' )
						)
					)
					.Assign(
						Code.Term( 'twigDup' ),
						Code.Term( 'true' )
					)
				)
				.Assign(
					Code.Term( 'key' ),
					Code.Term( 'arg' )
				)
				.Assign(
					Code.Term( 'arg' ),
					Code.Term( 'arguments[ ++a + 1 ]' )
				)
				.If(
					Code.Term( 'twig[ key ] !== undefined ' ),
					Code.Block( )
					.Fail(
						Code.Term(
							'\'key "\' + key + \'" already in use\''
						)
					)
				)
				.Assign(
					Code.Term( 'twig[ key ]'),
					Code.Term( 'arg' )
				)
				.Call(
					Code.Term( 'ranks.push' ),
					Code.Term( 'key' )
				)
			)
			.Case(
				Code.Term ( '\'twig:set\'' ),
				Code.Block( )
				.If(
					Code.Term( '!twigDup' ),
					Code.Block( )
					.Assign(
						Code.Term( 'twig' ),
						Code.Call(
							Code.Term( 'Jools.copy' ),
							Code.Term( 'twig' )
						)
					)
					.Assign(
						Code.Term( 'ranks' ),
						Code.Call(
							Code.Term( 'ranks.slice' )
						)
					)
					.Assign(
						Code.Term( 'twigDup' ),
						Code.Term( 'true' )
					)
				)
				.Assign(
					Code.Term( 'key' ),
					Code.Term( 'arg' )
				)
				.Assign(
					Code.Term( 'arg' ),
					Code.Term( 'arguments[ ++a + 1 ]' )
				)
				.If(
					Code.Term( 'twig[ key ] === undefined ' ),
					Code.Block( )
					.Fail(
						Code.Term(
							'\'key "\' + key + \'" not in use\''
						)
					)
				)
				.Assign(
					Code.Term( 'twig[ key ]'),
					Code.Term( 'arg' )
				)
			)
			.Case(
				Code.Term ( '\'twig:insert\'' ),
				Code.Block( )
				.If(
					Code.Term( '!twigDup' ),
					Code.Block( )
					.Assign(
						Code.Term( 'twig' ),
						Code.Call(
							Code.Term( 'Jools.copy' ),
							Code.Term( 'twig' )
						)
					)
					.Assign(
						Code.Term( 'ranks' ),
						Code.Call(
							Code.Term( 'ranks.slice' )
						)
					)
					.Assign(
						Code.Term( 'twigDup' ),
						Code.Term( 'true' )
					)
				)
				.Assign(
					Code.Term( 'key' ),
					Code.Term( 'arg' )
				)
				.Assign(
					Code.Term( 'rank' ),
					Code.Term( 'arguments[ a + 2 ]' )
				)
				.Assign(
					Code.Term( 'arg' ),
					Code.Term( 'arguments[ a + 3 ]' )
				)
				.Append(
					Code.Term( 'a += 2' )
				)
				.If(
					Code.Term( 'twig[ key ] !== undefined ' ),
					Code.Block( )
					.Fail(
						Code.Term(
							'\'key "\' + key + \'" already in use\''
						)
					)
				)
				.If(
					Code.Term( 'rank < 0 || rank > ranks.length' ),
					Code.Block( )
					.Fail(
						Code.Term( '\'invalid rank\'' )
					)
				)
				.Assign(
					Code.Term( 'twig[ key ]'),
					Code.Term( 'arg' )
				)
				.Append(
					Code.Call(
						Code.Term( 'ranks.splice' ),
						Code.Term( 'rank' ),
						Code.Term( '0' ),
						Code.Term( 'key' )
					)
				)
			)
			.Case(
				Code.Term ( '\'twig:remove\'' ),
				Code.Block( )
				.If(
					Code.Term( '!twigDup' ),
					Code.Block( )
					.Assign(
						Code.Term( 'twig' ),
						Code.Call(
							Code.Term( 'Jools.copy' ),
							Code.Term( 'twig' )
						)
					)
					.Assign(
						Code.Term( 'ranks' ),
						Code.Call(
							Code.Term( 'ranks.slice' )
						)
					)
					.Assign(
						Code.Term( 'twigDup' ),
						Code.Term( 'true' )
					)
				)
				.If(
					Code.Term( 'twig[ arg ] === undefined ' ),
					Code.Block( )
					.Fail(
						Code.Term(
							'\'key "\' + arg + \'" not in use\''
						)
					)
				)
				.Append(
					Code.Term( 'delete twig[ arg ]' )
				)
				.Append(
					Code.Call(
						Code.Term( 'ranks.splice' ),
						Code.Term( 'ranks.indexOf( arg )' ),
						Code.Term( '1' )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			Code.Block( )
			.Check(
				Code.Block( )
				.Fail( 'invalid argument' )
			)
		);

	loop =
		loop.Append( switchExpr );

	block =
		block
		.For(
			Code
			.VList( )
			.VarDec(
				'a',
				Code.Term( '0' )
			)
			.VarDec(
				'aZ',
				Code.Term( 'arguments.length' )
			),
			Code.Term( 'a < aZ' ),
			Code.Term( 'a += 2' ),
			loop
		);

	return block;
};


/*
| Generates the creators default values
*/
Gen.prototype.genCreatorDefaults =
	function(
		block,   // block to append to
		json     // only do jsons
	)
{
	var
		a,
		aZ,
		attr,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( json && !attr.json )
		{
			continue;
		}

		if( attr.defaultValue )
		{
			block =
				block
				.If(
					Code.Term( attr.vName + ' === undefined' ),
					Code.Block( )
					.Assign(
						Code.Term( attr.vName ),
						Code.Term( attr.defaultValue )
					)
				);
		}
	}

	return block;
};


/*
| Generates the creators checks.
*/
Gen.prototype.genCreatorChecks =
	function(
		block, // block to append to
		checkin  // do checks only when CHECKin
	)
{
	var
		attr,
		check,
		cond,
		name,
		tcheck,
		tfail;

	if( checkin )
	{
		check =
			Code.Block( );
	}
	else
	{
		check =
			block;
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.allowsUndefined )
		{
			check =
				check.If(
					Code.Term( attr.vName + ' === undefined' ),
					Code.Block( )
					.Fail( 'undefined attribute ' + name )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.If(
					Code.Term( attr.vName + ' === null' ),
					Code.Block( )
					.Fail( 'attribute ' + name + ' must not be null.' )
				);
		}

		switch( attr.type )
		{
			case 'Action' :
			case 'Array' :
			case 'Function' :
			case 'Item' :
			case 'Mark' :
			case 'Object' :
			case 'Tree' :

				continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond =
				Code.Term( attr.vName + ' !== null' );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				Code.Term( attr.vName + ' !== undefined' );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			// FUTURE multilined
			cond =
				Code.Term(
					attr.vName + ' !== null' +
					' && ' +
					attr.vName + ' !== undefined'
				);
		}
		else
		{
			cond =
				null;
		}

		switch( attr.type )
		{
			case 'Boolean' :

				tcheck =
					Code.Term(
						'typeof( ' + attr.vName + ' ) !== \'boolean\''
					);

				break;

			case 'Integer' :

				tcheck =
					Code.Or(
						Code.Term(
							'typeof( ' + attr.vName  + ' ) !== \'number\''
						),
						Code.Term(
							'Math.floor( ' + attr.vName + ' ) !== ' +
							attr.vName
						)
					);

				break;

			case 'Number' :

				tcheck =
					Code.Term(
						'typeof( ' + attr.vName  + ' ) !== \'number\''
					);

				break;


			case 'String' :

				tcheck =
					Code.And(
						Code.Term(
							'typeof( ' + attr.vName  + ' )' +
							' !== \'string\''
						),
						Code.Term(
							'!( ' + attr.vName + ' instanceof String )'
						)
					);

				break;

			default :

				tcheck =
					Code.Term(
						attr.vName + '.reflect !== \'' + attr.type + '\''
					);

				break;
		}

		tfail =
			Code.Block( )
			.Fail( 'type mismatch' );

		if( cond )
		{
			check =
				check.If(
					cond,
					Code.Block( )
					.If(
						tcheck,
						tfail
					)
				);
		}
		else
		{
			check =
				check.If(
					tcheck,
					tfail
				);
		}
	}


	// FIXME, in case of check is empty
	//        do not append

	if( checkin )
	{
		block =
			block.Check(
				check
			);
	}

	return block;
};


/*
| Generates the creators concerns.
*/
Gen.prototype.genCreatorConcerns =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		args,
		b,
		bZ,
		bAttr,
		cExpr,
		func,
		member,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.concerns )
		{
			continue;
		}

		args =
			attr.concerns.args;

		func =
			attr.concerns.func;

		member =
			attr.concerns.member;

		if( func )
		{
			cExpr =
				Code.Call(
					Code.Term( func )
				);

			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				// FIXME, make a gen.getCreatorVarName func

				bAttr =
					this.attributes[ args[ b ] ];

				if( !bAttr )
				{
					throw new Error(
						'unknown attribute: ' + args[ b ]
					);
				}

				cExpr =
					cExpr.Append(
						Code.Term( bAttr.vName )
					);
			}
		}
		else
		{
			if( !member )
			{
				throw new Error(
					'concerns neither func or member'
				);
			}

			if( !args )
			{
				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error( 'FIXME' );
				}
				else if( attr.allowsNull )
				{
					cExpr =
						Code.Term(
							attr.vName + ' !== null ? '
							+
							attr.vName + '.' + member + ' : '
							+
							'null'
						);
				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						Code.Term(
							attr.vName + ' !== undefined ? '
							+
							attr.vName + '.' + member + ' : '
							+
							'null'
						);
				}
				else
				{
					cExpr =
						Code.Term(
							attr.vName + '.' + member
						);
				}
			}
			else
			{
				cExpr =
					Code.Call(
						Code.Term(
							attr.vName + '.' + member
						)
					);

				for(
					b = 0, bZ = args.length;
					b < bZ;
					b++
				)
				{
					bAttr =
						this.attributes[ args[ b ] ];

					if( !bAttr )
					{
						throw new Error(
							'unknown attribute: ' + args[ b ]
						);
					}

					cExpr =
						cExpr.Append(
							Code.Term( bAttr.vName )
						);
				}
			}
		}

		block =
			block
			.Assign(
				Code.Term( attr.vName  ),
				cExpr
			);
	}

	return block;
};


/*
| Generates the creators unchanged detection,
| returning this.
*/
Gen.prototype.genCreatorUnchanged =
	function(
		block // block to append to
	)
{
	var
		attr,
		ceq,
		cond,
		name;

	cond =
		Code.Term( 'inherit' );


	if( this.twig )
	{
		cond =
			Code.And(
				cond,
				Code.Term( '!twigDup' )
			);
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			cond =
				Code.And(
					cond,
					Code.Term( attr.vName + ' === null' )
				);
		}

		switch( attr.type )
		{
			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Function' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'Object' :
			case 'String' :
			case 'Tree' : // FIXME

				ceq =
					Code.Term(
						attr.vName +
						' === inherit.' + attr.assign
					);

				break;

			default :

				if( !attr.allowsNull && !attr.allowsUndefined )
				{
					ceq =
// TODO clean
//						Code.Term(
//							attr.vName +
//							'.equals( inherit.' + attr.assign + ' )'
//						);
						Code.Call(
							Code.Term( attr.vName + '.equals' ),
							Code.Term( 'inherit.' + attr.assign )
						);
				}
				else
				{
					ceq =
						Code.Or(
							Code.Term(
								attr.vName + ' === inherit.' + attr.assign
							),
							Code.And(
								Code.Term( attr.vName ),
								Code.Call(
									Code.Term( attr.vName + '.equals' ),
									Code.Term( 'inherit.' + attr.assign )
								)
							)
						);
				}
		}

		cond =
			Code.And(
				cond,
				ceq
			);
	}

	block =
		block.If(
			cond,
			Code.Block( )
			.Return(
				Code.Term( 'inherit' )
			)
		);

	return block;
};


/*
| Generates the creators return statement
*/
Gen.prototype.genCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	if( this.singleton )
	{
		return (
			block
			.If(
				Code.Term( '!_singleton' ),
				Code.Block( )
				.Assign(
					Code.Term( '_singleton' ),
					Code.New(
						Code.Call(
							Code.Term( this.reference ),
							Code.Term( '' + this.tag )
						)
					)
				)
			)
			.Return(
				Code.Term( '_singleton' )
			)
		);
	}

	call =
		Code.Call(
			Code.Term( this.reference )
		);

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :
			case 'twig' :
			case 'twigDup' :
			case 'ranks' :

				call =
					call.Append(
						Code.Term( name )
					);

				break;

			case 'tag' :

				call =
					call.Append(
						Code.Term( '' + this.tag )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				call =
					call.Append(
						Code.Term( attr.vName )
					);
		}
	}

	return (
		block.Return(
			Code.New( call )
		)
	);
};


/*
| Generates the creator.
*/
Gen.prototype.genCreator =
	function(
		capsule // block to append to
	)
{
	var
		block;

	capsule =
		capsule.Comment(
			'Creates a new ' + this.name + ' object.'
		);

	block =
		Code.Block( );

	block =
		this.genCreatorVariables( block );

	block =
		this.genCreatorInheritanceReceiver( block );

	block =
		this.genCreatorFreeStringsParser( block );

	block =
		this.genCreatorDefaults( block, false );

	block =
		this.genCreatorChecks( block, true );

	block =
		this.genCreatorConcerns( block );

	block =
		this.genCreatorUnchanged( block );

	block =
		this.genCreatorReturn( block );

	capsule =
		capsule
		.Assign(
			Code.Term( this.reference + '.Create' ),
			Code.Assign(
				Code.Term( this.reference + '.prototype.Create' ),
				Code.Func( block )
				.Arg(
					null,
					'free strings'
				)
			)
		);

	return capsule;
};


/*
| Generates the fromJSONCreator's variable list.
*/
Gen.prototype.genFromJSONCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		varList.push( attr.vName );
	}

	varList.push( 'arg' );

	if( this.hasJSON )
	{
		// FIXME cleanup ifs

		if( this.twig )
		{
			varList.push(
				'a',
				'aZ',
				'key',
				'jval',
				'jwig',
				'ranks',
				'twig'
			);
		}
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.VarDec( varList[ a ] );
	}

	return block;
};

/*
| Generates the fromJSONCreator's JSON parser.
*/
Gen.prototype.genFromJSONCreatorParser =
	function(
		block,   // block to append
		jsonList
	)
{
	var
		a,
		aZ,
		arg,
		attr,
		// block built for cases
		caseBlock,
		name,
		// the switch
		switchExpr;

	switchExpr =
		Code.Switch(
			Code.Term( 'name' )
		)
		.Case(
			Code.Term( '\'type\'' ),
			Code.Block( )
			.If(
				Code.Term( 'arg !== \'' + this.name + '\'' ),
				Code.Block( )
				.Fail( 'invalid JSON ' )
			)
		);

	if( this.twig )
	{
		switchExpr =
			switchExpr
			.Case(
				Code.Term( '\'twig\'' ),
				Code.Block( )
				.Assign(
					Code.Term( 'jwig' ),
					Code.Term( 'arg' )
				)
			)
			.Case(
				Code.Term( '\'ranks\'' ),
				Code.Block( )
				.Assign(
					Code.Term( 'ranks' ),
					Code.Term( 'arg' )
				)
			);
	}

	for(
		a = 0, aZ = jsonList.length;
		a < aZ;
		a++
	)
	{
		name =
			jsonList[ a ];

		if( name === 'twig' || name === 'ranks' )
		{
			continue;
		}

		attr =
			this.attributes[ name ];

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :

				arg =
					Code.Term( 'arg' );

				break;

			default :

				arg =
					Code.Term(
						(
							attr.unit
							?
							( attr.unit + '.' )
							:
							''
						)
						+
						attr.type
						+
						'.CreateFromJSON( arg )'
					);
		}

		caseBlock =
			Code.Block( )
			.Assign(
				Code.Term( attr.vName ),
				arg
			);

		switchExpr =
			switchExpr
			.Case(
				Code.Term( '\'' + name + '\'' ),
				caseBlock
			);
	}

	block =
		block
		.ForIn(
			'name',
			Code.Term( 'json' ),
			Code.Block( )
			.Assign(
				Code.Term( 'arg' ),
				Code.Term( 'json[ name ]' )
			)
			.Append(
				switchExpr
			)
		);

	return block;
};


/*
| Generates the fromJSONCreator's twig processing.
*/
Gen.prototype.genFromJSONCreatorTwigProcessing =
	function(
		block // block to append to
	)
{
	var
		loop,
		name,
		switchExpr,
		ut;

	switchExpr =
		Code.Switch(
			Code.Term( 'jval.type' )
		);

	for(
		var a = 0, aZ = this.twigList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.twigList[ a ];

		ut =
			this.twig[ name ];

		switchExpr =
			switchExpr
			.Case(
				Code.Term( '\'' + name + '\'' ),
				Code.Block( )
				.Assign(
					Code.Term( 'twig[ key ]' ),
					Code.Call(
						Code.Term(
							(
								ut.unit
								?
								( ut.unit + '.' + ut.type )
								:
								ut.type
							)
							+
							'.CreateFromJSON'
						),
						Code.Term( 'jval' )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			Code.Block( )
			.Fail( 'invalid twig type' )
		);

	loop =
		Code.Block( )
		.Assign(
			Code.Term( 'key' ),
			Code.Term( 'ranks[ a ]' )
		)
		.If(
			Code.Term( '!jwig[ key ]' ),
			Code.Block( )
			.Fail( 'JSON ranks/twig mismatch' )
		)
		.Assign(
			Code.Term( 'jval' ),
			Code.Term( 'jwig[ key ] ' )
		)
		.Append(
			switchExpr
		);

	block =
		block
		.Assign(
			Code.Term( 'twig' ),
			Code.ObjLiteral( )
		)
		.If(
			Code.Or(
				Code.Term( '!jwig' ),
				Code.Term( '!ranks' )
			),
			Code.Block( )
			.Fail( 'ranks/twig information missing' )
		)
		.For(
			Code.Term( 'a = 0, aZ = ranks.length' ),
			Code.Term( 'a < aZ' ),
			Code.Term( 'a++' ),
			loop
		);

	return block;
};

/*
| Generates the fromJSONCreator's return statement
*/
Gen.prototype.genFromJSONCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	call =
		Code.Call(
			Code.Term( this.reference )
		);

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				call =
					call.Append(
						Code.Term( 'null' )
					);

				break;

			case 'tag' :

				call =
					call.Append(
						Code.Term( '' + this.tag )
					);

				break;

			case 'twigDup' :

				call =
					call.Append(
						Code.Term( 'true' )
					);

				break;

			case 'ranks' :
			case 'twig' :

				call =
					call.Append(
						Code.Term( name )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				if( attr.assign === null )
				{
					call =
						call
						.Append(
							Code.Term( 'null' )
						);
				}
				else
				{
					call =
						call
						.Append(
							Code.Term( attr.vName )
						);
				}
		}
	}

	return (
		block
		.Return(
			Code.New( call )
		)
	);
};


/*
| Generates the fromJSONCreator.
*/
Gen.prototype.genFromJSONCreator =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		// function contents
		funcBlock,
		// all attributes expected from JSON
		name,
		jsonList;

	jsonList =
		[ ];

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.json )
		{
			jsonList.push( name );
		}
	}

	if( this.twig )
	{
		jsonList.push( 'twig', 'ranks' );
	}

	jsonList.sort( );

	capsule =
		capsule.Comment(
			'Creates a new ' + this.name + ' object from JSON.'
		);

	funcBlock =
		this.genFromJSONCreatorVariables(
			Code.Block( )
		);

	funcBlock =
		this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock =
		this.genCreatorDefaults( funcBlock, true );

	funcBlock =
		this.genCreatorChecks( funcBlock, false );

	if( this.twig )
	{
		funcBlock =
			this.genFromJSONCreatorTwigProcessing( funcBlock );
	}

	funcBlock =
		this.genFromJSONCreatorReturn( funcBlock );

	capsule =
		capsule
		.Assign(
			Code.Term( this.reference + '.CreateFromJSON' ),
			Code.Func( funcBlock )
			.Arg(
				'json',
				'the JSON object'
			)
		);

	return capsule;
};


/*
| Generates the node include section.
*/
Gen.prototype.genReflection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.Comment( 'Reflection.' )
		.Assign(
			Code.Term( this.reference + '.prototype.reflect' ),
			Code.Term( '\'' + this.name + '\'' )
		);

	return capsule;
};


/*
| Generates the JoobjProto stuff.
*/
Gen.prototype.genJoobjProto =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.Comment( 'Sets values by path.' )
		.Assign(
			Code.Term( this.reference + '.prototype.setPath' ),
			Code.Term( 'JoobjProto.setPath' )
		)
		.Comment( 'Gets values by path' )
		.Assign(
			Code.Term( this.reference + '.prototype.getPath' ),
			Code.Term( 'JoobjProto.getPath' )
		);

	if( this.twig )
	{
		capsule =
			capsule
			.Comment( 'Returns a twig by rank.' )
			.Assign(
				Code.Term( this.reference + '.prototype.atRank' ),
				Code.Term( 'JoobjProto.atRank' )
			)
			.Comment( 'Gets the rank of a key.' )
			.Assign(
				Code.Term( this.reference + '.prototype.rankOf' ),
				Code.Term( 'JoobjProto.rankOf' )
			)
			.Comment( 'Creates a new unique identifier.' )
			.Assign(
				Code.Term( this.reference + '.prototype.newUID' ),
				Code.Term( 'JoobjProto.newUID' )
			);
	}

	return capsule;
};


/*
| Generates the toJSON converter.
*/
Gen.prototype.genToJSON =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		name,
		olit;

	block =
		Code.Block( )
		.VarDec(
			'json'
		);

	olit =
		Code
		.ObjLiteral( )
		.Add(
			'type',
			Code.Term( '\'' + this.name + '\'' )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.json )
		{
			continue;
		}

		olit =
			olit
			.Add(
				name,
				Code.Term( 'this.' + attr.assign )
			);
	}

	if( this.twig )
	{
		olit =
			olit
			.Add(
				'ranks',
				Code.Term( 'this.ranks' )
			)
			.Add(
				'twig',
				Code.Term( 'this.twig' )
			);
	}

	block =
		block
		.Assign(
			Code.Term( 'json' ),
			Code.Call(
				Code.Term( 'Object.freeze' ),
				olit
			)
		)
		.Return(
			Code.Func(
				Code.Block( )
				.Return(
					Code.Term( 'json' )
				)
			)
		);

	capsule =
		capsule
		.Comment( 'Converts a ' + this.name + ' into JSON.' )
		.Call(
			Code.Term( 'Jools.lazyValue' ),
			Code.Term( this.reference + '.prototype' ),
			Code.Term( '\'toJSON\'' ),
			Code.Func( block )
		);

	return capsule;
};


/*
| Generates the equals test.
*/
Gen.prototype.genEquals =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		cond =
			null,
		ceq,
		name;

	switch( this.equals )
	{
		case false :

			return capsule;

		case 'primitive' :

			// FUTURE remove

			return (
				capsule
				.Comment( 'Tests equality of object.' )
				.Assign(
					Code.Term( this.reference + '.prototype.equals' ),
					Code.Func(
						Code.Block( )
						.Return(
							Code.Term( 'this === obj' )
						)
					)
					.Arg(
						'obj',
						'object to compare to'
					)
				)
			);

		case true :
		case undefined :

			break;

		default :

			throw new Error(
				'invalid equals value'
			);
	}

	capsule =
		capsule
		.Comment( 'Tests equality of object.' );

	block =
		Code.Block( );

	block =
		block
		.If(
			Code.Term( 'this === obj' ),
			Code.Block( )
			.Return(
				Code.Term( 'true' )
			)
		)
		.If(
			Code.Term( '!obj' ),
			Code.Block( )
			.Return(
				Code.Term( 'false' )
			)
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'String' :
			case 'Tree' : // FIXME

				ceq =
					Code.Term(
						'this.' + attr.assign +
						' === obj.' + attr.assign
					);

				break;

			default :

				if( !attr.allowsNull )
				{
					ceq =
						Code.Term(
							'this.' + attr.assign +
							' === obj.' + attr.assign
						);
				}
				else
				{
					ceq =
						// FIXME XXX
						Code.Or(
							Code.Term(
								'this.' + attr.assign + ' === obj.' + attr.assign
							),
							Code.And(
								Code.Term(
									'this.' + attr.assign + ' !== null'
								),
								Code.Term(
									'this.' + attr.assign +
									'.equals( obj.' + attr.assign + ' )'
								)
							)
						);
				}
		}

		cond =
			cond === null ?
			ceq :
			Code.And(
				cond,
				ceq
			);
	}

	block =
		block
		.Return(
			cond
		);

	capsule =
		capsule
		.Assign(
			Code.Term( this.reference + '.prototype.equals' ),
			Code.Func(
				block
			).Arg(
				'obj',
				'object to compare to'
			)
		);

	return capsule;
};


/*
| Generates the export.
*/
Gen.prototype.genNodeExport =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.Comment( 'Node export.' )
		.If(
			Code.Term( 'SERVER' ),
			Code.Block( )
			.Assign(
				Code.Term( 'module.exports' ),
				Code.Term( this.reference )
			)
		)
	);
};


/*
| Returns the generated export block.
*/
Gen.prototype.genExport =
	function( block )
{
	block =
		block
		.Comment(
			'Export.'
		);

	if( this.unit )
	{
		block =
			block
			.VarDec(
				this.unit,
				Code.Or(
					Code.Term( this.unit ),
					Code.ObjLiteral( )
				)
			);
	}
	else
	{
		block =
			block
			.VarDec(
				this.name
			);
	}

	return block;
};


/*
| Returns the generated preamble.
*/
Gen.prototype.genPreamble =
	function( )
{
	var
		block;

	block =
		Code.Block( );

	block =
		this.genExport( block );

	block =
		this.genImports( block );

	return block;
};


/*
| Returns the generated capsule block.
*/
Gen.prototype.genCapsule =
	function( )
{
	var
		capsule =
			Code.Block( );

	if( this.node )
	{
		capsule =
			this.genNodeIncludes( capsule );
	}

	capsule =
		this.genConstructor( capsule );

	if( this.singleton )
	{
		capsule =
			this.genSingleton( capsule );
	}

	if( this.subclass )
	{
		capsule =
			this.genSubclass( capsule );
	}

	capsule =
		this.genCreator( capsule );

	if( this.hasJSON )
	{
		capsule =
			this.genFromJSONCreator( capsule );
	}

	capsule =
		this.genReflection( capsule );

	capsule =
		this.genJoobjProto( capsule );

	if( this.hasJSON )
	{
		capsule =
			this.genToJSON( capsule );
	}

	capsule =
		this.genEquals( capsule );

	if( this.node )
	{
		capsule =
			this.genNodeExport( capsule );
	}

	return capsule;
};


/*
| Generates code from a jools object definition.
*/
Gen.generate =
	function(
		joobj // the joobj definition
	)
{
	Validator.check( joobj );

	var
		file,
		gen;

	gen =
		Gen.Create(
			'joobj',
				joobj
		);

	file =
		Code.File( )
		.Header(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		)
		.Preamble(
			gen.genPreamble( )
		)
		.Capsule(
			gen.genCapsule( )
		);

	return file;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Gen;
}


} )( );
