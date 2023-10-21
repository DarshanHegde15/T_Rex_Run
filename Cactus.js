export default class Cactus{
    cactusDrawintervalMin=500;
    cactusDrawintervalMax=2000;
    nextCactusTime=null;
    cacti=[];
    constructor(ctx,cactiImages,scaleRatio,speed){
        this.ctx=ctx;
        this.canvas=ctx.canvas;
        this.cactiImages=cactiImages;
        this.scaleRatio=scaleRatio;
        this.speed=speed;
        this.setNextCactusTime();
    }

    setNextCactusTime(){
        const num=Math.floor(Math.random()*(this.cactusDrawintervalMax-this.cactusDrawintervalMin+1)+this.cactusDrawintervalMin);
        this.nextCactusTime=num;
    }

    createCactus(){
        const index=Math.floor(Math.random()*((this.cactiImages.length-1)-0+1)+0);
        const cactusImage=this.cactiImages[index];
        const x=this.canvas.width*1.5;
        const y=this.canvas.height-cactusImage.height;
        const cact=new Cact(this.ctx,x,y,cactusImage.width,cactusImage.height,cactusImage.image);
        this.cacti.push(cact);
    }

    update(gameSpeed,frameTime){
        if(this.nextCactusTime<=0){
            this.createCactus();
            this.setNextCactusTime();
        }
        this.nextCactusTime-=frameTime;
        this.cacti.forEach((cactus)=>{
            cactus.update(this.speed,gameSpeed,frameTime,this.scaleRatio);
        });

         this.cacti=this.cacti.filter(cactus=>cactus.x>-cactus.width);
    }
    
    draw(){
        this.cacti.forEach((cactus)=>cactus.draw());
    }

    detectCollide(sprite){
        return this.cacti.some((cactus)=>cactus.collideWith(sprite));
    }
    reset(){
        this.cacti=[];
    }
}

class Cact{
    constructor(ctx,x,y,width,height,image){
        this.ctx=ctx;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.image=image;
    }

    update(speed,gameSpeed,frameTime,scaleRatio){
        this.x-=speed*gameSpeed*frameTime*scaleRatio;
    }

    draw(){
        this.ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
    }

    collideWith(sprite){
        const adjust=1.4;
        if(sprite.x<this.x+this.width/adjust && sprite.x+sprite.width/adjust>this.x && sprite.y<this.y+this.height/adjust && sprite.height+sprite.y/adjust>this.y)
        return true;
        else
        return false;
    }
}