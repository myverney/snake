(function(window,undefined){
  // 食物
  function Food(map,x,y,width,height,color){
    this.map = map;
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 20;
    this.height = height || 20;
    this.color = color || 'green';
    this.food = null;
  }
  Food.prototype.render = function(){
    // 先删除原来的食物，然后重新渲染食物
    this.food && this.food.remove();
    // 随机生成食物的坐标
    this.x = parseInt(Math.random()*(this.map.offsetWidth/this.width)) * this.width;
    this.y = parseInt(Math.random()*(this.map.offsetHeight/this.height)) * this.height;
    // 创建食物
    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px';
    div.style.backgroundColor = this.color;
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
    // 把食物放到地图中
    this.map.appendChild(div);
    this.food = div;
  }
  // ----------------------------------
  // 蛇
  function Snake(map,width,height,direction){
    this.map = map;
    this.width = width || 20;
    this.height = height || 20;
    this.direction = direction || 'right';
    // 蛇的身体（DOM节点）
    this.bodys = [];
    // 蛇的节点数据
    this.datas = [{
      x : 3,
      y : 2,
      color : 'red'
    },{
      x : 2,
      y : 2,
      color : 'blue'
    },{
      x : 1,
      y : 2,
      color : 'blue'
    }]
  }
  Snake.prototype.render = function(){
    var that = this;
    // 绘制蛇的时候先删除原来的，然后重新绘制一条蛇
    // 删除蛇
    for (var i = 0; i < this.bodys.length; i++) {
      this.bodys[i].remove();
    }
    // 绘制蛇
    this.datas.forEach(function(item){
      // 创建蛇的节点
      var div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.width = that.width + 'px';
      div.style.height = that.height + 'px';
      div.style.backgroundColor = item.color;
      div.style.left = item.x * that.width + 'px';
      div.style.top = item.y * that.height + 'px';
      // 把节点追加到地图中
      that.map.appendChild(div);
      that.bodys.push(div);
    });
  }
  Snake.prototype.move = function(food){
    // 让蛇的身体向蛇头移动一步
    for (var i = this.datas.length - 1; i > 0 ; i--) {
      this.datas[i].x = this.datas[i - 1].x;
      this.datas[i].y = this.datas[i - 1].y;
    }
    // 控制蛇头的方向
    switch(this.direction){
      case 'top':
        this.datas[0].y -= 1;
        break;
      case 'right':
        this.datas[0].x += 1;
        break;
      case 'bottom':
        this.datas[0].y += 1;
        break;
      case 'left':
        this.datas[0].x -= 1;
        break;
    }
    // 控制蛇吃食物
    var headX = this.datas[0].x * this.width;
    var headY = this.datas[0].y * this.height;
    if(food.x == headX && food.y == headY){
      var lastNode = this.datas[this.datas.length - 1];
      this.datas.push({
        x : lastNode.x,
        y : lastNode.y,
        color : 'blue'
      });
      // 重新渲染食物
      food.render();
    }
  }
  // --------------------------------------------
  // 游戏
  function Game(map){
    this.map = map;
    this.food = new Food(this.map);
    this.snake = new Snake(this.map);
    this.timer = null;
  }

  Game.prototype.init = function(){
    // 初始化食物
    this.food.render();
    // 绑定事件
    this.bindEvent();
    // 启动游戏
    this.start();
  }
  // 启动游戏
  Game.prototype.start = function(){
    var that = this;
    this.timer = setInterval(function(){
      // 控制蛇移动一步
      that.snake.move(that.food);
      // 重新渲染蛇
      that.snake.render();

      // 控制蛇移动的边界
      var maxX = that.map.offsetWidth - that.snake.width;
      var maxY = that.map.offsetHeight - that.snake.height;
      if(that.snake.datas[0].x * that.snake.width < 0 || that.snake.datas[0].x * that.snake.width > maxX){
        // 游戏结束
        clearInterval(that.timer);
        alert('Game over!!!');
      }
      if(that.snake.datas[0].y * that.snake.height < 0 || that.snake.datas[0].y * that.snake.height > maxY){
        // 游戏结束
        clearInterval(that.timer);
        alert('Game over!!!');
      }

    },150);
  }
  // 键盘控制蛇的方向
  Game.prototype.bindEvent = function(){
    var that = this;
    document.onkeydown = function(e){
      e = e || window.event;
      console.log(e.keyCode);
      switch(e.keyCode){
        case 38:
          // top
          that.snake.direction = 'top';
          break;
        case 39:
          // right
          that.snake.direction = 'right';
          break;
        case 40:
          // bottom
          that.snake.direction = 'bottom';
          break;
        case 37:
          // left
          that.snake.direction = 'left';
          break; 
      }
    }
  }
  window.Game = Game;
})(window)