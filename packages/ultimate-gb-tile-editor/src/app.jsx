import React, { useState, useRef, useEffect } from "react";
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

const TileEdit = ({ dataArray, indexStart, onDataChange, scale }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.fillStyle = "#e0f8d0";
    ctx.fillRect(0, 0, 8 * scale, 8 * scale);

    const colors = ["#e0f8d0", "#88c070", "#346856", "#081820"];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillStyle = colors[dataArray[indexStart + (i * 8 + j)]];
        ctx.fillRect(j * scale, i * scale, (j + 1) * scale, (i + 1) * scale);
      }
    }
  }, [canvasRef, dataArray, indexStart, scale]);

  const canvasOnClick = (e) => {
    const { x, y } = getMousePos(canvasRef.current, e);
    const cellx = Math.floor(x / scale);
    const celly = Math.floor(y / scale);

    let newData = [...dataArray];
    newData[indexStart + (celly * 8 + cellx)]++;
    if (newData[indexStart + (celly * 8 + cellx)] > 3) {
      newData[indexStart + (celly * 8 + cellx)] = 0;
    }
    onDataChange(newData);
  };

  return (
    <canvas
      onClick={canvasOnClick}
      ref={canvasRef}
      width={scale * 8}
      height={scale * 8}
    ></canvas>
  );
};

function binToHex(s) {
  const byteMap = {
    "0000": "0",
    "0001": "1",
    "0010": "2",
    "0011": "3",
    "0100": "4",
    "0101": "5",
    "0110": "6",
    "0111": "7",
    "1000": "8",
    "1001": "9",
    "1010": "A",
    "1011": "B",
    "1100": "C",
    "1101": "D",
    "1110": "E",
    "1111": "F"
  };

  let parts = [];
  for (let i = 0; i < s.length; i += 8) {
    let subStrA = byteMap[s.slice(i, i + 4)];
    let subStrB = byteMap[s.slice(i + 4, i + 8)];
    parts.push(`0x${subStrA}${subStrB}`);
  }

  return parts.join(", ");
}

const pixelsToCByteArray = (name, data) => {
  const bitMap = { 0: "00", 1: "01", 2: "10", 3: "11" };
  let arr = data.map((d) => bitMap[d]);
  let outStr = `const char *${name} = {${binToHex(arr.join(""))}};`;
  return outStr;
};

const TileEditor = ({ width, height, scale }) => {
  // single 8x8 tile
  const [tileData, setTileData] = useState(
    Array(64 * (width * height)).fill(0)
  );
  const [strOut, setStrOut] = useState("");

  useEffect(() => {
    setTileData(Array(64 * (width * height)).fill(0));
  }, [width, height]);

  const onDataChange = (data) => {
    setTileData(data);
    setStrOut(pixelsToCByteArray("test", data));
  };

  let children = [];

  let buildRow = (rowNum, width) => {
    let row = [];
    for (let w = 0; w < width; w++) {
      row.push(
        <TileEdit
          key={`${w},${rowNum}`}
          dataArray={tileData}
          indexStart={(rowNum * width + w) * 64}
          onDataChange={onDataChange}
          scale={scale}
        />
      );
    }
    return row;
  };
  for (let h = 0; h < height; h++) {
    children.push(
      <div style={{ margin: "0px", padding: "0px", lineHeight: "0px" }}>
        {buildRow(h, width)}
      </div>
    );
  }
  return (
    <div>
      {children}
      <div>
        <p>{strOut}</p>
      </div>
    </div>
  );
};

function App() {
  const [size, setSize] = useState({ w: 1, h: 1 });
  const [scale, setScale] = useState(16);
  return (
    <div className="App">
      <button onClick={() => setSize({ ...size, w: size.w + 1 })}>
        Wider</button>
      <button onClick={() => setSize({ ...size, h: size.h + 1 })}>
        Taller
      </button>

      <TileEditor width={size.w} height={size.h} scale={scale} />
    </div>
  );
}

export default App;
