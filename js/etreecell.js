// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ etreecell 0.0.1 - etreecell Document Form JavaScript Library       │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2010-2014 etreecell (http://etreecell.com)             │ \\
// │ Copyright © 2009-2014 seoseunghyun (http://seoseunghyun.com)       │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the CC () license.                                  │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

var etreecell = function( _object, _loadDatas ){
	
	// 클래스가 etreecell인 DIV를 모두 가져온다.
	var canvasElement = new Array();
	var canvasReturn = new Array();
	
	// ById, ByClassName, ByTagName 모두 CSS 셀렉터 형식으로 제공한다.
	switch( _object.substr(0, 1) ){
		case '#': 
			_object = _object.substr(1, _object.length);
			canvasElement.push( document.getElementById( _object ) );
		break;
		
		case '.':
			_object = _object.substr(1, _object.length);
			canvasElement = document.getElementsByClassName( _object );
		break;

		default:
			canvasElement = document.getElementsByTagName(_object);		
	}

	
	// etreecell 캔버스 초기화
	var init = function( _canvas, _loadData ){
		
		// Raphael 부여
		var canvas = Raphael( _canvas );

		// Canvas에 전역 변수 공간 부여 (표준 attr과의 구분을 위해 canvas.config로 사용한다.)
		canvas.config = { 
			canvasDown : false,
			canvasDrag : false,
			canvasdownX : false,
			canvasdownY : false,
			objectDown : false,
			dblBooleanTimer : false,
			helperRect : false,
			connecting :false
		};
		canvas.register = { cell : new Array(), connection : new Array() }

		
		
		// Canvas 이벤트 부여
		var canvasDown = function(e){
			canvas.config.canvasDown = true;
			canvas.config.canvasdownX = e.offsetX;
			canvas.config.canvasdownY = e.offsetY;
			canvas.config.helperRect = false;
			
			if( canvas.config.dblBooleanTimer ){
				// 더블 클릭 이벤트 발생.
				e.preventDefault();
				createCell( null , { 
					'x' : e.offsetX - 100,
					'y' : e.offsetY - 13,
					'width' : 200,
					'height' : 26
				} );
				
				canvas.config.dblBooleanTimer = false;
				clearTimeout(canvas.config.dblBooleanTimer);
			}else{
				canvas.config.dblBooleanTimer = setTimeout(function(){
					canvas.config.dblBooleanTimer = false;
				}, 200);
			}
		}
		var canvasMove = function(e){	
			
			thisX = e.offsetX - canvas.config.canvasdownX;
			thisY = e.offsetY - canvas.config.canvasdownY;
			
			// Canvas가 눌려있어야 하고, 셀과 같은 오브젝트에 클릭되지 않아야 helper를 생성할 수 있다.
			if( canvas.config.canvasDown && !canvas.config.objectDown ){
				if( Math.abs(thisX) > 2 || Math.abs(thisY) > 2 ){
					canvas.config.canvasDrag = true;
				}
				if( canvas.config.canvasDrag ){
					if( canvas.config.helperRect ){
						if(thisX > 0 && thisY > 0 ){
							canvas.config.helperRect.attr({ 
								'x' : canvas.config.canvasdownX,
								'y' : canvas.config.canvasdownY,
								'width' : Math.abs(thisX),
								'height' : Math.abs(thisY),
							})
						}else if(thisX > 0 && thisY < 0 ){
							canvas.config.helperRect.attr({ 
								'x' : canvas.config.canvasdownX,
								'y' : e.offsetY,
								'width' : Math.abs(thisX),
								'height' : Math.abs(thisY),
							})
						}else if(thisX < 0 && thisY < 0 ){
							canvas.config.helperRect.attr({ 
								'x' : e.offsetX,
								'y' : e.offsetY,
								'width' : Math.abs(thisX),
								'height' : Math.abs(thisY),
							})
						}else if(thisX < 0 && thisY > 0 ){
							canvas.config.helperRect.attr({ 
								'x' : e.offsetX,
								'y' : canvas.config.canvasdownY,
								'width' : Math.abs(thisX),
								'height' : Math.abs(thisY),
							})
						}
						
					}else{
						canvas.config.helperRect = canvas.rect(canvas.config.canvasdownX, canvas.config.canvasdownY, 0,0);
						canvas.config.helperRect.attr({ 'stroke' : '#959595', 'stroke-dasharray' : '-' })
					}
				
				}
			}
		}
		var canvasUp = function(e){
			if(canvas.config.canvasDrag){
				// 드래그가 성공적으로 마무리 되었을 경우.
				canvas.config.helperRect.remove();
				canvas.config.helperRect = false;
			}
			canvas.config.canvasDown = false;
			canvas.config.canvasDrag = false;
		}
		var canvasLeave = function(e){
			if(canvas.config.canvasDrag){
				// 드래그가 취소되어야 할 경우.
				canvas.config.helperRect.remove();
				canvas.config.helperRect = false;
			}
			
			canvas.config.canvasDown = false;
			canvas.config.canvasDrag = false;
			
			if(canvas.config.objectDown){
				canvas.config.objectDown.animate({'x' : canvas.config.objectDown.config.downX ,'y': canvas.config.objectDown.config.downY, 'opacity' : canvas.config.objectDown.config.tmp.opacity },300,">");
				canvas.config.objectDown = false;
			}
		}

		canvas.canvas.addEventListener('mousedown', canvasDown);
		canvas.canvas.addEventListener('mousemove', canvasMove);
		canvas.canvas.addEventListener('mouseup', canvasUp);
		canvas.canvas.addEventListener('mouseleave', canvasLeave);		
		
		// Cell 생성 이벤트
		function createCell(_id, _style){
			// 캔버스의 해당 아이디가 있을 경우 셀 등록을 취소한다.
			
			if(canvas.getById( _id )){
				console.log(canvas.getById(_id));
				console.log(canvas);
				console.log("etreecell : ", _id + "id is exist.");
				return false;
			}
			if(canvas.getById( _id )){
					
			}
			// 셀의 기본 스타일
			var initStyle = { 
				'x' : 300,
				'y' : 300,
				'width' : 250,
				'height' : 25,
				'r' : 15,
				'opacity' : 1,
				'fill' : '#ffffff',
				'cursor' : 'pointer',
				'stroke-width' : 1
			}
			// style이 미리 정의되어 있으면 속성 값을 덮어 씌운다.
			if( _style ){
				for(var attrName in _style){
					initStyle[attrName] = _style[attrName];
				}
			}
			
			// 셀 형성
			var initCellX = parseInt(initStyle['x'])+(parseInt(initStyle['width']/2));
			var initCellY = parseInt(initStyle['y'])+(parseInt(initStyle['height']/2));

			var cell = canvas.rect(initCellX, initCellY, 0, 0, 0);
			canvas.register.cell.push(cell);
			
			if( _id ){
				cell.id = _id;
			}
			
			cell.attr({ 'opacity' : 0 });
			cell.animate(initStyle,300,"backOut");
			cell.config = new Array();
			cell.config.tmp = new Array();
			cell.config.connection = { 'inCell' : new Array(), 'outCell' : new Array(), 'inConn' : new Array(), 'outConn' : new Array() }
			cell.config.func = new Array();
			
			// 셀 Target Circle 제작
			cell.config.targetCircle = [ canvas.circle(initCellX,initCellY,0), canvas.circle(initCellX,initCellY,0), canvas.circle(initCellX,initCellY,0), canvas.circle(initCellX,initCellY,0) ];
			
			
			// 셀 Resizer 제작
			cell.config.resizeRect = new Array();
			cell.config.resizeRect = canvas.rect(initCellX + initStyle['width']/2-10, initCellY + initStyle['height']/2-10,10,10);
			cell.config.resizeRect.attr({ 'cursor' : 'se-resize', 'fill' : '#00ffff', 'stroke' : 'none', 'fill-opacity' : 0 });
			cell.config.resizeRect.config = new Array();
			
			cell.config.resizeRect.drag(
			
			// Drag Move;
			function(_x, _y){
				//this.attr({ 'x' : this.config.downX + _x -10, 'y' : this.config.downY + _y - 10 });
				cell.attr({ 'width' : this.config.downCellWidth + _x, 'height' : this.config.downCellHeight + _y})
				cell.targetCirclePosition();
				cell.cellResize();
			},
			
			// Drag Start
			function(_x, _y){
				canvas.config.objectDown = this;
				this.config.downX = _x;
				this.config.downY = _y;
				this.config.downCellX = cell.attr('x');
				this.config.downCellY = cell.attr('y');
				this.config.downCellWidth = cell.attr('width');
				this.config.downCellHeight = cell.attr('height');
			},
			
			// Drag End
			function(){
				canvas.config.objectDown = false;
				cell.cellResize();
			});
			
			cell.cellResize = function(){

				cell.config.resizeRect.attr({ 'x' : cell.attr('x') + cell.attr('width') - 10, 'y' : cell.attr('y') + cell.attr('height') - 10 });
				for(var i in cell.config.connection.outConn){
							connectionPosition(cell.config.connection.outConn[i]);
				}
				for(var j in cell.config.connection.inConn){
					connectionPosition(cell.config.connection.inConn[j]);
				}
			}
			
			
			// 네 개의 targetCircle에 이벤트를 등록하기 위한 함수, _attr이 있으면 해당 다차 배열을 매칭하여 속성을 대입.
			cell.targetCircleFunc = function( _func, _attr ){
				for(var key in cell.config.targetCircle){
					if(_attr){
						cell.config.targetCircle[key].attr( _attr[key] );
						// 시계 방향으로 Type Index를 "top: 0, right : 1, bottom : 2, right : 3" 형식으로 부여한다.
						cell.config.targetCircle[key].typeIndex = key;
					}
					if(_func){
						_func( cell.config.targetCircle[key] );
					}
				}
			}
			cell.targetCircleIn = function(){
				cell.targetCircleFunc(function(_obj){
					_obj.animate({'opacity':.5,'r': 5},300,"backOut");
				});
			}
			cell.targetCircleOut = function(){
				cell.targetCircleFunc(function(_obj){
					_obj.animate({'opacity':0,'r': 1},300,"backOut");
				});
			}
			cell.targetCirclePosition = function(){
				cell.targetCircleFunc(null,[
				{'cx' : cell.attr('x') + (cell.attr('width')/2), 'cy' : cell.attr('y') - cell.attr('stroke-width')/2 },
				{'cx' : cell.attr('x') + cell.attr('width') + cell.attr('stroke-width')/2, 'cy' : cell.attr('y') +  (cell.attr('height')/2)},
				{'cx' : cell.attr('x') + (cell.attr('width')/2), 'cy' : cell.attr('y') + cell.attr('height') + cell.attr('stroke-width')/2 },
				{'cx' : cell.attr('x') - cell.attr('stroke-width')/2, 'cy' : cell.attr('y') +  (cell.attr('height')/2) }
				]);
			}
			
			cell.targetCircleFunc( function( targetCircle ){
				
				targetCircle.attr({'fill' : '#797979','stroke':'none','opacity':0,'r':1});
				targetCircle.helper = false;	
			
				targetCircle.mouseover(function(){
					this.attr({'cursor':'pointer'});
					this.stop().animate({'opacity':1,'r': 5},100);
					if(cell.config.targetTimer){
						clearTimeout(cell.config.targetTimer);
					}
					
				});
				targetCircle.mouseout(function(){
					if(canvas.config.objectDown != targetCircle){
						cell.targetCircleOut();
					}
					cell.config.tmp.connectIn = false;
				});
				targetCircle.mouseup(function(){
					if( canvas.config.connecting && cell.config.tmp.connectIn){
						createConnection( canvas.config.connecting.cell, cell.config.tmp.connectIn, canvas.config.connecting.typeIndex, this.typeIndex );
					}
				});
				targetCircle.onDragOver(function(){
					this.stop().animate({'opacity':1,'r': 5},100);
					if(cell.config.targetTimer){
						clearTimeout(cell.config.targetTimer);
					}
					if( canvas.config.connecting && canvas.config.connecting.cell != cell ){

						cell.config.tmp.connectIn = cell;
					}
				})
				
				targetCircle.drag(
				// Drag Move
				function(_x,_y){
					if(this.helper){
						this.helper.attr({
							'path' : "M "+this.attr('cx')+" "+this.attr('cy')+" L "+ (this.attr('cx')+_x)+" "+(this.attr('cy')+_y),
							'stroke-dasharray' : '-',
							'stroke' : '#858585'
						});
					}
				},
				// Drag Start
				function(){
					canvas.config.objectDown = this;
					this.helper = canvas.path();
					this.helper.toFront();
					canvas.config.connecting = { 'cell' : cell, 'typeIndex' : this.typeIndex };
				},
				// Drag End
				function(){
					cell.targetCircleOut();
					canvas.config.objectDown = false;
					if(this.helper){
						this.helper.remove();
						this.helper = false;
						canvas.config.connecting = false;
					}
				});
			});
			
			//cell 이벤트 등록
			cell.mouseover(function(){
				this.attr({'cursor':'pointer'});
				this.targetCircleIn();
				//this.targetCirclePosition();
				if( canvas.config.connecting && canvas.config.connecting.cell != this ){

						this.config.tmp.connectIn = this;
				}
			});
			cell.mouseout(function(){
				this.config.targetTimer = setTimeout(function(){
					cell.targetCircleOut();
				}, 100)
				
			});
			cell.mouseup(function(){
				canvas.config.objectDown = false;
				this.attr({'opacity' : this.config.tmp.opacity});
				if( canvas.config.connecting && this.config.tmp.connectIn){
					createConnection( canvas.config.connecting.cell, this.config.tmp.connectIn, canvas.config.connecting.typeIndex, 'auto' );
				}
			});
			cell.mousedown(function(){
				canvas.config.objectDown = this;
				this.config.tmp.opacity = this.attr('opacity');
				this.attr({'opacity' : .5});
			})
			cell.drag( 
				// Drag Move
				function( _x, _y ){
					if(canvas.config.objectDown){
						this.cellResize();
						var x = this.config.downX + _x;
						var y = this.config.downY + _y;
						this.attr({'x' : x, 'y' : y});
						if(this.config.targetTimer){
							clearTimeout(this.config.targetTimer);
						}
						this.targetCirclePosition();
						for(var i in this.config.connection.outConn){
							connectionPosition(this.config.connection.outConn[i]);
						}
						for(var j in this.config.connection.inConn){
							connectionPosition(this.config.connection.inConn[j]);
						}
						
					}
					
				},
				//Drag Start
				function( _x, _y ){
					this.toFront();
					this.targetCircleFunc(function(_obj){
						_obj.toFront();
					});

					this.config.downX = this.attr('x');
					this.config.downY = this.attr('y');
				},
				
				//Drag End
				function(){
					this.cellResize();
					this.config.resizeRect.toFront();
					this.config.downX = false;
					this.config.downY = false;
				}
			);
			
			cell.toConnect = function( _toObj ){
				createConnection( cell, _toObj );
			}
			
			cell.onAnimation(function(){
				this.targetCirclePosition();
				this.cellResize();
				for(var i in cell.config.connection.outConn){
					connectionPosition(cell.config.connection.outConn[i]);
				}
				for(var j in cell.config.connection.inConn){
					connectionPosition(cell.config.connection.inConn[j]);
				}
			})

			return cell;
		}
		
		
		// Cell 연결 이벤트
		function createConnection( _outCell, _inCell, _outTypeIndex, _inTypeIndex ){
			for(var i in _outCell.config.connection.outCell){
					for(var j in _inCell.config.connection.inCell){
					if( _outCell.config.connection.outCell[i] == _inCell && _inCell.config.connection.inCell[j] == _outCell ){
						console.log("etreecell : ", "'" + _outCell.id + " to " + _inCell.id + "' line is exist.");
						return false;
					}
				}
			}
			if( !_outTypeIndex ){
				_outTypeIndex = 'auto';
			}
			if( !_inTypeIndex ){
				_inTypeIndex = 'auto';
			}

			if ( _outTypeIndex != 'auto' ){
					_outTypeIndex = parseInt(_outTypeIndex);
			}
			if ( _inTypeIndex != 'auto' ){
					_inTypeIndex = parseInt(_inTypeIndex);
			}

			var conn = canvas.path();
			canvas.register.connection.push(conn);
			
			conn.id = _outCell.id + "_" + _inCell.id;
			conn.outCell = _outCell;
			conn.inCell = _inCell;
			conn.outTypeIndex = _outTypeIndex;
			conn.inTypeIndex = _inTypeIndex;
			
			_outCell.config.connection.outConn.push(conn);
			_inCell.config.connection.inConn.push(conn);
			_outCell.config.connection.outCell.push(_inCell);
			_inCell.config.connection.inCell.push(_outCell);
			
			connectionPosition(conn);
		}
		
		
		
		function connectionPosition( _Conn ){
			_Conn.attr({"path" : connectionCurve( _Conn.outCell , _Conn.inCell , [ _Conn.outTypeIndex, _Conn.inTypeIndex ] )});
		}
		
		function connectionCurve( _outCell , _inCell , _fixIndex_ ){
			if(!_outCell.getBBox().width && !_outCell.getBBox().height ){
				return false;
			}
			var outCellBBox = _outCell.getBBox();
			var inCellBBox = _inCell.getBBox();
		
			var outCellStroke = _outCell.attr('stroke-width');
			var inCellStroke = _inCell.attr('stroke-width');
			
			var path = [{x : outCellBBox.x + outCellBBox.width / 2, y : outCellBBox.y - outCellStroke / 2 },
			         {x : outCellBBox.x + outCellBBox.width / 2, y : outCellBBox.y + outCellBBox.height + outCellStroke / 2 },
					 {x : outCellBBox.x - outCellStroke / 2, y : outCellBBox.y + outCellBBox.height / 2},
					 {x : outCellBBox.x + outCellBBox.width + outCellStroke / 2 , y : outCellBBox.y + outCellBBox.height / 2},
					 {x : inCellBBox.x + inCellBBox.width / 2, y : inCellBBox.y - inCellStroke / 2},
					 {x : inCellBBox.x + inCellBBox.width / 2, y : inCellBBox.y + inCellBBox.height + inCellStroke / 2},
					 {x : inCellBBox.x - inCellStroke / 2, y : inCellBBox.y + inCellBBox.height / 2},
					 {x : inCellBBox.x + inCellBBox.width + inCellStroke / 2, y : inCellBBox.y + inCellBBox.height / 2}];
			
			var d = {}, distance = [];
		    for ( var i = 0; i < 4; i++ ) {
		        for ( var j = 4; j < 8; j++ ) {
		            var dx = Math.abs(path[i].x - path[j].x),
		                dy = Math.abs(path[i].y - path[j].y);
		            if ( (i == j - 4) || (((i != 3 && j != 6) || path[i].x < path[j].x) && ((i != 2 && j != 7) || path[i].x > path[j].x) && ((i != 0 && j != 5) || path[i].y > path[j].y) && ((i != 1 && j != 4) || path[i].y < path[j].y)) ) {
		                distance.push(dx + dy);
		                d[distance[distance.length - 1]] = [i, j];
		          
		            }
		        }
		    }
		    var fixIndex, autoIndex;
			    if ( distance.length == 0 ) {
			        fixIndex = [0, 4];
			    } else {
			        fixIndex = d[Math.min.apply(Math, distance)];
			        
			    }
			if( _fixIndex_ ){
				//시계방향 4분면과 이 함수에서의 4분면의 호환을 위한 파싱 함수.
				var parsePosit = function( __x_ ){
					var __parseX;
					switch ( __x_ ){
						case 0 : __parseX = 0;break;
						case 1 : __parseX = 3;break;
						case 2 : __parseX = 1;break;
						case 3 : __parseX = 2;break;
						default:break;
					}
					return __parseX;
				}
				var unparsePosit = function( __x_ ){
					var __parseX;
					switch ( __x_ ){
						case 0 : __parseX = 2;break;
						case 1 : __parseX = 0;break;
						case 2 : __parseX = 1;break;
						case 3 : __parseX = 3;break;
						default:break;
					}
					return __parseX;
				}
				var marginPosit = function( __x_ ){
					var __parseX;
					switch ( __x_ ){
						case 0 : __parseX = -4;break;
						case 1 : __parseX = 4;break;
						case 2 : __parseX = 0;break;
						case 3 : __parseX = 0;break;
						default:break;
					}
					return __parseX;
				}
				
				if( _fixIndex_[0] != 'auto' ){
					fixIndex[0] = parsePosit( parseInt(_fixIndex_[0]) );
				}
				
				if( _fixIndex_[1] != 'auto' ){
					fixIndex[1] = parsePosit( parseInt(_fixIndex_[1]) )+4;
				}
			}
		    var x1 = path[fixIndex[0]].x,
		        y1 = path[fixIndex[0]].y,
		        x4 = path[fixIndex[1]].x,
		        y4 = path[fixIndex[1]].y;
		    
		    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
		    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
		    var x2 = [x1, x1, x1 - dx, x1 + dx][fixIndex[0]].toFixed(3),
		        y2 = [y1 - dy, y1 + dy, y1, y1][fixIndex[0]].toFixed(3),
		        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][fixIndex[1]].toFixed(3),
		        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][fixIndex[1]].toFixed(3);
		    return ['M', x1.toFixed(3), y1.toFixed(3), 'C', x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(',');
		}
		
		// 저장 할 경우 데이터로 뽑아낼 때 실행한다.
		function exportData(){
			var str = new Array();
			var strCell = new Array(), strConn = new Array();
			var _cell = canvas.register.cell;
			var _connection = canvas.register.connection;
			for(var i in _cell){
				strCell[i] = '{ "id" : "' + (_cell[i].id) + '", ';
				strCell[i] += '"attrs" : { ';

				var tmpAttrs = new Array();
				for(var j in _cell[i].attrs){
					tmpAttrs.push('"' + j + '" : "' + (_cell[i].attrs[j]) + '"');
				}
				
				strCell[i] += tmpAttrs.join(', ');
				strCell[i] += ' } ';
				strCell[i] += '}';
			}
			
			for(var i in _connection){
				strConn[i] = '{ "inCell" : "' + (_connection[i].inCell.id) + '", "outCell" : "' + (_connection[i].outCell.id) +'", ';
				strConn[i] += '"inTypeIndex" : "' + (_connection[i].inTypeIndex) + '", "outTypeIndex" : "' + (_connection[i].outTypeIndex) +'", ';
				strConn[i] += '"attrs" : { ';
				
				var tmpAttrs = new Array();
				
				for(var j in _connection[i].attrs){
					if( j.toLowerCase() != "path" ){
						tmpAttrs.push('"' + j + '" : "' + (_connection[i].attrs[j]) + '"');
					}
				}
				
				strConn[i] += tmpAttrs.join(', ');
				strConn[i] += ' } ';
				strConn[i] += '}';
			}
			str.push('{ "cell" : [ ' + strCell.join(', ') + ' ] } ');
			str.push('{ "connection" : [ ' + strConn.join(', ') + ' ] } ');
			return( '[ ' + str.join(', ') + ' ]' );
		}

		function loadData( _data ){
			// 캔버스 초기화
			canvas.clear();
			canvas = init( canvas.obj );
			
			var tmpJSON = eval("(function(){return " + _data + ";})()");
			var tmpCell = tmpJSON[0].cell;
			var tmpConn = tmpJSON[1].connection;
			for(var i in tmpCell){
				for(var j in tmpCell[i].attrs){
					var tmpAttr = (tmpCell[i].attrs[j]);
					if( isNaN(parseInt(tmpAttr)) ){
						tmpCell[i].attrs[j] = tmpAttr;
					}else{
						tmpCell[i].attrs[j] = parseInt(tmpAttr);
					}
				}

					canvas.createCell(tmpCell[i].id,tmpCell[i].attrs)

				
				//console.log(tmpCell[i])
			}

			for(var i in tmpConn){
				for(var j in tmpConn[i].attrs){
					var tmpAttr = (tmpConn[i].attrs[j]);
					if( isNaN(parseInt(tmpAttr)) ){
						tmpConn[i].attrs[j] = tmpAttr;
					}else{
						tmpConn[i].attrs[j] = parseInt(tmpAttr);
					}
				}
				
				canvas.createConnection( canvas.getById(tmpConn[i].outCell), canvas.getById(tmpConn[i].inCell), tmpConn[i].outTypeIndex , tmpConn[i].inTypeIndex );
			}

		}
		function animate( _attr, _duration, _easing ){
			var attr = {
				'x' : 0,
				'y' : 0,
				'zoom' : 1
			}
			var duration = 800;
			var easing = '<>';
			
			if(_duration){
				duration = _duration;
			}
			if(_easing){
				easing = _easing;
			}
			for(var i in _attr){
				attr[i] = _attr[i];
			}
			
			//canvas.setViewBox();
			canvas.animateViewBox( attr.x, attr.y, canvas.width / attr.zoom, canvas.height / attr.zoom, duration, easing);

		}
	
		// 반환 등록.
		canvas.obj = _canvas;
		canvas.createCell = createCell;
		canvas.createConnection = createConnection;
		canvas.exportData = exportData;
		canvas.loadData = loadData;
		canvas.animate = animate;
		return canvas;
	}

	//Base64 Encoding 과 Decoding을 위한 함수
	var Base64 = { _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";e += "";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
	
	
	//Etreecell Function 및 Variable Return
	for(var i = 0; i < canvasElement.length; i++){
		canvasReturn[i] = init(canvasElement[i], _loadDatas);
	}
	
	return canvasReturn;
	
}

Raphael.fn.animateViewBox = function animateViewBox( x, y, w, h, duration, easing_function, callback )
{
    var cx = this._viewBox ? this._viewBox[0] : 0,
        dx = x - cx,
        cy = this._viewBox ? this._viewBox[1] : 0,
        dy = y - cy,
        cw = this._viewBox ? this._viewBox[2] : this.width,
        dw = w - cw,
        ch = this._viewBox ? this._viewBox[3] : this.height,
        dh = h - ch,
        self = this;;
    easing_function = easing_function || "linear";
 
    var interval = 25;
    var steps = duration / interval;
    var current_step = 0;
    var easing_formula = Raphael.easing_formulas[easing_function];
 
    var intervalID = setInterval( function()
        {
            var ratio = current_step / steps;
            self.setViewBox( cx + dx * easing_formula( ratio ),
                             cy + dy * easing_formula( ratio ),
                             cw + dw * easing_formula( ratio ),
                             ch + dh * easing_formula( ratio ), false );
            if ( current_step++ >= steps )
            {
                clearInterval( intervalID );
                callback && callback();
            }
        }, interval );
}
