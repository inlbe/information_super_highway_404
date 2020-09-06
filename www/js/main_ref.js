class MyGame extends Game
{
  static get Palette()
  {
    let colourObj =
    {
      Black: '#000000',
      LightOrange: '#f8d898',
      Orange: '#f8a830',
      Brown: '#c04800',
      Red: '#f80000',
      Purple: '#c868e8',
      Blue: '#2868c0',
      Green: '#089050',
      LightGreen: '#70d038',
      Yellow: '#f8f858',
      Gray: '#787878',
      White: '#f8f8f8',
      LightGray: '#d3d3d3',
      DarkGray: '#a9a9a9',
      DimGray: '#696969'
    }
    return colourObj;
  }
  constructor(xTiles, yTiles, tileSize)
  {
    super(xTiles, yTiles, tileSize);
    window.addEventListener("keydown", function(e)
    {
      //arrow keys
      if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }
    }, false);
    this.screens =
    {
      titleScreen: null,
      mainGameScreen: null
    };
    this.curtainScreen = null;
    this.audioPlayer = null;
    this.caterpillarSprite = null;
    this.gameWorld.events.onKeyDown = ((event) =>
    {
      if(this.audioPlayer && (event.key === 'm' || event.key === 'M'))
      {
        if(this.audioPlayer.masterGainNode.gain.value > 0)
        {
          this.audioPlayer.masterGainNode.gain.value = 0;
        }
        else
        {
          this.audioPlayer.masterGainNode.gain.value = 0.1;
        }
      }
    });
  }
  preload()
  {
    super.preload();
    let spritePolygons = new SpritePolygons(this);
    let spriteShapes1 = [];
    spriteShapes1.push(spritePolygons.caterpillar());
    spriteShapes1.push(spritePolygons.caterpillar(true));
    spriteShapes1.push(spritePolygons.groundTile('w1'));
    spriteShapes1.push(spritePolygons.leaf('l'));
    for(let i = 0; i < 3; i++)
    {
      spriteShapes1.push(spritePolygons.player('p', i));
    }
    spriteShapes1.push([PolyShape.Rectangle(0, 0, this.gameWorld.tileSize,
      this.gameWorld.tileSize, 'w2', MyGame.Palette.Brown)]);
    spriteShapes1.push([PolyShape.Rectangle(0, 0, this.gameWorld.tileSize,
      this.gameWorld.tileSize, 'b', MyGame.Palette.White)]);
    spriteShapes1.push([new PolyShape([new Point(0, 16), new Point(31, 16)], 'r',
        undefined, MyGame.Palette.Blue, 2)]);
    spriteShapes1.push([PolyShape.Rectangle(0, 0, this.gameWorld.tileSize,
        this.gameWorld.tileSize, 'lo1',MyGame.Palette.Orange)]);
    spriteShapes1.push([PolyShape.Rectangle(1, 1, this.gameWorld.tileSize - 2,
        this.gameWorld.tileSize - 2, 'lo2', MyGame.Palette.White)]);
    spriteShapes1.push([PolyShape.Rectangle(0, 0, this.gameWorld.tileSize,
        this.gameWorld.tileSize, 'cu1',MyGame.Palette.Purple)]);
    spriteShapes1.push([PolyShape.Rectangle(0, 0, this.gameWorld.tileSize,
        this.gameWorld.tileSize, 'cu2',MyGame.Palette.LightGreen)]);
    spriteShapes1.push([PolyShape.Circle(0, 0, this.gameWorld.tileSize / 2, MyGame.Palette.Black,
        'pt', 3)]);
    spriteShapes1.push([spritePolygons.star(this.gameWorld.tileSize / 2, this.gameWorld.tileSize / 2, 's0', MyGame.Palette.Yellow)]);
    spriteShapes1.push([spritePolygons.star(this.gameWorld.tileSize / 2, this.gameWorld.tileSize / 2, 's1', MyGame.Palette.LightGreen)]);

    let spriteShapes2 = [];
    let mapWidth = MainGameScreen.LevelDimensions.WIDTH * this.gameWorld.tileSize;
    let mapHeight = MainGameScreen.LevelDimensions.HEIGHT * this.gameWorld.tileSize;

    spriteShapes2.push([PolyShape.Rectangle(0, 0, mapWidth, mapHeight, 'mb',
        MyGame.Palette.DimGray), spritePolygons.wavyRectangle('', this.gameWorld.tileSize / 4,0, mapHeight / 3,
        mapWidth, mapHeight * (2 / 3), MyGame.Palette.DarkGray),
        spritePolygons.wavyRectangle('', this.gameWorld.tileSize / 4,0, mapHeight * (2/ 3),
        mapWidth, mapHeight / 3, MyGame.Palette.LightGray)]);

    this.addSpriteSheet(new SpriteSheet(10, this.gameWorld.tileSize,
        this.gameWorld.tileSize, spriteShapes1));
    this.addSpriteSheet(new SpriteSheet(1, mapWidth,
        mapHeight, spriteShapes2));

    this.loadSpriteSheets();
  }
  playMusic()
  {
    if(!this.audioPlayer)
    {
      this.audioPlayer = new AudioPlayer(this.gameWorld);
      let music = "84808486cac6c4c6cac6848f7e8a85c0c5c9cb4f8b8985c0c4c0c5c9cb4f808486cac6c4c6cac6848f7e8a85c0c5c9cb4f8b8985c0c4c0c5c9cb4f04be448444c4cbc9cb83438444c4cbc9cb8343be43be91d5c7c3c783954391cbc9c5c985938545c5d191cdc74384808486cac6c4c6cac6848f7e8a85c0c5c9cb4f8b8985c0c4c0c5c9cb4fc0c5c9cb4f3e3e84c4c5407ec5c0c5cb8f84c4c540be45be84c4c540bec5c0c5cb8f84c4c540be85450abec9c5c0c2c6c88642bebec9c5c0c2c6d51090caccd0ce8a908c88c4c8cac5c0c5c4c5c0c5457ebec0c7c2c782457ebec4c5c4c5c4c50589c4c9c4c0854b4400444a48bec6c4808486cac6c4c6cac6848f7e8a85c0c5c9cb4f8b8985c0c4c0c5c9cb4f";
      this.audioPlayer.playMusic(music, 120, true);
    }
  }
  create()
  {
    super.create();
    let collisionGrid = new CollisionGrid(this, MainGameScreen.LevelDimensions.WIDTH, MainGameScreen.LevelDimensions.HEIGHT);
    this.gameWorld.collisionGrid = collisionGrid;
    this.screens.mainGameScreen = new MainGameScreen(this, 0, 0);
    this.screens.mainGameScreen.setVisible(false);
    this.screens.titleScreen = new TitleScreen(this, 0, 0);
    this.screens.titleScreen.nextScreen = this.screens.mainGameScreen;
    this.screens.mainGameScreen.nextScreen = this.screens.titleScreen;
    this.curtainScreen = new CurtainScreen(this, 0, 0);
    this.screens.titleScreen.addChild(this.curtainScreen);
    this.gameWorld.addChild(this.screens.mainGameScreen);
    this.gameWorld.addChild(this.screens.titleScreen);

    this.gameWorld.gravity = this.gameWorld.tileSize * 8;
    this.curtainScreen.onDone.addListener(this.gameWorld, (open) =>
    {
      if(open)
      {
        this.curtainScreen.parent.startScreen();
      }
      else
      {
        this.curtainScreen.parent.nextScreen.setVisible(true);
        this.curtainScreen.parent.setVisible(false);
        this.curtainScreen.parent.nextScreen.initScreen();
        this.curtainScreen.parent.nextScreen.addChild(this.curtainScreen);
        this.curtainScreen.drawCurtain();
      }
    });
    window.addEventListener('resize', this.resizeApp.bind(this));
    this.resizeApp();
    this.gameWorld.start();

  }
  resizeApp()
  {
    // GOT FROM HTML5 GAME DEVS FORUM THANKS
  	// Width-height-ratio of game resolution
    let game_ratio = this.gameWorld.xTiles / this.gameWorld.yTiles;

  	// Make div full height of browser and keep the ratio of game resolution
  	let div = document.getElementById('my-app');
  	div.style.width = (window.innerHeight * game_ratio) + 'px';
  	div.style.height = window.innerHeight + 'px';
  	// Check if device DPI messes up the width-height-ratio
  	//let canvas = document.getElementsByTagName('canvas')[0];
  	let dpi_w = (parseInt(div.style.width, 10) / this.canvas.width);
  	let dpi_h = (parseInt(div.style.height, 10) / this.canvas.height);
  	let height = window.innerHeight * (dpi_w / dpi_h);
  	let width = height * game_ratio;
    if(width > window.innerWidth)
    {
      let diffRatio = window.innerWidth / width;
      width = window.innerWidth;
      height *= diffRatio;
    }
  	this.canvas.style.width = width + 'px';
  	this.canvas.style.height = height + 'px';
  }
}

class SpritePolygons
{
  constructor(game)
  {
    this.game = game;
    this.tileSize = this.game.gameWorld.tileSize;
  }
  caterpillar(frame2 = false)
  {
    let caterpillarSegment = (x, y, key, colour) =>
    {
      let legs = this.legs(x + 5, y + 8, 6);
      return [legs[0], legs[1], caterpillarCircle(x, y, key, colour)];
    };
    let caterpillarHead = (x, y, key) =>
    {
      let antennaes = this.legs(x + 5, y + 2, -10);
      return [antennaes[0], antennaes[1], caterpillarCircle(x, y, key)];
    };
    let caterpillarCircle = (x, y, key, colour = MyGame.Palette.LightGreen) =>
    {
      return PolyShape.Circle(x, y, 5, colour, key);
    };
    let key = 'c';
    if(frame2)
    {
      key = 'c1'
    }
    let segs = []
    let head = caterpillarHead(22, 8, key);
    head.forEach((part) =>
    {
      segs.push(part);
    });
    for(let i = 0; i < 4; i++)
    {
      let yComp = 18;
      if(frame2 && (i === 1 || i === 2))
      {
        yComp = 15;
      }
      let colour = undefined;
      if(i % 2 === 0)
      {
        colour = MyGame.Palette.Purple;
      }
      let parts = caterpillarSegment(i * (10 - (8/3)), yComp, key, colour)
      parts.forEach((part) =>
      {
        segs.push(part);
      });
    }
    return segs;
  }

  groundTile(key)
  {
    return [PolyShape.Rectangle(0, 0, this.tileSize,
        this.tileSize, key, MyGame.Palette.Green),
        this.wavyRectangle(key, this.tileSize / 8, 0, 10, this.tileSize, 22,
        MyGame.Palette.Brown)];
  }
  leaf(key)
  {
    let leafPoints =
    [
      new Point(16, 25),
      new Point(0, 17),
      new Point(8, 13),
      new Point(4, 7),
      new Point(11, 8),
      new Point(16, 0),
      new Point(20, 8),
      new Point(27, 7),
      new Point(23, 13),
      new Point(31, 17),
      new Point(16, 25)
    ]
    let leafBody = [new PolyShape([new Point(16, 16), new Point(16, 31)], key,
       undefined, MyGame.Palette.Black),
       new PolyShape(leafPoints, key, MyGame.Palette.Orange, undefined)];
    return leafBody;
  }
  player(key, frame)
  {
    let head = () =>
    {
      return [PolyShape.Circle(8 - (frame * 3), 0, 6, MyGame.Palette.LightOrange, key),
          PolyShape.Circle(8 - (frame * 3), 0, 6, MyGame.Palette.Gray, key, 100, 0,
              Math.PI)];
    };
    let legPosns =
    [
      [-3,3],
      [-3,0],
      [0,0]
    ]
    key = key + frame;
    let headParts = head();
    let body1 = PolyShape.Circle(0, 12, 10, MyGame.Palette.Red, key, undefined, Math.PI / 2, Math.PI);
    body1.points.push(new Point(10, 22));
    let body2 = PolyShape.Rectangle(10, 12, 10, 15, key, MyGame.Palette.Red);
    let body3 = PolyShape.Rectangle(0, 22, 10, 5, key, MyGame.Palette.Red);
    let body4 = PolyShape.Rectangle(20, 14, 12, 3, key, MyGame.Palette.Red);
    let legs = this.legs(11,27, 5, legPosns[frame]);
    let stick = new PolyShape([new Point(29, 17), new Point(29 - (frame * 4), 31)], key,
        undefined, MyGame.Palette.Black);
    return [headParts[0], headParts[1], body1, body2, body3, body4, legs[0], legs[1], stick];
  }
  star(x, y, key, colour)
  {
    let angInc = Math.PI / 5;
    let radii = [this.tileSize / 2, this.tileSize / 4];
    let ang = 0;
    let points = [];
    let rad = 0
    for(let i = 0; i < 10; i++)
    {
      ang = (i * angInc) - (angInc / 2);
      rad = radii[i % 2];
      points.push(new Point(x + (Math.cos(ang) * rad), y + (Math.sin(ang) * rad)));
    }
    return new PolyShape(points, key, colour);
  }

  legs(x, y, yOffset, xOffsets = [-3, 3], key = "")
  {
    let leg = (xOffset) =>
    {
      return new PolyShape([new Point(x, y), new Point(x + xOffset, y + yOffset)],
          key, undefined, MyGame.Palette.Black, 2);
    };
    return[leg(xOffsets[0]), leg(xOffsets[1])];
  };
  wavyRectangle(key, amp, x, y, width, height, colour)
  {
    let points = [];
    for(let i = x; i < width; i ++)
    {
      let ang = (i / amp) * Math.PI;
      points.push(new Point(i, (Math.sin(ang) * amp) + y));
    }
    let corners = [new Point(x + width, y + height),
        new Point(x, y + height)];
    Array.prototype.push.apply(points,corners);
    points.concat(corners);
    return new PolyShape(points, key, colour, undefined);
  }
}

class Group extends Sprite
{
  constructor(game, x, y)
  {
    super(game, null, null, x, y, true, false);

  }
}

class TextSprite extends Sprite
{
  constructor(game, x, y, text, fillStyle = MyGame.Palette.Black, fontSize = 32)
  {
    super(game, Sprite.Type.TEXT, {font: 'bold ' + fontSize + 'px serif', text: text, fillStyle: fillStyle},
    0, 0, true, false);
  }
}

class GameScreen extends Group
{
  constructor(game, x, y)
  {
    super(game, x, y);
    this.onDone = new Signal(game, this);
    this.nextScreen = null;
    this.transitionInput = true;
  }
  initScreen()
  {

  }
  startScreen()
  {

  }
}
class PlayIcon extends Group
{
  constructor(game, x, y)
  {
    super(game, x, y);
    let circle = this.addChild(new Sprite(game, Sprite.Type.SPRITE_SHEET, 'b', game.gameWorld.tileSize,
        game.gameWorld.tileSize, true, false));
    circle.scale.x = 3,
    circle.scale.y = 3;
    this.addChild(new Sprite(game, Sprite.Type.SPRITE_SHEET, 'pt', game.gameWorld.tileSize,
       game.gameWorld.tileSize, true, false));

  }
}
class CurtainScreen extends GameScreen
{
  constructor(game, x, y)
  {
    super(game, x, y);
    this.width = game.canvas.width;
    this.height = game.canvas.height;
    this.leftCurtain = this.addChild(new CurtainSpriteGroup(game, x, y));
    this.rightCurtain = this.addChild(new CurtainSpriteGroup(game, (game.gameWorld.canvas.width / 2), y, 0));
    this.rightCurtain.moveTween.onComplete = () =>
    {
      if(this.rightCurtain.tweenOpenSet)
      {
        this.onDone.dispatch(true);
        this.setVisible(false);
      }
      else
      {
        this.onDone.dispatch(false);
      }
    }
    this.playIcon = this.addChild(new PlayIcon(game,
        (game.gameWorld.canvas.width / 2) - game.gameWorld.tileSize ,
        (game.gameWorld.canvas.height / 2) - game.gameWorld.tileSize ));
    this.events.onMouseDown = (position) =>
    {
      this.doMouseClick();
    }
  }
  doMouseClick()
  {
    if(this.parent.transitionInput && !this.rightCurtain.moveTween.active)
    {
      this.drawCurtain();
    }
  }
  drawCurtain()
  {
    this.leftCurtain.moveTween.active = true;
    this.rightCurtain.moveTween.active = true;
    this.leftCurtain.reverse();
    this.rightCurtain.reverse();
    if(this.visible)
    {
      this.playIcon.setVisible(false);
    }
    else
    {
      this.setVisible(true);
    }
  }
}
class CurtainSpriteGroup extends Group
{
  constructor(game, x, y, side = 1)
  {
    super(game, x, y);
    let sprite = null;
    this.tweenOpenSet = false;
    let yPos = (game.gameWorld.canvas.height / 2) - (game.gameWorld.tileSize / 2);
    this.startPoint = new Point(this.position.x, this.position.y);
    this.endPoint = new Point(-(game.gameWorld.canvas.width / 2) - game.gameWorld.tileSize, this.position.y)
    if(side === 0)
    {
      this.endPoint.x = game.gameWorld.canvas.width;
    }
    for(let i = 0; i < Math.floor(game.gameWorld.xTiles / 2) + side; i++)
    {
      if(i % 2 === side)
      {
        sprite = this.addChild(new Sprite(game, Sprite.Type.SPRITE_SHEET,
            'cu1', i * game.gameWorld.tileSize, yPos, true, false));
      }
      else
      {
        sprite = this.addChild(new Sprite(game, Sprite.Type.SPRITE_SHEET,
            'cu2', i * game.gameWorld.tileSize,yPos, true, false));
      }
      sprite.scale.y = game.gameWorld.canvas.height / this.game.gameWorld.tileSize;
      this.moveTween = game.gameWorld.addTween(new MoveTween(this, 1, 0, Tween.CONST_SPEED,
          new Point(0, 0), new Point(0, 0)));
    }
  }
  reverse()
  {
    if(this.tweenOpenSet)
    {
      this.moveTween.setStartEnd(this.endPoint, this.startPoint);
      this.tweenOpenSet = false;
    }
    else
    {
      this.moveTween.setStartEnd(this.startPoint, this.endPoint);
      this.tweenOpenSet = true;
    }
  }
}
class TitleScreen extends GameScreen
{
  constructor(game, x, y)
  {
    super(game, x, y);
    let centre = (textSprite) =>
    {
      return new Point((game.gameWorld.canvas.width - textSprite.width) / 2,
          (game.gameWorld.canvas.height - textSprite.height) / 2);
    };
    this.events.onKeyDown = () =>
    {
      if(!this.game.curtainScreen.visible)
      {
        this.game.curtainScreen.doMouseClick();
      }
    };
    this.titleText1 = "Oh, My Poor Rheumatic Back";
    this.titleText2 = "Oh, My Poor Rheumatic B  ck";
    let pressAnyKeyText = "Press any key";
    this.title = this.addChild(new TextSprite(game, 0, 0, this.titleText1, MyGame.Palette.Black, 64));
    this.pressAnyKey = this.addChild(new TextSprite(game, 0, 0, pressAnyKeyText));
    this.centrePoint = centre(this.title);
    let pressAnyKeyCentrePoint = centre(this.pressAnyKey);
    pressAnyKeyCentrePoint.y += game.gameWorld.tileSize * 2;
    this.pressAnyKey.position.setTo(pressAnyKeyCentrePoint);
    this.playerImage = this.addChild(new Sprite(game, Sprite.Type.SPRITE_SHEET, 'p0', 926, this.centrePoint.y, true, false));
    this.tweenContainer = new TweenContainer();
    let titleMoveTween = new MoveTween(this.title, 2, 0, Tween.CONST_ACCEL,
        new Point(this.centrePoint.x, game.canvas.height + (this.title.height / 2)),
        new Point(this.centrePoint.x, this.centrePoint.y));
    titleMoveTween.onComplete = () =>
    {
      this.title.frame.text = this.titleText2;
    };
    let playerScaleTween = new ScaleTween(this.playerImage, 2, 0, Tween.CONST_ACCEL,
        new Point(0, 0), new Point(1, 1));
    let pressAnyKeyScaleTween = new ScaleTween(this.pressAnyKey, 2, 0, Tween.CONST_ACCEL,
        new Point(0, 0), new Point(1, 1));
    this.tweenContainer.addTween(titleMoveTween);
    this.tweenContainer.addTween(playerScaleTween);
    this.tweenContainer.addTween(pressAnyKeyScaleTween);
    this.game.gameWorld.addTween(this.tweenContainer);
    this.addChild(new FlasherGroup(game, 0, 0));
    this.initScreen();
  }
  initScreen()
  {
    this.title.position.x = this.centrePoint.x;
    this.title.position.y = this.game.canvas.height + (this.title.height / 2);
    this.playerImage.scale.x = 0;
    this.playerImage.scale.y = 0;
    this.title.frame.text = this.titleText1;
    this.pressAnyKey.scale.x = 0;
    this.pressAnyKey.scale.y = 0;
  }
  startScreen()
  {
    this.game.playMusic();
    this.tweenContainer.activateTweens();
  }
}

class Flasher extends Sprite
{
  constructor(game, x, y, startFrame = 0)
  {
    super(game, Sprite.Type.SPRITE_SHEET, ['s0', 's1'],x, y, true, true)
    {
      this.animRate = 1 / 3;
      this.setFrame(startFrame);
    }
  }
}

class FlasherGroup extends Group
{
  constructor(game, x, y)
  {
    super(game, x, y);
    for(let i = 0; i < this.game.gameWorld.xTiles; i++)
    {
      this.addChild(new Flasher(game, i * game.gameWorld.tileSize, 0, i % 2));
      this.addChild(new Flasher(game, i * game.gameWorld.tileSize,
          game.gameWorld.tileSize * (game.gameWorld.yTiles - 1), 1 - (i % 2)));
    }
    for(let i = 1; i < this.game.gameWorld.yTiles - 1; i++)
    {
      this.addChild(new Flasher(game, 0, i * game.gameWorld.tileSize, i % 2));
      this.addChild(new Flasher(game, game.gameWorld.tileSize * (game.gameWorld.xTiles - 1),
          i * game.gameWorld.tileSize, 1 - (i % 2)));
    }
  }
}

class MainGameScreen extends GameScreen
{
  static get LevelDimensions()
  {
    return{WIDTH: 36, HEIGHT: 18};
  }
  constructor(game, x, y)
  {
    super(game, x, y);
    this.transitionInput = false;
    this.playAreaGroup = new Group(game, 64, 0);
    this.addChild(this.playAreaGroup);
    this.tileMap = new TileMap(game);
    this.playAreaGroup.addChild(new Sprite(game,Sprite.Type.SPRITE_SHEET, 'mb', 0, 0, true, false, game.spriteSheets[1]));
    this.playAreaGroup.addChild(this.tileMap);
    this.playAreaSize = new Point(MainGameScreen.LevelDimensions.WIDTH * this.game.gameWorld.tileSize,
        MainGameScreen.LevelDimensions.HEIGHT * this.game.gameWorld.tileSize)
    this.wallFrames = ['w1', 'w2'];
    this.playerSpritePool = new PlayerSpritePool();
    this.playerSprite = null;
    this.playerSprite = null;
    this.caterpillarSpawnGroupPool = new CaterpillarSpawnGroupPool();
    this.caterpillarSpawnGroup = null;
    this.leafSpriteGroupPool = new LeafSpriteGroupPool();
    this.leafSpriteGroup = this.leafSpriteGroupPool.obtain({game: game, x: 0, y: 0});
    this.powerUpSpriteGroupPool = new PowerUpSpriteGroupPool();
    this.powerUpSpriteGroup = this.powerUpSpriteGroupPool.obtain({game: game, x: 0, y: 0});
    this.platformCells = null;
    this.innerPlatformCells = null;
    this.leafoMeter = new LeafoMeter(this.game, 0, this.playAreaSize.y / 2, 10);
    this.leafoMeter.onMaxedOut.addListener(this, () =>
    {
      this._collapseMap();
    });
    this.addChild(this.leafoMeter);
    this.score = new ScoreSprite(game, 0, 0, 0);
    this.addChild(this.score);
    this.rainSpriteGroupPool = new RainSpriteGroupPool();
    this.rainSpriteGroup = this.rainSpriteGroupPool.obtain({game:game, x: 0, y: 0});
    this.mapData = null;
    this.wallMoveTweens = [];
    this.nukeAlphaTween = this.game.gameWorld.addTween(new AlphaTween(this.playAreaGroup, 2, 1, Tween.CONST_ACCEL, 1, 0.2));
    this.nukeTweenContainer = this.game.gameWorld.addTween(new TweenContainer());
    let dis = this.game.gameWorld.tileSize * 0.5;
    let storePoint = new Point(0,0);
    for(let i = 0; i < 7; i++)
    {
      let ang = Math.random() * Math.PI * 2;
      storePoint.x = (Math.cos(ang) * dis) + this.playAreaGroup.position.x;
      storePoint.y = (Math.sin(ang) * dis) + this.playAreaGroup.position.y;
      this.nukeTweenContainer.addTween(new MoveTween(this.playAreaGroup, 0.1, 0, Tween.CONST_SPEED,
          this.playAreaGroup.position, storePoint));
      this.nukeTweenContainer.addTween(new MoveTween(this.playAreaGroup, 0.1, 0, Tween.CONST_SPEED,
         storePoint, this.playAreaGroup.position));
    }
    this.nukeTweenContainer.addTween(this.nukeAlphaTween);
  }
  initScreen()
  {
    this.loadLevel();
    this.playerSprite.active = false;
  }
  startScreen()
  {
    this.playerSprite.active = true;
    this.caterpillarSpawnGroup.startSpawning();
    this.leafSpriteGroup.spriteTimer.reset(true);
    this.powerUpSpriteGroup.spriteTimer.reset(true);
    this.rainSpriteGroup.startRaining();
  }
  loadLevel()
  {
    this.wallMoveTweens.length = 0;
    this.tileMap.clearTileSprites(this.game.gameWorld.collisionGrid);
    this.generateLevel();
    this.tileMap.createTileSprites(this.mapData, this.game.gameWorld.collisionGrid);
    this.tileMap.setWallSpriteCollisionGroups(PlayerSprite.CollisionID + CaterpillarSprite.CollisionID);
    this.tileMap.wallSprites.forEach((wall) =>
    {
      let ranPoint = new Point(MathsFunctions.RandomInt(this.game.gameWorld.tileSize,
          this.game.screens.mainGameScreen.playAreaSize.x - this.game.gameWorld.tileSize),
          this.game.canvas.height + this.game.gameWorld.tileSize);
      this.wallMoveTweens.push(this.game.gameWorld.addTween
          (new MoveTween(wall, 2, 0, Tween.CONST_SPEED,
          wall.position, ranPoint)));
    });
    this.wallMoveTweens[this.wallMoveTweens.length - 1].onComplete = () =>
    {
      this.tileMap.clearTileSprites();
      this.game.curtainScreen.drawCurtain();
      this.score.resetScore();
    };
    this.game.gameWorld.collisionGrid.addSprite(this.playerSprite);
    this.playAreaGroup.addChild(this.leafSpriteGroup);
    this.playAreaGroup.addChild(this.powerUpSpriteGroup);
    this.playAreaGroup.addChild(this.playerSprite);
    this.playAreaGroup.addChild(this.caterpillarSpawnGroup);
    this.playAreaGroup.addChild(this.rainSpriteGroup);
    this.game.gameWorld.collisionGrid.addSprites(this.caterpillarSpawnGroup.children);
    this.playerSprite.onCollideCaterpillar.addListener(this, () =>
    {
      this.caterpillarSpawnGroup.zapCaterpillars(false);
    });
    this.playerSprite.onUnCollideCaterpillar.addListener(this, () =>
    {
      this.caterpillarSpawnGroup.startSpawning(false);
    });
    this.playerSprite.onSweptUpLeaf.addListener(this,(leafSprite) =>
    {
      this.leafoMeter.leaves --;
      this.leafoMeter.setLeafoMeter();
      this.score.addScore(LeafSprite.GivesScore);
    });
    this.playerSprite.onPickedUpPowerUp.addListener(this,(powerUpSprite) =>
    {
      this.score.addScore(PowerUpSprite.GivesScore);
      if(powerUpSprite.powerUpType === PowerUpSprite.PowerUpTypes.ClearLeaves)
      {
        this.leafSpriteGroup.zapLeaves();
        this.score.addScore(LeafSprite.GivesScore * this.leafoMeter.leaves);
        this.leafoMeter.leaves = 0;
        this.leafoMeter.setLeafoMeter();
      }
      else if(powerUpSprite.powerUpType === PowerUpSprite.PowerUpTypes.ClearCaterpillars)
      {
        this.score.addScore(PowerUpSprite.GivesScore * this.caterpillarSpawnGroup.maxCaterpillars);
        this.caterpillarSpawnGroup.zapCaterpillars();
        this.nukeTweenContainer.activateTweens();
      }
    });
    this.leafSpriteGroup.onSpriteSettled.addListener(this, () =>
    {
      this.leafoMeter.leaves ++;
      this.leafoMeter.setLeafoMeter();
    });
    this.leafoMeter.leaves = 0;
    this.leafoMeter.setLeafoMeter();
  }
  generateLevel()
  {
    this._generatePlayerSpriteGroup();
    this._generateCaterpillarSpawnGroup();
    let mapDataObj = this._generateMapData();
    this.mapData = mapDataObj.mapData;
    this.platformCells = mapDataObj.platformCells;
    this.innerPlatformCells = [];
    this.platformCells.forEach((point) =>
    {
      if(point.x > this.game.gameWorld.tileSize * 10 && point.x <
          (MainGameScreen.LevelDimensions.WIDTH - 10) * this.game.gameWorld.tileSize)
      {
        this.innerPlatformCells.push(point);
      }
    });
  }
  _parseHexChar(hexString, charIndex)
  {
    return parseInt(hexString.charAt(charIndex), 16);
  }
  _generateMapData()
  {
    //procedurally generate map
    let platformCells = [];
    let setWallAttribs = ((cell, index = 0) =>
    {
      cell.frames = this.wallFrames[index];
      cell.wall = true;
      cell.animated = false;
    });
    let setPlatformAttribs = ((cell) =>
    {
      setWallAttribs(cell);
      cell.onlyCollidesTop = true;
    });
    let platformWidth = 7;
    let platformRowSpace = 3;
    let platformSpacing = 2;
    let platformTotal = platformWidth + platformSpacing;
    let platformRow = false;
    let mapDims = this.constructor.LevelDimensions;
    let mapData = new MyGrid(mapDims.WIDTH, mapDims.HEIGHT, {frames: [], wall: false,
        animated: false, animRate: 1 / 2, onlyCollidesTop: false});
    for(let i = 1; i < MainGameScreen.LevelDimensions.WIDTH - 1; i++)
    {
      setWallAttribs(mapData.grid[i][MainGameScreen.LevelDimensions.HEIGHT - 1]);
    }
    for(let i = 0; i < MainGameScreen.LevelDimensions.HEIGHT; i++)
    {
      setWallAttribs(mapData.grid[0][i], 1);
      setWallAttribs(mapData.grid[MainGameScreen.LevelDimensions.WIDTH - 1][i], 1);
    }
    for(let y = MainGameScreen.LevelDimensions.HEIGHT - 1 - platformRowSpace; y > 1 ; y--)
    {
      let yOffset = y - 0;
      if(yOffset % platformRowSpace === 0)
      {
        platformRow = true;
      }
      else
      {
        platformRow = false;
      }
      for(let x = 1; x <  MainGameScreen.LevelDimensions.WIDTH - 1; x++)
      {
        let xOffset = x - 1;
        let platformIndex = xOffset - (platformTotal * Math.floor(xOffset / platformTotal));
        if(platformRow)
        {
          if(platformIndex < platformWidth)
          {
            //add platform
            setPlatformAttribs(mapData.grid[x][y + 2]);
            platformCells.push(new Point(x * this.game.gameWorld.tileSize,
                (y + 1) * this.game.gameWorld.tileSize));
          }
        }
      }

    }
    return {mapData: mapData, platformCells: platformCells};
  }
  _generatePlayerSpriteGroup()
  {
    this.playerSprite = this.playerSpritePool.obtain({game: this.game, x: 1 * this.game.gameWorld.tileSize,
        y: 16 * this.game.gameWorld.tileSize});
  }
  _generateCaterpillarSpawnGroup()
  {
    let total = 10;
    this.caterpillarSpawnGroup = this.caterpillarSpawnGroupPool.obtain({game: this.game, x: 0, y: 0, total: total});
  }
  _collapseMap()
  {
    this.playerSpritePool.free(this.playerSprite);
    this.caterpillarSpawnGroupPool.free(this.caterpillarSpawnGroup);
    this.leafSpriteGroupPool.free(this.leafSpriteGroup);
    this.powerUpSpriteGroupPool.free(this.powerUpSpriteGroup);
    this.game.gameWorld.collisionGrid.removeSprites(this.tileMap.wallSprites, true);
    this.wallMoveTweens.forEach((tween) =>
    {
      tween.active = true;
    });
    this.rainSpriteGroupPool.free(this.rainSpriteGroup);
    this.playAreaGroup.removeChild(this.leafSpriteGroup);
    this.playAreaGroup.removeChild(this.powerUpSpriteGroup);
    this.playAreaGroup.removeChild(this.caterpillarSpawnGroup);
    this.playAreaGroup.removeChild(this.rainSpriteGroup);
  }
}

class ScoreSprite extends TextSprite
{
  constructor(game, x, y, score)
  {
    super(game, x, y, "");
    this.score = score;
    this.highScore = score;
    this._updateScoreText();
  }
  addScore(score)
  {
    this.score += score;
    if(this.score > this.highScore)
    {
      this.highScore = this.score;
    }
    this._updateScoreText();
  }
  resetScore()
  {
    this.score = 0;
    this._updateScoreText();
  }
  _updateScoreText()
  {
    this.frame.text = "Score:" + this.score + " High: " + this.highScore;
  }
}

class CharacterSprite extends Sprite
{
  constructor(game, frames, x, y, animated)
  {
    super(game, Sprite.Type.SPRITE_SHEET, frames, x, y, false, animated);
    this.spawnScaleTween = this.game.gameWorld.addTween
        (new ScaleTween(this, 0.8, 0, Tween.CONST_ACCEL,
        new Point(0, 0), new Point(1, 1)));
    this.terminateScaleTween = this.game.gameWorld.addTween
        (new ScaleTween(this, 0.8, 0, Tween.CONST_ACCEL,
        new Point(1, 1), new Point(0, 0)));
    this.terminateScaleTween.onComplete = () =>
    {
      this.terminate();
    }
    this.gravityEnabled = true;
    this.maxPosYSpeed = this.game.gameWorld.tileSize * 5;
    this.onTerminated = new Signal(game, this);
  }
  doHit(collisionSprite)
  {
    if(collisionSprite.setFinished)
    {
      collisionSprite.setFinished();
    }
  }
  terminate()
  {
    this.setVisible(false);
    this.onTerminated.dispatch(this);
  }
  reset()
  {
    super.reset();
    this.game.gameWorld.collisionGrid.removeSprite(this);
    this.parent.removeChild(this);
  }
}

class PlayerSprite extends CharacterSprite
{
  static get CollisionID()
  {
    return 1 << 1;
  }
  constructor(game, x, y)
  {
    super(game, ['p0', 'p1', 'p2', 'p1'], x, y, false);
    this.onPickedUpPowerUp = new Signal(game, this);
    this.onCollideCaterpillar = new Signal(game, this);
    this.onUnCollideCaterpillar = new Signal(game, this);
    this.onCollide.addListener(this, (sprite, collisionSprite) =>
    {
      if(!this.collideCaterpillarMoveTween.active)
      {
        if(collisionSprite.constructor.CollisionID === LeafSprite.CollisionID)
        {
          if(collisionSprite.inPlace)
          {
            this.game.screens.mainGameScreen.leafSpriteGroup.pool.free(collisionSprite);
            this.onSweptUpLeaf.dispatch(collisionSprite);
          }
        }
        else if(collisionSprite.constructor.CollisionID === PowerUpSprite.CollisionID)
        {
          if(collisionSprite.inPlace)
          {
            this.game.screens.mainGameScreen.powerUpSpriteGroup.pool.free(collisionSprite);
            this.onPickedUpPowerUp.dispatch(collisionSprite);
          }
        }
        else if(collisionSprite.constructor.CollisionID === CaterpillarSprite.CollisionID
            && collisionSprite.active)
        {
          let randomPoint = this.game.screens.mainGameScreen.platformCells
              [MathsFunctions.RandomInt(0, this.game.screens.mainGameScreen.platformCells.length)];
          this.collideCaterpillarMoveTween.setStartEnd(this.position,
              new Point(randomPoint.x, randomPoint.y - (this.game.gameWorld.tileSize * 2)));
          this.game.gameWorld.collisionGrid.removeSprite(this);
          this.collideCaterpillarMoveTween.active = true;
          this.collideCaterpillarRotateTween.active = true;
          this.solid = false;
          this.onCollideCaterpillar.dispatch();
        }
      }
    });
    this.collideCaterpillarMoveTween = this.game.gameWorld.addTween
        (new MoveTween(this, 4, 0, Tween.CONST_SPEED,
        new Point(0, 0), new Point(0, 0)));
    this.collideCaterpillarRotateTween = this.game.gameWorld.addTween
        (new RotateTween(this, 0.3, -1, Tween.CONST_SPEED,
        Math.PI * 2));
    this.collideCaterpillarMoveTween.onComplete = () =>
    {
      this.collideCaterpillarRotateTween.active = false;
      this.angle = 0;
      this.solid = true;
      this.initGridPos();
      this.game.gameWorld.collisionGrid.addSprite(this);
      this.onUnCollideCaterpillar.dispatch();
    };

    this.animRate = 1 / 4;
    this.onSweptUpLeaf = new Signal(game, this);
    this.moveXSpeed = this.game.gameWorld.tileSize * 3.5;
    this.moveYSpeed = -this.game.gameWorld.tileSize * 7;
    this.jumping = false;
    this.collisionGroup = CaterpillarSprite.CollisionID +
        WallSprite.CollisionID + LeafSprite.CollisionID +
        PowerUpSprite.CollisionID;
    this.keyStates =
    {
      left: false,
      right: false,
      up: false
    }

    this.events.onKeyDown = ((event) =>
    {
      if(event.keyCode === 39 || event.key === 'd' || event.key === 'D')
      {
        this.keyStates.right = true;
      }
      else if(event.keyCode === 37 || event.key === 'a' || event.key === 'A')
      {
        this.keyStates.left = true;
      }

      if(event.keyCode === 38 || event.key === 'w' || event.key === 'W')
      {
        this.keyStates.up = true;
      }
    });

    this.events.onKeyUp = ((event) =>
    {
      if(event.keyCode === 39 || event.key === 'd' || event.key === 'D')
      {
        this.keyStates.right = false;
      }
      else if(event.keyCode === 37 || event.key === 'a' || event.key === 'A')
      {
        this.keyStates.left = false;
      }
      else if(event.keyCode === 38 || event.key === 'w' || event.key === 'W')
      {
        this.keyStates.up = false;
      }
    });
  }
  _doSpeed()
  {
    if(this.active)
    {
      this.animated = true;
      if(this.keyStates.left && !this.keyStates.right)
      {
        this.speed.x = -this.moveXSpeed;
        this.flipX = true;
      }
      else if(this.keyStates.right && !this.keyStates.left)
      {
        this.speed.x = this.moveXSpeed;
        this.flipX = false;
      }
      else
      {
        this.speed.x = 0;
        this.animated = false;
        this.setFrame(0);
      }
      if(!this.jumping)
      {
        if(this.keyStates.up && this.collidingY)
        {
          this.speed.y = this.moveYSpeed;
          this.jumping = true;
        }
      }
      else if(!this.keyStates.up)
      {
        this.jumping = false;
        if(this.speed.y < 0)
        {
          this.speed.y = 0;
        }
      }
    }
  }
  update(deltaTimeSec)
  {
    super.update(deltaTimeSec);
    if(this.jumping && this.collidingY)
    {
      this.jumping = false;
    }
    this._doSpeed();
  }
  reset()
  {
    super.reset();
    this.onSweptUpLeaf.listeners.length = 0;
    this.onPickedUpPowerUp.listeners.length = 0;
    this.onCollideCaterpillar.listeners.length = 0;
    this.onUnCollideCaterpillar.listeners.length = 0;
    for(var key in this.keyStates)
    {
      this.keyStates[key] = false;
    }
    this.flipX = false;
    this.animated = false;
    this.setFrame(0);
  }
}

class CaterpillarSprite extends CharacterSprite
{
  static get CollisionID()
  {
    return 1 << 2;
  }
  constructor(game, x, y, animated = true)
  {
    super(game, ['c','c1'], x, y, animated);
    this.hitWallThisFrame = false;
    this.active = false;
    this.solid = false;
    this.moveXSpeed = this.game.gameWorld.tileSize * 2.91;
    this.moveYSpeed = -this.game.gameWorld.tileSize * 7;
    this.moveCrossingPlatformYSpeed = -this.game.gameWorld.tileSize * 3.5;
    this.playerSprite = game.screens.mainGameScreen.playerSprite;
    this.crosssingPlatform = false;
    this.animRate = 1/3;
    this.collisionGroup = PlayerSprite.CollisionID  + WallSprite.CollisionID;
    this.speed.x = -this.moveXSpeed;
    this.onCollide.addListener(this, (sprite, collisionSprite) =>
    {
      if(!this.hitWallThisFrame && this.collidingX && collisionSprite !== this.playerSprite)
      {
        this.hitWallThisFrame = true;
        this.speed.x = -this.speed.x;
        this.flipX = !this.flipX;
      }
    }, true);
    this.aliveTimer = new Timer(0);
    game.gameWorld.timers.push(this.aliveTimer);
    this.aliveTimer.onComplete = () =>
    {
      this.terminateScaleTween.active = true;
      this.active = false;
    };
    this.spawnScaleTween.onComplete = () =>
    {
      this.active = true;
    }
  }
  terminate()
  {
    super.terminate();
  }
  doHit(collisionSprite)
  {
    super.doHit(collisionSprite);
  }
  update(deltaTime)
  {
    super.update(deltaTime);
    this.hitWallThisFrame = false;
    if(this.crosssingPlatform)
    {
      if(this.collidingY)
      {
        this.crosssingPlatform = false;
      }
    }
    else if(!this.collidingY)
    {
      if(this.speed.y > 0 && this.playerSprite.gridPos.y - 3 <= this.gridPos.y)
      {
        this.goToPlayerX();
      }
      else
      {
        this.speed.x = 0;
      }
    }
    else
    {
      if(this.playerSprite.gridPos.y === this.gridPos.y)
      {
        this.goToPlayerX();
        if(this.speed.x < 0 &&
            !this.game.gameWorld.collisionGrid.grid[this.gridPos.x- 1][this.gridPos.y + 1].wall)
        {
          this.speed.y = this.moveCrossingPlatformYSpeed;
          this.crosssingPlatform = true;
        }
        else if(this.speed.x > 0 &&
            !this.game.gameWorld.collisionGrid.grid[this.gridPos.x + 1][this.gridPos.y + 1].wall)
        {
          this.speed.y = this.moveCrossingPlatformYSpeed;;
          this.crosssingPlatform = true;
        }
      }
      else if(this.playerSprite.gridPos.y < this.gridPos.y &&
          (this.playerSprite.gridPos.y - 1) % 3 === 0)
      {
        if(this.game.gameWorld.collisionGrid.grid[this.gridPos.x][this.gridPos.y - 2].wall)
        {
          this.speed.x = 0;
          this.speed.y = this.moveYSpeed;
        }
        else
        {
          this.goToPlayerX();
        }
      }
      else if(this.speed.x === 0)
      {
        this.goToPlayerX();
      }
    }

  }
  goToPlayerX()
  {
    if(this.playerSprite.gridPos.x < this.gridPos.x)
    {
      this.speed.x = -this.moveXSpeed;
      this.flipX = true;
    }
    else if(this.playerSprite.gridPos.x > this.gridPos.x)
    {
      this.speed.x = this.moveXSpeed;
      this.flipX = false;
    }
  }
}

class SpriteDropperGroup extends Group
{
  constructor(game, x, y, pool, time)
  {
    super(game, x, y);
    this.pool = pool;
    this.time = time;
    this.spriteTimer = new Timer(time)
    this.game.gameWorld.timers.push(this.spriteTimer);
    this.onSpriteSettled = new Signal(game, this);
    this.spriteTimer.onComplete = () =>
    {
      this.spriteTimerHandler();
    };
  }
  spriteTimerHandler()
  {
    let sprite = this.pool.obtain({game: this.game,
        x: MathsFunctions.RandomInt(this.game.gameWorld.tileSize,
        this.game.screens.mainGameScreen.playAreaSize.x - this.game.gameWorld.tileSize), y: 0});
    sprite.moveTween.onComplete = () =>
    {
      sprite.inPlace = true;
      this.onSpriteSettled.dispatch();
    };
    this.addChild(sprite);
    this.game.gameWorld.collisionGrid.addSprite(sprite);
    let platformCells = this.getPlatformCells();
    let randomPoint = platformCells[MathsFunctions.RandomInt(0, platformCells.length)];
    sprite.moveTween.setStartEnd(sprite.position, randomPoint);
    sprite.rotateTween.active = true;
    sprite.moveTween.active = true;
    this.spriteTimer.reset(true);
    return sprite;
  }
  reset()
  {
    super.reset();
    this.spriteTimer.reset(false);
    this.onSpriteSettled.listeners.length = 0;
    this.resetChildren();
    this.spriteTimer.endTime = this.time;
  }
  resetChildren()
  {
    while(this.children.length > 0)
    {
      this.pool.free(this.children[0]);
    }
  }
  getPlatformCells()
  {
    return null;
  }
}

class LeafSpriteGroup extends SpriteDropperGroup
{
  constructor(game, x, y)
  {
    super(game, x, y, new LeafSpritePool(), 3);
    this.minLeafTime = 1.5;
    this.reduceInc = -0.0075;
  }
  getPlatformCells()
  {
    return this.game.screens.mainGameScreen.platformCells;
  }
  spriteTimerHandler()
  {
    let leafSprite = super.spriteTimerHandler();
    leafSprite.alphaTween.onComplete = () =>
    {
      this.pool.free(leafSprite);
    }
    if(this.spriteTimer.endTime > this.minLeafTime)
    {
      this.spriteTimer.endTime += this.reduceInc;
    }

  }
  zapLeaves()
  {
    this.children.forEach((leafSprite) =>
    {
      if(leafSprite.inPlace)
      {
        this.game.gameWorld.collisionGrid.removeSprite(leafSprite);
        leafSprite.scaleTween.active = true;
        leafSprite.alphaTween.active = true;
      }
    });
  }
  reset()
  {
    super.reset();
  }
}

class PowerUpSpriteGroup extends SpriteDropperGroup
{
  constructor(game, x, y)
  {
    super(game, x, y, new PowerUpSpritePool(), 15);
    this.counter = 0;
  }
  getPlatformCells()
  {
    return this.game.screens.mainGameScreen.innerPlatformCells;
  }
  spriteTimerHandler()
  {
    let powerUpSprite = super.spriteTimerHandler();
    this.spriteTimer.endTime += 2;
    this.counter ++;
    powerUpSprite.powerUpType = 1 - (this.counter % 2);
    powerUpSprite.setFrame(powerUpSprite.powerUpType);
    powerUpSprite.aliveTimer.reset(true);
  }
  reset()
  {
    super.reset();
    this.counter = 0;
  }
}

class RainSpriteGroup extends Group
{
  constructor(game, x, y)
  {
    super(game, x, y);
    this.totalRainSprites = 10;
    this.rainAngle = Math.PI * (5 / 8);
    this.rainSpeed = game.gameWorld.tileSize * 8;
    this.rainTimer = new Timer(0.3);
    this.rainTimer.onComplete = () =>
    {
      if(this.launchQueue.length > 0)
      {
        let rainSprite = this.launchQueue[0];
        this.launchQueue.splice(0, 1);
        rainSprite.active = true;
        rainSprite.setVisible(true);
        rainSprite.position.x = MathsFunctions.RandomInt(this.game.gameWorld.tileSize,
            this.game.screens.mainGameScreen.playAreaSize.x - this.game.gameWorld.tileSize);
        rainSprite.position.y = 0 -game.gameWorld.tileSize;
      }
      this.rainTimer.reset(true);
    };
    game.gameWorld.timers.push(this.rainTimer);
    this.launchQueue = [];
    let rainSprite = null;

    for(let i = 0; i < this.totalRainSprites; i++)
    {
      rainSprite = new RainSprite(game, 0, 0);
      rainSprite.setVisible(false);
      rainSprite.active = false;
      rainSprite.angle = this.rainAngle;
      rainSprite.speed.x = Math.cos(this.rainAngle) * this.rainSpeed;
      rainSprite.speed.y = Math.sin(this.rainAngle) * this.rainSpeed;
      rainSprite.onOutOfView.addListener(this, (rainSprite) =>
      {
        rainSprite.active = false;
        rainSprite.visible = false;
        this.launchQueue.push(rainSprite);
      });
      this.addChild(rainSprite);
    }
  }
  startRaining()
  {
    this.children.forEach((child) =>
    {
     this.launchQueue.push(child);
    });
    this.rainTimer.reset(true);
  }
  reset()
  {
    super.reset();
    this.launchQueue.length = 0;
    this.children.forEach((child) =>
    {
      child.setVisible(false);
      child.active = false;
    });
    this.rainTimer.reset(false);
  }
}

class DropSprite extends Sprite
{
  constructor(game, x, y, frames)
  {
    super(game, Sprite.Type.SPRITE_SHEET, frames, x, y, false, false);
    this.moveTween = this.game.gameWorld.addTween
        (new MoveTween(this, 2, 0, Tween.CONST_SPEED,
        new Point(0, 0), new Point(0, 0)));
    this.solid = false;
    this.inPlace = false;
    this.angle = Math.PI / 4;
    this.rotateTween = this.game.gameWorld.addTween(new RotateTween(this, 2, -1,
        Tween.CONST_ACCEL, -Math.PI * (1/2)));
  }
  reset()
  {
    super.reset();
    this.angle = Math.PI / 4;
    this.rotateTween.active = false;
    this.inPlace = false;
    this.game.gameWorld.collisionGrid.removeSprite(this);
    this.parent.removeChild(this);
  }
}

class LeafSprite extends DropSprite
{
  static get CollisionID()
  {
    return 1 << 3;
  }
  static get GivesScore()
  {
    return 100;
  }
  constructor(game, x, y)
  {
    super(game, x, y, 'l');
    this.scaleTween = this.game.gameWorld.addTween(new ScaleTween(this, 2, 0, Tween.CONST_SPEED,
        new Point(1, 1), new Point(10, 10)));
    this.alphaTween = this.game.gameWorld.addTween(new AlphaTween(this, 2, 0, Tween.CONST_SPEED, 1, 0));
  }
  reset()
  {
    super.reset();
    this.scale.x = 1;
    this.scale.y = 1;
    this.alpha = 1;
  }
}

class PowerUpSprite extends DropSprite
{
  static get CollisionID()
  {
    return 1 << 4;
  }
  static get GivesScore()
  {
    return 200;
  }
  static get PowerUpTypes()
  {
    let powerUpTypes =
    {
      ClearLeaves: 0,
      ClearCaterpillars: 1
    };
    return powerUpTypes;
  }
  constructor(game, x, y)
  {
    super(game, x, y, ['s0', 's1']);
    this.powerUpType = 0;
    this.aliveTimer = new Timer(8);
    game.gameWorld.timers.push(this.aliveTimer);
    this.aliveTimer.onComplete = () =>
    {
      this.reset();
    }
  }
  reset()
  {
    super.reset();
    this.aliveTimer.reset(false);
  }
}

class RainSprite extends Sprite
{
  constructor(game, x, y)
  {
    super(game, Sprite.Type.SPRITE_SHEET, 'r', x, y, false, false);
    this.onOutOfView = new Signal(game, this);
  }
  update(deltaTimeSec)
  {
    super.update(deltaTimeSec)
    //in View?
    if(this.position.x < 0 ||
       this.position.x > this.game.screens.mainGameScreen.playAreaSize.x ||
       this.position.y > this.game.screens.mainGameScreen.playAreaSize.y)
    {
      this.onOutOfView.dispatch(this);
    }
  }
}

class CaterpillarSpawnGroup extends Group
{
  constructor(game, x, y, spritesTotal)
  {
    super(game, x, y);
    this.minSpawnDisSq = Math.pow(game.gameWorld.tileSize * 10, 2);
    this.caterpillarSpritePool = new CaterpillarSpritePool();
    this.maxCaterpillars = 1;
    this.maxCaterpillarsTimer = new Timer(12);
    game.gameWorld.timers.push(this.maxCaterpillarsTimer);
    this.spritesTotal = spritesTotal;
    this.maxCaterpillarsTimer.onComplete = () =>
    {
      if(this.maxCaterpillars < this.spritesTotal)
      {
        this.maxCaterpillars ++;
        this.maxCaterpillarsTimer.reset(true);
      }
    };

    this.spawnTimer = new Timer(3);
    this.spawnTimer.onComplete = () =>
    {
      this.spawn();
      this.spawnTimer.reset(true);
    };
    game.gameWorld.timers.push(this.spawnTimer);
    this._initSprites();
  }
  startSpawning(resetMaxCaterpillarsTimer = true)
  {
    this.spawnTimer.reset(true);
    if(resetMaxCaterpillarsTimer)
    {
      this.maxCaterpillarsTimer.reset(true);
    }
  }
  _initSprites()
  {
    for(let  i = 0; i < this.spritesTotal; i++)
    {
      this.addChild(this.caterpillarSpritePool.obtain(
      {
        game: this.game,
        x: 0,
        y: 0,
      })).setVisible(false);
    }
  }
  spawn()
  {
    let visibleCount = 0;
    let canSpawn = false;
    let ran = 0;
    let cellPoint = null;
    let platformCellsCopy = [...this.game.screens.mainGameScreen.platformCells];
    this.children.some((caterpillarSprite) =>
    {
      if(caterpillarSprite.visible)
      {
        visibleCount ++;
      }
      else
      {
        canSpawn = false;
        while(!canSpawn)
        {
          ran = MathsFunctions.RandomInt(0, platformCellsCopy.length);
          cellPoint = platformCellsCopy[ran];
          if(MathsFunctions.DisSq(caterpillarSprite.playerSprite.position, cellPoint) < this.minSpawnDisSq)
          {
            platformCellsCopy.splice(ran, 1);
          }
          else
          {
            canSpawn = true;
          }
        }
        caterpillarSprite.position.setTo(cellPoint);
        caterpillarSprite.position.y -= 0.1;
        caterpillarSprite.setVisible(true);
        caterpillarSprite.spawnScaleTween.active = true;
        caterpillarSprite.initGridPos();
        caterpillarSprite.aliveTimer.endTime = MathsFunctions.RandomInt(7, 10);
        caterpillarSprite.aliveTimer.reset(true);
        visibleCount ++;
      }
      if(visibleCount >= this.maxCaterpillars)
      {
        return true;
      }
    });
  }
  set(objectArgs)
  {
    this.spritesTotal = objectArgs.total;
    this._initSprites();
  }
  reset()
  {
    super.reset();
    while(this.children.length > 0)
    {
      this.caterpillarSpritePool.free(this.children[0]);
    }
    this.spawnTimer.reset(false);
    this.maxCaterpillarsTimer.reset(false);
    this.maxCaterpillars = 1;
  }
  zapCaterpillars(powerUp = true)
  {
    this.children.forEach((caterpillarSprite) =>
    {
      if(caterpillarSprite.visible)
      {
        caterpillarSprite.terminateScaleTween.active = true;
        caterpillarSprite.spawnScaleTween.active = false;
        caterpillarSprite.active = false;
        caterpillarSprite.aliveTimer.reset(false);
      }
    });
    if(powerUp)
    {
      this.spawnTimer.reset(true);
      this.maxCaterpillarsTimer.reset(true);
      this.maxCaterpillars = 1;
    }
    else
    {
      this.spawnTimer.reset(false);
    }
  }
}

class LeafoMeter extends Group
{
  constructor(game, x, y, maxLeaves)
  {
    super(game, x, y);
    this.maxLeaves = maxLeaves;
    this.leaves =  0;
    this.masterScale = 10;
    this.maxForegroundHeight = (this.masterScale * game.gameWorld.tileSize) - 2;
    this.background = new Sprite(game, Sprite.Type.SPRITE_SHEET, 'lo1', 0, 0, true, false);
    this.foreGround = new Sprite(game, Sprite.Type.SPRITE_SHEET, 'lo2', 0, 0, true, false);
    this.background.scale.y = this.masterScale;
    this.addChild(this.background);
    this.addChild(this.foreGround);
    this.onMaxedOut = new Signal(game, this);
    this.setLeafoMeter();
  }
  setLeafoMeter()
  {
    let scaleToDim = (1 - (this.leaves / this.maxLeaves)) * this.maxForegroundHeight;
    this.foreGround.scale.y = scaleToDim / (this.game.gameWorld.tileSize - 2);
    this.foreGround.position.y = (scaleToDim / 2) - (this.maxForegroundHeight / 2);
    if(this.leaves === this.maxLeaves)
    {
      this.onMaxedOut.dispatch();
    }
  }
}

class PlayerSpritePool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new PlayerSprite(objectArgs.game,
        objectArgs.x, objectArgs.y);
  }
}

class CaterpillarSpawnGroupPool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new CaterpillarSpawnGroup(objectArgs.game, objectArgs.x, objectArgs.y,
        objectArgs.total);
  }
}

class CaterpillarSpritePool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new CaterpillarSprite(objectArgs.game, objectArgs.x, objectArgs.y);
  }
}

class LeafSpriteGroupPool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new LeafSpriteGroup(objectArgs.game, objectArgs.x, objectArgs.y);
  }
}

class PowerUpSpriteGroupPool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new PowerUpSpriteGroup(objectArgs.game, objectArgs.x, objectArgs.y);
  }
}

class LeafSpritePool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new LeafSprite(objectArgs.game, objectArgs.x, objectArgs.y);
  }
}
class PowerUpSpritePool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new PowerUpSprite(objectArgs.game, objectArgs.x, objectArgs.y);
  }
}
class RainSpriteGroupPool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new RainSpriteGroup(objectArgs.game, objectArgs.x, objectArgs.y);
  }
}

var myGame = new MyGame(38, 18, 32);
myGame.preload();
