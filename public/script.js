
// The technologies of my time are limiting what I can do, I can only send 4000 bytes in a link...
// I abandoned the idea of sending pixel data in the url

const canvas  = document.getElementById("mainCanvas"); 
const ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var pixelArr = []
const ghpath= '/PixelArt';

const convertPixelArrTo64String = ()=>{
    const intToBin = (n)=>{
        var  bin = ""
        while(n>0){
            if(n%2==0){
                bin+= '0';
            }
            else{
                bin+= '1';
            }
            n = Math.floor(n/2);
        }
        while(bin.length!=8) bin+='0';

        return bin; //least sig -> most sig
    }

    var ans = "";
    for(i=0;i<128;i++){
        for(j=0;j<128;j++){
            ans+= intToBin(pixelArr[i][j][0]);
            ans+= intToBin(pixelArr[i][j][1]);
            ans+= intToBin(pixelArr[i][j][2]);
        }
    }

    var base64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';
    var ans64 = "";
    for(i=0;i<ans.length;i+=6){
        let currTot = 1,tot=0;
        for(j=0;j<6;j++){
            if(ans[i+j]=='1'){
                tot+=currTot;
            }
            currTot*=2;
        }
        ans64+=base64Table[tot];
    }
    
    return ans64;
}

const convert64StringtoPixelArr = (str)=>{
    var base64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';

    const intToBin = (n)=>{
        var  bin = ""
        while(n>0){
            if(n%2==0){
                bin+= '0';
            }
            else{
                bin+= '1';
            }
            n = Math.floor(n/2);
        }
        if(bin.length>6){
            console.error("Long integer");
            return "000000";
        }
        while(bin.length!=6) bin+='0';

        return bin;
    }

    let s = ""; // converting to normal binary string
    for (let i = 0; i < str.length; i++) {
        const n = base64Table.indexOf(str[i]);
        s+= intToBin(n);
    }

    const binToint = (ind)=>{
        var  int = 0,curr=1;
        for (let i = 0; i < 8; i++) {
            if(s[i+ind]=='1'){
                int+=curr;
            }
            curr+=curr;
        }
        return int;
    }

    var currInd = 0; // adding values to pixelarr
    for(i=0;i<128;i++){
        for(j=0;j<128;j++){
            if(currInd+8>=s.length) {
                pixelArr[i][j][0] = 0;
            }
            else{
                pixelArr[i][j][0] = binToint(currInd);
                currInd+=8;
            }
            if(currInd+8>=s.length) {
                pixelArr[i][j][1] = 0;
            }
            else{
                pixelArr[i][j][1] = binToint(currInd);
                currInd+=8;
            }
            if(currInd+8>=s.length) {
                pixelArr[i][j][2] = 0;
            }
            else{
                pixelArr[i][j][2] = binToint(currInd);
                currInd+=8;
            }
        }
    }

    
    
    
}


const init = ()=>{  
    for(i=0;i<128;i++){
        let temparr = []
        for(j=0;j<128;j++){
            // For random array
            // let temparr2 = []
            // temparr2.push(Math.floor(Math.random()*256))
            // temparr2.push(Math.floor(Math.random()*256))
            // temparr2.push(Math.floor(Math.random()*256))
            // temparr.push(temparr2);
            temparr.push([0,0,0])
        }
        pixelArr.push(temparr);
    }
};
init();


function makeImage(src)
{
    base_image = new Image();
    base_image.src = src;
    base_image.onload = function(){

        //After loading an Image 
        ctx.drawImage(base_image, 0, 0,width,height);
        var imageData = ctx.getImageData(0, 0, width, height);
        var data = imageData.data;

    
        //fill pixelarray
        for(i=0;i<128;i++){
            for(j=0;j<128;j++){
                var x = i*16 + 8;
                var y = j*16 + 8;
                var red = data[((width * y) + x) * 4];
                var green = data[((width * y) + x) * 4 + 1];
                var blue = data[((width * y) + x) * 4 + 2];
                pixelArr[i][j][0] = red;
                pixelArr[i][j][1] = green;
                pixelArr[i][j][2] = blue;
            }
        }
        // draw new pixelArray
        makeImageFromPixelArr();
        // console.log(convertPixelArrTo64String());
    }
}

const makeImageFromPixelArr = ()=>{
    var imgData = ctx.createImageData(width, height);
    for (i = 0; i < imgData.data.length; i += 4) {
        var x = (i/4)%width,y=(i/4)/width;
        x = Math.floor(x/16);// 0-128
        y = Math.floor(y/16);// 0-128
        imgData.data[i+0] =  pixelArr[x][y][0];
        imgData.data[i+1] =  pixelArr[x][y][1];
        imgData.data[i+2] =  pixelArr[x][y][2];
        imgData.data[i+3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
}



const inputElement = document.getElementById("image");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
    const fileList = this.files; 
    makeImage(URL.createObjectURL(fileList[0]));
}


const numImages = 3;
var currInd = Math.floor(Math.random()*numImages);
makeImage(`${ghpath}/defaultImages/${currInd}.png`);

const scrollLeft = document.getElementById("left")
const scrollRight = document.getElementById("right")

scrollLeft.onclick = ()=>{
    currInd = (currInd+numImages-1)%numImages;
    makeImage(`${ghpath}/defaultImages/${currInd}.png`);
}

scrollRight.onclick = ()=>{
    currInd = (currInd+1)%numImages;
    makeImage(`${ghpath}/defaultImages/${currInd}.png`);
}
