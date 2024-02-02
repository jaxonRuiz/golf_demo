// flag !! in comments for particuarily useful notes
// im feeling rather talkative(typative?) in notes today
class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    // init only run ONCE
    init() {
        // useful variables
        this.SHOT_VELOCITY_X_MIN = 100;
        this.SHOT_VELOCITY_X_MAX = 300;

        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // score variables
        this.shotCounter = 0;
        this.points = 0;

        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, "cup"); 
        this.cup.body.setCircle(this.cup.width/4); // changing bounding body of cup to circle
        this.cup.body.setOffset(this.cup.width/4);
        this.cup.body.setImmovable(true);
        // you can tell which code i wrote by the semicolons LOL. 
        // too much C coding is bad for the brain :(
        
        this.resetBall();

        // add walls
        let wallA = this.physics.add.sprite(0, height/4, 'wall');
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2)); 
        // wall goes inbetween borders (+- wallA.width/2 to adjust for wall size to avoid wall hanging off side)
        wallA.setImmovable(true);

        let wallB = this.physics.add.sprite(0, height/2, 'wall');
        wallB.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2)); 
        // wall goes inbetween borders (+- wallA.width/2 to adjust for wall size to avoid wall hanging off side)
        wallB.setImmovable(true);

        // adding trackers
        this.reusedConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 150
        }
        this.shotsText = this.add.text(0,0, "shots: " + this.shotCounter.toString(), this.reusedConfig);
        this.scoreText = this.add.text(width/2,0, "points: " + this.points.toString(), this.reusedConfig);
        this.ratioText = this.add.text(width*(3/4),0, "rate: " + (this.points).toString()+"%", this.reusedConfig);

        
        // adding walls to a group <- useful !!
        this.walls = this.add.group([wallA, wallB]);

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, "oneway");
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2));
        this.oneWay.body.setImmovable(true);
        this.oneWay.body.checkCollision.down = (false);
        this.oneWay.body.setCollideWorldBounds(true);
        this.oneWay.body.setBounce(1); 
        this.oneWay.setVelocityX(width/6);


        // add pointer input
        this.input.on('pointerdown', (pointer)=>{
            // body of callback function
            // note that 'let' makes shotDirection local ONLY to this function
            this.shotCounter++;
            this.shotsText.text = "shots: " + this.shotCounter.toString();
            this.ratioText.text = "rate: " + (this.points/this.shotCounter).toString() + "%";
            let shotDirection_y = pointer.y <= this.ball.y ? 1 : -1;
            let shotDirection_x = pointer.x <= this.ball.x ? 1 : -1;
            // ^ ternary operations. format is: (condition) ? (if true) : (if false)

            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X_MIN, this.SHOT_VELOCITY_X_MAX) * shotDirection_x);
            // ^ will give an amount of variance in x velocity. math.between gives value between +- SHOT_VELOCITY_X
            this.ball.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection_y);
        }) // doing input, when mouse is pressed. also using inline function, passing in pointer aka mouse(?)

        // cup/ball collision
        // v want to make collision interaction between ball and cup
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.destroy();
            this.points++;
            this.scoreText.text = "score: " + this.points.toString();
            this.ratioText.text = "rate: " + (this.points/this.shotCounter).toString() + "%";
            console.log("ball hit hole");
            this.resetBall();
        }) 
        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls);

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay);
    }

    update() {
        
    }
    resetBall() {
        // add ball
        this.ball = this.physics.add.sprite(width/2, height-height/10, "ball");
        this.ball.body.setCircle(this.ball.width/2); // sets circle based on radius of ball
        this.ball.body.setCollideWorldBounds(true); // makes ball locked to screen
        this.ball.body.setBounce(0.5); // making bouncy. param is a 0-1 float. half bouncy rn
        this.ball.body.setDamping(true).setDrag(0.5); // friction i think
    }

}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[x] Add ball reset logic on successful shot
[x] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[x] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/