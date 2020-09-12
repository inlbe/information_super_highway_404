class MyGame extends Game
{
  static get Palette()
  {
    let colourObj =
    {
      Pink1: '#ff71ce',
      Pink2: '#ff24b3',
      Pink3: '#d6008d',
      Blue1: '#01cdfe',
      Blue2: '#018fb2',
      Blue3: '#015165',
      Green1: '#05ffa1',
      Green2: '#00b873',
      Green3: '#006b43',
      Purple1: '#b967ff',
      Purple2: '#951aff',
      Purple3: '#6e00cc',
      Yellow1: '#fffb9f'
    }
    return colourObj;
  }
  constructor(xTiles, yTiles, tileSize, isometricProperties)
  {
    super(xTiles, yTiles, tileSize, isometricProperties);
    window.addEventListener("keydown", function(e)
    {
      //arrow keys
      if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }
    }, false);
  }
  preload()
  {
    super.preload();
    let spriteShapes1 = [];
    let spriteShapes2 = [];

    let y = (88 - this.tileSize) / Math.cos(this.isometricProperties.ang);
    spriteShapes1.push(this.isometricCube(this.tileSize / 2, y, 35, 'w0', 1, this.tileSize / 2));
    spriteShapes1.push(this.isometricCube(this.tileSize, y, 35, 'w1', 2));
    spriteShapes1.push(this.isometricCube(this.tileSize / 2, y, 35, 'w2', 1));
    spriteShapes1.push(this.isometricCube(this.tileSize, y, 35, 'w3', 4));
    spriteShapes1.push(this.isometricCube(this.tileSize, y, 35, 'w4', 8));
    spriteShapes1.push(this.isometricCube(this.tileSize, y, 35, 'w5', 16));
    spriteShapes1.push(this.isometricCube(this.tileSize, y, 35, 'w6', 32));
    spriteShapes1.push([MyShape.Rectangle(0, 0, 0, 0, 'w7', MyGame.Palette.Pink1)]);

    spriteShapes1.push(this.isometricCube(this.tileSize / 3, y / 8, 35, 'pg', 7, 0, 0,
        MyGame.Palette.Green1, MyGame.Palette.Green2, MyGame.Palette.Green3));

    spriteShapes1.push(this.isometricCube(this.tileSize * (2/3), y * (2/3), 35, 'p1', 7, 0, 0,
        MyGame.Palette.Blue1, MyGame.Palette.Blue2, MyGame.Palette.Blue3));

    spriteShapes1.push(this.isometricCube(this.tileSize * (2/3), y * (2/3), 35, 'p2', 7, 0, 0,
       MyGame.Palette.Purple1, MyGame.Palette.Purple2, MyGame.Palette.Purple3));


    spriteShapes2.push([MyShape.Rectangle(0, 0, this.gameWorld.camera.width,
        this.gameWorld.camera.height, 'b', MyGame.Palette.Yellow1)]);

    this.addSpriteSheet(new SpriteSheet(10, 88,
        81, spriteShapes1));
    this.addSpriteSheet(new SpriteSheet(1, this.gameWorld.camera.width,
        this.gameWorld.camera.height, spriteShapes2));
    this.loadSpriteSheets();

  }
  create()
  {
    super.create();
    let background = new Background(this, 0, 0);
    this.gameWorld.addChild(background);
    let titleGroup = new TitleGroup(this, 0, 0);
    background.addChild(titleGroup);
    let gameGroup = new GameGroup(this, 0, 0);
    gameGroup.setVisible(false);
    background.addChild(gameGroup);
    this.gameWorld.start();
    this.gameWorld.events.onKeyDown = () =>
    {
      if(titleGroup.visible)
      {
        titleGroup.setVisible(false);
        gameGroup.setVisible(true);
        gameGroup.newLevel();
      }
    }
  }
  isometricCube(x, y, z, frame, sides = 7, xOffset = 0, yOffset = 0, colour1 = MyGame.Palette.Pink1,
      colour2 = MyGame.Palette.Pink2, colour3 = MyGame.Palette.Pink3)
  {
    let a = y * Math.sin(this.isometricProperties.ang);
    let b = y * Math.cos(this.isometricProperties.ang);
    let out = [];
    let outFrame = frame;

    if(sides & 1)
    {
      out.push(MyShape.Rectangle(0, a, x, z, outFrame, colour1));
      outFrame = '';
    }
    if(sides & 2)
    {
      out.push(new MyShape([new Point(b + x, 0), new Point(b + x, z), new Point(x, a + z), new Point(x, a), new Point(b + x, 0)], outFrame, colour3));
      outFrame = '';
    }
    if(sides & 4)
    {
      out.push(new MyShape([new Point(b, 0), new Point(b + x, 0), new Point(x, a), new Point(0, a), new Point(b, 0)], outFrame, colour2));
    }
    if(sides & 8)
    {
      out.push(new MyShape([new Point(b + x, 0), new Point(x, a), new Point(0, a), new Point(b + x, 0)], outFrame, colour2));
    }
    if(sides & 16)
    {
      out.push(new MyShape([new Point(b, 0), new Point(b + x, 0), new Point(0, a), new Point(b, 0)], outFrame, colour2));
    }
    if(sides & 32)
    {
      out.push(new MyShape([new Point(b + x, 0), new Point(b + x, z), new Point(0, a + z), new Point(0, a), new Point(b + x, 0)], outFrame, colour3));
    }

    out.forEach((myShape) =>
    {
      myShape.points.forEach((point) =>
      {
        point.x += xOffset;
        point.y += yOffset;
      })
    })
    return out;

  }
}

class Level
{
  constructor(enemys, pages, size, chambers)
  {
    this.enemys = enemys;
    this.pages = pages;
    this.size = size;
    this.chambers = chambers;
  }
}

class TextSprite extends Sprite
{
  constructor(game, x, y, text, fillStyle = MyGame.Palette.Green1, fontSize = 32)
  {
    super(game, Sprite.Type.TEXT, {font: 'bold ' + fontSize + 'px serif', text: text, fillStyle: fillStyle},
    x, y, true);
  }
}

class Background extends Group
{
  constructor(game, x, y)
  {
    super(game, x, y);
    this.background = new Sprite(game, Sprite.Type.SPRITE_SHEET, ['b'], 0, 0, false,
        game.spriteSheets[1]);
    this.addChild(this.background);
  }
  update()
  {
    this.background.position.x = this.game.gameWorld.camera.position.x;
    this.background.position.y = this.game.gameWorld.camera.position.y;
  }
}

class TitleGroup extends Group
{
  constructor(game, x, y)
  {
    super(game, x, y);
    let triPoints =
    [
      new Point(0,0),
      new Point(450, 250),
      new Point(90, 425),
      new Point(0, 0)
    ];
    let triShape = new MyShape(triPoints, '', MyGame.Palette.Purple1)
    let tri = new Sprite(game, Sprite.Type.MY_SHAPE, [triShape], x, y, true, false);
    tri.width = 450;
    tri.height = 425;
    tri.position.x = (game.gameWorld.camera.width - tri.width) / 2;
    tri.position.y = (game.gameWorld.camera.height - tri.height) / 2;
    this.addChild(tri);
    let titleText = new TextSprite(game, 0, 0, "Information Super Highway", undefined, game.tileSize);
    titleText.position.x = (game.gameWorld.camera.width - titleText.width) / 2;
    this.addChild(titleText);

    let playText = new TextSprite(game, 0, 0, "Press any key");
    playText.position.x = (game.gameWorld.camera.width - playText.width) / 2;
    playText.position.y = game.gameWorld.camera.height - (playText.height * 2);
    this.addChild(playText);

    let tile1 = ['w0', 'w1', 'w2'];
    let tile2 = ['w6', 'w6', 'w7'];
    let slope1 = [...tile2].concat(['w4']);
    let flat = [...tile1].concat(['w3']);
    let slope2 = [...tile2].concat(['w5']);
    let tiles = [[], flat, slope1, slope2];
    let numSize = 5;
    let pad = 1;
    let four =
    [
      [0,0,2,1,0],
      [0,2,3,1,0],
      [2,3,0,1,0],
      [1,1,1,1,1],
      [0,0,0,1,0]
    ];

    let zero =
    [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ];

    let numbers = [four, zero, four];
    let isoMaps = [];

    numbers.forEach((number) =>
    {
      let isoMap = new IsoTilemap(game);
      let mapData = new MyGrid(numSize, numSize, {frames: [], wall: false,
          isometric: true});
      for(let x = 0; x < numSize; x++)
      {
        for(let y = 0; y < numSize; y++)
        {
          if(number[y][x])
          {
            let cell = mapData.grid[x][y];
            cell.wall = true;
            cell.frames = tiles[number[y][x]];
          }
        }
      }
      isoMap.createTileSprites(mapData);
      isoMap.width = mapData.xDim * game.tileSize;
      isoMap.height = mapData.yDim * game.tileSize;
      this.addChild(isoMap);
      isoMaps.push(isoMap);
    });
    let totalWidth = ((isoMaps.length * numSize) + ((isoMaps.length - 1) * pad)) * game.tileSize;

    isoMaps.forEach((isoMap, index) =>
    {

      isoMap.position.y = (this.game.gameWorld.camera.height - isoMap.height) / 2;
      isoMap.position.y += ((isoMap.position.y + isoMap.height * 0.5) / game.tileSize) * -game.isometricProperties.xOffsetPerTile;
      isoMap.position.x = (((isoMap.position.y + isoMap.height * 0.5)
         / game.tileSize) * -game.isometricProperties.xOffsetPerTile) +
         ((game.gameWorld.camera.width - totalWidth) / 2) + ((totalWidth / isoMaps.length) * index);
    });

    let moveTween1 = game.gameWorld.addTween(new MoveTween(isoMaps[0], 1, 0, Tween.CONST_SPEED,
        new Point(isoMaps[0].position.x, -isoMaps[0].height),
        new Point(isoMaps[0].position.x, isoMaps[0].position.y)));
    moveTween1.active =  true;

    let moveTween2 = game.gameWorld.addTween(new MoveTween(isoMaps[1], 1, 0, Tween.CONST_SPEED,
        new Point(isoMaps[1].position.x, game.gameWorld.camera.height + isoMaps[1].height),
        new Point(isoMaps[1].position.x, isoMaps[1].position.y)));
    moveTween2.active =  true;

    let moveTween3 = game.gameWorld.addTween(new MoveTween(isoMaps[2], 1, 0, Tween.CONST_SPEED,
        new Point(isoMaps[2].position.x, -isoMaps[2].height),
        new Point(isoMaps[2].position.x, isoMaps[2].position.y)));
    moveTween3.active =  true;
  }
}


class GameGroup extends Group
{
  constructor(game, x, y)
  {
    super(game, x, y);
    let collisionGrid = new CollisionGrid(game, 100, 100);
    game.gameWorld.collisionGrid = collisionGrid;
    this.isoMap = new IsoTilemap(game);
    this.addChild(this.isoMap);
    game.gameWorld.isoTilemaps.push(this.isoMap);
    let mazeCreator = new MazeCreator();
    let playerSpritePool = new PlayerSpritePool();
    let enemySpritePool = new EnemySpritePool();
    let pagePool = new PagePool();
    let miniMapPool = new MiniMapPool();
    let miniMap = null;
    let player = null;
    let pageSprites = [];
    let enemySprites = [];
    let invisibleWallSprites = [];
    let pickProportion = 0.1;
    let pickAmount = 0;
    let mapTimer = new Timer(0.1);
    game.gameWorld.timers.push(mapTimer);
    let onMapAllVisible = new Signal(game, this);
    let onNewPath = new Signal(game, this);
    onMapAllVisible.addListener(this, () =>
    {
      enemySprites.forEach((enemySprite) =>
      {
        enemySprite.navigate();
      });
      player.startFlashing();
    });
    mapTimer.onComplete = () =>
    {
      let picks = pickAmount;
      if(invisibleWallSprites.length < picks)
      {
        picks = invisibleWallSprites.length;
      }
      do
      {
        let pickedIndex = MathsFunctions.RandomInt(0, invisibleWallSprites.length);
        invisibleWallSprites[pickedIndex].setVisible(true);
        invisibleWallSprites.splice(pickedIndex, 1);
        picks --;
      } while (picks > 0);
      if(invisibleWallSprites.length === 0)
      {
        onMapAllVisible.dispatch();
      }
      else
      {
        mapTimer.reset(true);
      }
    }

    let levels =
    [
      new Level(10, 5, 5, 0),
      new Level(15, 7, 8, 0),
      new Level(50, 10, 10, 1),
      new Level(70, 13, 14, 2),
      new Level(100, 16, 20, 3)
    ];

    let currentLevel = 0;

    let generateMapData = (frames, fillGrid, spacing = 1) =>
    {
      let mapXDim = (fillGrid.xDim * (spacing + 1)) + 1;
      let mapYDim = (fillGrid.yDim * (spacing + 1)) + 1;
      let mapData = new MyGrid(mapXDim, mapYDim, {frames: [], wall: false,
          isometric: true});
      let mapFillGrid = new FillGrid(mapXDim, mapYDim);
      fillGrid.grid.forEach((col, x) =>
      {
        col.forEach((cell, y) =>
        {
          cell.enclosed.forEach((val, index) =>
          {
            if(val)
            {
              let dir = mazeCreator.fillGrid.directionObj.directions[index].point;
              let mapCell = null;
              let ax = (spacing + 1) * x;
              let ay = (spacing + 1) * y;
              let cx = ax + (1 + (spacing / 2));
              let cy = ay + (1 + (spacing / 2));
              let d = cx - (((spacing + 1) * x) + 1);
              for(let i = -d - 1; i < d + 1; i++)
              {
                let xGrid = cx + (i * (1 - Math.abs(dir.x))) + (dir.x * (d + Math.abs(Math.min(dir.x, 0))));
                let yGrid = cy + (i * (1 - Math.abs(dir.y))) + (dir.y * (d + Math.abs(Math.min(dir.y, 0))));
                mapCell = mapData.grid[xGrid][yGrid];
                mapCell.wall = true;
                if(mapCell.frames.length === 0)
                {
                  mapCell.frames = frames;
                  mapFillGrid.grid[xGrid][yGrid].filled = true;
                }
              }
            }
          });
        });
      });
      return {mapData, mapFillGrid};
    }
    let resetLevel = () =>
    {
      mapTimer.reset(false);
      invisibleWallSprites.length = 0;
      this.isoMap.clearTileSprites(game.gameWorld.collisionGrid);
      playerSpritePool.free(player);
      this.isoMap.removeDynamicIsoChild(player);
      game.gameWorld.collisionGrid.removeSprite(player);
      player = null;
      pagePool.freeAll(pageSprites);
      this.isoMap.removeDynamicIsoChildren(pageSprites);
      game.gameWorld.collisionGrid.removeSprites(pageSprites)
      pageSprites.length = 0;
      enemySpritePool.freeAll(enemySprites);
      this.isoMap.removeDynamicIsoChildren(enemySprites);
      game.gameWorld.collisionGrid.removeSprites(enemySprites)
      enemySprites.length = 0;
      miniMapPool.free(miniMap);
      this.removeChild(miniMap);
      miniMap = null;
      onNewPath.listeners.length = 0;
    }
    this.newLevel = (levelObj = levels[currentLevel]) =>
    {
      let resolveMaze = () =>
      {
        return new Promise((resolve) =>
        {
          mazeCreator.onMazeGenerated = (fillGrid) =>
          {
            resolve(fillGrid);
          }
          mazeCreator.makeMaze(levelObj.size, levelObj.size, levelObj.chambers);
        });
      };
      let resolveEnemys = (workers, ends, mapFillGrid) =>
      {
        return new Promise((resolve) =>
        {
          onNewPath.addListener(this, (enemy, worker) =>
          {
            enemySprites.push(enemy);
            game.gameWorld.collisionGrid.addSprite(enemy);
            this.isoMap.addDynamicIsoChild(enemy);
            pavedEnemys ++;
            if(pavedEnemys < levelObj.enemys)
            {
              enemySpritePool.obtain({game: game, x: 0, y: 0, ends: ends,
                  mapFillGrid: mapFillGrid, worker:worker, onNewPath: onNewPath});
            }
            else
            {
              resolve();
            }
          });
          let pavedEnemys = 0;
          workers.forEach((worker) =>
          {
            enemySpritePool.obtain({game: game, x: 0, y: 0, ends: ends,
                mapFillGrid: mapFillGrid, worker:worker, onNewPath: onNewPath});
          });
        });
      };

      let asyncNewLevel = async () =>
      {
        this.game.gameWorld.stop();
        let workers = [];
        let threads = window.navigator.hardwareConcurrency > levelObj.enemys ? levelObj.enemys : window.navigator.hardwareConcurrency;
        for(let i = 0; i < threads; i++)
        {
          workers.push(new Worker('js_webworker_version/WebWorkerTest.js'))
        }
        let fillGrid = await resolveMaze();
        let obj = generateMapData(['w0', 'w1', 'w2', 'w3'], fillGrid, 3);
        this.isoMap.createTileSprites(obj.mapData, game.gameWorld.collisionGrid);
        this.isoMap.setWallSpriteCollisionGroups(PlayerSprite.CollisionID);
        this.isoMap.wallSprites.forEach((spriteArray) =>
        {
          spriteArray.forEach((sprite) =>
          {
            if(sprite.visible)
            {
              sprite.setVisible(false);
              invisibleWallSprites.push(sprite);
            }
          });
        });
        pickAmount = Math.floor(pickProportion * invisibleWallSprites.length);
        mapTimer.reset(true);
        let mapFillGrid = obj.mapFillGrid;
        let ends = [];
        mapFillGrid.forEach((obj, x, y) =>
        {
          if(!obj.filled)
          {
            ends.push(new Point(x, y));
          }
        });
        let ranEnd = MathsFunctions.RandomPick(ends);
        player = playerSpritePool.obtain({game: game, x: ranEnd.x * game.tileSize,
            y: (ranEnd.y * game.tileSize), mapFillGrid: mapFillGrid});
        player.onPickedUpPage.addListener(this,(page) =>
        {
          miniMap.doPickUpPage(page);
          page.setVisible(false);
          page.active = false;
          if(!pageSprites.some((pageSprite) =>
          {
            return(pageSprite.visible)
          }))
          {
            if(currentLevel < levels.length - 1)
            {
              currentLevel ++;
            }
            else
            {
              currentLevel = 0;
            }
            resetLevel();
            this.newLevel(levels[currentLevel]);
          }
        });
        player.onCollidedWithEnemy.addListener(this, () =>
        {
          resetLevel();
          this.newLevel(levels[currentLevel]);
        });
        game.gameWorld.collisionGrid.addSprite(player);
        await resolveEnemys(workers, ends, mapFillGrid);
        workers.forEach((worker) =>
        {
          worker.terminate();
        });
        workers.length = 0;
        let endsClone = [...ends];
        for(let i = 0; i < levelObj.pages; i++)
        {
          let endIndex = MathsFunctions.RandomInt(0, endsClone.length);
          let end = endsClone[endIndex];
          let page = pagePool.obtain({game: game, xGrid: end.x, yGrid: end.y});
          pageSprites.push(page);
          endsClone.splice(endIndex, 1);
          game.gameWorld.collisionGrid.addSprite(page);
          this.isoMap.addDynamicIsoChild(page);
        }
        miniMap = miniMapPool.obtain({game: game, x: 0, y: 0, mapFillGrid: mapFillGrid,
            pageSprites: pageSprites, player: player});
        this.addChild(miniMap);
        this.isoMap.addDynamicIsoChild(player);
        this.game.gameWorld.start();
      }
      asyncNewLevel();
    }
  }
}
class BaseIsoSprite extends Sprite
{
  constructor(game, frames, x, y,width = game.tileSize * (2/3),
      height = game.tileSize * (2/3))
  {
    super(game, Sprite.Type.SPRITE_SHEET, frames, x, y, false, undefined, true,
        width, height);
    this.onSet = new Signal(game, this);
  }
  doCollide()
  {

  }
}

class Page extends BaseIsoSprite
{
  static get CollisionID()
  {
    return 1 << 5;
  }
  constructor(game, xGrid, yGrid)
  {
    super(game, ['pg'], 0 , 0, game.tileSize / 3, game.tileSize / 8);
    this.position.x = (xGrid * game.tileSize) + ((game.tileSize - this.width) / 2);
    this.position.y = (yGrid * game.tileSize) + ((game.tileSize - this.height) / 2);
    this.solid = false;

  }
  set(objectArgs)
  {
    super.set(objectArgs);
    this.position.x = (objectArgs.xGrid * this.game.tileSize) + ((this.game.tileSize - this.width) / 2);
    this.position.y = (objectArgs.yGrid * this.game.tileSize) + ((this.game.tileSize - this.height) / 2);
  }
}

class PlayerSprite extends BaseIsoSprite
{
  static get CollisionID()
  {
    return 1 << 1;
  }
  constructor(game, x, y, mapFillGrid)
  {
    super(game,['p2'], x, y);
    this.position.x += (game.tileSize - this.width) / 2;
    this.position.y += (game.tileSize - this.height) / 2;
    this.onPickedUpPage = new Signal(game, this);
    this.onCollidedWithEnemy = new Signal(game, this);
    this.moveSpeed = this.game.tileSize * 3;
    let startScalePoint = new Point(1, 1);
    let endScalePoint = new Point(0, 0);
    let scaleTween = game.gameWorld.addTween(new ScaleTween(this, 0.5, 0, Tween.CONST_SPEED,
        startScalePoint, endScalePoint));
    let alphaTween = this.game.gameWorld.addTween(new AlphaTween(this, 0.2, 11, Tween.CONST_SPEED, 1, 0.2));
    let invincible = true;
    this.processKeys = false;
    this.isoZ = 1;
    alphaTween.onComplete = () =>
    {
      invincible = false;
    }
    scaleTween.onComplete = () =>
    {
      this.onCollidedWithEnemy.dispatch();
    }
    this.onSet.addListener(this, () =>
    {
      scaleTween.setStartEnd(startScalePoint, endScalePoint);
      scaleTween.active = false;
      alphaTween.setStartEnd(1, 0.2);
      invincible = true;
      this.keyStates.left = false;
      this.keyStates.right = false;
      this.keyStates.up = false;
      this.keyStates.down = false;
    });
    this.startFlashing = () =>
    {
      this.processKeys = true;
      alphaTween.active = true;
    }
    this.mapSize = new Point(0, 0);
    this.mapSize.x = mapFillGrid.xDim * game.tileSize;
    this.mapSize.y = mapFillGrid.yDim * (game.tileSize + (game.isometricProperties.yOffsetPerTile + 1));
    this.onCollide.addListener(this, (sprite, collisionSprite) =>
    {
      if(!invincible && !scaleTween.active &&
          collisionSprite.constructor.CollisionID === EnemySprite.CollisionID)
      {
        scaleTween.active = true;
      }
      else if(collisionSprite.constructor.CollisionID === Page.CollisionID)
      {
        this.onPickedUpPage.dispatch(collisionSprite);
      }
    });
    this.keyStates =
    {
      left: false,
      right: false,
      up: false,
      down: false
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
      else if(event.keyCode === 40 || event.key === 's' || event.key === 'S')
      {
        this.keyStates.down = true;
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
      else if(event.keyCode === 40 || event.key === 's' || event.key === 'S')
      {
        this.keyStates.down = false;
      }
    });
    this.collisionGroup = WallSprite.CollisionID + EnemySprite.CollisionID + Page.CollisionID;
  }
  update(deltaTimeSec)
  {
    if(this.processKeys)
    {
      this.speed.x = 0;
      this.speed.y = 0;
      if(this.keyStates.right)
      {
        this.speed.x = this.moveSpeed;
      }
      else if(this.keyStates.left)
      {
        this.speed.x = -this.moveSpeed;
      }
      if(this.keyStates.up)
      {
        this.speed.y = -this.moveSpeed;
      }
      else if(this.keyStates.down)
      {
        this.speed.y = this.moveSpeed;
      }
    }

    if(this.mapSize.x < this.game.canvas.width)
    {
      this.game.gameWorld.camera.position.x = this.isoTranX;
    }
    else if(this.centre.x + (this.game.canvas.width / 2) > this.mapSize.x)
    {
      this.game.gameWorld.camera.position.x = this.mapSize.x + this.isoTranX - this.game.canvas.width;
    }
    else if(this.centre.x > (this.game.canvas.width / 2))
    {
      this.game.gameWorld.camera.position.x = this.centre.x + this.isoTranX - (this.game.canvas.width / 2);
    }
    else
    {
      this.game.gameWorld.camera.position.x = this.isoTranX;
    }

    if(this.mapSize.y < this.game.canvas.height)
    {
      this.game.gameWorld.camera.position.y = 0;
    }
    else if(this.centre.y + this.isoTranY + (this.game.canvas.height / 2) > this.mapSize.y)
    {
      this.game.gameWorld.camera.position.y = this.mapSize.y - (this.game.canvas.height);
    }
    else if(this.centre.y + this.isoTranY > (this.game.canvas.height / 2))
    {
      this.game.gameWorld.camera.position.y = this.centre.y + this.isoTranY - (this.game.canvas.height / 2);
    }
    else
    {
      this.game.gameWorld.camera.position.y = 0;
    }
  }
  reset()
  {
    super.reset();
    this.onPickedUpPage.listeners.length = 0;
    this.onCollidedWithEnemy.listeners.length = 0;
  }
  set(objectArgs)
  {
    super.set(objectArgs);
    this.mapSize.x = objectArgs.mapFillGrid.xDim * this.game.tileSize;
    this.mapSize.y = objectArgs.mapFillGrid.yDim * (this.game.tileSize + (this.game.isometricProperties.yOffsetPerTile + 1));
    this.position.x += (this.game.tileSize - this.width) / 2;
    this.position.y += (this.game.tileSize - this.height) / 2;
    this.scale.x = 1;
    this.scale.y = 1;
    this.processKeys = false;
    this.onSet.dispatch();
  }
}

class EnemySprite extends BaseIsoSprite
{
  static get CollisionID()
  {
    return 1 << 2;
  }
  constructor(game, x, y, ends, mapFillGrid, worker, onNewPath)
  {
    super(game,['p1'], x, y);
    this.isoZ = 1;
    let reversing = false;
    let _ends = ends;
    let _mapFillGrid = mapFillGrid;
    let _worker = worker;
    let _onNewPath = onNewPath;

    this.onSet.addListener(this, (ends, mapFillGrid, worker, onNewPath) =>
    {
      _ends = ends;
      _mapFillGrid = mapFillGrid;
      _worker = worker;
      _onNewPath = onNewPath;
      navIndex = 0;
      oldDir = null;
      reversing = false;
      newPath();
    });

    let resolveWorker = (fillGrid, start, end) =>
    {
      return new Promise((resolve) =>
      {
        _worker.onmessage = (e) =>
        {
          resolve(e.data);
        }
        _worker.postMessage([fillGrid, start, end]);
      });
    };

    let newPath = async () =>
    {
      let clonedEnds = [..._ends];
      let startPoint = null;
      let startIndex = 0;
      let colGridEmpty = false;
      while(!colGridEmpty)
      {
        startIndex = MathsFunctions.RandomInt(0, clonedEnds.length);
        let gridCell = game.gameWorld.collisionGrid.grid[clonedEnds[startIndex].x][clonedEnds[startIndex].y];
        if(!gridCell.sprites.some((sprite) =>
        {
          if(sprite.constructor.CollisionID === PlayerSprite.CollisionID ||
              sprite.constructor.CollisionID === EnemySprite.CollisionID)
          {
            return true;
          }
        }))
        {
          colGridEmpty = true;
        }
        else
        {
          clonedEnds.splice(startIndex, 1);
        }
      }
      startPoint = clonedEnds[startIndex];
      clonedEnds.splice(startIndex, 1);
      let endPoint = MathsFunctions.RandomPick(clonedEnds);

      currentPath = await resolveWorker(_mapFillGrid, startPoint, endPoint);
      pos = currentPath.gridSquares[navIndex].position;
      this.position.x = (pos.x * game.tileSize) + ((game.tileSize - this.width) / 2);
      this.position.y = (pos.y * game.tileSize) + ((game.tileSize - this.height) / 2);
      _onNewPath.dispatch(this, _worker);
    }
    let currentPath = null
    let navIndex = 0;
    let oldDir = null;
    let pos = null
    let moveSpeed = game.tileSize * 1.5;
    let direction = new Direction();
    newPath();
    this.navigate = () =>
    {
      let reNavigate = false;
      let dir = direction.directions[currentPath.gridSquares[navIndex].direction - 1].point;
      if(oldDir !== dir)
      {
        this.position.x = (this.gridPos.x * game.tileSize) + ((game.tileSize - this.width) / 2);
        this.position.y = (this.gridPos.y * game.tileSize) + ((game.tileSize - this.height) / 2);
      }
      if(reversing)
      {
        this.speed.x = -dir.x * moveSpeed;
        this.speed.y = -dir.y * moveSpeed;
        if(navIndex === 0)
        {
          navIndex = -1;
          reversing = false;
        }
        else
        {
          oldDir = dir;
        }
      }
      else
      {
        this.speed.x = dir.x * moveSpeed;
        this.speed.y = dir.y * moveSpeed;
        if(dir.x === 0 && dir.y === 0)
        {
          reversing = true;
          navIndex --;
          reNavigate = true;
        }
        else
        {
          oldDir = dir;
        }
      }
      return reNavigate;
    }
    this.onGridPosChanged.addListener(this, () =>
    {
      if(reversing)
      {
        navIndex --;
      }
      else
      {
        navIndex ++;
      }
      if(this.navigate())
      {
        this.navigate();
      }
    });
    this.collisionGroup = PlayerSprite.CollisionID;
  }
  reset()
  {
    super.reset();
    this.onCollide.listeners.length = 0;
  }
  set(objectArgs)
  {
    super.set(objectArgs);
    this.onSet.dispatch(objectArgs.ends, objectArgs.mapFillGrid,
        objectArgs.worker, objectArgs.onNewPath);
  }
}

class MiniMap extends Group
{
  constructor(game, x, y, mapFillGrid, pageSprites, player)
  {
    super(game, x, y)
    let wallsLayer = new Sprite(game, Sprite.Type.MY_SHAPE, null, 0, 0, true/*, false*/);
    wallsLayer.frames.length = 0;
    this.addChild(wallsLayer);
    let miniMapPagesLayer = new Group(game, 0, 0);
    this.addChild(miniMapPagesLayer);
    let miniMapPlayerLayer = new Group(game, 0, 0);
    this.addChild(miniMapPlayerLayer);
    let size = this.game.canvas.width / 5;
    let _mapFillGrid = mapFillGrid;
    let gridSize = size / _mapFillGrid.xDim;
    let miniMapPages = [];
    let miniMapPagePool = new MiniMapPagePool();
    let miniMapPlayerPool = new MiniMapPlayerPool();
    let _player = player;
    let miniMapPlayer = null;
    this.onSet = new Signal(game, this);
    this.doPickUpPage = (pageSprite) =>
    {
      let index = ArrayFunctions.FindObjectIndex(miniMapPages, pageSprite, (miniMapPage) =>
      {
        return miniMapPage.pageSprite;
      });
      if(index >= 0)
      {
        let miniMapPage = miniMapPages[index];
        miniMapPagePool.free(miniMapPage);
        miniMapPagesLayer.removeChild(miniMapPage);
        miniMapPages.splice(index, 1);
      }
    }

    this.onSet.addListener(this,(mapFillGrid, player) =>
    {
      ver.length = 0;
      hor.length = 0;
      wallsLayer.frames.length = 0;
      _mapFillGrid = mapFillGrid;
      gridSize = size / _mapFillGrid.xDim;
      miniMapPagePool.freeAll(miniMapPages);
      miniMapPagesLayer.removeChildren(miniMapPages);
      miniMapPages.length = 0;
      _player = player;
      miniMapPlayerPool.free(miniMapPlayer);
      miniMapPlayerLayer.removeChild(miniMapPlayer);
      miniMapPlayer = null;
      generateFrames();
      generateMiniMapPages();
      generateMiniMapPlayer();
    });

    let ver = [];
    let hor = [];
    let generateFrames = () =>
    {
      //do verticals;
      _mapFillGrid.grid.forEach((row, x) =>
      {
        for(let y = 0; y < _mapFillGrid.yDim; y++)
        {
          let obj = _mapFillGrid.grid[x][y];
          if(obj.filled)
          {
            let start = new Point(x, y);
            let end = null;
            let done = false;
            let index = y + 1;
            while(!done && index < _mapFillGrid.yDim)
            {
              let obj2 = _mapFillGrid.grid[x][index];
              if(!obj2.filled || (obj2.filled && index === _mapFillGrid.yDim - 1))
              {
                done = true;
                if(index - y > 1)
                {
                  end = new Point(x, index);
                  if(index === _mapFillGrid.yDim - 1)
                  {
                    end.y ++;
                  }
                  ver.push([start, end]);
                }
              }
              index ++;
            }
            y = index;
          }
        }
      });

      //do horizontals
      for(let y = 0; y < _mapFillGrid.yDim; y++)
      {
        for(let x = 0; x < _mapFillGrid.xDim; x++)
        {
          let obj1 = _mapFillGrid.grid[x][y];
          if(obj1.filled)
          {
            let start = new Point(x, y);
            let end = null;
            let done = false;
            let index = x + 1;
            while(!done && index < _mapFillGrid.xDim)
            {
              let obj2 = _mapFillGrid.grid[index][y];
              if(!obj2.filled || (obj2.filled && index === _mapFillGrid.xDim - 1))
              {
                done = true;
                if(index - x > 1)
                {
                  end = new Point(index, y);
                  if(index === _mapFillGrid.xDim - 1)
                  {
                    end.x ++;
                  }
                  hor.push([start, end]);
                }
              }
              index ++;
            }
            x = index;
          }
        }
      }
      ver.forEach((a) =>
      {
        wallsLayer.frames.push(MyShape.Rectangle(a[0].x * gridSize, a[0].y * gridSize, gridSize, (a[1].y - a[0].y) * gridSize, undefined, MyGame.Palette.Blue1));
      });
      hor.forEach((a) =>
      {
        wallsLayer.frames.push(MyShape.Rectangle(a[0].x * gridSize, a[0].y * gridSize, (a[1].x - a[0].x) * gridSize , gridSize, undefined, MyGame.Palette.Blue1));
      });
    }
    let generateMiniMapPages = () =>
    {
      pageSprites.forEach((pageSprite) =>
      {
        let miniMapPage = miniMapPagePool.obtain({game: game, gridX: pageSprite.gridPos.x,
            gridY: pageSprite.gridPos.y, gridSize: gridSize, pageSprite: pageSprite});
        miniMapPagesLayer.addChild(miniMapPage);
        miniMapPages.push(miniMapPage);
      })
    }
    let generateMiniMapPlayer = () =>
    {
      miniMapPlayer = miniMapPlayerPool.obtain({game: game, gridX: _player.gridPos.x,
          gridY: _player.gridPos.y, gridSize: gridSize, playerSprite: _player});
      miniMapPlayerLayer.addChild(miniMapPlayer);
    }
    generateFrames();
    generateMiniMapPages();
    generateMiniMapPlayer();
  }
  update()
  {
    this.position.x = this.game.gameWorld.camera.position.x;
    this.position.y = this.game.gameWorld.camera.position.y;
  }
  set(objectArgs)
  {
    super.set(objectArgs);
    this.onSet.dispatch(objectArgs.mapFillGrid, objectArgs.player);
  }
}

class MiniMapSprite extends Sprite
{
  constructor(game, gridX, gridY, gridSize, fixed, colour)
  {
    super(game, Sprite.Type.MY_SHAPE, null, 0, 0, fixed);
    this.gridSize = gridSize;
    this.size = gridSize * (3/4);
    this.mapPad = ((gridSize - this.size) / 2);
    this.position.x = (gridX * gridSize) + this.mapPad;
    this.position.y = (gridY * gridSize) + this.mapPad;
    this.colour = colour;
    this.setShape()
  }
  setShape()
  {
    this.frames.length = 0;
    this.frames.push(MyShape.Rectangle(0, 0, this.size, this.size, null, this.colour));
  }
  set(objectArgs)
  {
    super.set(objectArgs);
    this.gridSize = objectArgs.gridSize;
    this.size = objectArgs.gridSize * (3/4);
    this.position.x = (objectArgs.gridX * objectArgs.gridSize) + this.mapPad;
    this.position.y = (objectArgs.gridY * objectArgs.gridSize) + this.mapPad;
    this.setShape();
  }
}

class MiniMapPage extends MiniMapSprite
{
  constructor(game, gridX, gridY, gridSize, pageSprite)
  {
    super(game, gridX, gridY, gridSize, true, MyGame.Palette.Green1);

    this.pageSprite = pageSprite
  }
  set(objectArgs)
  {
    super.set(objectArgs);
    this.pageSprite = objectArgs.pageSprite;
  }
}

class MiniMapPlayer extends MiniMapSprite
{
  constructor(game, gridX, gridY, gridSize, playerSprite)
  {
    super(game, gridX, gridY, gridSize, true, MyGame.Palette.Purple1);
    this.playerSprite = playerSprite;
  }
  update(deltaTime)
  {
    this.position.x = this.playerSprite.position.x * (this.gridSize / this.game.tileSize);
    this.position.y = this.playerSprite.position.y * (this.gridSize / this.game.tileSize);
  }
  set(objectArgs)
  {
    super.set(objectArgs);
    this.playerSprite = objectArgs.playerSprite;
  }
}

class MiniMapPagePool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new MiniMapPage(objectArgs.game,
        objectArgs.gridX, objectArgs.gridY,
        objectArgs.gridSize, objectArgs.pageSprite);
  }
}

class MiniMapPlayerPool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new MiniMapPlayer(objectArgs.game,
        objectArgs.gridX, objectArgs.gridY,
        objectArgs.gridSize, objectArgs.playerSprite);
  }
}

class PagePool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new Page(objectArgs.game,
        objectArgs.xGrid, objectArgs.yGrid);
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
        objectArgs.x, objectArgs.y,
        objectArgs.mapFillGrid);
  }
}

class EnemySpritePool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new EnemySprite(objectArgs.game,
        objectArgs.x, objectArgs.y, objectArgs.ends,
        objectArgs.mapFillGrid, objectArgs.worker,
        objectArgs.onNewPath);
  }
}

class MiniMapPool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new MiniMap(objectArgs.game,
        objectArgs.x, objectArgs.y,
        objectArgs.mapFillGrid, objectArgs.pageSprites,
        objectArgs.player);
  }
}
//got this off stackoverflow
var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;

let ang = Math.atan2(3, 4);
let hyp = 30;
let tileSize = 64
let myGame = new MyGame(x / tileSize, y / tileSize, tileSize, {xOffsetPerTile: -Math.cos(ang) * hyp,
    yOffsetPerTile: -Math.sin(ang) * hyp, ang: Math.atan(23/12)});
myGame.preload();
