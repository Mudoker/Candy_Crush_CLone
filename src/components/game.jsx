// import Image from 'next/image'
// import { useEffect, useRef, useState} from 'react'
// import Piece from './piece';

// export default function Game({ candyCrush }) {
//   const tilesContainer = useRef<HTMLDivElement>(null);
//   const [size, setSize] = useState(0);
//   const [toggle, triggerToggle] = useState(false);

//   useEffect(() => {
//     function handleResize() {
//       if (tilesContainer.current) {
//         setSize(Math.max(tilesContainer.current.offsetWidth / candyCrush.width, 100));
//       }
//     }
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [candyCrush.width, tilesContainer]);

//   const swipeHandler = (prop ) => {
//     candyCrush.swipe(prop);
//     console.log(candyCrush.board);
//   };

//   return (
//     <main className={`flex min-h-screen flex-col items-center justify-between p-12`}>
//       <div className={`flex flex-wrap w-full items-center`}>
//         <div className={`mx-auto relative`} ref={tilesContainer}>
//           {candyCrush.board.map((row, i) => (
//             <div className={`flex items-center justify-center border-boardBorder border-x-4 ${i === 0 ? "border-t-4" : i === candyCrush.height - 1 ? "border-b-4" : ""}`} key={i}>
//               {row.map((tile, j) => (
//                 <div className={`bg-tile border-tileBorder border-2 flex`} style={{ width: size, height: size }} key={j}></div>
//               ))}
//             </div>
//           ))}
//           {Object.values(candyCrush.pieces).map((piece, index) => (
//             <Piece key={index} swipeHandler={swipeHandler} candyCrushPiece={piece} tileSize={size} />
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }