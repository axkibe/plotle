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
| Shortcut for variable declerations.
*/
/*
var
VarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	return (
		Code.VarDec.create(
			'name',
				name,
			'assign',
				assign || null
		)
	);
};
*/


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
		name;

	this.init =
		joobj.init;

	this.unit =
		joobj.unit;

	this.name =
		joobj.name;

	this.hasJSON =
		!!joobj.json;

	this.tag =
		Math.floor( Math.random( ) * 1000000000 );

	for( name in joobj.attributes || { } )
	{
		jAttr =
			joobj.attributes[ name ];

		if( jAttr.json )
		{
			this.hasJSON =
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
		Object.keys( attributes );

	attrList.sort( );

	this.attrList =
		attrList;

	this.attributes =
		Object.freeze( attributes );

	constructorList.sort( );

	constructorList.unshift( 'tag' );

	this.constructorList =
		Object.freeze( constructorList );

	this.reference =
		( joobj.unit === joobj.name ) ?
			joobj.name + 'Obj'
			:
			joobj.name;

	this.equals =
		joobj.equals;
};


/*
| Creates the joobj data structures to work with.
*/
/*
var
buildJD =
	function(
		joobj
	)
{
	var
		attr,
		// alphabetical sorted attribute names
		attrList =
			[ ],
		attributes =
			{ },
		// list of all arguments passed to
		// constructor
		conVars =
			{ },
		name,
		// units sorted alphabetically
		unitList =
			null,
		// units used
		units =
			{ };

	// list of attributes
	if( joobj.attributes )
	{
		for( name in joobj.attributes )
		{
			attr =
				joobj.attributes[ name ];

			attributes[ name ] =
				Object.freeze(
					{
						concerns :
							attr.concerns,
						defaultValue :
							attr.defaultValue,
						json :
							attr.json,
						name :
							name,
						vName :
							'v_' + name
					}
				);

			if( attr.unit )
			{
				units[ attr.unit ] =
					true;
			}

			if( attr.json )
			{
				hasJSON =
					true;

				jsonList.push( name );
			}

			if(
				attr.assign !== null
				||
				(
					joobj.init
					&&
					joobj.init.indexOf( name ) >= 0
				)
			)
			{
				conVars[ name ] =
					Object.freeze(
						{
							name :
								name,
							comment :
								attr.comment,
							vName :
								attributes[ name ].vName
						}
					);
			}
		}

		attrList =
			Object
				.keys( joobj.attributes )
				.sort( );
	}

	unitList =
		Object.keys( units ).sort( );

	if(
		joobj.init
		&&
		joobj.init.indexOf( 'inherit' ) >= 0
	)
	{
		conVars.inherit =
			Object.freeze(
				{
					name :
						'inherit',
					comment :
						'inheritance',
					vName :
						'inherit'
				}
			);
	}

	if( joobj.twig )
	{
		conVars.twig =
			Object.freeze(
				{
					name :
						'twig',
					comment :
						'twig, set upon change',
					vName :
						'twig'
				}
			);

		conVars.ranks =
			Object.freeze(
				{
					name :
						'ranks',
					comment :
						'twig order, set upon change',
					vName :
						'ranks'
				}
			);

		if( hasJSON )
		{
			jsonList.push( 'twig' );
			jsonList.push( 'ranks' );
		}
	}

	var
		conList =
			Object.keys( conVars );

	conList.sort(
		function( o, p )
		{
			return (
				Jools.compare(
					conVars[ o ].vName,
					conVars[ p ].vName
				)
			);
		}
	);

	jsonList.sort( );

	return Object.freeze(
		{
			attrList :
				attrList,
			attributes :
				attributes,
			conList :
				conList,
			conVars :
				conVars,
			hasJSON :
				hasJSON,
			jsonList :
				jsonList,
			name :
				joobj.name,
			node :
				joobj.node,
			// in case unit and joobj are named identically
			// the shortcut will be renamed
			singleton :
				joobj.singleton,
			subclass :
				joobj.subclass,
			twig :
				joobj.twig,
			unitList :
				unitList
		}
	);
};
*/


/*
| Generates the imports section.
*/
Generator.prototype.genImportsSection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule.Comment(
			'Imports.'
		);

	capsule =
		capsule
			.VarDec( 'JoobjProto' )
			.VarDec( 'Jools' );

	return capsule;
};


/*
| Generates the node include section.
*/
Generator.prototype.genNodeIncludesSection =
	function(
		capsule // block to append to
	)
{
	var
		block;

	capsule =
		capsule.Comment(
			'Node includes.'
		);

	block =
		Code
		.Block( )
		.Assign(
			Code.Term( 'JoobjProto' ),
			Code.Term( 'require( \'../src/joobj/proto\' )' )
		)
		.Assign(
			Code.Term( 'Jools' ),
			Code.Term( 'require( \'../src/jools/jools\' )' )
		);

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
		aZ,
		attr,
		block,
		constructor,
		name;

	capsule =
		capsule.Comment(
			'Constructor.'
		);

	block =
		Code
		.Block( )
		.Check(
			Code
			.Block( ).
			If(
				Code.Term( 'tag !== ' + this.tag ),
				Code
				.Block( )
				.Fail( )
			)
		);

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

		block =
			block.Assign(
				Code.Term( 'this.' + attr.assign ),
				Code.Term( attr.vName )
			);
	}

	block =
		block.Term(
			'Jools.immute( this )'
		);

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
			case 'tag' :

				constructor =
					constructor.Arg(
						'tag',
						'magic cookie'
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
		throw new Error( 'TODO' );
	}

	return capsule;
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
		name,
		receiver =
			Code
			.Block( )
			.Assign(
				Code.Term( 'inherit' ),
				Code.Term( 'this' )
			);

	if( this.twig )
	{
		throw new Error( 'TODO' );
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
			receiver.Assign(
				Code.Term( attr.vName ),
				Code.Term( 'this.' + attr.assign )
			);
	}

	return (
		block.If(
			Code.Term( 'this !== ' + this.reference ),
			receiver
		)
	);
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
		Code
		.Block( )
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
				Code
				.Block( )
				.If(
					Code.Term( 'arg !== undefined' ),
					Code
					.Block( )
					.Assign(
						Code.Term( attr.vName ),
						Code.Term( 'arg' )
					)
				)
			);
	}

	switchExpr =
		switchExpr.Default(
			Code
			.Block( )
			.Check(
				Code
				.Block( )
				.Fail( 'invalid argument' )
			)
		);

	loop =
		loop.append( switchExpr );

	block =
		block.For(
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
					Code
					.Block( )
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
		skip,
		tcheck,
		tfail;

	check =
		Code
		.Block( );

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
					Code
					.Block( )
					.Fail( 'undefined attribute ' + name )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.If(
					Code.Term( attr.vName + ' === null' ),
					Code
					.Block( )
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

				skip =
					true;

				break;

			default :

				skip =
					false;
		}

		if( !skip )
		{
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
			else
			{
				cond =
					null;
			}
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
						'Math.floor( ' + attr.vName + ' ) !== ' + attr.vNae
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
					Code.Term(
						'typeof( ' + attr.vName  + ' )' + ' !== \'string\'' +
						' && ' +
						'!( ' + attr.vName + ' instanceof String )'
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
			Code
			.Block( )
			.Fail( 'type mismtach' );

		if( cond )
		{
			check =
				check
				.If(
					cond,
					Code
					.Block
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
		name,
		tList;

	tList =
		Code.TList( )
		.Term( 'inherit' );


	if( this.twig )
	{
		tList =
			tList
			.Term( '&&' )
			.Term(' !twigDup' );
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
			tList =
				tList
				.Term( '&&' )
				.Term( attr.vName + ' === null' );
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

				tList =
					tList
					.Term( '&&' )
					.Term(
						attr.vName +
						' === inherit.' + attr.assign
					);

				break;

			default :

				if( !attr.allowsNull && !attr.allowsUndefined )
				{
					tList =
						tList
						.Term( '&&' )
						.Term(
							attr.vName +
							'.equals( inherit.' + attr.assign
						);
				}
				else
				{
					tList =
						tList
						.Term( '&&' )
						.Term( '(' )
						.Term(
							attr.vName + ' === inherit.' + attr.assign
						)
						.Term( '||' )
						.Term( '(' )
						.Term( attr.vName )
						.Term( '&&' )
						.Term(
							attr.vName +
							'.equals( inherit.' + attr.assign
						)
						.Term( ')' )
						.Term( ')' );
				}
		}
	}

	block =
		block.If(
			tList,
			Code
			.Block( )
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

	call =
		Code.Call(
			Code.Term( this.reference )
		)
		.append(
			Code.Term( '' + this.tag )
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
			case 'tag' :

				call =
					call
					.append(
						Code.Term( name )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				call =
					call
					.append(
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
		Code
		.Block( );

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
			Code
			.Block( )
			.If(
				Code.Term( 'arg !== \'' + this.name + '\'' ),
				Code
				.Block( )
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
			Code
			.Block( )
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
			Code
			.Block( )
			.append(
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
		)
		.append(
			Code.Term( '' + this.tag )
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
			case 'tag' :

				call =
					call
					.append(
						Code.Term( name )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				call =
					call
					.append(
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
			Code
			.Block( )
		);

	// TODO remove
	funcBlock =
		funcBlock
		.If(
			Code.Term( 'json._$grown' ),
			Code
			.Block( )
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
		Code
		.Block( )
		.VarDec(
			'json'
		);

	olit =
		Code.ObjLiteral( );

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
				Code.Term( 'this.' + name )
			);
	}

	block =
		block
		.Assign(
			Code.Term( 'json' ),
			Code.Call(
				Code.Term( 'Object.freeze' )
			).append(
				olit
			)
		);

	capsule =
		capsule
		.Comment( 'Converts a ' + this.name + ' into JSON.' )
		.append(
			Code.Call(
				Code.Term( 'Jools.lazyValue' )
			)
			.append(
				Code.Term( this.reference + '.prototype' )
			)
			.append(
				Code.Term( '\'toJSON\'' )
			)
			.append(
				Code.Func( block )
			)
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
		name;

	if( this.equals === false )
	{
		return capsule;
	}

	if( this.equals === 'primitive' )
	{
		return capsule;
	}

	console.log( this.equals );

	if(
		this.equals !== true
		&&
		this.equals !== undefined
	)
	{
		throw new Error(
			'invalid equals value'
		);
	}

	capsule =
		capsule
		.Comment( 'Tests equality of object.' );

	block =
		Code
		.Block( );

	block =
		block
		.If(
			Code.Term( 'this === obj' ),
			Code
			.Block( )
			.Return(
				Code.Term( 'true' )
			)
		)
		.If(
			Code.Term( '!obj' ),
			Code
			.Block( )
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

		if( cond === null )
		{
			cond =
				Code.Term(
					'this.' + attr.assign +
					' === obj.' + attr.assign
				);
		}
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
| Returns generator with the capsule generated.
*/
Generator.prototype.genCapsule =
	function( )
{
	var
		capsule =
			Code
			.Block( );

// XXX
	capsule =
		this.genImportsSection( capsule );

	capsule =
		this.genNodeIncludesSection( capsule );

	capsule =
		this.genConstructor( capsule );

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
		).Capsule(
			gen.genCapsule( )
		);

	return file;
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Generator;
}


} )( );
