import React, { useEffect, useRef } from "react";

export function TileEditor({
    tileData,
    ontileDataChange,
    leftCursorColor,
    rightCursorColor,
}) {

    const canvasRef = useRef();
    const [mouseState, setMouseState] = React.useState(
        { x: 0, y: 0, leftClick: false, rightClick: false });

    const canvas_onMouseMove = (e) => {
        var rect = canvasRef.current.getBoundingClientRect();
        var newMouseState = { ...mouseState, x: e.clientX - rect.left, y: e.clientY - rect.top };


        setMouseState(newMouseState);
    };
    const canvas_onMouseDown = (e) => {
        let newMouseState = { ...mouseState };
        if (e.button === 0) {
            newMouseState.leftClick = true;

        } else if (e.button === 2) {
            newMouseState.rightClick = true;
        }

        setMouseState(newMouseState);
    };
    const canvas_onMouseUp = (e) => {
        let newMouseState = { ...mouseState };
        if (e.button === 0) {
            newMouseState.leftClick = false;

        } else if (e.button === 2) {
            newMouseState.rightClick = false;
        }
        setMouseState(newMouseState);

    };

    useEffect(() => {
        const scale = canvasRef.current.width / 8;

        const x = Math.floor(mouseState.x / scale);
        const y = Math.floor(mouseState.y / scale);
        const index = y * 8 + x;
        let newTileData = [];
        if (tileData) { newTileData = [...tileData]; } else {
            newTileData = new Array(64).fill(0);
        }
        newTileData[index] = mouseState.leftClick ? leftCursorColor : mouseState.rightClick ? rightCursorColor : newTileData[index];

        ontileDataChange(newTileData);
    }, [mouseState]);

    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");

            if (ctx && tileData && tileData.length) {

                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                const scale = canvasRef.current.width / 8;
                for (let y = 0; y < 8; y++) {
                    for (let x = 0; x < 8; x++) {
                        switch (tileData[y * 8 + x]) {
                            case 0:
                                ctx.fillStyle = "white";
                                break;
                            case 1:
                                ctx.fillStyle = "lightgray";
                                break;
                            case 2:
                                ctx.fillStyle = "gray";
                                break;
                            case 3:
                                ctx.fillStyle = "black";
                                break;
                        }

                        ctx.fillRect(x * scale + 1, y * scale + 1, scale - 2, scale - 2);
                    }
                }

            }
        }

    }, [tileData, mouseState]);

    return (
        <div>
            <canvas
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                ref={canvasRef}
                width={400}
                height={400}
                onMouseMove={canvas_onMouseMove}
                onMouseDown={canvas_onMouseDown}
                onMouseUp={canvas_onMouseUp}></canvas>
        </div>
    );


};