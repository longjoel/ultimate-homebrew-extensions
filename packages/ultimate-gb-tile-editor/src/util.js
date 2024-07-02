/** Utility functions */
export function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


export function binToHex(s) {
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

export function pixelsToCByteArray(name, data) {
    const bitMap = { 0: "00", 1: "01", 2: "10", 3: "11" };
    let arr = data.map((d) => bitMap[d]);
    let outStr = `const char *${name} = {${binToHex(arr.join(""))}};`;
    return outStr;
};
