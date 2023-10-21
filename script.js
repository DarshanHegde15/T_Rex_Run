/**@type{HTMLCanvasElement} */
import Player from "./Player.js";
import Cactus from "./Cactus.js";
import Score from "./Score.js";

const canvas=document.getElementById("board");
const ctx=canvas.getContext('2d');//Find the element by using dom tree and create context.
const gameSpeed_start=1;
const gameSpeed_increment=0.00001; 

const GAME_HEIGHT=200;
const GAME_WIDTH=800;

let lastTime=null;
let scaleRatio=null;
let player=null;
let ground=null;
let gameSpeed=gameSpeed_start;
let cactus=null;
let gameOver=false;
let resetEventListeners=false;
let startWaiting=true;
let score=null;

const playerWidth=58;
const playerHeight=62;
const maxJump=GAME_HEIGHT;
const minJump=150;
const groundWidth=2400;
const groundHeight=24;
const ground_and_cactus_speed=0.5;

const cacti=[
    {width:48/1.5,height:100/1.5,image:"images/cactus_1.png"},
    {width:98/1.5,height:100/1.5,image:"images/cactus_2.png"},
    {width:68/1.5,height:70/1.5,image:"images/cactus_3.png"},
];

class Ground{
    constructor(ctx,width,height,speed,scaleRatio){
        this.ctx=ctx;
        this.canvas=ctx.canvas;
        this.width=width;
        this.height=height;
        this.speed=speed;
        this.scaleRatio=scaleRatio;
        this.x=0;
        this.y=this.canvas.height-this.height;
        this.groundImg=new Image();
        this.groundImg.src="images/ground.png";
    }
    draw(){
        this.ctx.drawImage(this.groundImg,this.x,this.y,this.width,this.height);
        this.ctx.drawImage(this.groundImg,this.x+this.width,this.y,this.width,this.height);
        if(this.x<-this.width)
        this.x=0;
    }
    update(gameSpeed,frameTime){
        this.x-=gameSpeed*frameTime*this.speed*this.scaleRatio;
    }
    reset(){
        this.x=0;
    }
}

function createSprites(){
    const playerWidth_inGame=playerWidth*scaleRatio;
    const playerHeight_inGame=playerHeight*scaleRatio;
    const minJump_inGame=minJump*scaleRatio;
    const maxJump_inGame=maxJump*scaleRatio;
    const groundWidth_inGame=groundWidth*scaleRatio;
    const groundHeight_inGame=groundHeight*scaleRatio;
    player=new Player(ctx,playerWidth_inGame,playerHeight_inGame,minJump_inGame,maxJump_inGame,scaleRatio);
    ground=new Ground(ctx,groundWidth_inGame,groundHeight_inGame,ground_and_cactus_speed,scaleRatio);

    const cactiImages=cacti.map((cactus)=>{
        const image=new Image();
        image.src=cactus.image;
        return{
            image:image,
            width:cactus.width*scaleRatio,
            height:cactus.height*scaleRatio,
        };
    });
    cactus=new Cactus(ctx,cactiImages,scaleRatio,ground_and_cactus_speed);
    score=new Score(ctx,scaleRatio);
}

function setScreen(){
    scaleRatio=getScaleRatio();
    canvas.width=GAME_WIDTH*scaleRatio;
    canvas.height=GAME_HEIGHT*scaleRatio;
    createSprites(); 
}

setScreen();

window.addEventListener("resize",()=>setTimeout(setScreen,500));

if(screen.orientation){
    screen.orientation.addEventListener("change",setScreen);
}

function getScaleRatio(){
    const screenHeight=Math.min(window.innerHeight,document.documentElement.clientHeight);
    const screenWidth=Math.min(window.innerWidth,document.documentElement.clientWidth);
    if(screenWidth/screenHeight<GAME_WIDTH/GAME_HEIGHT)
    return screenWidth/GAME_WIDTH;
    else
    return  screenHeight/GAME_HEIGHT; 
}

function showGameOver(){
    const fontSize=70*scaleRatio;
    ctx.font=`${fontSize}px Verdana`;
    ctx.fillStyle="grey";
    const x=canvas.width/4.5;
    const y=canvas.height/2;
    ctx.fillText("GAME OVER",x,y);
}

function setupReset(){
    if(!resetEventListeners){
        resetEventListeners=true;
        setTimeout(()=>{
            window.addEventListener("keyup",reset,{once:true});
            window.addEventListener("touchstart",reset,{once:true});
        },500);
    }
}

function reset(){
    resetEventListeners=false;
    gameOver=false;
    startWaiting=false;
    ground.reset();
    cactus.reset();
    score.reset();
    gameSpeed=gameSpeed_start;
}

function showStartText(){
    const fontSize=40*scaleRatio;
    ctx.font=`${fontSize}px Verdana`;
    ctx.fillStyle="grey";
    const x=canvas.width/14;
    const y=canvas.height/2;
    ctx.fillText("Tap Screen Or Press Space To Start",x,y);
}

function updateGameSpeed(frameTime){
    gameSpeed+=frameTime*gameSpeed_increment;
}

function clearScreen(){
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function animate(currentTime){
    if(lastTime==null){window.addEventListener("keyup",reset,{once:true});
    window.addEventListener("touchstart",reset,{once:true});
        lastTime=currentTime;
        requestAnimationFrame(animate);
        return;
    }
    const frameTime=currentTime-lastTime;
    lastTime=currentTime;
    clearScreen();
    if(!gameOver && !startWaiting){
    ground.update(gameSpeed,frameTime);
    cactus.update(gameSpeed,frameTime);
    player.update(gameSpeed,frameTime);
    score.update(frameTime);
    updateGameSpeed(frameTime);
    }
    if(!gameOver && cactus.detectCollide(player)){
    gameOver=true;
    setupReset();
    score.setHighScore();
    }

    ground.draw();
    cactus.draw();
    player.draw();
    score.draw();

    if(gameOver){
        showGameOver();
    }

    if(startWaiting){
        showStartText();
    }

    requestAnimationFrame(animate)
}

requestAnimationFrame(animate);

window.addEventListener("keyup",reset,{once:true});
window.addEventListener("touchstart",reset,{once:true});