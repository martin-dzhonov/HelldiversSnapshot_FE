
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express, { response } from "express";
import Jimp from "jimp";
const fs = require('fs');
const app = express();
const port = 3001;


const { createWorker } = require('tesseract.js');
const worker = await createWorker('eng');


app.get('/filter', (req, res) => {
    const dirPath = `Screenshots/Terminid/Latest`;

    fs.readdir(dirPath, (err, files) => {
        const promisesArr = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const promise = new Promise((resolve, reject) => {
                Jimp.read(dirPath + '/' + file, (err, image) => {
                    const imageColor = image.getPixelColor(92, 50);
                    const colorRGB = Jimp.intToRGBA(imageColor);
                    const faction = getFaction(colorRGB);
                    resolve(file + ":" + faction);
                });
            });
            promisesArr.push(promise);
        }

        const validImages = [];
        Promise.all(promisesArr).then((values) => {
            for (let j = values.length - 1; j > 3; j--) {
                if (j % 10 === 0) {
                    console.log(j)
                }
                const value = values[j];
                const nextValue = values[j - 1];
                const nextNextValue = values[j - 2];
                const splitValue = value.split(":");
                const splitNextValue = nextValue.split(":");
                const splitNextNextValue = nextNextValue.split(":");

                if (splitNextValue[1] !== 'invalid' && splitValue[1] === 'invalid') {
                    validImages.push(splitNextValue[0])
                    validImages.push(splitNextNextValue[0])
                }
            }

            const filesCopy = files.filter(function (el) {
                return validImages.indexOf(el) < 0;
            }).map((item) => dirPath + '/' + item);

            deleteFiles(filesCopy, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send('all files removed');
                }
            });
        });
    });
});

app.get('/generate', (req, res) => {
    const faction = "Terminid";
    const baseImgSize = 70;

    const startX = 58;
    const startY = 842;
    const offsetX = [
        1, 16, 31, 46,
        185, 200, 216, 231,
        366, 382, 397, 412,
        551, 566, 581, 596
    ];

    fs.readdir('assets', (err, assets) => {

        const assetsPromiseArr = [];
        const matchDataPromiseArr = [];
        const baseDirectory = `Screenshots/Terminid/All`

        assets.forEach((asset) => {
            assetsPromiseArr.push(new Promise((resolve, reject) => {
                Jimp.read('assets/' + asset, (err, image) => {
                    resolve([image, asset]);
                });
            }));
        })

        Promise.all(assetsPromiseArr).then((assetsImg) => {
            fs.readdir(baseDirectory, (err, files) => {
                for (let i = 1000; i < 1858; i++) {
                    const screenshotPath = `${baseDirectory}/${files[i]}`;

                    const matchItemsPromise = new Promise((resolve, reject) => {
                        Jimp.read(screenshotPath, (err, image) => {
                            if (i % 2 === 0) {
                                const players = [[], [], []];
                                for (let j = 4; j < 16; j++) {
                                    const strategemImage = image.clone();
                                    const offset = startX + offsetX[j] + (baseImgSize * j);
                                    strategemImage.crop(offset, startY, baseImgSize, baseImgSize);

                                    let maxDiff = 100000;
                                    let bestMatchname = "";
                                    for (let k = 0; k < assetsImg.length; k++) {
                                        const matchDiff = getItemDiff(strategemImage, assetsImg[k][0]);
                                        if (matchDiff < maxDiff) {
                                            maxDiff = matchDiff;
                                            bestMatchname = assetsImg[k][1];
                                        }
                                    }
                                    if (bestMatchname === "empty.png") bestMatchname = "";

                                    const playerIndex = Math.floor(j / 4) - 1;
                                    players[playerIndex].push(bestMatchname.replace(".png", ""));
                                }

                                const metaData = fs.statSync(screenshotPath);
                                resolve({
                                    id: files[i],
                                    created: metaData.mtime,
                                    players: players
                                })
                            } else {
                                const tesseractTypePromise = new Promise((resolve, reject) => {
                                    const typeClone = image.clone();
                                    typeClone.crop(25, 170, 610, 110);
                                    typeClone.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                                        const bufferPromise = asyncCall(buffer);
                                        bufferPromise.then((result) => {
                                            resolve(result.split(/\r?\n/)[1]);
                                        })
                                    });
                                });
                                const tesseractDiffPromise = new Promise((resolve, reject) => {
                                    const typeClone = image.clone();
                                    typeClone.crop(885, 865, 215, 45);
                                    typeClone.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                                        const bufferPromise = asyncCall(buffer);
                                        bufferPromise.then((result) => {
                                            resolve(result);
                                        })
                                    });
                                });

                                Promise.all([tesseractTypePromise, tesseractDiffPromise]).then((result) => {

                                    let diffIndex = 2;
                                    const difficulties = ["HELLDIVE", "IMPOSSIBLE", "SUICIDE MISSION"];
                                    difficulties.forEach((arrItem, arrIndex) => {
                                        const indexFound = result[1].indexOf(arrItem) !== -1;

                                        if (indexFound) diffIndex = arrIndex;
                                    })

                                    resolve({
                                        missionType: result[0],
                                        difficulty: 9 - diffIndex
                                    })
                                })
                            }
                        })
                    });

                    matchDataPromiseArr.push(matchItemsPromise);
                }

                Promise.all(matchDataPromiseArr).then((result) => {
                    const resultParsed = [];
                    for (let i = 0; i < result.length; i++) {
                        if (i % 2 === 0) {
                            const tessResult = result[i + 1];


                            resultParsed.push({
                                type: tessResult.missionType,
                                difficulty: tessResult.difficulty,
                                ...result[i]
                            });
                        }
                    }

                    fs.readFile('dataTerminid.json', 'utf8', function (err, data) {
                        let pastData = [];
                        if(data){
                            pastData = JSON.parse(data);
                        }
                        
                       const joined = pastData.concat(resultParsed);

                        fs.writeFile('dataTerminid1.json', JSON.stringify(joined), (err) => {
                            if (err) throw err;
                            res.send("success");
                        });
                    });
                })
            });
        });
    })
});

function deleteFiles(files, callback) {
    if (files.length == 0) callback();
    else {
        var f = files.pop();
        fs.unlink(f, function (err) {
            if (err) callback(err);
            else {
                deleteFiles(files, callback);
            }
        });
    }
}

function getItemDiff(image, asset) {
    const imgSize = 70;
    let total = 0;

    for (let x = 0; x < imgSize; x++) {
        for (let y = 0; y < imgSize; y++) {
            let p1 = Jimp.intToRGBA(image.getPixelColor(x, y));
            let p2 = Jimp.intToRGBA(asset.getPixelColor(x, y));

            let pixelDiff = getPixelMissmatch(p1, p2);
            if (
                (p1.red < 50 && p1.green < 50 && p1.blue < 50) &&
                (p2.red < 50 && p2.green < 50 && p2.blue < 50)
            ) {
                pixelDiff = 0;
            }

            if (
                (p1.red > 180 && p1.green > 80 && p1.blue < 82) &&
                (p2.red > 180 && p2.green > 80 && p2.blue < 82)
            ) {
                pixelDiff = 0;
            }

            total = total + pixelDiff;
        }
    }
    return total;
}

const getPixelMissmatch = (p1, p2) => {
    const deltaR = Math.abs(p1.r - p2.r);
    const deltaG = Math.abs(p1.g - p2.g);
    const deltaB = Math.abs(p1.b - p2.b);
    const totalDiff = deltaR + deltaG + deltaB;
    return totalDiff / 2;
}

const getFaction = (pixel) => {
    if (pixel.r > 250 && pixel.g > 90 && pixel.g < 95 && pixel.b > 90 && pixel.b < 95) {
        return 'automaton';
    } else if (pixel.r > 250 && pixel.g > 178 && pixel.g < 195 && pixel.b < 10) {
        return 'terminid';
    } else if (pixel.r > 75 && pixel.g > 85 && pixel.g < 95 && pixel.b > 95 && pixel.b < 105) {
        return 'terminid';
    }
    return 'invalid';
}

async function asyncCall(buffer) {
    const { data: { text } } = await worker.recognize(buffer);
    return text;
}

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

app.get('/download', (req, res) => {
    res.send('Welcome to my server!');
});

app.get('/test', (req, res) => {
    fs.readFile("myjsonfile.json", 'utf8', (err, data) => {
        res.setHeader('Access-Control-Allow-Origin', "*")
        res.send(data);
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

