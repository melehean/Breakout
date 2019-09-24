const MAX_TRAINING = 10;
let move;
class VideoController
{
  constructor(x,y,w,h)
  {
    this.video = createCapture(VIDEO);    
    this.video.hide();
    
    this.model_ready = false;
    this.loaded = false;
    //Position of camera
    this.x= x;
    this.y = y;
    this.w= w;
    this.h = h;
    //Model and knn
    this.mobilenet = ml5.featureExtractor("MobileNet", () => this.model_ready = true);
    this.knn = ml5.KNNClassifier();
    this.logits = null;//data from mobilenet
    //amount of clicks of move buttons
    this.clicks = [];
    for(let i=0;i<3;i++)
    {
      this.clicks[i]=0;
    }
    
    this.go_left_button = createButton("PADDLE GO LEFT");
    this.stay_still_button = createButton("PADDLE DOESN'T MOVE");
    this.go_right_button = createButton("PADDLE GO RIGHT");
    this.save_button = createButton("SAVE TRAINING");
    this.load_button = createButton("LOAD TRAINING");
    
    button_setup(this.go_left_button, 0, 500, 296, 150, "30px");
    button_setup(this.stay_still_button, 310, 500, 296, 150, "30px");
    button_setup(this.go_right_button, 620,500, 296, 150, "30px");
    button_setup(this.save_button, 930, 500, 296, 150, "30px");
    button_setup(this.load_button,1240,500, 296, 150, "30px");
    
    this.go_left_button.mousePressed(() => 
    {
      if(this.clicks[0] < MAX_TRAINING)
      {
        this.logits = this.mobilenet.infer(this.video);
        this.knn.addExample(this.logits, "left");
        this.clicks[0]++;
      }
    });
    this.stay_still_button.mousePressed(() => 
    {
      if(this.clicks[1] < MAX_TRAINING)
      {
        this.logits = this.mobilenet.infer(this.video);
        this.knn.addExample(this.logits, "still");
        this.clicks[1]++;
      }
    });
    this.go_right_button.mousePressed(() => 
    {
      if(this.clicks[2] < MAX_TRAINING)
      {
        this.logits = this.mobilenet.infer(this.video);
        this.knn.addExample(this.logits, "right");
        this.clicks[2]++;
      }
    });
    this.save_button.mousePressed(() => 
    {
      if(this.check_training_complete())
      {
        this.knn.save("model.json");
        alert("Calm down. It's not a virus, it's just an AI model with some data ;). IF you want to load it, make sure you put it with code files"); 
      }
      else
      {
        alert("Don't try to trick me, I know you didn't complete your training");
      }
    });
    this.load_button.mousePressed(() => this.knn.load("model.json", () => this.loaded = true));
  }
  
  show_in_training()
  {
    image(this.video, this.x,this.y,this.w,this.h);
    this.go_left_button.show();
    this.stay_still_button.show();
    this.go_right_button.show();
    this.save_button.show();
    this.load_button.show();
    textSize(30);
    fill("#f5f6fa");
    for(let i =0;i<3;i++)
    {
      text(this.clicks[i] + "/" + MAX_TRAINING, 310*i + 110, 680);
    }
  }
  
  show_in_game()
  {
    image(this.video, this.x,this.y,this.w,this.h);
    if(this.knn.getNumLabels() > 0)
    {
      this.logits = this.mobilenet.infer(this.video);//data about image
      this.knn.classify(this.logits, this.get_results);//classify the image
    }
    textSize(40);
    fill("#f5f6fa");
    text(move, 200,500);//image classification
  }
  
  get_results(error, result)
  {
    if(error)
    {
      console.error(error);
      alert("I have some technical problem. Make sure everything is fine");
    }
    else
    {
      move = result.label;//image classification
    }
  }
  
  check_training_complete()
  {
    for(let i=0;i<3;i++)
    {
      if(this.clicks[i]<MAX_TRAINING)
      {
        return false;
      }
    }
    return true;
  }
  
  get_move()
  {
    return move;
  }
  
  hide_buttons()
  {
    this.go_left_button.hide();
    this.stay_still_button.hide();
    this.go_right_button.hide();
    this.save_button.hide();
    this.load_button.hide();
  }
}
