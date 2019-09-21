let walls,platform,square;
let max_score, loser, winner;
const THICKNESS = 20;
const FRAME_X = 300;
const FRAME_Y = 100;
const BRICK_START_HEIGHT = 200;
const WORLD_START = FRAME_X + THICKNESS;
const MIN_BRICK_SIZE = 18;
const BRICKS_ROWS = 6;
let WORLD_END, WORLD_HEIGHT;
let bricks = [];
let game_font;
let button;

function setup() 
{
  createCanvas(windowWidth,windowHeight);
  
  WORLD_END = windowWidth - FRAME_X - THICKNESS;
  WORLD_HEIGHT = FRAME_Y + THICKNESS;
  winner = false;
  
  walls = new Walls(FRAME_X,FRAME_Y,THICKNESS,color("#f5f6fa"));
  platform = new Platform(150, 20, 600, WORLD_START, WORLD_END, color("#4b6584"));
  square = new Square(WORLD_START, WORLD_END, WORLD_HEIGHT, windowHeight, 16, color("#778ca3"));
  
  bricks_setup();
  
  game_font = loadFont("fonts/INVASION2000.ttf");
  textFont(game_font);
  
  button_setup();
}

function draw() 
{
  background(27);
  
  walls.show();
  
  loser = square.bounce_in_world_space();
  if(loser == false && winner == false)
  {
    platform.show();
    square.show();
    
    platform.update();
    square.update();
    square.hit_platform(platform);
    
    let cnt = 0;
    for(let i =0;i<BRICKS_ROWS;i++)
    {
      for(let j =0;j<bricks[i].length;j++)
      {
        bricks[i][j].show();
        cnt++;
        if(square.hit_brick(bricks[i][j]) == true)
        {
          bricks[i].splice(j,1);  
          cnt--;
        }
      }
    }
    
    textSize(63);
    fill("#f5f6fa");
    text("SCORE:", 20,200);
    text(max_score - cnt,20,260);
    if(cnt == 0)
    {
      winner = true;
    }
  }
  else
  {
    if(loser==true)
    {
      text("YOU LOSE!", 600,65);
    }
    else
    {
      text("YOU WON!", 600,65);
    }
    button.show();
  }
}

function restart()
{
  loser = false;
  winner = false;
  square = new Square(WORLD_START, WORLD_END, WORLD_HEIGHT, windowHeight, 16, color("#778ca3"));
  bricks_setup();
  button.hide();
}

function bricks_setup()
{
  let one_brick_size = find_brick_size();
  let bricks_num = (WORLD_END - WORLD_START)/one_brick_size;
  max_score = bricks_num * BRICKS_ROWS;
  
  let colors = [];
  colors.push(color("#e74c3c"));//red
  colors.push(color("#e67e22"));//orange
  colors.push(color("#f1c40f"));//yellow
  colors.push(color("#27ae60"));//green
  colors.push(color("#2980b9"));//blue
  colors.push(color("#9b59b6"));//purple
   
  for(let i = 0;i<BRICKS_ROWS;i++)
  {
    bricks[i] = [];
    for(let j = 0;j<bricks_num;j++)
    {
      bricks[i][j] = new Brick(WORLD_START+j*one_brick_size,
      BRICK_START_HEIGHT+i*one_brick_size,one_brick_size,colors[i]);
    }
  }
}

function button_setup()
{
  button = createButton("PLAY AGAIN");
  button.size(250,125);
  button.position(1255,120);
  button.style("border", "none");
  button.style("background-color", "#34495e");
  button.style("font-size", "50px");
  button.style("font-family", "INVASION2000");
  button.style("hover", "opacity: 0.1");
  button.mousePressed(restart);
  button.hide();
}

function find_brick_size()
{
  let world_size = WORLD_END - WORLD_START;
  let size = world_size+1;
  for(let i = 2;i<=Math.sqrt(world_size);i++)
  {
    if(world_size%i == 0)
    {
      if((i-MIN_BRICK_SIZE)>=0 && i<size)
      {
         size = i;
      }
    }
    if(world_size%floor(world_size/i)==0)
    {
      if((floor(world_size/i) - MIN_BRICK_SIZE)>=0&& floor(world_size/i)<size)
      {
         size = floor(world_size/i);
      }
    }
  }
  return size;
}
