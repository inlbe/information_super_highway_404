class PointPool extends Pool
{
  constructor()
  {
    super();
  }
  obtain(objectArgs)
  {
    return new Point(objectArgs.x, objectArgs.y);
  }
}

class Direction
{
  static get Directions()
  {
    return {E: 1, N: 2, W: 3, S: 4, NONE: 5};
  }
  constructor()
  {
    this.directions = [];
    this.directions.push({id:Direction.Directions.E, point: new Point(1, 0), blockedBy : []},
        {id:Direction.Directions.N, point: new Point(0, -1), blockedBy: []},
        {id:Direction.Directions.W, point: new Point(-1, 0), blockedBy: []},
        {id:Direction.Directions.S, point: new Point(0, 1), blockedBy: []},
        {id:Direction.Directions.NONE, point: new Point(0, 0), blockedBy: []});
  }
  static get DIRECTION_OBJ()
  {
    return new Direction();
  }
}

class BoolGrid
{
  constructor(xDim, yDim)
  {
    this.grid = [];
    this.xDim = xDim;
    this.yDim = yDim;
    for(let x = 0; x < xDim; x++)
    {
      let col = [];
      this.grid.push(col);
      for(let y = 0; y < yDim; y++)
      {
        col.push(false);
      }
    }
  }
  resetGrid()
  {
    this.grid.forEach((col) =>
    {
      for(let i = 0; i < col.length; i++)
      {
        col[i] = false;
      }
    });
  }
}

class FillGrid
{
  constructor(xDim, yDim)
  {
    this.grid = [];
    this.xDim = xDim;
    this.yDim = yDim;
    this.directionObj = Direction.DIRECTION_OBJ;
    for(let x = 0; x < xDim; x++)
    {
      let col = [];
      this.grid.push(col);
      for(let y = 0; y < yDim; y++)
      {
        col.push({filled: false, joinable: false,
          enclosed:
          [
            true,
            true,
            true,
            true
          ]});
      }
    }
  }
  forEach(callback)
  {
    for(let x = 0; x < this.xDim; x++)
    {
      for(let y = 0; y < this.yDim; y++)
      {
        callback(this.grid[x][y], x, y);
      }
    }
  }
}

class GridSquarePool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new GridSquare(objectArgs.position, objectArgs.direction);
  }
}

class GridPathPool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new GridPath(objectArgs.grid, objectArgs.start,
        objectArgs.end, objectArgs.gridSquares, objectArgs.gridSquarePool);
  }
}

class GridPathFinderPool extends Pool
{
  constructor()
  {
    super();
  }
  newObject(objectArgs)
  {
    return new GridPathFinder(objectArgs.fillGrid, objectArgs.start,
        objectArgs.end, objectArgs.gridPaths,
        objectArgs.gridSquarePool, objectArgs.gridPathPool);
  }
}

class GridSquare
{
  constructor(position, direction)
  {
    if(!position)
    {
      this.position = new Point(0,0);
    }
    else
    {
      this.position = new Point(position.x, position.y);
    }
    if(!direction)
    {
      this.direction = Direction.Directions.NONE;
    }
    else
    {
      this.direction = direction;
    }
  }
  reset()
  {
    this.direction = Direction.Directions.NONE;
    this.position.x = 0;
    this.position.y = 0;
  }
  set(objectArgs)
  {
    this.position.setTo(objectArgs.position);
    this.direction = objectArgs.direction;
  }
}

class GridPath
{
  static get Status()
  {
    return {DEAD_END: 1, REACHED_END:2, OK:4, OK_NO_FORK:8};
  }
  constructor(grid, start, end, gridSquares, gridSquarePool)
  {
    this.grid = grid;
    if(start)
    {
      this.start = new Point(start.x, start.y);
    }
    else
    {
      this.start = new Point(0,0);
    }
    if(end)
    {
      this.end = new Point(end.x, end.y);
    }
    else
    {
      this.end = new Point(0,0);
    }
    this.gridSquarePool = gridSquarePool;

    if(!gridSquares)
    {
      this.gridSquares = new Array();
      this.gridSquares.push(this.gridSquarePool.obtain({position: start, direction: Direction.Directions.NONE}));
    }
    else
    {
      //copy into new GridSquare array omit last element
      this.gridSquares = new Array();
      for(let i = 0; i < gridSquares.length - 1; i++)
      {
        this.gridSquares.push(this.gridSquarePool.obtain({position: gridSquares[i].position,
            direction: gridSquares[i].direction}));
      }
    }
    this.reachedEnd = false;
    this.deadEnd = false;
  }
  scout(squaresVisited)
  {
    let noCollide = (testPoint, direction) =>
    {
      let returnVal = GridPath.Status.OK;
      if(squaresVisited.grid[testPoint.x][testPoint.y])
      {
        this.deadEnd = true;
      }
      else
      {
        squaresVisited.grid[testPoint.x][testPoint.y] = true;
      }
      refGridSquare.direction = direction.id;
      this.gridSquares.push(this.gridSquarePool.obtain({position: testPoint,
          direction: Direction.Directions.NONE}));
      return returnVal;
    };
    let refGridSquare = this.gridSquares[this.gridSquares.length - 1];
    let index = 0;
    let testPoint = new Point(0, 0);
    if(refGridSquare.direction !== Direction.Directions.NONE)
    {
      index = refGridSquare.direction;
    }
    for(let i = index; i < Direction.Directions.S; i++)
    {
      let direction = this.grid.directionObj.directions[i];
      testPoint.setTo(refGridSquare.position.addNew(direction.point));
      if(testPoint.x < this.grid.xDim && testPoint.x >= 0 &&
          testPoint.y < this.grid.yDim && testPoint.y >= 0)
      {
        let collide = this.isCollide(testPoint);
        if((!collide) &&
            !this._hasBeen(testPoint))
        {
          if(this.isAtEnd(testPoint))
          {
            refGridSquare.direction = direction.id;
            this.reachedEnd = true;
            this.gridSquares.push(this.gridSquarePool.obtain({position: testPoint,
                direction: Direction.Directions.NONE}));
            return GridPath.Status.REACHED_END;
          }
          else
          {
            return noCollide(testPoint, direction);
          }
        }
      }
    }
    this.deadEnd = true;
    return GridPath.Status.DEAD_END;
  }
  _hasBeen(testPoint)
  {
    let hasBeen = false;
    for(let i = 0; i < this.gridSquares.length; i++)
    {
      if(this.gridSquares[i].position.x === testPoint.x &&
          this.gridSquares[i].position.y === testPoint.y)
      {
        hasBeen = true;
        break;
      }
    }
    return hasBeen;
  }
  reset()
  {
    this.gridSquarePool.freeAll(this.gridSquares);
    this.gridSquares.length = 0;
    this.reachedEnd = false;
    this.deadEnd = false;
  }
  set(objectArgs)
  {
    this.start.setTo(objectArgs.start);
    this.end.setTo(objectArgs.end);
    this.grid = objectArgs.grid;
    if(!objectArgs.gridSquares)
    {
      this.gridSquares.push(this.gridSquarePool.obtain({position: objectArgs.start,
          direction: Direction.Directions.NONE}));
    }
    else
    {
      //copy into new GridSquare array omit last element
      for(let i = 0; i < objectArgs.gridSquares.length - 1; i++)
      {
        this.gridSquares.push(this.gridSquarePool.obtain({position: objectArgs.gridSquares[i].position,
            direction: objectArgs.gridSquares[i].direction}));
      }
    }
  }
  isCollide(testPoint)
  {
    return this.grid.grid[testPoint.x][testPoint.y].filled;
  }
  isAtEnd(testPoint)
  {
    let end = false;
    if(testPoint.compare(this.end))
    {
      end = true;
    }
    return end;
  }
}

class GridPathFinder
{
  constructor(fillGrid, start, end, gridPaths,
      gridSquarePool, gridPathPool)
  {
    this.fillGrid = fillGrid;
    this.gridSquarePool = gridSquarePool;
    this.gridPathPool = gridPathPool;

    if(!start)
    {
      start = new Point(0,0);
    }
    if(!end)
    {
      end = new Point(0, 0);
    }
    this.tilesVisited = new BoolGrid(fillGrid.xDim, fillGrid.yDim);
    if(!gridPaths)
    {
      this.gridPaths = new Array();
      this.gridPaths.push(this.gridPathPool.obtain(
              {grid: fillGrid,start: start,end: end,gridSquares: null,gridSquarePool: this.gridSquarePool}));
    }
    else
    {
      this.gridPaths = gridPaths;
    }
  }
  process()
  {
    let index = 0;
    let pathIndex = 0;
    let finished = false;
    let outcome = null;
    let pathActive = false; //at least one path active
    if(this.gridPaths[0].start.compare(this.gridPaths[0].end))
    {
      //start equals ends
      finished = true;
      pathActive = true;
    }
    else
    {
      do
      {
        if (!this.gridPaths[index].reachedEnd &&
            !this.gridPaths[index].deadEnd)
        {
          outcome = this.gridPaths[index].scout(this.tilesVisited);
          if(outcome === GridPath.Status.OK)
          {
            //fork new path
            this.gridPaths.push(this.gridPathPool.obtain({grid: this.fillGrid,start: this.gridPaths[index].start,
                end: this.gridPaths[index].end, gridSquares: this.gridPaths[index].gridSquares,
                gridSquarePool: this.gridSquarePool}));
            index ++;
            if(!pathActive)
            {
              pathActive = true;
            }
          }
          else if(outcome === GridPath.Status.OK_NO_FORK)
          {
            if(!pathActive)
            {
              pathActive = true;
            }
          }
          else if(outcome === GridPath.Status.REACHED_END)
          {
            pathIndex = index;
            finished = true;
            if(!pathActive)
            {
              pathActive = true;
            }
          }
        }
        else if(index < this.gridPaths.length - 1)
        {
          index ++;
        }
        else
        {
          if(!pathActive)
          {
            // no active paths
            finished = true;
          }
          else
          {
            index = 0;
            pathActive = false;
          }
        }
      }while(!finished)
    }
    return {pathActive: pathActive, pathIndex: pathIndex};
  }
  set(objectArgs)
  {
    this.fillGrid = objectArgs.fillGrid;
    this.gridPaths.push(this.gridPathPool.obtain({grid: this.fillGrid, start: objectArgs.start,
        end: objectArgs.end, gridSquares: null, gridSquarePool: this.gridSquarePool}));
    if(this.fillGrid.xDim !== this.tilesVisited.xDim ||
        this.fillGrid.yDim !== this.tilesVisited.yDim)
    {
      this.tilesVisited = new BoolGrid(this.fillGrid.xDim, this.fillGrid.yDim);
    }
    else
    {
      this.tilesVisited.resetGrid(); //reset grid
    }
  }
  reset()
  {
    this.gridPathPool.freeAll(this.gridPaths);
    this.gridPaths.length = 0;
  }
}
