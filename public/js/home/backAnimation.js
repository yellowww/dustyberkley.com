var backAnimation = {
    squares: {
        static:[],
        moving:[],
        allMoving:[],
        init: (w,h) => {
            for(let i=0;i<w;i++) {
                let staticCol = [];
                for(let j=0;j<h;j++) {
                    staticCol.push({
                        h:Math.random()*180+200,
                        s:Math.random()*30+40,
                        l:Math.random()*20+30
                    })
                }
                backAnimation.squares.static.push(staticCol);
            }
        }
    },
    r: {
        canvas:undefined,
        c:undefined,
        frame: () => {
            backAnimation.r.c.clearRect(0,0,window.innerWidth,window.innerHeight*2);
            backAnimation.r.renderStatic();
            backAnimation.r.renderMoving();
        },
        findScale:(x,y,s) => {
            let dist = Math.sqrt(
                Math.pow(x-backAnimation.mouse.clickX,2)+
                Math.pow(y-backAnimation.mouse.clickY,2)
            )-backAnimation.mouse.clickDist;
            let newScale = s;
            if(dist<150 && dist>0) newScale = (s-s*0.3)/Math.pow((150-dist)*-0.2,2)*35+s*0.3;
            if(dist>-150 && dist<0) newScale = Math.pow((150-(-150/dist)),2)*0.0065;
            if(newScale>s)return s;
            return newScale;
        },
        renderStatic: () => {
            let len0 = backAnimation.squares.static.length;
            let len1 = backAnimation.squares.static[0].length;
            for(let i=0;i<len0;i++) {           
                for(let j=0;j<len1;j++) {              
                    let thisSquare = backAnimation.squares.static[i][j];
                    const px = i*(window.innerWidth/len0), py = j*(window.innerWidth/len0);
                    let lMod = 5000/Math.sqrt(
                        Math.pow(px-backAnimation.mouse.x,2)+
                        Math.pow(py-backAnimation.mouse.y,2)
                    );
                    if(thisSquare.l+lMod>100) {
                        lMod = 100-thisSquare.l
                    };
                    const scale = backAnimation.r.findScale(px,py,(window.innerWidth/len0));
                    const scaleShift = ((window.innerWidth/len0)-scale)/2;
                    backAnimation.r.c.fillStyle = "hsl("+thisSquare.h+","+(thisSquare.s)+"%,"+(thisSquare.l+lMod)+"%)";
                    backAnimation.r.c.fillRect(px+scaleShift,py+scaleShift,scale,scale);
                }
            }
        },
        renderMoving: () => {
            let len0 = backAnimation.squares.static.length;
            for(let i=0;i<backAnimation.squares.moving.length;i++) {
                let thisSquare = backAnimation.squares.moving[i];

                let lMod = 5000/Math.sqrt(
                    Math.pow(thisSquare.x-backAnimation.mouse.x,2)+
                    Math.pow(thisSquare.y-backAnimation.mouse.y,2)
                );
                if(thisSquare.l+lMod>100) {
                    lMod = 100-thisSquare.l
                };
                const scale = backAnimation.r.findScale(thisSquare.x,thisSquare.y,(window.innerWidth/len0));
                const scaleShift = ((window.innerWidth/len0)-scale)/2;

                backAnimation.r.c.fillStyle = "hsl("+thisSquare.h+","+thisSquare.s+"%,"+(thisSquare.l+lMod)+"%)";
                backAnimation.r.c.fillRect(thisSquare.x+scaleShift,thisSquare.y+scaleShift,scale,scale)
            }
        }
    },
    update: {
        moveChance:0.005,
        frame: () => {
            backAnimation.update.convertFrame();
            backAnimation.update.moveFrame();
            if(backAnimation.mouse.clickDist<window.innerWidth*2) backAnimation.mouse.clickDist+=15;
        },
        moveFrame:() => {
            for(let i=0;i<backAnimation.squares.moving.length;i++) {
                let thisMoving = backAnimation.squares.moving[i];
                thisMoving.x+=(thisMoving.x-thisMoving.tx)/-10;
                thisMoving.y+=(thisMoving.y-thisMoving.ty)/-10;
                if(Math.abs(thisMoving.x-thisMoving.tx)<4 && Math.abs(thisMoving.y-thisMoving.ty)<4) {
                    backAnimation.squares.static[thisMoving.i][thisMoving.j] = {
                        h:thisMoving.h,
                        s:thisMoving.s,
                        l:thisMoving.l
                    }
                    backAnimation.squares.moving.splice(i,1);
                    i--;
                }
            }
        },
        convertFrame:() => {
            let len0 = backAnimation.squares.static.length;
            let len1 = backAnimation.squares.static[0].length;
            for(let i=0;i<len0;i++) {           
                for(let j=0;j<len1;j++) {  
                    let thisSquare = backAnimation.squares.static[i][j];  
                    let thisSquareString = i+"x"+j    
                    if(Math.random()<backAnimation.update.moveChance && !backAnimation.squares.allMoving.includes(thisSquareString)) {
                        let tx = Math.round(Math.random()*2-1);
                        let ty = Math.round(Math.random()*2-1);
                        let canMove = backAnimation.update.checkCatch(
                            i,
                            j,
                            tx,
                            ty,
                            len0,
                            len1
                        );
                        //console.log(canMove)
                        if(canMove) {
                            backAnimation.squares.moving.push({
                                h:thisSquare.h,
                                s:thisSquare.s,
                                l:thisSquare.l,
                                x:i*(window.innerWidth/len0),
                                y:j*(window.innerWidth/len0),
                                i:i+tx,
                                j:j+ty,
                                tx:(i+tx)*(window.innerWidth/len0),
                                ty:(j+ty)*(window.innerWidth/len0)
                            });
                            backAnimation.squares.allMoving.push(thisSquareString);
                        }
                    }
                }
            }
        },
        checkCatch: (x,y,tx,ty,w,h) => {
            if(tx == 0 && ty == 0) return false;
            if(tx != 0 && ty != 0) return false;
            if(x+tx<w && x+tx>0 && y+ty<h && y+ty>0) return true;
            return false;
        }
    },
    mouse:{
        x:0,
        y:0,
        clickDist:window.innerWidth*2,
        clickX:750,
        clickY:200,
        updateCoords:(e) => {
            backAnimation.mouse.x = e.clientX;
            backAnimation.mouse.y = e.clientY+window.innerHeight*((1-(e.clientX/window.innerWidth))*0.5+0.5);
        },
        onClick:(e) => {
            backAnimation.mouse.clickX = e.clientX;
            backAnimation.mouse.clickY = e.clientY+window.innerHeight*((1-(e.clientX/window.innerWidth))*0.5+0.5);
            backAnimation.mouse.clickDist = 0;
        }
    },
    frame:()=>{
        backAnimation.r.frame();
        backAnimation.update.frame();
    },
    init: (canvas) => {
        document.body.onmousemove = backAnimation.mouse.updateCoords;
        document.body.onclick = backAnimation.mouse.onClick;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight*2;
        backAnimation.r.canvas = canvas;
        backAnimation.r.c = canvas.getContext('2d');
        backAnimation.squares.init(window.innerWidth/150,window.innerWidth/150);
        setInterval(backAnimation.frame,30);
    }
}