var sidebar = {
    burger: {
        toggled:false,
        iterating:false,
        activate:() => {
            sidebar.burger.iterating = true;
            const e = document.getElementById("burgerIcon");
            const sheet = document.getElementById("sidebar-sheet");

            e.style.transform = "translateX(-0.2cm)";
            setTimeout(()=>{e.style.transform = "translateX(0.15cm)";},250);
            sidebar.burger.doAnimation(false);
            sidebar.burger.toggled = true;

            sheet.style.transform = "translateX(0) rotateZ(0deg)";
            setTimeout(()=> {
                sidebar.burger.iterating = false;
            },300);
            
        },
        doAnimation:(reverse,cb)=> {
            sidebar.burger.iterating = true;
            let i = 0;
            const e = document.getElementById("burgerIcon");
            const loop = setInterval(() => {
                if(i<4) {
                    let fileName;
                    if(reverse){fileName=3-i}else{fileName=i};
                    e.src = "assets/hamburger/hamburgerArrow"+fileName+".png";
                } else {
                    clearInterval(loop);
                    sidebar.burger.iterating = false;
                    if(cb)cb()
                }
                i++
            },30);
        },
        deactivate:()=> {
            sidebar.burger.iterating = true;
            const e = document.getElementById("burgerIcon");  
            const sheet = document.getElementById("sidebar-sheet");

            e.style.transform = "translateX(0cm)";
            sidebar.burger.doAnimation(true,()=> {
                e.src = "assets/hamburger/closed.png";
            });       
            sidebar.burger.toggled = false;

            sheet.style.transform = "translateX(-65vw)";
            setTimeout(()=> {
                sheet.style.transform = "translateX(-50vw) rotateZ(35deg)";
                sidebar.burger.iterating = false;
            },300);
        },
        onClick:()=> {
            if(!sidebar.burger.iterating)if(sidebar.burger.toggled){sidebar.burger.deactivate()}else{sidebar.burger.activate()};
        }
    },
    init:()=> {
        document.getElementById("burgerIcon").onclick = sidebar.burger.onClick;
    }
}