import React, { useRef } from "react";

export function TileEditor({
    tileData,
    ontileDataChange,
    leftCursorColor,
    rightCursorColor,
}) {

    const canvasRef = useRef();
    const [mouseState, setMouseState] = React.useState({ x: 0, y: 0, leftClick: false, rightClick: false });



    const canvas_onMouseMove = (e) => {
        var rect = canvasRef.current.getBoundingClientRect();
        setMouseState({ ...mouseState, x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const canvas_onMouseDown = (e) => {
        if(e.button === 0){
            setMouseState({ ...mouseState, leftClick: true});
        } else if(e.button === 2){
            setMouseState({ ...mouseState, rightClick: true});
        }

        
    };
    const canvas_onMouseUp = (e) => {
        if(e.button === 0){
            setMouseState({ ...mouseState, leftClick: false});
        } else if(e.button === 2){
            setMouseState({ ...mouseState, rightClick: false});
        }

    };
    const renderCanvas = () => {

    

        if (canvasRef && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");

            if (ctx) {

                if(mouseState.leftClick || mouseState.rightClick) {
                    const scale = canvasRef.current.width / 8;
                    const x = Math.floor(mouseState.x / scale);
                    const y = Math.floor(mouseState.y / scale);
                    const index = y * 8 + x;
                    let newTileData = [...tileData];
                    newTileData[index] = mouseState.leftClick ? leftCursorColor :  mouseState.rightClick ? rightCursorColor : tileData[index];
                    ontileDataChange(newTileData);
                }

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

                        ctx.fillRect(x * scale + 1, y * scale + 1, scale - 2, scale - 2);
                    }
                }

            }
        }
        requestAnimationFrame(renderCanvas);
    };

    requestAnimationFrame(renderCanvas);

    return (
        <div>
            <canvas
            onContextMenu={(e) => {e.preventDefault(); e.stopPropagation();}}
                ref={canvasRef}
                width={400}
                height={400}
                onMouseMove={canvas_onMouseMove}
                onMouseDown={canvas_onMouseDown}
                onMouseUp={canvas_onMouseUp}></canvas>
        </div>
    );
};