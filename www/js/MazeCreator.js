class MazeCreator
{
  constructor(gridSquarePool, gridPathPool, gridPathFinderPool)
  {
    this.gridSquarePool = gridSquarePool;
    this.gridPathPool = gridPathPool;
    this.gridPathFinderPool = gridPathFinderPool;
    this.fillGrid = null;
    this.chamberSize = 3;
    this.chamberEntrances = [];
  }
  _doChamberPoints(chambers, gridPoints)
  {
    let roundHalfChamberSize = Math.round(this.chamberSize / 2);
    let floorHalfChamberSize = Math.floor(this.chamberSize / 2);
    let chamberSpacing = 2;
    let possibleChamberPoints = [];
    let chamberPoints = [];

    for(let x = (chamberSpacing - 1) + roundHalfChamberSize; x < this.fillGrid.xDim - chamberSpacing - roundHalfChamberSize; x++)
    {
      for(let y = (chamberSpacing - 1) + roundHalfChamberSize; y < this.fillGrid.yDim - chamberSpacing - roundHalfChamberSize; y++)
      {
        possibleChamberPoints.push(new Point(x, y));
      }
    }
    let addChamberPoint = (point) =>
    {
      chamberPoints.push(new Point(point.x, point.y));
      for(let x = point.x - floorHalfChamberSize; x < point.x + floorHalfChamberSize; x++)
      {
        for(let y = point.y - floorHalfChamberSize; y < point.y + floorHalfChamberSize; y++)
        {
          this._removePoint(possibleChamberPoints,new Point(x, y));
        }
      }
    };
    //do
    while(chambers > 0 && possibleChamberPoints.length > 0)
    {
      let ranPoint = MathsFunctions.RandomPick(possibleChamberPoints);
      if(chamberPoints.length === 0)
      {
        addChamberPoint(ranPoint);
        chambers --;
      }
      else if(chamberPoints.some((chamberPoint) =>
      {
        if(Math.abs(ranPoint.x - chamberPoint.x) < this.chamberSize * 2 &&
            Math.abs(ranPoint.y - chamberPoint.y) < this.chamberSize * 2)
        {
          return true;
        }

      }))
      {
        this._removePoint(possibleChamberPoints, ranPoint);
      }
      else
      {
        addChamberPoint(ranPoint);
        chambers --;

      }
    }
    //while(chambers > 0 && possibleChamberPoints.length > 0)
    chamberPoints.forEach((chamberPoint) =>
    {
      for(let x = chamberPoint.x - floorHalfChamberSize; x < chamberPoint.x + floorHalfChamberSize + 1; x++)
      {
        for(let y = chamberPoint.y -floorHalfChamberSize; y < chamberPoint.y + floorHalfChamberSize + 1; y++)
        {
          let fillObj = this.fillGrid.grid[x][y];
          fillObj.filled = true;
          fillObj.joinable = false;
          fillObj.enclosed.forEach((val, index) =>
          {
            fillObj.enclosed[index] = false;
          });
          this._removePoint(gridPoints, new Point(x, y));
        }
      }
    });
    return chamberPoints
  }
  makeMaze(xDim, yDim, chambers = 0)
  {
    this.fillGrid = new FillGrid(xDim, yDim);
    let gridPoints = [];
    let gridPointsCopy = [];
    let joinablePoints = [];
    for(let x = 0; x < this.fillGrid.xDim; x ++)
    {
      for(let y = 0; y < this.fillGrid.yDim; y++)
      {
        gridPoints.push(new Point(x, y));
      }
    }

    let chamberPoints = this._doChamberPoints(chambers, gridPoints);

    let ranPoint = MathsFunctions.RandomPick(gridPoints);
    let start = new Point().setTo(ranPoint);
    ranPoint = MathsFunctions.RandomPick(gridPoints);
    let end = new Point().setTo(ranPoint);
    let done = false;
    //debugger;

    do
    {
      let gridPathFinder = this.gridPathFinderPool.obtain({fillGrid: this.fillGrid, start: start,
          end: end, gridPaths: null, gridSquarePool: this.gridSquarePool,
          gridPathPool: this.gridPathPool});
      let obj = gridPathFinder.process();
      if(obj.pathActive)
      {
        let gridPath = gridPathFinder.gridPaths[obj.pathIndex];
        let prevDir = Direction.Directions.NONE;
        gridPath.gridSquares.forEach((gridSquare, index) =>
        {
          let fillPoint = this.fillGrid.grid[gridSquare.position.x][gridSquare.position.y];
          if(gridSquare.direction !== Direction.Directions.NONE)
          {
            fillPoint.enclosed[gridSquare.direction - 1] = false;
          }
          if(prevDir !== Direction.Directions.NONE)
          {
            let prevDirPoint = this.fillGrid.directionObj.directions[prevDir - 1].point;
            let enclosedIndex = ArrayFunctions.FindObjectIndex(this.fillGrid.directionObj.directions,
                true, (dir) =>
            {
              let found = false;
              if(dir.point.x === prevDirPoint.x * -1
                  && dir.point.y === prevDirPoint.y * -1)
              {
                found = true;
              }
              return found;
            });
            fillPoint.enclosed[enclosedIndex] = false;
          }
          prevDir = gridSquare.direction;
          fillPoint.filled = true;
          this._removePoint(gridPoints, gridSquare.position);
          joinablePoints.push(new Point(gridSquare.position.x, gridSquare.position.y));
        });
        if(gridPoints.length > 0)
        {
          start.setTo(MathsFunctions.RandomPick(joinablePoints));
          this._removePoint(joinablePoints, start);
          gridPointsCopy = [...gridPoints];
          end.setTo(MathsFunctions.RandomPick(gridPointsCopy));
          this._removePoint(gridPointsCopy, end);
        }
        else
        {
          done = true;
        }
      }
      else if(gridPointsCopy.length > 0)
      {
        end.setTo(MathsFunctions.RandomPick(gridPointsCopy));
        this._removePoint(gridPointsCopy, end);
      }
      else
      {
        start.setTo(MathsFunctions.RandomPick(joinablePoints));
        this._removePoint(joinablePoints, start);
        gridPointsCopy = [...gridPoints];
        end.setTo(MathsFunctions.RandomPick(gridPointsCopy));
        this._removePoint(gridPointsCopy, end);
      }
      this.gridPathFinderPool.free(gridPathFinder);
    }
    while(!done)
    this.chamberEntrances.length = 0;
    chamberPoints.forEach((chamberPoint) =>
    {
      let ranSide = this.fillGrid.directionObj.directions[MathsFunctions.RandomIntInclusive(0, Direction.Directions.S - 1)].point;
      let openSideIndex = ArrayFunctions.FindObjectIndex(this.fillGrid.directionObj.directions, true, (item) =>
      {
        let found = false;
        if(item.point.x === ranSide.x * -1 && item.point.y === ranSide.y * -1)
        {
          found = true;
        }
        return found;
      });
      let xOffset = (Math.floor(this.chamberSize / 2) + 1) * ranSide.x;
      let yOffest = (Math.floor(this.chamberSize / 2) + 1) * ranSide.y;
      this.chamberEntrances.push(new Point(chamberPoint.x + xOffset, chamberPoint.y + yOffest));
      this.fillGrid.grid[chamberPoint.x + xOffset]
          [chamberPoint.y + yOffest].enclosed[openSideIndex] = false;

    });

    return this.fillGrid;
  }
  _removePoint(gridPoints, point)
  {
    let index = ArrayFunctions.FindObjectIndex(gridPoints, true, (gridPoint) =>
    {
      let found = false;
      if(gridPoint.x === point.x && gridPoint.y === point.y)
      {
        found = true;
      }
      return found;
    });
    if(index >= 0)
    {
      gridPoints.splice(index, 1);
    }
  }
}
