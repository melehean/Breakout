class Platform
{
  constructor(rect_w,rect_h, y_h, start, end, col)
  {
    this.rect_w = rect_w;
    this.rect_h = rect_h;
    this.y = y_h;
    this.x = start;
    this.start = start;
    this.end = end;
    this.col = col;
  }
  show()
  {
    fill(this.col);
    noStroke();
    rect(this.x,this.y,this.rect_w,this.rect_h);
  }
  
  update_mouse()
  {
    if(mouseX < this.start)
    {
      this.x = this.start;
    }
    else if(mouseX + this.rect_w > this.end)
    {
      this.x = this.end-this.rect_w;
    }
    else
    {
      this.x = mouseX;
    }
  }
  
  update_video(move)
  {
    if(move == "left")
    {
      this.x-=4;
    }
    else if(move == "right")
    {
      this.x+=4;
    }
    if(this.x<this.start)
    {
      this.x = this.start;
    }
    if(this.x + this.rect_w > this.end)
    {
      this.x = this.end - this.rect_w;
    }
   
  }
  
  get_position()
  {
    return createVector(this.x,this.y);
  }
  
  get_size()
  {
    return createVector(this.rect_w,this.rect_h);
  }
}
