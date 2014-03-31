/*
| Generates jooled objects from a jools definition.
|
| Version 2
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
			'GenV2',
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
	Generator =
		require( '../joobj/this' )( module ),
	Code =
		require( '../code/shorthand' ),
	Validator =
		require( './validator' );

// FIXME remove
//	Jools =
//		require( '../jools/jools' ),

/*
| Initialized a generator
*/
Generator.prototype._init =
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
		name,
		// units sorted alphabetically
		unitList =
			null,
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

	this.tag =
		Math.floor( Math.random( ) * 1000000000 );

	this.twig =
		joobj.twig;

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
			units[ jAttr.unit ] =
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

	if( this.twig )
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

	unitList =
		Object.keys( units ).sort( );

	this.unitList =
		Object.freeze( unitList );

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
Generator.prototype.genImports =
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

	return capsule;
};


/*
| Generates the node include.
*/
Generator.prototype.genNodeIncludes =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		block,
		// stuff already generated
		generated =
			{ },
		name;

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

	// includes the used types from the units

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

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'Object' :
			case 'String' :

				continue;
		}

		if( generated[ attr.unit ] )
		{
			if( generated[ attr.unit ][ attr.type ] )
			{
				continue;
			}
			else
			{
				generated[ attr.unit ][ attr.type ] =
					true;
			}
		}
		else
		{
			generated[ attr.unit ] =
				{ };

			generated[ attr.unit ][ attr.type ] =
				true;
		}

		if( !attr.unit )
		{
			continue;
			// FIXME?
			/*
			throw new Error(
				'Unit missing from: ' +
					this.name +
					'.' +
					name
			);
			*/
		}

		block =
			block
			.Assign(
				Code.Term( attr.unit + '.' + attr.type ),
				Code.Call(
					Code.Term( 'require' ),
					Code.Term(
						'\'../../src/' +
							attr.unit.toLowerCase( ) +
							'/' +
							attr.type.toLowerCase( ) +
							'\''
					)
				)
			);
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
Generator.prototype.genConstructor =
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
			initCall =
				initCall.Append(
					Code.Term( this.init[ a ] )
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
Generator.prototype.genSingleton =
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
Generator.prototype.genSubclass =
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
Generator.prototype.genCreatorVariables =
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
			'twig',
			'ranks',
			'twigDup',
			'key'
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
Generator.prototype.genCreatorInheritanceReceiver =
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
Generator.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		attr,
		loop,
		name,
		switchExpr;

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
Generator.prototype.genCreatorDefaults =
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
| Generates the creators checks
*/
Generator.prototype.genCreatorChecks =
	function(
		block // block to append to
	)
{
	var
		attr,
		check,
		cond,
		name,
		tcheck,
		tfail;

	check =
		Code.Block( );

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
		else if( attr.allowsNull && attr.allowsUndefine )
		{
			// FUTURE multilined
			cond =
				Code.Term(
					attr.vName + ' !== null' +
					' && ' +
					attr.vName + ' !== undefined'
				);
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
					Code.Term(
						'typeof( ' + attr.vName  + ' ) !== \'number\'' +
						' || ' +
						'Math.floor( ' + attr.vName + ' ) !== ' + attr.vName
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

	block =
		block.Check(
			check
		);

	return block;
};


/*
| Generates the creators unchanged detection,
| returning this.
*/
Generator.prototype.genCreatorUnchanged =
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
				Code.Term(' !twigDup' )
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
					// FIXME this is ugly
					ceq =
						Code.Term(
							'('
							+
							attr.vName + ' === inherit.' + attr.assign
							+
							'||'
							+
							'('
							+
							attr.vName
							+
							'&&'
							+
							attr.vName +
							'.equals( inherit.' + attr.assign + ')'
							+
							'))'
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
Generator.prototype.genCreatorReturn =
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
Generator.prototype.genCreator =
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
		this.genCreatorChecks( block );

	block =
		this.genCreatorUnchanged( block );

	block =
		this.genCreatorReturn( block );

	capsule =
		capsule
		.Assign(
			Code.Term( this.reference + '.create' ),
			Code.Assign(
				Code.Term( this.reference + '.prototype.create' ),
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
| Generates the from JSON creators variable list.
*/
Generator.prototype.genFromJSONCreatorVariables =
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

	varList.push( 'arg' );

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
| Generates the from JSON creators JSON parser.
*/
Generator.prototype.genFromJSONCreatorParser =
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
			throw new Error( 'TODO' );
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
							attr.unit ?
							( attr.unit + '.' )
							:
							''
						)
						+
						attr.type
						+
						'.createFromJSON( arg )'
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
| Generates the from JSON creators return statement
*/
Generator.prototype.genFromJSONCreatorReturn =
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
| Generates the from JSON creator.
*/
Generator.prototype.genFromJSONCreator =
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
		jsonList =
			[ ];

	//generateChecks( r, jj, true );

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

	// TODO remove
	funcBlock =
		funcBlock
		.If(
			Code.Term( 'json._$grown' ),
			Code.Block( )
			.Return(
				Code.Term( 'json' )
			)
		);

	funcBlock =
		this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock =
		this.genCreatorDefaults( funcBlock, true );

	funcBlock =
		this.genCreatorChecks( funcBlock );

	funcBlock =
		this.genFromJSONCreatorReturn( funcBlock );

	capsule =
		capsule
		.Assign(
			Code.Term( this.reference + '.createFromJSON' ),
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
Generator.prototype.genReflection =
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

	// TODO remove workaround
	if( this.hasJSON )
	{
		capsule =
			capsule
			.Comment( 'Workaround old meshverse growing.' )
			.Assign(
				Code.Term( this.reference + '.prototype._grown' ),
				Code.Term( 'true' )
			);
	}

	return capsule;
};


/*
| Generates the JoobjProto stuff.
*/
Generator.prototype.genJoobjProto =
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
			);
	}

	return capsule;
};


/*
| Generates the toJSON converter.
*/
Generator.prototype.genToJSON =
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
		.add(
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
			.add(
				name,
				Code.Term( 'this.' + attr.assign )
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
Generator.prototype.genEquals =
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
						// FIXME
						Code.Term(
							'(this.' + attr.assign +
							' === obj.' + attr.assign +
							' ||' +
							'(' +
							'this.' + attr.assign + ' !== null' +
							' && ' +
							'this.' + attr.assign +
							'.equals( obj.' + attr.assign + ' )' +
							'))'
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
Generator.prototype.genNodeExport =
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
Generator.prototype.genExport =
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
				Code.Term( this.unit + ' || { }' )
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
Generator.prototype.genPreamble =
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
Generator.prototype.genCapsule =
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
Generator.generate =
	function(
		joobj // the joobj definition
	)
{
	Validator.check( joobj );

	var
		file,
		gen;

	gen =
		Generator.create(
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
		Generator;
}


} )( );
