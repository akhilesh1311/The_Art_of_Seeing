function mouseMove(e){
    if(move){
        var x = e.clientX;
        var y = e.clientY;

        var con = document.getElementById('filter')
        fleft = parseInt(oleft) + parseInt(x) - parseInt(dleft)
        ftop = parseInt(otop) + parseInt(y) - parseInt(dtop)
        console.log(oleft + ';' + otop + ';' + dleft + ';' + dtop + ';' + x + ';' + y + ';' + fleft + ';' + ftop)
        con.style.left = fleft + 'px';
        con.style.top = ftop + 'px';

        var coor = "坐标值: (" + con.style.left + "," + con.style.top + ")";
        console.log(coor)
    }
}
function mouseDown(e){
    move = true
    var con = document.getElementById('filter')
    oleft = con.style.left
    otop = con.style.top
    dleft = e.clientX;
    dtop = e.clientY;
    console.log(oleft + ';' + otop + ';' + dleft + ';' + dtop)
}
function mouseUp(e){
    move = false
}

function changeWidth(e){
    console.log('fff')
    var bars = document.getElementsByClassName("filterbar")
    var owidth = bars[0].clientWidth
    var fwidth = 0
    if(e==1){
        fwidth = parseFloat(owidth) + 1.0
    }else{
        fwidth = parseFloat(owidth) - 1.0
    }
    console.log(owidth + ';' + fwidth)
    for (var i = 0; i < bars.length; i++) {
        bars[i].style.width = fwidth + "px";
        bars[i].clientWidth = fwidth + "px";
    }
}
function changeDistance(e){
    console.log('fff')
    var bars = document.getElementsByClassName("filterbar")
    var bar = bars[0]
    var style = bar.currentStyle || window.getComputedStyle(bar);
    var owidth = style.marginRight
    var fwidth = 0
    if(e==1){
        fwidth = parseFloat(owidth) + 1.0
    }else{
        fwidth = parseFloat(owidth) - 1.0
    }
    
    console.log(owidth + ';' + fwidth)
    for (var i = 0; i < bars.length; i++) {
        bars[i].style.marginRight = fwidth + "px";
    }
}
function changeImg(i){
    pid = i
    console.log(pid)
    var main_img = document.getElementById('main_img')
    var img_name = 'book/Image_' + i + '.jpg'
    main_img.src = img_name
    var images = document.getElementsByClassName('thumbs')
    for (var j = 0; j < images.length; j++) {
        images[j].style.borderColor = '#CCC';
        images[j].style.borderWidth = '1';
    }
    images[i-2].style.borderColor = '#F00';
    images[i-2].style.borderWidth = '2';
}
function hideFilter(){
    var filter = document.getElementById('filter')
    var hide_btn = document.getElementById('hide_btn')
    if(filter.style.display==''){
        filter.style.display = 'none'
        hide_btn.innerText='Show'
    }else{
        filter.style.display = ''
        hide_btn.innerText='Hide'
        filter.style.left = '280px';
        filter.style.top = '150px';
    }
}
function gomenu(i){
    if(i==1){
        window.location.replace("index.php");
    }else if(i==2){
        window.location.replace("moire1.html");
    }else if(i==3){
        window.location.replace("http://172.31.142.137:5005/upload");
    }else if(i==4){
        window.location.replace("menu4.php");
    }
    
}
function addComment(){
    var con=document.getElementById('comment').value;
    if(con.replace(/(^\s*)|(\s*$)/g,'').length==0){
        alert('please input something');
        return;
    }
    // alert(con)
    var ajax=Ajax();
    var url="addcomment.php";
    var pcon="uid="+'1'+"&comment="+con+"&pid="+pid;
    ajax.post(url,pcon,function(data){
        // console.log(data)
        if(data.substr(0,7)=='success'){
            var comments= document.getElementById('comments');
            comments.innerHTML=data.substr(8)+comments.innerHTML;
        }else{
            alert('fail');
        }
    });
}