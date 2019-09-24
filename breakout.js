//********************************************
//CONSTANTS
//********************************************
const THICKNESS = 20;
const BRICK_START_HEIGHT = 200;
const MIN_BRICK_SIZE = 18;
const BRICKS_ROWS = 6;
const CAMERA_W = 500;
const CAMERA_H = 450;
const SQUARE_VEL_MOUSE = 4;
const SQUARE_VEL_VIDEO = 1;
const PLATFORM_WIDTH = 150;
const PLATFORM_POS_HEIGHT = 600;
const windows = 
{
  MENU: 0,
  GAME: 1,
  TRAINING: 2,
};
//********************************************
//PSEUDO - CONSTANTS DEPENDING ON CONTROL MODE
//********************************************
let WORLD_END, WOLRD_START;
let FRAME_X, FRAME_Y, WORLD_HEIGHT;
//********************************************
//BUTTONS
//********************************************
let play_again_button, video_button;
let mouse_button, next_button, back_button;
//********************************************
//GAME VARIABLE
//********************************************
let walls,platform,square;
let max_score, loser, winner;
let bricks = [];
//********************************************
//WINDOWS VARIABLE
//********************************************
let game_font;
let window_number;
let brickwall;
let mouse;

function setup() 
{
  createCanvas(windowWidth,windowHeight);
  
  window_number = windows.MENU;
  winner = false;
  loser = false;
  
  game_font = loadFont("fonts/INVASION2000.ttf");
  textFont(game_font);
  //Creating buttons
  play_again_button = createButton("PLAY AGAIN");
  video_button = createButton("VIDEO CONTROL");
  mouse_button = createButton("MOUSE CONTROL");
  next_button = createButton("NEXT");
  back_button = createButton("BACK TO MENU");
  //Buttons setup
  play_again_button.hide();//these button is special I'll set up it later
  back_button.hide();
  button_setup(video_button, 550, 180, 360,180, "50px");
  button_setup(mouse_button, 550, 400, 360, 180, "50px");
  button_setup(next_button, windowWidth-120,20, 100, 100, "30px");
  //Buttons mousePressed
  play_again_button.mousePressed(restart);
  video_button.mousePressed(video_button_click);
  mouse_button.mousePressed(mouse_button_click);
  next_button.mousePressed(next_button_click);
  back_button.mousePressed(back_button_click);
  //Brickwall background
  brickwall = loadImage("images/brickwall.jpg");
}

function draw() 
{
  background(27);
  if(window_number == windows.MENU)
  {
    menu();
  }
  else if(window_number == windows.GAME)
  {
    game();
  }
  else if(window_number == windows.TRAINING)
  {
    training();
  }
}

//********************************************
//WINDOWS
//********************************************

function menu()
{
  background(brickwall);
  textSize(128);
  fill("#f5f6fa");
  text("BREAKOUT", 375, 100);
  video_button.show();
  mouse_button.show();
}

function game()
{
  if(mouse == false)//if video control mode
  {
    video_controller.show_in_game();
    button_setup(back_button, 130,windowHeight-60, 250, 50, "25px");
  }
  else
  {
    button_setup(back_button, 25, windowHeight-75, 250, 50, "25px");
  }  
  walls.show();
  back_button.show();
  loser = square.bounce_in_world_space();
  if(loser == false && winner == false)
  {
    platform.show();
    square.show();
    
    if(mouse == true)
    {
      platform.update_mouse();
    }
    else
    {
      platform.update_video(video_controller.get_move());
    }
    square.update();
    square.hit_platform(platform);
    
    let cnt = 0;//how many bricks left
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
    if(mouse == true)
    {
      //Actual score
      text("SCORE: ", 20,200);
      text(max_score - cnt, 20, 250);
    }
    else
    {
      text("SCORE: " + (max_score - cnt), 100,600);
    }
    if(cnt == 0)
    {
      winner = true;
    }
  }
  else
  {
    textSize(63);
    fill("#f5f6fa");
    if(loser==true)
    {
      if(mouse == true)
      {
        text("YOU LOSE!", 600,65);
      }
      else
      {
        text("YOU LOSE!", 830,65);
      }
    }
    else
    {
      if(mouse == true)
      {
        text("YOU WON!", 600,65);
      }
      else
      {
        text("YOU WON!", 830,65);
      }
    }
    play_again_button.show();
  }
}

function training()
{
  background(brickwall);
  textSize(63);
  text("TRAINING", 830, 60);
  textSize(40);
  text("NOW BE FOCUSED", 800, 120);
  textSize(20);
  text("THIS PART IS NECESSARY TO PLAY GAME IN VIDEO CONTROL MODE", 550, 180);
  text("WE WILL TRAIN AI MODEL TO RECOGNIZE YOUR MOVES", 550, 220);
  text("YOU HAVE TO DEFINE MOVES AND ITS MEANING", 550, 260);
  text("FOR EXAMPLE - LEFT HAND HOLD UP MEANS PADDLE GO LEFT", 550, 300);
  text("SO MAKE YOUR MOVES AND CLICK BUTTONS BELOW TO TRAIN", 550, 340);
  text("WHEN YOU REACH ALL NUMBERS BELOW, CLICK NEXT BUTTON TO PLAY", 550, 380);
  text("YOU CAN SAVE YOUR TRAINING OR LOAD IT IF YOU DID IT BEFORE", 550, 420);
  text("UNLESS YOU CHANGE YOUR LOOK OR BACKGROUND, THEN YOU HAVE TO DO IT AGAIN", 550, 460);
  video_controller.show_in_training();
  next_button.show();
  button_setup(back_button, CAMERA_W+20, 20, 100, 100, "25px");
  back_button.show();
}

//********************************************
//INITIALISATION OF WORLDS DEPENDING ON CONTROL
//********************************************

function mouse_world_setup()
{
  //Left corner of world
  //If I change these values walls will be center in the screen anyway
  FRAME_X = 300;
  FRAME_Y = 100;
    
  WORLD_END = windowWidth - FRAME_X - THICKNESS;
  WORLD_START  = FRAME_X + THICKNESS;
  WORLD_HEIGHT = FRAME_Y + THICKNESS;
   
  button_setup(play_again_button, 1260, 150, 250, 125, "50px");
  bricks_setup();
   
  walls = new Walls(FRAME_X,FRAME_Y,THICKNESS, windowWidth, color("#f5f6fa"));
  platform = new Platform(PLATFORM_WIDTH, THICKNESS, PLATFORM_POS_HEIGHT, WORLD_START, WORLD_END, color("#4b6584"));
  square = new Square(WORLD_START, WORLD_END, WORLD_HEIGHT, windowHeight, MIN_BRICK_SIZE - 2,SQUARE_VEL_MOUSE, color("#778ca3"));
}

function video_world_setup()
{
  FRAME_X = 550;
  FRAME_Y = 100;
    
  //Here I want to move walls to the right
  WORLD_END = windowWidth + CAMERA_W - FRAME_X - THICKNESS;
  WORLD_START  = FRAME_X + THICKNESS;
  WORLD_HEIGHT = FRAME_Y + THICKNESS;
   
  button_setup(play_again_button, 130, 530, 250, 125, "50px");
  bricks_setup();
   
  walls = new Walls(FRAME_X,FRAME_Y,THICKNESS, windowWidth + CAMERA_W, color("#f5f6fa"));
  platform = new Platform(PLATFORM_WIDTH, THICKNESS, PLATFORM_POS_HEIGHT, WORLD_START, WORLD_END, color("#4b6584"));
  square = new Square(WORLD_START, WORLD_END, WORLD_HEIGHT, windowHeight, MIN_BRICK_SIZE - 2,SQUARE_VEL_VIDEO, color("#778ca3"));
}

//********************************************
//BUTTON SETUP AND MOUSEPRESSED FUNCTIONS
//********************************************

function button_setup(button, x, y, size_x, size_y, font_size)
{
  button.size(size_x,size_y);
  button.position(x,y);
  button.style("border", "none");
  button.style("background-color", "#34495e");
  button.style("font-size", font_size);
  button.style("color", "#f5f6fa");
  button.style("font-family", "INVASION2000");
  button.hide();
}

function next_button_click()
{
  if(video_controller.check_training_complete() == true)
  {
    window_number = 1;
    video_world_setup();
    next_button.hide();
    video_controller.hide_buttons();
  }
  else
  {
    alert("Don't try to trick me, I know you didn't complete your training");
  } 
}

function restart()
{
  loser = false;
  winner = false;
  if(mouse == true)
  {
    square = new Square(WORLD_START, WORLD_END, WORLD_HEIGHT, windowHeight, MIN_BRICK_SIZE - 2,SQUARE_VEL_MOUSE, color("#778ca3"));
  }
  else
  {
    square = new Square(WORLD_START, WORLD_END, WORLD_HEIGHT, windowHeight, MIN_BRICK_SIZE - 2,SQUARE_VEL_VIDEO, color("#778ca3"));
  }
  bricks_setup();
  play_again_button.hide();
}

function video_button_click()
{
  video_button.hide();
  mouse_button.hide();
  video_controller = new VideoController(0,0,CAMERA_W,CAMERA_H);
  mouse = false;
  window_number = 2;
}

function mouse_button_click()
{
  video_button.hide();
  mouse_button.hide();
  mouse_world_setup();
  mouse = true;
  window_number = 1;
}

function back_button_click()
{
  window_number = 0;
  back_button.hide();
  play_again_button.hide();
  if(video_controller != null)
  {
    video_controller.hide_buttons();
    next_button.hide();
  }
}

//********************************************
//BRICK SETUP
//********************************************

function bricks_setup()
{
  let one_brick_size = find_brick_size();//Optimal size of one brick
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

function find_brick_size()
{
  //looking for size of brick, that is divisor of world length
  //and it's bigger than MIN_BRICK_SIZE, but possibly small
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
