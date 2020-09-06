class MapCreator
{
  constructor()
  {
    this.chamberSize = 7;
    this.corridorWidth = 3;
    this.fillGrid = null;
    let
  }
  makeMap(chambers)
  {
    let halfIndex = Math.round(size / 2);
    let fillRect = (x, y, size, doors = 0) =>
    {
      let offset = size / 2;
      for(let i = 0; i < this.fillGrid.directionObj.directions.length - 1; i++)
      {
        for(let j = 0; j < size; j++)
        {
          let point = this.fillGrid.directionObj.directions[i].point;
          if(!(j === halfIndex && doors & 1 << i))
          {
            this.fillGrid.grid[(point.x * offset) + Math.abs(offset * point.x) + x]
                [(point.y * offset) + Math.abs(offset * point.y) + y].filled = true;
          }
        }
      }
      /*
      for(let x = 0; x < width; x++)
      {
        //if(Math.round(x / 2))
      }
      for(let y = 0; y < height; y++)
      {

      }
      */
    }

    let mapSize = (chambers * this.chamberSize) +
        (this.corridorWidth * (chambers + 1)) + 2

    this.fillGrid = new FillGrid(mapSize, mapSize);
    fillRect(0, 0, mapSize);
    for(let x = 0; x < mapSize; x++)
    {
      for(let y = 0; y < mapSize; y++)
      {
        let doors = MathsFunctions.RandomInt(0, 16);
        //fillRect((x * chamberSize) + 
      }
    }
  }
}
