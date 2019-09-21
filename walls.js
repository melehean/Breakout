class Walls
{
  constructor(x,y,thickness,col)
  {
    this.thickness = thickness;
    this.col = col;
    this.x = x;
    this.y = y;
    this.size_x = windowWidth - x;
    this.size_y = windowHeight - y;
  }
  show()
  {
    fill(this.col);
    noStroke();
    rect(this.x,this.y,this.thickness,this.size_y);
    rect(this.x + this.thickness,this.y,this.size_x-this.thickness - this.x,this.thickness);
    rect(this.size_x -this.thickness,this.y + this.thickness, this.thickness, this.size_y-this.thickness);
  }
}
