let gameArea = new Phaser.Scene('Game');

gameArea.init = function() {
    this.playerSpeed = 4;

    this.enemyMinSpeed = 6;
    this.enemyMaxSpeed = 4;


    this.enemyMinY = 40;
    this.enemyMaxY = 320;

    this.isTerm = false;
}

gameArea.preload = function(){
  this.load.image('background', 'img/bg.jpg');
  this.load.image('player', 'img/player.png');
  this.load.image('enemy', 'img/java.png');
  this.load.image('finish', 'img/cplus.png')
};

gameArea.create = function() {
  let bg = this.add.sprite(0, 0, 'background');

  bg.setOrigin(0,0);

  this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');

  this.player.setScale(0.78);

  this.player.depth = 0

  this.finish = this.add.sprite(this.sys.game.config.width - 40, this.sys.game.config.height / 2, 'finish')

  this.finish.setScale(0.8)

  this.enemies = this.add.group({
      key: 'enemy',
      repeat: 3,
      setXY: {
          x: 180,
          y: 100,
          stepX: 105,
          stepY: 20
      }
  });

  this.enemy = this.add.sprite(100, this.sys.game.config.height / 2, 'enemy')


  this.enemies.add(this.enemy)

  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.45, -0.45)

  Phaser.Actions.Call(this.enemies.getChildren(), function(en) {
      let v = Math.round() < 0.5 ? 1 : -1;
      let speed = this.enemyMinSpeed + (Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed));
      en.speed = v * speed


  }, this)
  

};

gameArea.update = function(){

    if (this.isTem) return;

    if (this.input.activePointer.isDown) {
        this.player.x += this.playerSpeed
    }

    let playerRect = this.player.getBounds();
    let treasureRect =this.finish.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
        this.scene.restart()
        return;
    }

    let enemies = this.enemies.getChildren();


    for (let i = 0; i < enemies.length; i++) {

        enemies[i].y += enemies[i].speed

        if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
            enemies[i].speed *= -1;
        }
    
        if (enemies[i].y  >= this.enemyMaxY && enemies[i].speed > 0) {
            enemies[i].speed *= -1;
        }

        let enemyRect = enemies[i].getBounds();
    
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            return this.gameEnd();
        }

    }

};


gameArea.gameEnd = function() {

    this.isTerm = true;

    this.cameras.main.shake(200);
    this.cameras.main.on('camerashakecomplete', (cam, ef) => {
        // this.cameras.main.fade(400);
        this
    })

    this.cameras.main.on('camerafadeoutcomplete', function(camera, eff) {
        // this.scene.restart()
    }, this)

}



let config = {
  type: Phaser.AUTO, 
  width: 620,
  height: 360,
  scene: gameArea
};

let game = new Phaser.Game(config);