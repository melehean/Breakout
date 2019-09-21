class Square
{
  constructor(start_x, end_x, start_y,end_y, size, col)
  {
    this.pos = createVector((end_x+start_x)/2, (end_y+start_y)/2);
    this.start = createVector(start_x,start_y);
    this.end = createVector(end_x,end_y);
    this.vel = createVector(4,4);
    this.direction = createVector(1,1);
    this.size = size;
    this.col = col;
  }
  
  update()
  {
    this.pos.x += this.vel.x * this.direction.x;
    this.pos.y += this.vel.y * this.direction.y;    
  }
  
  bounce_in_world_space()
  {
    if(this.pos.x<this.start.x&&this.direction.x<0)
    {
      this.direction.x *= -1;
    }
    else if(this.pos.x>this.end.x-this.size&&this.direction.x>0)
    {
      this.direction.x *= -1;
    }
    else if(this.pos.y<this.start.y&&this.direction.y<0)
    {
      this.direction.y *= -1;
    }
    else if(this.pos.y>this.end.y-this.size&&this.direction.y>0)
    {
      return true;
    }
    return false;
  }
  
  hit_platform(platform)
  {
    let platform_pos = platform.get_position();
    let platform_size = platform.get_size();

    if(this.pos.x > platform_pos.x - this.size &&this.pos.x < platform_pos.x + platform_size.x 
    && this.pos.y < platform_pos.y  && this.pos.y > platform_pos.y - this.size 
    && this.direction.y > 0)
    {
      this.direction.y *= -1;
    }
  }
  
  hit_brick(brick)
  {
    let brick_size = brick.get_size();
    let brick_pos = brick.get_pos();
    if(this.pos.y <= brick_pos.y)//Square above brick
    {
      if(this.pos.x >= brick_pos.x - this.size && this.pos.x <= brick_pos.x + brick_size
      &&this.pos.y >= brick_pos.y - this.size && this.pos.y <= brick_pos.y
      &&this.direction.y > 0)
      {
        this.direction.y *= -1;
        return true
      }
    }
    else //Square beneath brick
    {
      if(this.pos.x >= brick_pos.x - this.size && this.pos.x <= brick_pos.x + brick_size
      &&this.pos.y <= brick_pos.y + brick_size + this.size && this.pos.y >= brick_pos.y + brick_size
      && this.direction.y < 0)
      {
        this.direction.y *= -1; 
        return true;
      }
    }
    //If square isn't above or beneath brick I will check if it is on left or right side of brick
    if(this.pos.x <= brick_pos.x)//Square on the left side of brick
    {
      if(this.pos.x >= brick_pos.x - this.size && this.pos.x <= brick_pos.x
      &&this.pos.y <= brick_pos.y + brick_size && this.pos.y >= brick_pos.y - this.size
      &&this.direction.x > 0)
      {
        this.direction.x *= -1;
        return true;
      }
    }
    else//Square on the right side of brick
    {
      if(this.pos.x >= brick_pos.x+brick_size&& this.pos.x <= brick_pos.x+brick_size+this.size
      &&this.pos.y <= brick_pos.y + brick_size && this.pos.y >= brick_pos.y - this.size
      &&this.direction.x < 0)
      {
        this.direction.x *= -1;
        return true;
      }
    }
    return false;
  }
  
  show()
  {
    fill(this.col);
    rect(this.pos.x,this.pos.y,this.size,this.size);
  }
}
