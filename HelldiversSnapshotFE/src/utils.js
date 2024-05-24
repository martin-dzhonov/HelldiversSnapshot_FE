const getPixelMissmatch = (p1, p2) => {
    const deltaR = Math.abs(p1.red - p2.red);
    const deltaG = Math.abs(p1.green - p2.green);
    const deltaB = Math.abs(p1.blue - p2.blue);
    const totalDiff = deltaR + deltaG + deltaB;
    return totalDiff / 2;
  }

  const extractPixelColor = (data, cols, x, y) => {
    let pixel = cols * x + y;
    let position = pixel * 4;
    return {
      red: data[position],
      green: data[position + 1],
      blue: data[position + 2],
      alpha: data[position + 3],
    };
  };

  export  const compareImages = (img1, img2, imgSize) => {
    let total = 0;
    for (let x = 0; x < imgSize; x++) {
      for (let y = 0; y < imgSize; y++) {
        let p1 = extractPixelColor(img1.data, imgSize, x, y);
        let p2 = extractPixelColor(img2.data, imgSize, x, y);
        let pixelDiff = getPixelMissmatch(p1, p2);
        if (p1.red > 180 && p1.blue > 180) {
          pixelDiff = pixelDiff + 50;
        }
        if (p1.red > 180 && p1.red > 180) {
          pixelDiff = pixelDiff - 50;
        }
        if (p1.blue > 180 && p1.blue > 180) {
          pixelDiff = pixelDiff - 50;
        }
        total = total + pixelDiff;
        //let hexCode1 = `#${[p1.red, p1.green, p1.blue].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
        //let hexCode2 = `#${[p2.red, p2.green, p2.blue].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
        //console.log('%c \u25A0', `background: #222; color: ${hexCode1}`, `(${p1.red}, ${p1.green}, ${p1.blue})`);      
        //console.log('%c \u25A0', `background: #222; color: ${hexCode2}`, `(${p2.red}, ${p2.green}, ${p2.blue})`);  
        //console.log(pixelDiff);    
      }
    }
    return total;
  };

  // useEffect(() => {
  //   if (ref2.current && !dumpMode) {
  //     const baseImgArr = [];
  //     for (let i = 0; i < baseIcons.length; i++) {
  //       let image = new Image();
  //       image.setAttribute('crossorigin', 'anonymous');
  //       image.src = baseIcons[i];
  //       image.onload = () => {
  //         const ctx = ref2.current.getContext('2d', { willReadFrequently: true })
  //         if (ctx) { ctx.drawImage(image, 0, 0); }
  //         baseImgArr[i] = ctx.getImageData(0, 0, baseImgSize, baseImgSize);
  //         setBaseImgData(baseImgArr);
  //       };
  //     }
  //   }
  // }, [])

  // useEffect(() => {
  //   if (ref1.current && baseImgData.length > 45 && !dumpMode) {
  //     let metaDict = {};

  //     for (let s = 1; s < (screenshotsCount + 1); s++) {

  //       let image = new Image();
  //       image.setAttribute('crossorigin', 'anonymous');
  //       image.src = `Screenshots/${factionName}/Screenshot (${s}).png`;
  //       image.onload = () => {

  //         for (let i = 0; i < 16; i++) {
  //           const ctx = ref1.current.getContext('2d', { willReadFrequently: true })
  //           let maxDiff = 100000;
  //           let bestMatchStr = '';
  //           if (ctx) {
  //             ctx.drawImage(image,
  //               startX + (baseImgSize * i) + offsetX[i],
  //               startY,
  //               baseImgSize, baseImgSize,
  //               0, 0,
  //               baseImgSize, baseImgSize,
  //             );
  //           }

  //           const imgData = ctx.getImageData(0, 0, baseImgSize, baseImgSize);
  //           for (let j = 0; j < baseImgData.length; j++) {
  //             const diff = compareImages(imgData, baseImgData[j], baseImgSize);
  //             if (diff < maxDiff) {
  //               maxDiff = diff;
  //               bestMatchStr = baseLabels[j];
  //             }
  //           }

  //           if (metaDict[bestMatchStr]) {
  //             metaDict[bestMatchStr] += 1;
  //           } else {
  //             metaDict[bestMatchStr] = 1;
  //           }
  //           if(bestMatchStr === 'ballistic_shield'){
  //             console.log(s +":" + i);
  //           }

  //           if (s === screenshotsCount && i === 15) {
  //             console.log('-----Report-----');
  //             console.log(metaDict);
  //             setMetaDictState(metaDict);
  //           }
  //         };
  //       }
  //     }
  //   }
  // }, [baseImgData, factionName])


  // afterDraw: (chart) => handleDrawImage(chart, graphData[0], 1),
