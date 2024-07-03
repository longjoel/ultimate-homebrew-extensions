import React from 'react';


export const TileCommands = ({ tileData, setTileData }) => {

    const clearTiles = () => {
        setTileData(new Array(64).fill(0));
    };

    const rollTilesUp = () => {
        let newTileData = [...tileData];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                newTileData[y * 8 + x] = tileData[(y % 7 + 1) * 8 + x];
            }
        }
        setTileData(newTileData);
    };
    const rollTilesDown = () => {
        let newTileData = [...tileData];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let srcY = y - 1;
                if (srcY < 0) { srcY = 7; }
                newTileData[y * 8 + x] = tileData[srcY * 8 + x];
            }
        }
        setTileData(newTileData);
    };

    const rollTilesLeft = () => {
        let newTileData = [...tileData];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                newTileData[y * 8 + x] = tileData[y * 8 + (x + 1) % 8];
            }
        }
        setTileData(newTileData);
    };

    const flipTilesHorizontal = () => {
        let newTileData = [...tileData];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 4; x++) {
                let srcX = 7 - x;
                newTileData[y * 8 + x] = tileData[y * 8 + srcX];
                newTileData[y * 8 + srcX] = tileData[y * 8 + x];
            }
        }
        setTileData(newTileData);
    };

    const rollTilesRight = () => {
        let newTileData = [...tileData];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let srcX = x - 1;
                if (srcX < 0) { srcX = 7; }
                newTileData[y * 8 + x] = tileData[y * 8 + srcX];
            }
        }
        setTileData(newTileData);
    };

    const flipTilesVertical = () => {
        let newTileData = [...tileData];
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 8; x++) {
                let srcY = 7 - y;
                newTileData[y * 8 + x] = tileData[srcY * 8 + x];
                newTileData[srcY * 8 + x] = tileData[y * 8 + x];
            }
        }
        setTileData(newTileData);
    };

    const rotateCW = () => {
        let newTileData = [...tileData];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                newTileData[y * 8 + x] = tileData[(7 - x) * 8 + y];
            }
        }
        setTileData(newTileData);
    };

    const buttonStyle = { width: '50%' };
    return <div>
        <button style={{ width: '100%' }} onClick={clearTiles}>Clear</button>
        <button style={buttonStyle} onClick={rollTilesUp}>Roll up</button>
        <button style={buttonStyle} onClick={rollTilesDown}>Roll down</button>
        <button style={buttonStyle} onClick={rollTilesLeft}>Roll left</button>
        <button style={buttonStyle} onClick={rollTilesRight}>Roll right</button>
        <button style={buttonStyle} onClick={flipTilesHorizontal}>Flip Horizontal</button>
        <button style={buttonStyle} onClick={flipTilesVertical}>Flip Vertical</button>
        <button style={buttonStyle} onClick={rotateCW}>Rotate CW</button>
        <br />
    </div>;
};
