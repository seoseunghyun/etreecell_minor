// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ etreecell 0.0.1 - etreecell Document Form JavaScript Library       │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2010-2015 etreecell (http://etreecell.com)             │ \\
// │ Copyright © 2009-2015 seoseunghyun (http://seoseunghyun.com)       │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the CC () license.                                  │ \\
// └────────────────────────────────────────────────────────────────────┘ \\
/*\
 |	Variable & Function Rule.
 |	_* : Parameter Variable or Function
 |	*_ : Temp Variable or Function (count of underbar is mean Depth)
 |	etreecell = canvas
\*/
(function(window, document, undefined) {

    // !etreecell : Global variable
    var etreecell = function(_canvas, _renderer) {

        this.version = '0.0.1';
        this.canvas = _canvas;
        
        this.render = etreecell.renderer[ _renderer || 'Raphael' ];        
        this.paper = this.render.constructor( _canvas );
		
        this.render.etreecell = this;
		this.render.background = this.render.setBackgroundEvent(this,this.paper);

        // etreecell's mode (read & write mode)
        this.mode = {
            animate: {
                createCell: false
            },
            edit: true,
            view: true,
            effect: true,
            control: 'mouse' // able to 'touch'
        }

        this.pressedKey = {
            shift: false,
            ctrl: false
        }

        var this_ = this;



        // document's special key sender
        document.addEventListener("keydown", function(e) {

            var code_ = (e.keyCode ? e.keyCode : e.which)
            switch (code_) {
                case 16:
                    this_.pressedKey.shift = true;
                    break;
                case 17:
                    this_.pressedKey.ctrl = true;
                    break;
                    // Mac Command Key
                case 91:
                    this_.pressedKey.ctrl = true;
                    break;
                    
				case 8 : 
					if(this_.mode.edit && this_.active.cell == '' ){
						this_.selected.cell[0].remove();
					}
					break;
				case 46 : 
					if(this_.mode.edit && this_.active.cell == ''){
						this_.selected.cell[0].remove();
					}
					break;

                default:
                    break;
            }
        }, false);

        document.addEventListener("keyup", function(e) {

            var code_ = (e.keyCode ? e.keyCode : e.which);

            switch (code_) {
                case 16:
                    this_.pressedKey.shift = false;
                    break;
                case 17:
                    this_.pressedKey.ctrl = false;
                    break;
                    // Mac Command Key
                case 91:
                    this_.pressedKey.ctrl = false;
                    break;
                default:
                    break;
            }
        }, false);


    }

    etreecell.renderer = {};
    etreecell.form = {};

    // !Renderer of Raphael
    etreecell.renderer.Raphael = {
	    
	    // etreecell object of Global etreecell function.
	    etreecell : null,
	    
        // new Raphael Object return
        constructor: function(_paper) {
            return new Raphael(document.getElementById(_paper));
        },
        
        setBackgroundEvent : function(_etreecell , _render){
	        alert('d');
	        var etreecell_ = this.etreecell;
	        
	        return  _render.rect(0, 0, _etreecell.paper.width, _etreecell.paper.height, 0)
            .attr({

                'fill': '#eeeeee',
                'fill-opacity': 0,
                'stroke-width': 0

            })
            .dblclick(function(e) {
				e.preventDefault()
                etreecell_.createCell(guid(), {
                    x: e.offsetX - 100,
                    y: e.offsetY - 13,
                    width: 200,
                    height: 26,
                    'fill-opacity': 0,
                    stroke: '#222222',
                    'stroke-width': 2,
                    shape: {
                        'fill': '#222222'
                    }
                });
                

            })
            .toBack()
        },

        // Create Cell Shape. ( _cell )
        shape: function(_cell) {

            // Create Rectangle
            var etreecell_ = this.etreecell;
            var attrs_ = mergeObject(etreecell_.defaultStyle.cell, _cell.styleAttrs);


            var shape_ = etreecell_.paper.rect(attrs_.x, attrs_.y, 0, 0, attrs_.r);

            // Modify custom style of Cell.
            shape_.attr(attrs_);


            // Create Animation ( if mode of createCell animation is true )
            if (this.etreecell.mode.animate.createCell) {

                shape_.attr({

                    x: attrs_.x + attrs_.width / 2,
                    y: attrs_.y + attrs_.height / 2,
                    width: 0,
                    height: 0

                });

                var attrTimer_ = setInterval(function() {

                    _cell.linkPositioning();
                    _cell.helpers.positioning();

                }, 0);

                shape_.animate({

                    x: attrs_.x,
                    y: attrs_.y,
                    width: attrs_.width,
                    height: attrs_.height

                }, 300, "backOut", function() {

                    clearInterval(attrTimer_);

                });

            } else {

                shape_.attr({

                    width: attrs_.width,
                    height: attrs_.height

                });

            }

            return shape_;

        },

        // Create helpers Shape.
        helpers: function(_cell) {

            var etreecell_ = _cell.etreecell;
            var render_ = etreecell_.render;
            var this_ = this;

            var helperStyle_ = etreecell_.defaultStyle.theme;
            if (helperStyle_ == 'dark') {
                helperStyle_ = {
                    fill: '#bbbbbb',
                    autoFill: '#e6e6e6',
                    stroke: 'none'
                }
            } else if (helperStyle_ == 'bright') {
                helperStyle_ = {
                    fill: '#585858',
                    autoFill: '#161616',
                    stroke: 'none'
                }
            } else {
                helperStyle_ = {
                    fill: etreecell_.defaultStyle.helper.fill || '#585858',
                    autoFill: etreecell_.defaultStyle.helper.autoFill || '#161616',
                    stroke: etreecell_.defaultStyle.helper.stroke || 'none'
                }
            }
            this.linkers = [];

            for (var i = 0; i < 5; i++) {
                this.linkers[i] = etreecell_.paper
                    .path(render_.helperPosition(_cell, i))
                    .attr({
                        stroke: helperStyle_.stroke,
                        fill: ((i == 4) ? helperStyle_.autoFill : helperStyle_.fill),
                        cursor: 'pointer',
                        opacity: .3,
                        'fill-opacity': 0
                    })
                    .mouseover(function() {
                        this_.showLinker(this.fixIndex);
                        if (etreecell_.tmp.helperLinking && etreecell_.tmp.helperLinking.cell != this.cell) {
                            this_.focusLinker(true, this.fixIndex);
                        }
                    })
                    .mouseout(function() {
                        this_.hideLinker();
                    })
                    .mouseup(function() {
                        if (etreecell_.tmp.helperLinking && etreecell_.tmp.helperLinking.cell != this.cell && !keyInArray(this.cell.io.inCell, etreecell_.tmp.helperLinking.cell)) {

                            etreecell_.tmp.helperLinking.cell.link(_cell, null, [((etreecell_.tmp.helperLinking.fixIndex == 4) ? 'auto' : etreecell_.tmp.helperLinking.fixIndex), ((this.fixIndex == 4) ? 'auto' : this.fixIndex)]);

//                            etreecell_.tmp.helperLinking.cell.bindData(_cell, 0, 0)

                            etreecell_.tmp.helperLinking.cell.refreshData();
                            this_.focusLinker(false, this.fixIndex);
                            etreecell_.tmp.helperLinking.cell.helpers.hideLinker();

                        }
                    })
                    .toFront()
                    .drag(
                        // Drag Move
                        function(_x, _y) {
                            this.translate(_x - this.originalX_, _y - this.originalY_);

                            if (this.helper_) {
                                this.helper_.attr({
                                    'path': "M " + this.helperOriginalX_ + "," + this.helperOriginalY_ + " L" + (_x + this.helperOriginalX_) + "," + (_y + this.helperOriginalY_),
                                    'stroke-dasharray': '-',
                                    'stroke': '#858585'
                                });
                            }

                            this.originalX_ = _x;
                            this.originalY_ = _y;
                            this.toBack();
                            this.helper_.toBack();

                        },
                        // Drag start
                        function(_x, _y) {

                            this.originalX_ = 0;
                            this.originalY_ = 0;

                            this.helperOriginalX_ = _x;
                            this.helperOriginalY_ = _y;
                            this.helper_ = etreecell_.paper.path();
                            this.helper_.toFront();

                            etreecell_.tmp.helperLinking = this;
                        },
                        // Drag end
                        function() {
                            this.translate(-1 * this.originalX_, -1 * this.originalY_)
                            etreecell_.tmp.helperLinking = false
                            if (this.helper_) {
                                this.helper_.remove();
                                this.helper_ = false;
                            }
                        }
                    )
                this.linkers[i].fixIndex = i;
                this.linkers[i].cell = _cell;


            }
            this.resizer = etreecell_.paper
                .path(render_.helperPosition(_cell, 'resizer'))
                .attr({
                    stroke: 'none',
                    fill: '#2f2f2f',
                    cursor: 'se-resize',
                    'fill-opacity': 0
                })
                .mouseover(function() {
                    this_.showLinker('resizer');
                })
                .mouseout(function() {
                    this_.hideLinker();
                })
                .toFront()
                //.hide()
                .drag(
                    // drag move
                    function(_x, _y) {

                        if (this.originalWidth + this.originalX_ < _cell.form.shape.getBBox().width + 5 || this.originalHeight + this.originalY_ < _cell.form.shape.getBBox().height + 5) {

                            this.originalX_ = _x;
                            this.originalY_ = _y;

                            return;

                        } else {

                            this.translate(_x - this.originalX_, _y - this.originalY_);

                            this.originalX_ = _x;
                            this.originalY_ = _y;

                            _cell.attr({
                                'width': this.originalWidth + this.originalX_,
                                'height': this.originalHeight + this.originalY_
                            });

                        }
                        _cell.linkPositioning();


                    },
                    // drag start
                    function() {
                        this.originalX_ = 0;
                        this.originalY_ = 0;
                        this.originalWidth = _cell.shape.attr('width');
                        this.originalHeight = _cell.shape.attr('height');
                    },
                    // drag end
                    function() {

                    }
                )

            var focusTransform = {
                onPath: "r180 ",
                offPath: "r0 t0,0",
                distance: 3
            }

            // 연결 중일 때 특정(마우스를 올려 놓은) 링커의 모양을 변형 시킨다.
            this.focusLinker = function(_focusBool, _fixIndex) {

                if (_focusBool) {
                    var linkerTransform_ = focusTransform.onPath;

                    switch (_fixIndex) {

                        case 0:
                            linkerTransform_ += "t0,-" + focusTransform.distance;
                            break;

                        case 1:
                            linkerTransform_ += "t" + focusTransform.distance + ",0";
                            break;

                        case 2:
                            linkerTransform_ += "t0," + focusTransform.distance;
                            break;

                        case 3:
                            linkerTransform_ += "t-" + focusTransform.distance + ",0";
                            break;

                    }

                    this_.linkers[_fixIndex].transform(linkerTransform_);


                } else {

                    this_.linkers[_fixIndex].transform(focusTransform.offPath);

                }

            }

            // 연결 중일 때 링커 전체의 모양을 변형 시킨다.
            this.focusLinkers = function(_focusBool) {

                if (_focusBool) {

                    for (var i in this_.linkers) {

                        var linkerTransform_ = focusTransform.onPath;

                        switch (this_.linkers[i].fixIndex) {
                            case 0:
                                linkerTransform_ += "t0,-" + focusTransform.distance;
                                break;

                            case 1:
                                linkerTransform_ += "t" + focusTransform.distance + ",0";
                                break;

                            case 2:
                                linkerTransform_ += "t0," + focusTransform.distance;
                                break;

                            case 3:
                                linkerTransform_ += "t-" + focusTransform.distance + ",0";
                                break;
                        }

                        this_.linkers[i].transform(linkerTransform_);

                    }

                } else {

                    for (var i in this_.linkers) {

                        this_.linkers[i].transform("r0");

                    }

                }


            }


            // 링커를 보여준다.
            this.showLinker = function(_fixIndex) {



                for (var i in this.linkers) {

                    this.linkers[i].attr({
                        'fill-opacity': 1
                    }).toFront()
                    this.resizer.attr({
                        'fill-opacity': 0
                    }).toFront()

                    if (_fixIndex == parseInt(i)) {

                        this.linkers[i].attr('opacity', .9)

                    } else {

                        this.linkers[i].attr('opacity', .5)

                    }
                }

            }

            // 링커를 가린다.
            this.hideLinker = function() {



                for (var i in this_.linkers) {
                    this_.linkers[i].attr({
                        'fill-opacity': 0
                    });
                }

                this_.resizer.attr({
                    'fill-opacity': 0
                });

            }



            // Helper Event Function 등록
            this.positioning = function() {

                for (var i in this.linkers) {

                    this.linkers[i].attr('path', render_.helperPosition(_cell, parseInt(i)))

                }

                this.resizer.attr('path', render_.helperPosition(_cell, 'resizer')).transform('')
            }


            // 에디트 모드가 아닐 때 helper들 모두 숨김
            if (!etreecell_.mode.edit) {
                for (var i in this.linkers) {
                    this.linkers[i].hide();
                }
                this.resizer.hide();
            }

            // 마우스 모드일 때 적용 이벤트
            if (etreecell_.mode.control == 'mouse' && etreecell_.mode.edit) {
                _cell.pushEvent(function(e) {
                    this_.positioning();
                }, 'dragmove');

                _cell.pushEvent(function(e) {
                    _cell.helpers.showLinker();
                    if (etreecell_.tmp.helperLinking && etreecell_.tmp.helperLinking.cell != e.cell) {
                        _cell.helpers.focusLinkers(true);
                    }
                }, 'mouseover');

                _cell.pushEvent(function(e) {
                    _cell.helpers.focusLinkers(false);
                    _cell.helpers.hideLinker();

                }, 'mouseout');

                _cell.pushEvent(function(e) {
                    if (etreecell_.tmp.helperLinking && etreecell_.tmp.helperLinking.cell != _cell && !keyInArray(_cell.io.inCell, etreecell_.tmp.helperLinking.cell)) {
                        etreecell_.tmp.helperLinking.cell.link(_cell, null, [((etreecell_.tmp.helperLinking.fixIndex == 4) ? 'auto' : etreecell_.tmp.helperLinking.fixIndex), 'auto'])
                    }
                    _cell.helpers.focusLinkers(false);
                }, 'mouseup')

            }



        },

        // linker positioning	return : PATH
        helperPosition: function(_cell, _fixIndex, _size, _distance) {
            var size = _size || 7;
            var distance = _distance || 0;
            var cell_ = {
                x: _cell.shape.attr('x'),
                y: _cell.shape.attr('y'),
                width: _cell.shape.attr('width'),
                height: _cell.shape.attr('height'),
                r: _cell.shape.attr('r')
            }
            var path_;

            switch (_fixIndex || 0) {
                case 0:
                    path_ = "M" + (cell_.x + (cell_.width / 2) - size) + "," + (cell_.y - distance) + " L" + (cell_.x + (cell_.width / 2) + size) + "," + (cell_.y - distance) + " L" + (cell_.x + (cell_.width / 2)) + "," + (cell_.y - distance - size) + " Z";
                    break;

                case 1:
                    path_ = "M" + (cell_.x + cell_.width + distance) + "," + ((cell_.y + cell_.height / 2) - size) + " L" + (cell_.x + cell_.width + distance) + "," + ((cell_.y + cell_.height / 2) + size) + " L" + (cell_.x + cell_.width + distance + size) + "," + (cell_.y + cell_.height / 2) + " Z";
                    break;

                case 2:
                    path_ = "M" + (cell_.x + (cell_.width / 2) - size) + "," + (cell_.y + cell_.height + distance) + " L" + (cell_.x + (cell_.width / 2) + size) + "," + (cell_.y + cell_.height + distance) + " L" + (cell_.x + (cell_.width / 2)) + "," + (cell_.y + cell_.height + distance + size) + " Z";
                    break;

                case 3:
                    path_ = "M" + (cell_.x - distance) + "," + ((cell_.y + cell_.height / 2) - size) + " L" + (cell_.x - distance) + "," + ((cell_.y + cell_.height / 2) + size) + " L" + (cell_.x - distance - size) + "," + (cell_.y + cell_.height / 2) + " Z";
                    break;

                case 4:
                    size /= 1.5;
                    path_ = "M " + (cell_.x - (distance * 2)) + "," + (cell_.y - (distance * 2)) + " m -" + size + ", 0 a " + size + "," + size + " 0 1,0 " + size * 2 + ",0 a " + size + "," + size + " 0 1,0 -" + size * 2 + ",0";
                    break;

                case 'resizer':
                    path_ = "M" + (cell_.x + cell_.width + 4) + "," + (cell_.y + cell_.height - cell_.r) + " L" + (cell_.x + cell_.width + 4) + "," + (cell_.y + cell_.height + 4) + " L" + (cell_.x + cell_.width - cell_.r) + "," + (cell_.y + cell_.height + 4) + " Z";
                    break;

                default:
                    break;
            }
            return path_;
        },

        bindEvents: function(_cell) {

            var isClickBool_ = true;


            // 더블 클릭 시 해당 셀 활성화를 위한 변수
            var dblclickBool_ = false;
            var dblclickTimer_;

            // Event Register
            _cell.shape
                .drag(function(_x, _y) {
                    // IE에서는 mousedown 부터 dragmove 처리를 해주기 때문에 다음과 같이 처리를 해야한다.
                    if (_x != 0 && _y != 0) {
                        isClickBool_ = false;
                        clearTimeout(dblclickTimer_);
                        dblclickBool_ = false;
                        functionInArray(_cell.events.dragmove, {
                            shape: this,
                            x: _x,
                            y: _y
                        });
                    }
                }, function() {
	                //c.preventDefault();
                    functionInArray(_cell.events.dragstart, this);
                }, function() {
                    functionInArray(_cell.events.dragend, this);
                })
                .mouseup(function() {

                    // CLICK EVENT : Prevent drag event
                    if (isClickBool_) {
                        functionInArray(_cell.events.click, {
                            cell: _cell
                        });
                    }

                    isClickBool_ = true;
                    functionInArray(_cell.events.mouseup, {
                        cell: _cell
                    });



                })
                .mouseover(function() {
                    functionInArray(_cell.events.mouseover, {
                        cell: _cell
                    });
                })
                .mouseout(function() {
                    functionInArray(_cell.events.mouseout, {
                        cell: _cell
                    });
                })

            // 셀이 더블클릭으로 활성화 되었을 때 자동적으로 activate 이벤트가 활성화 된다.
            .mousedown(function() {

                if (dblclickBool_) {

                    functionInArray(_cell.events.dblclick, {
                        cell: _cell
                    });

                }
                dblclickBool_ = true;

                dblclickTimer_ = setTimeout(function() {
                    dblclickBool_ = false;
                }, 300)
                functionInArray(_cell.events.mousedown, {
                    cell: _cell
                });
            })


        },

        // Initiallizing Events
        initEvents: function(_cell) {

            var this_ = this;
            var selectedShape_;
            var shapeAction_ = {

                drag_: false,

                originalPosition_: {
                    x: 0,
                    y: 0
                }

            };

            var bindersOriginalPosition_ = {

                x: [],
                y: [],
                width: [],
                height: []

            };
            _cell.linkPositioning = function() {
                for (var i in this.io.link) {

                    // IE 에서는 arrow가 path에 들어가기 때문에 다음과 같이 처리해준다.
                    this.io.link[i].link.attr({
                        'arrow-start': '',
                        'arrow-end': ''
                    })

                    this.io.link[i].link.attr('path', this_.etreecell.render.linkCurve(this.io.link[i].outCell, this.io.link[i].inCell, this.io.link[i].fixIndex));

                    this.io.link[i].link.attr({
                        'arrow-start': this.io.link[i].styleAttrs['arrow-start'],
                        'arrow-end': this.io.link[i].styleAttrs['arrow-end']
                    })

                }
            }



            // 편집이 가능하면
            if (_cell.etreecell.mode.edit) {

                _cell.etreecell.paper.canvas.addEventListener('mousedown', function() {
                    _cell.etreecell.deselectAll();
                    _cell.etreecell.deactivateAllCell();

                }, true);

                _cell.overrideEvent(function(e) {
                    _cell.select();
                }, 'mousedown');
                _cell.overrideEvent(function(e) {

                    var _shape = e.shape;
                    var _x = e.x;
                    var _y = e.y;
                    

                    _shape.attr({

                        x: shapeAction_.originalPosition_.x + _x,
                        y: shapeAction_.originalPosition_.y + _y

                    });
                    
                   


                    _cell.linkPositioning();
                    for (var i in _cell.styleBinders.x) {
                        if (_cell.styleBinders.x[i].shape) {
                            _cell.styleBinders.x[i].shape.attr({
                                x: bindersOriginalPosition_.x[i] + _x
                            });
                        } else {
                            _cell.styleBinders.x[i].style.left = (bindersOriginalPosition_.x[i] + _x) + 'px';
                        }

                    }

                    for (var i in _cell.styleBinders.y) {
                        if (_cell.styleBinders.y[i].shape) {
                            _cell.styleBinders.y[i].shape.attr({
                                y: bindersOriginalPosition_.y[i] + _y
                            });
                        } else {
                            _cell.styleBinders.y[i].style.top = (bindersOriginalPosition_.y[i] + _y) + 'px';
                        }
                    }

                }, "dragmove");

                _cell.overrideEvent(function(_shape) {

                   // _shape.toFront();

                    shapeAction_.originalPosition_.x = _shape.attr('x');
                    shapeAction_.originalPosition_.y = _shape.attr('y');

                    for (var i in _cell.styleBinders.x) {
                        if (_cell.styleBinders.x[i].shape) {
                            bindersOriginalPosition_.x[i] = _cell.styleBinders.x[i].shape.attr('x');
                          //  _cell.styleBinders.x[i].shape.toFront();
                        } else {
                            bindersOriginalPosition_.x[i] = parseInt(_cell.styleBinders.x[i].style.left.split('p')[0])
                        }
                    }

                    for (var i in _cell.styleBinders.y) {
                        if (_cell.styleBinders.y[i].shape) {
                            bindersOriginalPosition_.y[i] = _cell.styleBinders.y[i].shape.attr('y');
                          //  _cell.styleBinders.y[i].shape.toFront();
                        } else {
                            bindersOriginalPosition_.y[i] = parseInt(_cell.styleBinders.y[i].style.top.split('p')[0])
                        }
                    }

                }, "dragstart");

                _cell.overrideEvent(function(_shape) {
					 _cell.styleAttrs.x = _shape.attr('x');
					 _cell.styleAttrs.y = _shape.attr('y');
                }, "dragend");

                _cell.overrideEvent(function() {
                    _cell.activate(true);
                }, "dblclick")


            }

        },

        // Create Link Shape
        link: function(_link, _outCell, _inCell, _attrs, _fixIndex) {

            // Create Rectangle
            var etreecell_ = this.etreecell;
            var attrs_ = _link.styleAttrs || {};

            if (etreecell_.defaultStyle.theme == 'dark') {
                attrs_['arrow-end'] = 'block-wide-long';
                attrs_.stroke = '#eeeeee';
                attrs_['stroke-width'] = 2;
            } else if (etreecell_.defaultStyle.theme == 'bright') {
                attrs_['arrow-end'] = 'block-wide-long';
                attrs_.stroke = '#4b4b4b';
                attrs_['stroke-width'] = 2;
                attrs_['stroke-dasharray'] = '';
            }

            attrs_['arrow-end'] = attrs_['arrow-end'] || etreecell_.defaultStyle.link['arrow-end'] || 'block-wide-long';
            attrs_['arrow-start'] = attrs_['arrow-start'] || etreecell_.defaultStyle.link['arrow-start'] || 'none';
            attrs_.stroke = attrs_.stroke || etreecell_.defaultStyle.link.stroke || '#eeeeee';
            attrs_['stroke-width'] = attrs_['stroke-width'] || etreecell_.defaultStyle.link['stroke-width'] || 2;

            // '', '-', '-.' ...
            attrs_['stroke-dasharray'] = attrs_['stroke-dasharray'] || etreecell_.defaultStyle.link['stroke-dasharray'] || '';

            if (typeof attrs_['fill-opacity'] !== 'undefined') {
                attrs_['fill-opacity'] = attrs_['fill-opacity'];
            } else {
                attrs_['fill-opacity'] = etreecell_.defaultStyle.cell['fill-opacity'] || 1;
            }

            var link_ = this.etreecell.paper.path(this.linkCurve(_outCell, _inCell, _fixIndex)).attr({
                'arrow-end': attrs_['arrow-end'],
                'arrow-start': attrs_['arrow-start'],
                'stroke': attrs_.stroke,
                'stroke-width': attrs_['stroke-width'],
                'stroke-dasharray': attrs_['stroke-dasharray']
            })

            return link_;

        },

        // Return Link Curve
        linkCurve: function(_inCell, _outCell, _fixIndex) {

            var BBox = function(_cell) {
                var cell_ = {
                    x: _cell.shape.attr('x'),
                    y: _cell.shape.attr('y'),
                    x2: _cell.shape.attr('x') + _cell.shape.attr('width'),
                    y2: _cell.shape.attr('y') + _cell.shape.attr('height'),
                    width: _cell.shape.attr('width'),
                    height: _cell.shape.attr('height'),
                    stroke: _cell.shape.attr('stroke-width')
                }
                return cell_
            }
            var outCellBBox = BBox(_outCell);
            var inCellBBox = BBox(_inCell);


            var path = [{
                x: outCellBBox.x + outCellBBox.width / 2,
                y: outCellBBox.y - outCellBBox.stroke / 2
            }, {
                x: outCellBBox.x + outCellBBox.width / 2,
                y: outCellBBox.y + outCellBBox.height + outCellBBox.stroke / 2
            }, {
                x: outCellBBox.x - outCellBBox.stroke / 2,
                y: outCellBBox.y + outCellBBox.height / 2
            }, {
                x: outCellBBox.x + outCellBBox.width + outCellBBox.stroke / 2,
                y: outCellBBox.y + outCellBBox.height / 2
            }, {
                x: inCellBBox.x + inCellBBox.width / 2,
                y: inCellBBox.y - inCellBBox.stroke / 2
            }, {
                x: inCellBBox.x + inCellBBox.width / 2,
                y: inCellBBox.y + inCellBBox.height + inCellBBox.stroke / 2
            }, {
                x: inCellBBox.x - inCellBBox.stroke / 2,
                y: inCellBBox.y + inCellBBox.height / 2
            }, {
                x: inCellBBox.x + inCellBBox.width + inCellBBox.stroke / 2,
                y: inCellBBox.y + inCellBBox.height / 2
            }];

            var d = {},
                distance = [];
            for (var i = 0; i < 4; i++) {
                for (var j = 4; j < 8; j++) {
                    var dx = Math.abs(path[i].x - path[j].x),
                        dy = Math.abs(path[i].y - path[j].y);
                    if ((i == j - 4) || (((i != 3 && j != 6) || path[i].x < path[j].x) && ((i != 2 && j != 7) || path[i].x > path[j].x) && ((i != 0 && j != 5) || path[i].y > path[j].y) && ((i != 1 && j != 4) || path[i].y < path[j].y))) {
                        distance.push(dx + dy);
                        d[distance[distance.length - 1]] = [i, j];

                    }
                }
            }
            var fixIndex, autoIndex;
            if (distance.length == 0) {
                fixIndex = [0, 4];
            } else {
                fixIndex = d[Math.min.apply(Math, distance)];

            }
            if (_fixIndex) {

                //시계방향 4분면과 이 함수에서의 4분면의 호환을 위한 파싱 함수.
                var parsePosit = function(__x_) {
                    var __parseX;
                    switch (__x_) {
                        case 0:
                            __parseX = 0;
                            break;
                        case 1:
                            __parseX = 3;
                            break;
                        case 2:
                            __parseX = 1;
                            break;
                        case 3:
                            __parseX = 2;
                            break;
                        default:
                            break;
                    }
                    return __parseX;
                }
                var unparsePosit = function(__x_) {
                    var __parseX;
                    switch (__x_) {
                        case 0:
                            __parseX = 2;
                            break;
                        case 1:
                            __parseX = 0;
                            break;
                        case 2:
                            __parseX = 1;
                            break;
                        case 3:
                            __parseX = 3;
                            break;
                        default:
                            break;
                    }
                    return __parseX;
                }
                var marginPosit = function(__x_) {
                    var __parseX;
                    switch (__x_) {
                        case 0:
                            __parseX = -4;
                            break;
                        case 1:
                            __parseX = 4;
                            break;
                        case 2:
                            __parseX = 0;
                            break;
                        case 3:
                            __parseX = 0;
                            break;
                        default:
                            break;
                    }
                    return __parseX;
                }

                if (_fixIndex[0] != 'auto') {
                    fixIndex[0] = parsePosit(parseInt(_fixIndex[0]));
                }

                if (_fixIndex[1] != 'auto') {
                    fixIndex[1] = parsePosit(parseInt(_fixIndex[1])) + 4;
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
    }

    var etreecellForm_text = function(_etreecell, _cell) {

        var this_ = this;
        this.formId = '#etreecell000001';
        this.formType = 'text';
        this.relativePositionShape = {
            x: 12,
            y: 12,
            width: -12,
            height: -12
        }

        var styleAttrs_ = _cell.styleAttrs.shape || {};

        _cell.setData(0, 'Input text to dblclick!');
        
        this.shape = _etreecell.paper
            .text(_cell.styleAttrs.x + this.relativePositionShape.x, _cell.styleAttrs.y + this.relativePositionShape.y, '')
            .attr({
                'font-size': styleAttrs_['font-size'] || 13,
                'text-anchor': 'start',
                'text': _cell.getData(0),
                'cursor': 'pointer'
            })
            .attr(styleAttrs_)
            .mousedown(function() {
                functionInArray(_cell.events.mousedown, {
                    cell: _cell
                });
            })

        _cell.bindStyle(this);
        _cell.bindEvent(this);




        this.active = {
            wrapper: document.createElement('div'),
            input: document.createElement('input')
        }

        this.active.wrapper.appendChild(this.active.input)

        this.active.wrapper.style.position = 'absolute';
        this.active.wrapper.style.left = (_cell.styleAttrs.x + this.relativePositionShape.x) + 'px';
        this.active.wrapper.style.top = (_cell.styleAttrs.y + this.relativePositionShape.y) + 'px';
        this.active.wrapper.style.width = (_cell.styleAttrs.width + this.relativePositionShape.width) + 'px';
        this.active.wrapper.style.height = (_cell.styleAttrs.height + this.relativePositionShape.height) + 'px';
        this.active.wrapper.style.marginLeft = -5;
        this.active.wrapper.style.marginTop = -5;

        this.active.wrapper.style.textAlign = 'center';

        this.active.input.style.position = 'relative';
        this.active.input.style.margin = '0 auto';
        this.active.input.style.width = '100%';
        this.active.input.style.height = '100%';
        this.active.input.style.border = 'none 0px';
        this.active.input.style.background = 'none';
        this.active.input.style.color = styleAttrs_.color || 'black';
        this.active.input.style.fontSize = styleAttrs_['font-size'] + 'px' || 13;
        this.active.input.value = _cell.getData(0);

        this.active.input.addEventListener('keydown', function(e) {
            if (e.keyCode == 13) {
                _cell.deactivate();
            }
        })

        _cell.bindStyle(this.active.wrapper);

        _cell.pushEvent(function() {

            if (_cell.styleAttrs.shape) {

                this_.active.input.style.color = _cell.styleAttrs.shape.fill || 'black';
                this_.active.input.style.fontSize = _cell.styleAttrs.shape['font-size'] + 'px' || 13;
            }
 this_.active.input.value = _cell.getData(0)

            document.getElementById(_etreecell.canvas).appendChild(this_.active.wrapper);

            this_.shape.hide();

        }, 'activate');

        _cell.pushEvent(function() {
            this_.shape.show();
            document.getElementById(_etreecell.canvas).removeChild(this_.active.wrapper);
            _cell.setData(0, this_.active.input.value);
            _cell.refreshData();

        }, 'deactivate');

        _cell.pushEvent(function() {
            this_.shape.attr({
                "text": _cell.getData(0)
            });
            if (_cell.styleAttrs.width < this_.shape.getBBox().width) {
                _cell.attr({
                    'width': this_.shape.getBBox().width + this_.relativePositionShape.x * 2
                })
            }
            _cell.linkPositioning();
        }, 'refreshData')

    }


    var etreecellForm_image = function(_etreecell, _cell) {

        var this_ = this;
        this.formId = '#etreecell000002';
        this.formType = 'image';
        this.relativePositionShape = {
            x: 7,
            y: 7,
            width: -12,
            height: -12
        }

        _cell.setData(0, 'http://img.naver.net/static/www/u/2013/0731/nmms_224940510.gif');
        this.shape = _etreecell.paper
            .image(_cell.getData(0), _cell.styleAttrs.x + this.relativePositionShape.x, _cell.styleAttrs.y + this.relativePositionShape.y, _cell.styleAttrs.width + this.relativePositionShape.width, _cell.styleAttrs.height + this.relativePositionShape.height)
            .attr({
                'font-size': 13,
                'text-anchor': 'start',
                'text': _cell.getData(0),
                'cursor': 'pointer'
            })

        _cell.bindStyle(this);
        _cell.bindEvent(this);



        this.active = {
            wrapper: document.createElement('div'),
            input: document.createElement('input')
        }

        this.active.wrapper.appendChild(this.active.input)

        this.active.wrapper.style.position = 'absolute';
        this.active.wrapper.style.left = (_cell.styleAttrs.x + this.relativePositionShape.x) + 'px';
        this.active.wrapper.style.top = (_cell.styleAttrs.y + this.relativePositionShape.y) + 'px';
        this.active.wrapper.style.width = (_cell.styleAttrs.width + this.relativePositionShape.width) + 'px';
        this.active.wrapper.style.height = (_cell.styleAttrs.height + this.relativePositionShape.height) + 'px';
        this.active.wrapper.style.marginLeft = -5;
        this.active.wrapper.style.marginTop = -5;

        this.active.wrapper.style.textAlign = 'center';

        this.active.input.style.position = 'relative';
        this.active.input.style.margin = '0 auto';
        this.active.input.style.width = '100%';
        this.active.input.style.height = '100%';
        this.active.input.style.border = 'none 0px';
        this.active.input.style.background = 'none';
        this.active.input.value = _cell.getData(0);

        this.active.input.addEventListener('keydown', function(e) {
            if (e.keyCode == 13) {
                _cell.deactivate();
            }
        })

        _cell.bindStyle(this.active.wrapper);

        _cell.pushEvent(function() {
            document.getElementById(_etreecell.canvas).appendChild(this_.active.wrapper);
            this_.active.input.value = _cell.getData(0);
            this_.shape.hide();

        }, 'activate');

        _cell.pushEvent(function() {
            this_.shape.show();
            document.getElementById(_etreecell.canvas).removeChild(this_.active.wrapper);
            _cell.setData(0, this_.active.input.value);
            _cell.refreshData();
        }, 'deactivate');

        _cell.pushEvent(function() {
            this_.shape.attr({
                "src": _cell.getData(0)
            });
        }, 'refreshData')

    }




    // !cell 생성자 ( 생성된 etreecell 객체 , 지정할 cell id , cell 속성, cell 유형 객체 )
    var cell = function(_etreecell, _id, _attrs, _form) {

        this.etreecell = _etreecell;
        this.objType = 'cell';
        this.id = _id;
        this.styleAttrs = _attrs || {};
        this.data = [];
        this.selected = false;

        var this_ = this;




        // !cell : cell in, out cell 등록
        this.io = {
            inCell: [],
            outCell: [],
            link: []
        };


        // !이벤트 함수 배열 목록
        this.events = {

            click: [],
            dblclick: [],
            dragstart: [],
            dragmove: [],
            dragend: [],
            mouseover: [],
            mouseout: [],
            mousedown: [],
            mouseup: [],
            select: [],
            deselect: [],
            resize: [],
            activate: [],
            deactivate: [],
            refreshData: []

        }

        // !셀에 묶여있는 스타일 객체들
        this.styleBinders = {

            x: [],
            y: [],
            width: [],
            height: []

        };

        // !cell 렌더링 
        this.shape = _etreecell.render.shape(this);

        // !이벤트 바인딩
        _etreecell.render.bindEvents(this);

        // 셀 모양 이벤트 초기화		
        _etreecell.render.initEvents(this);

        // !helpers 렌더링 
        this.helpers = new _etreecell.render.helpers(this);

        // 유형 등록
        //this.form = _form || new etreecellForm_text( _etreecell , this );
        switch (_form) {
            case 'text':
                this.form = new etreecellForm_text(_etreecell, this);
                break;

            case 'image':
                this.form = new etreecellForm_image(_etreecell, this);
                break;

            default:
                this.form = new etreecellForm_text(_etreecell, this);
                break;
        }

        // !cell : etreecell에 등록
        _etreecell.obj.cell.push(this);

    }

    // !link 생성자 ( 생성된 etreecell 객체 , a To b의 a에 해당하는 cell 객체  , a To b의 b에 해당하는 cell 객체 )
    var link = function(_etreecell, _outCell, _inCell, _attrs, _fixIndex) {

        this.etreecell = _etreecell;
        this.objType = 'link';
        this.id = _outCell.id + '->' + _inCell.id;
        this.styleAttrs = _attrs || {};

        this.inCell = _outCell;
        this.outCell = _inCell;
        this.fixIndex = _fixIndex;

        // { [ send dataIndex , receive dataIndex ]  }
        this.dataBinder = [];


        // !이벤트 함수 배열 목록
        this.events = {

            click: [],
            dblclick: [],
            dragstart: [],
            dragmove: [],
            dragend: [],
            mouseover: [],
            mouseout: [],
            mousedown: [],
            mouseup: [],
            select: [],
            deselect: [],
            resize: [],
            activate: [],
            deactivate: [],
            refreshData: []

        };

        // !셀에 묶여있는 스타일 객체들
        this.styleBinders = {

            x: [],
            y: [],
            width: [],
            height: []

        };

        // !cell : 각 셀에 io 등록
        _outCell.io.outCell.push(_inCell);
        _inCell.io.inCell.push(_outCell);

        // !cell 렌더링
        this.link = _etreecell.render.link(this, this.outCell, this.inCell, this.styleAttrs, this.fixIndex);

        // !cell : 각 셀에 io link 등록
        _outCell.io.link.push(this);
        _inCell.io.link.push(this);


        // !cell : etreecell에 등록
        _etreecell.obj.link.push(this);


    }




    // !!!-- Prototype 생성부 --!!

    // !etreecell 전역 함수 prototype 선언부
    etreecell.prototype = {

        // 테마를 위한 기본 스타일
        defaultStyle: {
            cell: {
                x: 10,
                y: 10,
                width: 250,
                height: 26,
                'fill-opacity': 1,
                'fill': '#eeeeee',
                r: 10,
                cursor: 'pointer',
                'stroke-width': 0
            },
            link: {},
            helper: {

            }
        },

        obj: {
            cell: [],
            link: []
        },

        selected: {
            cell: [],
            link: []
        },

        active: {
            cell: [],
            link: []
        },

        type: {},

        tmp: {
            helperLinking_: false
        },
        
        reset : function(){
	        this.obj = {
            cell: [],
            link: []
	        }
	
	        this.selected= {
	            cell: [],
	            link: []
	        }
	
	        this.active= {
	            cell: [],
	            link: []
	        }
	
	        this.type= {}
	
	        this.tmp= {
	            helperLinking_: false
	        }

	        this.render.background = this.render.setBackgroundEvent(this,this.paper);
	        		
        },

        // 기본 이벤트
        resize: function(_width, _height) {

            this.paper.setSize(_width || document.width, _height || document.height);
            this.render.background.attr({
                'width': _width || document.width,
                'height': _height || document.height
            });

        },

        // 생성부
        createCell: function(_id, _attrs, _type) {

            return new cell(this, _id, _attrs, _type);

        },

        createLink: function(_outCell, _inCell, _attrs, _fixIndex) {

            return new link(this, _outCell, _inCell, _attrs, _fixIndex || ['auto', 'auto']);

        },

        // 제거부
        removeCell: function(_cell) {

            var objKey_ = keyInArray(this.obj.cell, _cell);

            if (objKey_) {
               // console.log(this.obj.cell[objKey]);
               // console.log(this.obj.cell[objKey].form.shape);
               
               	for(var i_ in this.obj.cell[objKey_].io.link ){
	                this.obj.cell[objKey_].io.link[i_].remove();
                }
                
                for(var i_ in this.obj.cell[objKey_].helpers.linkers ){
	                this.obj.cell[objKey_].helpers.linkers[i_].remove();
                }
                this.obj.cell[objKey_].form.shape.remove();
                this.obj.cell[objKey_].shape.remove();
                delete this.obj.cell[objKey_].form;
                delete this.obj.cell[objKey_];
                
                this.obj.cell.splice(objKey_, 1);
            }

        },

        removeLink: function(_link) {

            var objKey_ = keyInArray(this.obj.link, _link);

            if (objKey_) {
	            
				this.obj.link[objKey_].link.remove();
				delete this.obj.link[objKey_];
                this.obj.link.splice(objKey_, 1);

            }

            var selectedKey_ = keyInArray(this.selected.link, _link);

            if (selectedKey_) {
                this.selected.link.splice(selectedKey_, 1);
            }

        },

        activateCell: function(_cell, _resetBool) {
            if (_resetBool) {
                this.deselectAll();
                this.deactivateAllCell();
            }

            this.active.cell.push(_cell);
            functionInArray(_cell.events.activate);
        },

        deactivateCell: function(_cell) {

            var activeKey_ = keyInArray(this.active.cell, _cell);

            if (activeKey_) {
                this.active.cell.splice(activeKey_, 1);
                functionInArray(_cell.events.deactivate);
            }
        },

        deactivateAllCell: function() {
            for (var cellsKey_ in this.active.cell) {
                this.active.cell[cellsKey_].deactivate();
            }
        },

        refreshDataCell: function(_cell) {

            for (var i in _cell.io.link) {
                if (_cell.io.link[i].inCell == _cell) {

                    for (var j in _cell.io.link[i].dataBinder) {
                        _cell.io.link[i].outCell.setData(
                            _cell.io.link[i].dataBinder[j][1], _cell.getData(_cell.io.link[i].dataBinder[j][0]));
                        _cell.io.link[i].outCell.refreshData();
                        _cell.io.link[i].outCell.linkPositioning();
                        _cell.io.link[i].outCell.helpers.positioning();
                    }

                }
            }
            functionInArray(_cell.events.refreshData);
        },

        bindDataCell: function(_outCell, _inCell, _outIndex, _inIndex) {
            for (var i in _outCell.io.link) {
                if (_outCell.io.link[i].outCell == _inCell) {
                    _outCell.io.link[i].dataBinder.push([_outIndex, _inIndex]);
                }
            }
        },

        unbindDataCell: function(_outCell, _inCell, _outIndex, _inIndex) {
            for (var i in _outCell.io.link) {
                if (_outCell.io.link[i].outCell == _inCell) {
                    for (var j in _outCell.io.link[i].dataBinder) {

                        if (_outCell.io.link[i].dataBinder[j][0] == _outIndex && _outCell.io.link[i].dataBinder[j][1] == _inIndex) {
                            _outCell.io.link[i].dataBinder.splice(j, 1);
                        }
                    }
                }
            }
        },


        // 선택부
        // 셀 선택자 ( 셀 혹은 셀 배열 , 선택된 다른 객체 모두 선택 해제 : true || false )
        selectCell: function(_cells, _resetBool) {

            if (_resetBool) {

                this.deselectAll();
                this.deactivateAllCell();

            }

            if (_cells.objType == 'cell') {
                _cells = [_cells];
            }

            for (var cellsKey_ in _cells) {

                var cell_ = _cells[cellsKey_];

                if (!cell_.selected) {

                    cell_.selected = true;

                    this.selected.cell.push(cell_);
                    functionInArray(cell_.events.select);

                }

            }

        },

        deselectCell: function(_cells) {

            if (_cells.objType == 'cell') {

                _cells = [_cells];

            }

            for (var cellsKey_ in _cells) {

                var cell_ = _cells[cellsKey_];

                if (cell_.selected) {

                    cell_.selected = false;

                    var selectedKey_ = keyInArray(this.selected.cell, cell_);

                    if (selectedKey_) {

                        this.selected.cell.splice(selectedKey_, 1);
                        functionInArray(cell_.events.deselect);

                    }

                }

            }

        },

        deselectAllCell: function() {

            for (var cellKey_ in this.selected.cell) {

                this.selected.cell[cellKey_].deselect();

            }

        },

        selectLink: function(_links, _resetBool) {

            if (_resetBool) {

                this.deselectAll();

            }

            if (_links.objType == 'link') {

                _links = [_links];

            }

            for (var linksKey_ in _links) {

                var link_ = _links[linksKey_];

                if (!link_.selected) {

                    link_.selected = true;

                    this.selected.link.push(link_);

                }

            }

        },

        deselectLink: function(_links) {

            if (_links.objType == 'link') {

                _links = [_links];

            }

            for (var linksKey_ in _links) {

                var link_ = _links[linksKey_];

                if (link_.selected) {

                    link_.selected = false;

                    var selectedKey_ = keyInArray(this.selected.link, link_);

                    if (selectedKey_) {

                        this.selected.link.splice(selectedKey_, 1);

                    }

                }

            }

        },

        deselectAllLink: function() {

            for (var linkKey_ in this.selected.link) {

                this.selected.link[linkKey_].deselect();

            }

        },

        deselectAll: function() {

            this.deselectAllCell();
            this.deselectAllLink();

        },

        // 셀 형태 바꾸기 & 바꾸기 애니메이션
        changeAttrCell: function(_cell, _attrs) {

            /*
            			if( !this.mode.edit ){
            				return _cell;
            			}
            */

            _cell.shape.attr(_attrs);
            for (var i in _attrs) {

              //  if (_cell.styleAttrs[i]) {
                    if (i == 'shape') {
                        for (var j in _attrs.shape) {
                            _cell.styleAttrs.shape[j] = _attrs.shape[j];
                        }
                        _cell.form.shape.attr(_attrs.shape)
                    }
                    _cell.styleAttrs[i] = _attrs[i];
                    

               // }

                for (var j in _cell.styleBinders[i]) {

                    if (_cell.styleBinders[i][j].styleAttrs) {

                        _cell.styleBinders[i][j].attr(i, _attrs[i]);

                    } else {
                        if (_cell.styleBinders[i][j].shape) {

                            _cell.styleBinders[i][j].shape.attr(i, _attrs[i] + _cell.form.relativePositionShape[i]);

                        } else {

                            _cell.styleBinders[i][j].style[((i == 'y') ? 'top' : ((i == 'x') ? 'left' : i))] = (_attrs[i] + _cell.form.relativePositionShape[i]) + 'px';

                        }
                    }
                }
            }
            _cell.helpers.positioning();
            return _cell;
        },

        changeAnimateCell: function(_cell, _attrs, _duration, _easing, _callback) {

            /*
if( !this.mode.edit ){
				
				return _cell;
				
			}
*/

            var duration_ = _duration || 500;

            _cell.shape.animate(_attrs, _duration, _easing, _callback);

            var moveLinkTimer_ = setInterval(function() {

                _cell.linkPositioning();
                _cell.helpers.positioning();

            }, 1);

            var moveLinkTimerClear_ = setTimeout(function() {

                clearInterval(moveLinkTimer_);
                clearTimeout(moveLinkTimerClear_);

            }, duration_ + 10);

            for (var i in _attrs) {

                if (_cell.styleAttrs[i]) {
                    if (i == 'shape') {
                        for (var j in _attrs.shape) {
                            _cell.styleAttrs.shape[j] = _attrs.shape[j];
                        }
                        _cell.form.shape.animate(_attrs.shape, duration_, _easing);
                    }

                    _cell.styleAttrs[i] = _attrs[i];

                }

                for (var j in _cell.styleBinders[i]) {

                    if (_cell.styleBinders[i][j].styleAttrs) {

                        _cell.styleBinders[i][j].animate({
                            i: _attrs[i]
                        }, duration_, _easing);

                    } else {
                        if (_cell.styleBinders[i][j].shape) {

                            var attr_ = {};

                            attr_[i] = _attrs[i] + _cell.form.relativePositionShape[i];
                            _cell.styleBinders[i][j].shape.animate(attr_, duration_, _easing);

                        } else {

                            var moveTmpTimer_ = setTimeout(function() {
                                _cell.attr(_attrs)
                                clearTimeout(this);
                            }, _duration);

                        }
                    }
                }
            }
            return _cell;
        },

        // 셀의 이벤트를 바인드 해준다. ( dragmove, dblclick ) || all
        bindEventCell: function(_cell, _obj, _types) {

            // 일단 Type 무시
            var type_ = _types || ['dragmove', 'dblclick'];

            var isClickBool_ = true;

            // 더블 클릭 시 해당 셀 활성화를 위한 변수
            var dblclickBool_ = false;

            var dblclickTimer_;

            _obj.shape
                .drag(function(_x, _y) {
                    if (_x != 0 && _y != 0) {
                        isClickBool_ = false;
                        clearTimeout(dblclickTimer_);
                        dblclickBool_ = false;
                        functionInArray(_cell.events.dragmove, {
                            shape: _cell.shape,
                            x: _x,
                            y: _y
                        })
                    }
                }, function(_x, _y) {
                    functionInArray(_cell.events.dragstart, _cell.shape)

                }, function(_x, _y) {
					functionInArray(_cell.events.dragend, _cell.shape)
                })
                .mouseup(function() {

                    // CLICK EVENT : Prevent drag event
                    if (isClickBool_) {
                        functionInArray(_cell.events.click, {
                            cell: _cell
                        });
                    }

                    isClickBool_ = true;
                    functionInArray(_cell.events.mouseup, {
                        cell: _cell
                    });
                    functionInArray(_cell.events.mouseup, {
                        cell: _cell
                    });
                })
                .mouseover(function() {
                    functionInArray(_cell.events.mouseover, {
                        cell: _cell
                    });
                })
                .mouseout(function() {
                    functionInArray(_cell.events.mouseout);
                })
                .mousedown(function() {
                    if (dblclickBool_) {
                        functionInArray(_cell.events.dblclick, {
                            cell: _cell
                        });
                    }
                    dblclickBool_ = true;

                    dblclickTimer_ = setTimeout(function() {
                        dblclickBool_ = false;
                    }, 300)
                    functionInArray(_cell.events.mousedown, {
                        cell: _cell
                    });
                })
        },

        // 셀 모양을 묶는다. (묶일 부모 셀, 묶는 오브젝트 , x y width height 가능)
        bindStyleCell: function(_cell, _obj, _attrs) {
            var attrs_ = (_attrs == 'x' || _attrs == 'y' || _attrs == 'width' || _attrs == 'height' ? [_attrs] : _attrs);

            for (var i in attrs_) {
                if (!keyInArray(attrs_[i], _cell.styleBinders[attrs_[i]])) {
                    _cell.styleBinders[attrs_[i]].push(_obj);
                }
            }
        },

        unbindStyleCell: function(_cell, _obj, _attrs) {
            var attrs_ = (_attrs == 'x' || _attrs == 'y' || _attrs == 'width' || _attrs == 'height' ? [_attrs] : _attrs);

            for (var i in attrs_) {
                var bindedKey_ = keyInArray(attrs_[i], _cell.styleBinders[attrs_[i]]);

                if (bindedKey_) {
                    _cell.styleBinders[attrs_[i]].splice(bindedKey_, 1);
                }
            }
        },

        // 셀 데이타 입출력
        setDataCell: function(_cell, _key, _data) {
            _cell.data[_key] = _data;
            _cell.refreshData();
            //functionInArray( _cell.events.refreshData , { key : _key , data : _data } );

            // 연결되어 있는 모든 셀의 정보를 reset
            // !!!!! 미완성
        },

        getDataCell: function(_cell, _key) {
            return _cell.data[_key];
        },

        removeDataCell: function(_cell, _key) {
            _cell.data.splice(_key, 1);
            //functionInArray( _cell.events.refreshData , { key : _key } );
        },
        
        getCellById: function(_cellId){
	        for(var i_ in this.obj.cell) {
		        if(this.obj.cell[i_].id == _cellId){
			        return this.obj.cell[i_]
		        }
	        }
			return false;
        },
        
        getLinkById: function(_linkId){
/*
	        for(var i_ in this.obj.cell) {
		        if(this.obj.cell[i_].id == _cellId){
			        return this.obj.cell[i_]
		        }
	        }
			return false;
*/
        },

        exportData: function() {
            var exportArray_ = new Array();
            var cellArray_ = new Array(),
                linkArray_ = new Array();
            var cellObjs_ = this.obj.cell;
            var cellLinks_ = this.obj.link;
            for (var i in cellObjs_) {

                cellArray_[i] = '{ "id" : "' + (cellObjs_[i].id) + '", ';
                cellArray_[i] += '"styleAttrs" : { ';

                var tmpAttrs_ = new Array();
                for (var j in cellObjs_[i].styleAttrs) {
	                
	                
                    if (j == 'shape') {
                        var tmpshapes_ = new Array();
                        for (var k in cellObjs_[i].styleAttrs.shape) {
                            tmpshapes_.push('"' + k + '" : "' + (cellObjs_[i].styleAttrs.shape[k]) + '"');
                        }

                        tmpAttrs_.push('"shape" : {' + (tmpshapes_.join(', ')) + '}');
                    } else {
                        tmpAttrs_.push('"' + j + '" : "' + (cellObjs_[i].styleAttrs[j]) + '"');
                    }
                }

                cellArray_[i] += tmpAttrs_.join(', ');

                cellArray_[i] += '}, ';
                cellArray_[i] += '"formType" : "'+cellObjs_[i].form.formType+'", ';
                cellArray_[i] += '"formId" : "'+cellObjs_[i].form.formId+'", ';
                cellArray_[i] += '"data" : { ';
                var tmpDatas_ = new Array();
                for (var j in cellObjs_[i].data) {
                    tmpDatas_.push('"' + j + '" : "' + (cellObjs_[i].data[j]) + '"');
                }

                cellArray_[i] += tmpDatas_.join(', ');


                cellArray_[i] += ' } ';
                cellArray_[i] += '}';
            }
			
            for (var i in cellLinks_) {

                linkArray_[i] = '{ "inCell" : "' + (cellLinks_[i].inCell.id) + '", "outCell" : "' + (cellLinks_[i].outCell.id) + '", ';
                linkArray_[i] += '"inFixIndex" : "' + (cellLinks_[i].fixIndex[0]) + '", "outFixIndex" : "' + (cellLinks_[i].fixIndex[1]) + '", ';
                linkArray_[i] += '"dataBinder" : [ ';

                var tmpBinder_ = new Array();

                for (var j in cellLinks_[i].dataBinder) {
	                console.log(cellLinks_[i].dataBinder[j]);
                        tmpBinder_.push('["' + cellLinks_[i].dataBinder[j][0] + '","' + cellLinks_[i].dataBinder[j][1] + '"]');
                }

                linkArray_[i] += tmpBinder_.join(', ');
                
                linkArray_[i] += ' ], ';
                
                linkArray_[i] += '"attrs" : { ';

                var tmpAttrs_ = new Array();

                for (var j in cellLinks_[i].styleAttrs) {
                    if (j.toLowerCase() != "path") {
                        tmpAttrs_.push('"' + j + '" : "' + (cellLinks_[i].styleAttrs[j]) + '"');
                    }
                }

                linkArray_[i] += tmpAttrs_.join(', ');
                linkArray_[i] += ' } ';
                linkArray_[i] += '}';
            }
            exportArray_.push('{ "cell" : [ ' + cellArray_.join(', ') + ' ] } ');
            exportArray_.push('{ "link" : [ ' + linkArray_.join(', ') + ' ] } ');
            return ('[ ' + exportArray_.join(', ') + ' ]');
        },

        importData: function( _data ) {
			this.paper.clear();
			this.reset();
			
			var tmpJSON_ = eval("(function(){return " + _data + ";})()");
			var cellArray_ = tmpJSON_[0].cell;
			var linkArray_ = tmpJSON_[1].link;
			
			for ( var i in cellArray_ ) {
				var tmpCell_ = cellArray_[i];
				
				if ( tmpCell_.styleAttrs.x ) {
					tmpCell_.styleAttrs.x = parseInt( tmpCell_.styleAttrs.x );
				}
				
				if ( tmpCell_.styleAttrs.y ) {
					tmpCell_.styleAttrs.y = parseInt( tmpCell_.styleAttrs.y );
				}
				
				
				if ( tmpCell_.styleAttrs.width ) {
					tmpCell_.styleAttrs.width = parseInt( tmpCell_.styleAttrs.width );
				}
				
				if ( tmpCell_.styleAttrs.height ) {
					tmpCell_.styleAttrs.height = parseInt( tmpCell_.styleAttrs.height );
				}
				

				if ( tmpCell_.styleAttrs.shape && tmpCell_.styleAttrs.shape.x ) {
					tmpCell_.styleAttrs.shape.x = parseInt( tmpCell_.styleAttrs.shape.x );
				}
				
				if ( tmpCell_.styleAttrs.shape && tmpCell_.styleAttrs.shape.y ) {
					tmpCell_.styleAttrs.shape.y = parseInt( tmpCell_.styleAttrs.shape.y );
				}
				
				var tmpCreatedCell = this.createCell( tmpCell_.id , tmpCell_.styleAttrs , tmpCell_.formType);
				for(var j in tmpCell_.data){
					tmpCreatedCell.setData(j, tmpCell_.data[j]);
					
				}
				
				
				if(tmpCell_.formType == "image"){
				console.log(tmpCell_.styleAttrs);
				}
			}
			
			for ( var i in linkArray_ ) {
				
				var tmpLink_ = linkArray_[i];

				if(tmpLink_.inFixIndex != "auto"){
					tmpLink_.inFixIndex = parseInt(tmpLink_.inFixIndex)
				}
				
				if(tmpLink_.outFixIndex != "auto"){
					tmpLink_.outFixIndex = parseInt(tmpLink_.outFixIndex)
				}
				
				var tmpCreatedLink = this.createLink(this.getCellById(tmpLink_.inCell),this.getCellById(tmpLink_.outCell), tmpLink_.attrs, [tmpLink_.inFixIndex,tmpLink_.outFixIndex]);
				
				for(var j in tmpLink_.dataBinder){
					etcl.bindDataCell(this.getCellById(tmpLink_.inCell),this.getCellById(tmpLink_.outCell), tmpLink_.dataBinder[j][0], tmpLink_.dataBinder[j][1])				
					
				}
			}
        },

        // 컴파일 용 내부 출력 부
        _print: function() {
            var print;
            console.log('***** (etreecell) Cell ******');
            console.log(this.obj.cell);
            console.log('');
            console.log('***** (etreecell) Link ******');
            console.log(this.obj.link);
            console.log('***** (etreecell) selectCell ******');
            console.log(this.selected.cell);
        }

    }

    // !cell 전역 함수 prototype 선언부
    cell.prototype = {

        link: function(_inCell, _attrs, _fixIndex) {
            return this.etreecell.createLink(this, _inCell, _attrs, _fixIndex);
        },

        remove: function() {
            this.etreecell.removeCell(this);
        },

        pushEvent: function(_fn, _event) {
            this.events[_event].push(_fn);
        },

        overrideEvent: function(_fn, _event) {
            this.events[_event] = [_fn];
        },

        activate: function(_resetBool) {
            this.etreecell.activateCell(this, _resetBool || false);
        },

        deactivate: function() {
            this.etreecell.deactivateCell(this);
        },

        select: function(_resetBool) {
            this.etreecell.selectCell(this, _resetBool || false);
        },

        deselect: function() {
            this.etreecell.deselectCell(this);
        },

        bindStyle: function(_obj, _attrs) {
            this.etreecell.bindStyleCell(this, _obj, _attrs || ['x', 'y', 'width', 'height']);
        },

        unbindStyle: function(_obj, _attrs) {
            this.etreecell.bindStyleCell(this, _obj, _attrs || ['x', 'y', 'width', 'height']);
        },

        bindEvent: function(_obj, _types) {
            this.etreecell.bindEventCell(this, _obj, _types || ['dragmove', 'dblclick']);
        },

        refreshData: function() {
            this.etreecell.refreshDataCell(this);
        },

        setData: function(_key, _data) {
            this.etreecell.setDataCell(this, _key, _data);
        },

        getData: function(_key) {
            return this.etreecell.getDataCell(this, _key);
        },

        setData: function(_key, _data) {
            this.etreecell.setDataCell(this, _key, _data);
        },

        bindData: function(_inCell, _outIndex, _inIndex) {
            this.etreecell.bindDataCell(this, _inCell, _outIndex, _inIndex);
        },

        unbindData: function(_inCell, _outIndex, _inIndex) {
            this.etreecell.unbindDataCell(this, _inCell, _outIndex, _inIndex);
        },

        attr: function(_attrs) {
            return this.etreecell.changeAttrCell(this, _attrs)
        },

        animate: function(_attrs, _duration, _easing, _callbackFn) {
            if (typeof _easing == 'function') {
                _callbackFn = _easing
                _easing = 'linear'
            }
            return this.etreecell.changeAnimateCell(this, _attrs, _duration, _easing || 'linear', _callbackFn)
        }


    }

    // !link 전역 함수 prototype 선언부
    link.prototype = {

        remove: function() {
            this.etreecell.removeLink(this);
        },

        select: function(_resetBool) {
            this.etreecell.selectLink(this, _resetBool || false);
        },

        deselect: function() {
            this.etreecell.deselectLink(this);
        }

    }


    // !_  keyInArray( 검색 대상 배열 , 검색 할 값, 검색 후 콜백 함수(인자 : Key 값); return Key 값 : false;
    function keyInArray(_arr, _val) {

        for (var i in _arr) {
            if (_arr[i] == _val) {
                return i;
            }
        }
        return false;

    }

    // !_ functionInArray( 함수 배열 , 각 함수에 실행할 콜백 )
    function functionInArray(_arr, _callbackVar) {
        for (var i in _arr) {
            _arr[i](_callbackVar);
        }
    }

    // !_오브젝트 합치는 함수
    function mergeObject(_objectA, _objectB) {

        var returnObject = {};

        for (var i_ in _objectA) {
            returnObject[i_] = _objectA[i_];
        }

        for (var i_ in _objectB) {
            returnObject[i_] = _objectB[i_];
        }

        return returnObject;
    }

    // !_ GUID 발급 함수
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '' + s4() + '' + s4() + '' + s4() + '' + s4() + s4() + s4();
    }




    // Raphael Extend Script
    Raphael.fn.animateViewBox = function animateViewBox(x, y, w, h, duration, easing_function, callback) {
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

        var intervalID = setInterval(function() {
            var ratio = current_step / steps;
            self.setViewBox(cx + dx * easing_formula(ratio),
                cy + dy * easing_formula(ratio),
                cw + dw * easing_formula(ratio),
                ch + dh * easing_formula(ratio), false);
            if (current_step++ >= steps) {
                clearInterval(intervalID);
                callback && callback();
            }
        }, interval);
    }


    // !etreecell 전역 적용
    window.etreecell = window.etreecell = etreecell;

})(window, document);