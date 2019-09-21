class Brick
{
  constructor(x,y,size,col)
  {
    this.x = x;
    this.y = y;
    this.size = size;
    this.col = col;
  }
  show()
  {
    fill(this.col);
    noStroke();
    rect(this.x,this.y,this.size,this.size);
  }
  
  get_pos()
  {
    return createVector(this.x,this.y);
  }
  get_size()
  {
    return this.size;
  }
  
}
