import "@assets/styles/_reset.scss";
import "@assets/styles/_auralux.scss";

// import "@types/window"

import Game from "@/Game";
import MyNoise from "@utils/Noise/MyNoise";
import { SplineCurve, Vector2 } from "three";
import NoiseControls from "./sandbox/NoiseControls";


// const canvas = document.createElement("canvas");


// window.devicePixelRatio=2;
// var sizeX = window.innerWidth;
// var sizeY = window.innerHeight;
// var scale = window.devicePixelRatio;
// let rects: any = [];

// resizeCanvas()

// function resizeCanvas() {
//   sizeX = window.innerWidth;
//   sizeY = window.innerHeight;
//   canvas.style.width = sizeX + "px";
//   canvas.style.height = sizeY + "px";
//   canvas.width = Math.floor(sizeX * scale);
//   canvas.height = Math.floor(sizeY * scale);
//   draw()
// }


/*
 https://www.youtube.com/watch?v=jvPPXbo87ds
 Cardinal spline
 Hermite spline
 ~39min
*/

// NoiseControls.create();

// window.addEventListener("resize", resizeCanvas)
// document.body.appendChild(canvas);

// // MyNoise.random()
// draw()


// function draw() {

//   let dotSize  = 2
//   if (canvas.getContext) {
//     const ctx = canvas.getContext("2d");
  
  
//     if (ctx) {
  
      
//       let pos = new Vector2(0, 0);
//       for (let i = 0 ; i <= 100 ; i++) {
  
//         ctx.strokeStyle = "#aaaaaa"
//         if (i % 5 === 0) {
//           ctx.strokeStyle = "#000000";
//         }
//         pos.x = 0;
//         pos.y = MyNoise.mapRange(i, 0, 100, 0, canvas.height);
  
        
//         ctx.beginPath();
//         ctx.moveTo(pos.x, pos.y);
        
//         pos.x = canvas.width;
  
//         ctx.lineTo(pos.x, pos.y);
//         ctx.lineWidth = 1;
//         ctx.stroke();
//         ctx.closePath();
  
//         if (i%5===0) {
//           ctx.font = "24px Consolas"
//           ctx.fillStyle = "#ffffFF"
//           ctx.fillRect(3, pos.y - 30, 18 * i.toString().length, 28)
//           ctx.fillStyle = "#000000"
//           ctx.fillText(i.toString(), 7, pos.y -10);
//         }
//       }
  
//       for (let i = 0; i < MyNoise.arr.length; i++) {
  
//         let current = new Vector2(
//           MyNoise.mapRange(i, 0, MyNoise.arr.length, 0, canvas.width),
//           MyNoise.mapRange(MyNoise.arr[i], 0, 1, 0, canvas.height)
//         );
  
//         if (i > 0) {
//           ctx.strokeStyle = "#00FF00";
//           let last = new Vector2(
//             MyNoise.mapRange(i - 1, 0, MyNoise.arr.length, 0, canvas.width),
//             MyNoise.mapRange(MyNoise.arr[i - 1], 0, 1, 0, canvas.height)
//           );
//           ctx.beginPath();
//           ctx.moveTo(last.x, last.y);
//           ctx.lineTo(current.x, current.y);
//           ctx.stroke();
//           ctx.closePath();
//         }
        
//         ctx.fillStyle = "#FF0000";
//         ctx.fillRect(current.x - dotSize/2, current.y - dotSize/2, dotSize, dotSize);
        
//         rects.push({
//           from: new Vector2(current.x - dotSize * 2, current.y - dotSize * 2),
//           to: new Vector2(current.x + dotSize * 2, current.y + dotSize *2),
//           datas: {
//             value: MyNoise.arr[i],
//             index: i,
//           },
//         });
  
//       }
  
  
//       // console.log("main array", MyNoise.arr)
//       let steps = .001
//       for (let i = 0; i <= 1; i += steps) {
//         let v = MyNoise.noise(i);
//         // console.log("CURRENT")
//         let current = new Vector2(
//           MyNoise.mapRange(i, 0, 1, 0, canvas.width),
//           MyNoise.mapRange(v, 0, 1, 0, canvas.height)
//         );
  
//         if (i > 0) {
//           // console.log("PREVIOUS");
//           ctx.strokeStyle = "#0000FF";
//           let last = new Vector2(
//             MyNoise.mapRange(i - steps, 0, 1, 0, canvas.width),
//             MyNoise.mapRange(MyNoise.noise(i - steps), 0, 1, 0, canvas.height)
//           );
//           ctx.lineWidth = 2
//           ctx.beginPath();
//           ctx.moveTo(last.x, last.y);
//           ctx.lineTo(current.x, current.y);
//           ctx.stroke();
//           ctx.closePath();
//         }
  
//         ctx.fillStyle = "#FF00FF";
//         ctx.fillRect(
//           current.x - dotSize / 2,
//           current.y - dotSize / 2,
//           dotSize,
//           dotSize
//         );
  
//         rects.push({
//           from: new Vector2(current.x - dotSize * 2, current.y - dotSize * 2),
//           to: new Vector2(
//             current.x + dotSize * 2,
//             current.y + dotSize * 2
//           ),
//           datas: {
//             value: v,
//             index: i
//           }
//         });
//       }
  
  
//     }
//   }
// }

// let infos = document.createElement("div");
// infos.id = "infos";
// infos.style.position = "absolute";
// infos.style.visibility = "hidden"
// document.body.appendChild(infos);

// canvas.addEventListener("mousemove", (ev: MouseEvent) => {
//   let rect = rects.find((r: any) => {
//     return r.from.x <= ev.clientX && r.to.x >= ev.clientX && r.from.y <= ev.clientY && r.to.y >= ev.clientY
//   })


//   if (rect) {
    
//     infos.innerHTML = rect.datas.index + "<br>" + rect.datas.value
//     infos.style.top = (ev.clientY + 20) + "px"
//     infos.style.left = (ev.clientX + 20) + "px"
//     infos.style.visibility = "visible"
//   } else {
//     infos.style.visibility = "hidden"
//   }

// });

const game = new Game()

window.__auralux__ = {
    game: game,
    helpers: {
    }
}

game.start()

// for (let i = 0 ; i < 20 ; i++) {
//   let val = Math.random()
//   let indexFound = MyNoise.mapRange(val, 0, 1, 0, MyNoise.arr.length)
//   let valFound
//   if (indexFound !== Math.ceil(indexFound)) {
//     valFound = (MyNoise.arr[Math.floor(indexFound)] + MyNoise.arr[Math.ceil(indexFound)]) / 2
//   } else {
//     valFound = MyNoise.arr[indexFound]
//   }

//   // let dFound = document.createElement("div")
//   //     dFound.classList.add("dot", "success")
//   //     dFound.style.left = indexFound*(MyNoise.mapRange(1, 0, MyNoise.arr.length, 0, 100)) + "vw"
//   //     dFound.style.transform = "translateY(-" + valFound + "px)"

//   //   document.body.appendChild(dFound)
// }

// let arr = [13,98,70,75,12,54,70,70,51,92,28,92,57,75,42,70,76,3,99,48,70,22,36,19,85,100,16,70,50,55,27,0,26,67,64,40,52,50,89,83,73,38,26,88,28,24,70,0,91,51,81,29,53,32,48,22,19,27,47,0,36,72,100,40,14,2,31,8,6,38,4,62,45,38,46,96,14,88,85,81,11,99,58,37,47,63,67,41,57,96,11,12,62,70,83,3,70,32,52,39,65,77,99,13,61,58,26,71,64,72,58,95,93,61,73,60,82,80,70,1,15,37,56,22,1,63,35,53,45,11,31,49,69,85,94,32,11,54,38,13,59,77,22,38,10,21,77,91,30,71,68,48,55,55,30,34,9,13,18,64,59,65,49,76,65,50,66,47,19,76,91,31,88,88,9,41,46,37,56,52,0,14,48,53,95,70,21,56,74,22,28,74,12,90,85,53,29,59,10,65,98,87,3,89,71,39,77,68,27,32,17,45,28,97,54,20,34,98,58,76,13,60,93,31,95,34,22,92,78,8,54,54,53,92,42,43,76,67,79,6,85,70,51,50,41,80,0,10,30,90,51,14,56,90,73,95,27,48,99,40,78,11,63,35,68,97,48,46,89,34,60,15,13,87,93,21,14,4,4,75,85,66,41,5,27,16,9,57,8,69,99,63,92,86,72,27,17,17,73,46,24,35,16,48,38,86,34,28,13,65,91,55,89,76,96,99,36,89,40,13,5,9,10,80,87,3,21,54,96,74,59,30,98,13,0,19,3,30,99,69,72,66,61,78,76,32,45,23,42,85,57,56,17,24,90,53,23,71,25,24,58,33,39,14,4,68,63,70,59,74,84,31,31,88,77,23,34,11,63,98,39,77,10,47,26,41,80,92,30,79,98,51,75,100,88,76,72,81,51,59,56,81,68,10,31,35,26,82,9,1,69,59,49,5,53,43,31,94,53,50,5,42,60,30,61,5,71,85,34,98,93,79,66,19,51,87,43,97,94,98,91,26,48,82,33,37,64,29,24,55,88,35,94,85,22,96,54,11,45,84,64,15,39,13,50,2,56,76,89,1,83,50,90,7,20,84,78,11,82,26,64,94,25,46,28,55,23,76,65,14,84,86,4,91,12,99,58,30,94,91,17,0,36,44,83,82,23,5,84,0,58,13]

// let arr = []
// let dispersion = .1
// let precision = 1;

// for (let i = 0 ; i < MyNoise.arr.length ; i++) {
//   let d = document.createElement("div")
//     d.classList.add("dot")
//     d.style.left = i*(MyNoise.mapRange(1, 0, MyNoise.arr.length, 0, 100) / precision) + "vw"
//     d.style.transform = "translateY(-" + MyNoise.arr[i] + "px)"

//   document.body.appendChild(d)
// }



// console.log("noise", noise(.1))
// console.log("noise", noise(1))
// console.log("noise", noise(.6))
// console.log("noise", noise(3.14))
// console.log("noise", noise(5.134))
// console.log("noise", noise(1235345.342))
// console.log("noise", noise(0.00231))
// console.log("noise", noise(0.999999))
