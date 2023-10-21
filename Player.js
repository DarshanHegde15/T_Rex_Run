export default class Player{
    walkAnimation_Timer=200;
    walkAnimationTimer=this.walkAnimation_Timer;
    dinoImages=[];
    jumpPressed=false;
    jumpInProgress=false;
    falling=false;
    jumpSpeed=0.6;
    gravity=0.4;

    constructor(ctx,width,height,minJump,maxJump,scaleRatio){
        this.ctx=ctx;
        this.canvas=ctx.canvas;
        this.width=width;
        this.height=height;
        this.minJump=minJump;
        this.maxJump=maxJump;
        this.scaleRatio=scaleRatio;
        this.x=10*scaleRatio;
        this.y=this.canvas.height-this.height-1.5*scaleRatio;
        this.standPosition=this.y;
        this.dinoStanding=new Image();
        this.dinoStanding.src="images/standing_still.png"
        this.image=this.dinoStanding;

        const dinoImage1=new Image();
        dinoImage1.src="images/dino_run1.png";
        const dinoImage2=new Image();
        dinoImage2.src="images/dino_run2.png";
        this.dinoImages.push(dinoImage1);
        this.dinoImages.push(dinoImage2);

        //Jump using keyboard
        window.removeEventListener("keyup",this.keyup);
        window.removeEventListener("keydown",this.keydown);
        window.addEventListener("keyup",this.keyup);
        window.addEventListener("keydown",this.keydown);

        //Jump using touch
        window.removeEventListener("touchstart",this.touchstart);
        window.removeEventListener("touchend",this.touchend);
        window.addEventListener("touchstart",this.touchstart);
        window.addEventListener("touchend",this.touchend);
    }

    keyup=(event)=>{
        if(event.code==="Space")
        this.jumpPressed=false;
    };
    keydown=(event)=>{
        if(event.code==="Space")
        this.jumpPressed=true;
    };

    touchstart=()=>{
        this.jumpPressed=true;
    };
    touchend=()=>{
        this.jumpPressed=false;
    }

    draw(){
        this.ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }
    update(gameSpeed,frameTime){
        console.log(this.jumpPressed)
        if(this.walkAnimationTimer<=0){
            if(this.image==this.dinoImages[0])
            this.image=this.dinoImages[1];
            else
            this.image=this.dinoImages[0];
            this.walkAnimationTimer=this.walkAnimation_Timer;
        }
        this.walkAnimationTimer-=frameTime*gameSpeed;

        if(this.jumpInProgress)
        this.image=this.dinoStanding;
        this.jump(frameTime);
    }

    jump(frameTime){
        if(this.jumpPressed)
        this.jumpInProgress=true;
        if(this.jumpInProgress&&!this.falling){
            if(this.y>this.canvas.height-this.minJump||(this.y>this.canvas.height-this.maxJump&&this.jumpPressed))
            this.y-=this.jumpSpeed*frameTime*this.scaleRatio;
            else
            this.falling=true;
        }
        else{
            if(this.y<this.standPosition){
                this.y+=this.gravity*frameTime*this.scaleRatio;
                if(this.y+this.height>this.canvas.height)
                this.y=this.standPosition;
            }
            else{
                this.falling=false;
                this.jumpInProgress=false;
            }
        }
    }
}