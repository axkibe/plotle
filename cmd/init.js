{
  cmd: 'alter',
  time: -1,
  src: {
    val: {
      type: 'Space',
      items: {
        type: 'ItemCopse',
        '0' : {
          type: 'Note',
          zone: {
		    type: 'Rect',
 	        pnw : { type: 'Point', x: 100, y: 100 },
	        pse : { type: 'Point', x: 300, y: 200 },
	      },
	      doc: {
			 type: 'Doc',
	         alley : [
	          {
                type: 'Para',
                text: 'If you can dream---and not make dreams your master;',
              }, {
                type: 'Para',
                text: 'If you can think---and not make thoughts your aim,',
              }, {
                type: 'Para',
                text: 'If you can meet with Triumph and Disaster',
              }, {
                type: 'Para',
                text: 'And treat those two impostors just the same',
              },
            ],
          },
        },
      },
      z : {
		type : 'ArcAlley',
        alley : [
          '0',
	    ],
      },
    },
  },
  trg: {
    path: ['welcome'],
  },
}

