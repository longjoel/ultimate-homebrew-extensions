import React, { useEffect } from 'react';

export function TilesPreview({
    tileCollection,
    currentTileIndex,
    ontileChange
}) {

    const canvasRef = React.useRef();

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
                                if (!tile) {
                                    continue;
                                }
                                const color = tile[y * 8 + x];
                                ctx.fillStyle = color === 0 ? "white" : color === 1 ? "lightgray" : color === 2 ? "gray" : "black";
                                ctx.fillRect((gridX * scaleWidth) + (x * pixelWidth), gridY * scaleHeight + (y * pixelHeight), pixelWidth, pixelHeight);
                            }
                        }

                        if (i === currentTileIndex) {
                            ctx.strokeStyle = "red";
                            ctx.strokeRect(gridX * scaleWidth, gridY * scaleHeight, scaleWidth, scaleHeight);
                        }

                    }


                }
                ctx.strokeStyle = "red";
                ctx.strokeRect(0, currentTileIndex * scaleHeight, scaleWidth, scaleHeight);
            }

        }


    }, [tileCollection, currentTileIndex]);

    return <div>
        <canvas width={8 * 16} height={32 * 16} ref={canvasRef} ></canvas>
    </div>;
}