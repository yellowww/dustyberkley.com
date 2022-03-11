
class Button {
    e = undefined;
    loop = undefined;

    constructor(e) {
        this.e = e;
    }
    hoverIteration = (ins) => {
        const t = new Date().getTime();
        const loopSpeed = 0.75;
        const maxP = 0.2;
        let dashOffset = Math.round(t/20)%400;
        let px = Math.sin(t/(11*loopSpeed)*(Math.PI/180))*maxP+(maxP);
        let py = Math.cos(t/(11*loopSpeed)*(Math.PI/180))*maxP+(maxP);
        ins.e.style.marginLeft = (px/-2+0.3)+"cm";
        ins.e.style.marginTop = py/-2+"px";
        ins.e.style.paddingLeft = (px/2+0.3)+"cm";
        ins.e.style.paddingRight = (px/2+0.3)+"cm";
        ins.e.style.paddingTop = py/2+"cm";
        ins.e.style.paddingBottom = py/2+"cm";
        ins.e.style.backgroundImage = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='9' ry='9' stroke='white' stroke-width='4' stroke-dasharray='200' stroke-dashoffset='${dashOffset}' stroke-linecap='square'/%3e%3c/svg%3e")`
    }
    onHover = (ins) => {
        ins.loop = window.setInterval(function() {
            ins.hoverIteration(ins);
        },30);
    }
    onHoverOut = (ins) => {
        ins.e.style.padding = "0";
        ins.e.style.backgroundImage = "none";
        ins.e.style.paddingLeft = "0.3cm";
        ins.e.style.paddingRight = "0.3cm";
        ins.e.style.marginLeft = "-0.3cm";        
        ins.e.style.margin = "0";
        window.clearInterval(ins.loop);
    }
}

var buttonHover = {
    initiate: (selector) => {
        let allE = Array.from(document.getElementsByClassName(selector));
        allE.forEach((item)=>{
            let thisButton = new Button(item);
            item.onmouseover = ()=>{thisButton.onHover(thisButton)};
            item.onmouseout = ()=>{thisButton.onHoverOut(thisButton)};
        });
    }
}