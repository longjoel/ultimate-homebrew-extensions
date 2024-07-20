import React, { useEffect } from 'react';

export function TilesPreview({
    tileCollection,
    currentTileIndex,
    ontileChange
}) {

  
    const canvasRef = React.useRef();

    const onPreviewClick = (event) => {

        const canvas = canvasRef.current;
        const scaleWidth = canvas.width / 8;
        const scaleHeight = canvas.height / 32;
        var rect = canvasRef.current.getBoundingClientRect();
        var newMouseState = {  x: event.clientX - rect.left, y: event.clientY - rect.top };

        const x = Math.floor(newMouseState.x / scaleWidth);
        const y = Math.floor(newMouseState.y / scaleHeight);
        const index = y * 8 + x;
        ontileChange(index);
    };


    useEffect(() => {
        const canvas = canvasRef.current;
        const scaleWidth = canvas.width / 8;
        const scaleHeight = canvas.height / 32;
        const pixelWidth = scaleWidth / 8;
        const pixelHeight = scaleHeight / 8;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                for (let gridY = 0; gridY < 32; gridY++) {
                    for (let gridX = 0; gridX < 8; gridX++) {

                        let i = gridY * 8 + gridX;
                        for (let y = 0; y < 8; y++) {
                            for (let x = 0; x < 8; x++) {
                                const tile = tileCollection[i];
                                if (!tile || !tile.length) {
                                    continue;
                                }
                                const color = tile[y * 8 + x];
                                ctx.fillStyle = color === 0 ? "black" : color === 1 ? "gray" : color === 2 ? "lightgray" : "white";
                                ctx.fillRect((gridX * scaleWidth) + (x * pixelWidth), gridY * scaleHeight + (y * pixelHeight), pixelWidth, pixelHeight);
                            }
                        }

                        if (i === currentTileIndex) {
                            ctx.strokeStyle = "red";
                            ctx.strokeRect(gridX * scaleWidth, gridY * scaleHeight, scaleWidth, scaleHeight);
                        }

                    }


                }
            
            }

        }


    }, [tileCollection, currentTileIndex]);

    return <div>
        <canvas width={8 * 32} height={32 * 32} ref={canvasRef} onClick={onPreviewClick}></canvas>
    </div>;
}