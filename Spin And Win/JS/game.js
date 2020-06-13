let prizes = {
    count : 12,
    prize_name : ["3000 credits","35% off","Hard Luck","70% off","Swagpack","100% off","Netflix","50% off","Amazon Voucher","2 Extra Spin","CB T Shirt","CB Book"]
}


let config = {
    type : Phaser.CANVAS,
    width : 800,
    height : 600,
    backgroundColor : 0xffcc00,

    scene : {
        preload : preload,
        create : create,
        update : update,
    }
};
// Game --contains--> Config --contains--> Scenes --has 3 important parts--->1.Loading assets , 2. Create , 3.Updating continuously
let game = new Phaser.Game(config);

function preload()
{  
    console.log("Preload")
    // load object , load some images
    this.load.image('background' , '../Assets/back.jpg');
    console.log(this);
    this.load.image('wheel' , '../Assets/wheel.png');
    this.load.image('pin' , '../Assets/pin.png');
    this.load.image('stand' , '../Assets/stand.png');
    this.load.image('start' , '../Assets/start.png');
    this.load.image('tryAgain' , '../Assets/tryAgain.png');
    this.load.audio('spinSound','../Assets/spinSound.mp3',{
        instances : 1
    });
    this.load.audio('tada','../Assets/tada.mp3',{
        instances : 1
    });
    this.load.audio('lose','../Assets/lose.mp3',{
        instances : 1
    });
    
}

function create()
{
    console.log("Create");
    let W = game.config.width;
    let H = game.config.height;
    let background = this.add.sprite(0,0,'background');
    
    background.setPosition(W/2,H/2);
    background.setScale(0.20)

    //adding wheel at center
    this.wheel = this.add.sprite(W/2,H/2,"wheel");
    this.wheel.setScale(0.20);
    this.wheel.depth = 1;

    //adding pin
    let pin = this.add.sprite(W/2,H/2-200,"pin");
    pin.setScale(0.25);
    pin.depth = 2;

    //adding stand
    let stand = this.add.sprite(W/2,H/2+200,"stand");
    stand.setScale(0.25);
    stand.depth = 0;

    //adding tryagain button and setting it at invisible mode
    this.tryAgain = this.add.sprite(W/2-250,H/2-200,"tryAgain");
    this.tryAgain.setScale(0.40);
    this.tryAgain.setInteractive();
    this.tryAgain.depth = 2;
    


    //adding start button
    this.start = this.add.sprite(W/2,H/2,"start");
    this.start.setInteractive();
    this.start.setScale(0.10);
    this.start.depth = 2;
    this.start.visible = true;

    
    // event listener for mouse click
    this.start.on("pointerdown",spinwheel,this);
    this.start.on('pointerover',scaleInc,this);
    this.start.on('pointerout',scaleDec,this);

    // adding sound
    this.sound.add('spinSound');
    this.sound.add('tada');
    this.sound.add('lose');


    //create text object
    font_style = {
        font : "bold 30px Arial",
        align : "center",
        color : "blue",
    }
    this.game_text = this.add.text(10,10,"Welcome To Spin & Win",font_style);    
}

// Game Loop
function update()
{
    console.log("Inside Update");
    //this.wheel.angle += 1;
}

function scaleInc()
{
    this.start.setScale(0.18);
}

function scaleDec()
{
    this.start.setScale(0.10);
}

function scaleInc2()
{
    this.tryAgain.setScale(0.50);
}

function scaleDec2()
{
    this.tryAgain.setScale(0.40);
}


function spinwheel()
{
    this.start.disableInteractive();
    console.log("U clicked the mouse");
    console.log("Start Spin");
    this.game_text.setText("Let's See What You Won.");
    this.sound.play('spinSound');

    let rounds = Phaser.Math.Between(5,7);
    let degrees = Phaser.Math.Between(0,11)*30;
    let angle_moved = 360*rounds + degrees;
    this.start.visible = false;

    let idx = prizes.count - 1 - Math.floor(degrees/(360/prizes.count));

    tween = this.tweens.add(
        {
            targets : this.wheel,
            
            angle : angle_moved ,//randomly
            ease : "Cubic.easeOut",
            duration : 16000,
            callbackScope: this,
            onComplete  :function(){
                this.tryAgain.visible = true;
                this.tryAgain.on("pointerdown",restart,this);
                this.tryAgain.on('pointerover',scaleInc2,this);
                this.tryAgain.on('pointerout',scaleDec2,this);
                if(idx != 2)
                {
                    this.sound.play('tada');
                    console.log("You won " + prizes.prize_name[idx]);
                    this.game_text.setText("You won " + prizes.prize_name[idx]);
                }
                else
                {
                    this.sound.play('lose');
                    console.log("Hard Luck !,Please Try Again Later.");
                    this.game_text.setText("Hard Luck !,Please Try Again Later.");
                }
            }
        }
    );

}

function restart()
{
    this.scene.restart();
}