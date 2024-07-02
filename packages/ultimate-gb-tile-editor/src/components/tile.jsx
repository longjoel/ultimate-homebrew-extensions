import React, { useRef } from "react";
import { getMousePos } from "../util";

export function Tile({
    tileData,
    ontileDataChange,
    leftCursorColor,
    rightCursorColor,
}) {

    const canvasRef = useRef();

    let isMouseDown = false;

    const plotPixel = (e) => {
        const scale = canvasRef.current.width / 8;

        const { x, y } = getMousePos(canvasRef.current, e);
        const cellx = Math.floor(x / scale);
        const celly = Math.floor(y / scale);

        let newData = [...tileData];
        newData[(celly * 8 + cellx)] = leftCursorColor;

        ontileDataChange(newData);
    };

    const canvas_onMouseMove = (e) => {
        if (isMouseDown) {
            plotPixel(e);
        }
    };
    const canvas_onMouseDown = (e) => {
        isMouseDown = true;
        plotPixel(e);
    };
    const canvas_onMouseUp = (e) => {
        isMouseDown = false;
    };

    const renderCanvas = () => {
        if (!canvasRef && !canvasRef.current) { requestAnimationFrame(renderCanvas); return; }

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) { requestAnimationFrame(renderCanvas); return; }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const scale = canvasRef.current.width / 8;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                switch (tileData[y * 8 + x]) {
                    case 0:
                        ctx.fillStyle = "black";
                        break;
                    case 1:
                        ctx.fillStyle = "darkgreen";
                        break;
                    case 2:
                        ctx.fillStyle = "green";
                        break;
                    case 3:
                        ctx.fillStyle = "lightgreen";
                        break;
                }

                ctx.fillRect(x * scale+1, y * scale+1, scale-2, scale-2);
            }
        }

        requestAnimationFrame(renderCanvas);
    };

    requestAnimationFrame(renderCanvas);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                onMouseMove={canvas_onMouseMove}
                onMouseDown={canvas_onMouseDown}
                onMouseUp={canvas_onMouseUp}></canvas>
        </div>
    );
};