// imageProcessing.js
const originalCtx = originalCanvas.getContext('2d');
const processedCtx = processedCanvas.getContext('2d');

// Process the image based on threshold (black/white)
function processImage(threshold) {
    const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
    const data = imageData.data;
    const processedImageData = processedCtx.createImageData(originalCanvas.width, originalCanvas.height);
    const processedData = processedImageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const color = avg < threshold ? 0 : 255;
        processedData[i] = color;        // Red
        processedData[i + 1] = color;    // Green
        processedData[i + 2] = color;    // Blue
        processedData[i + 3] = 255;      // Fully opaque
    }

    processedCtx.putImageData(processedImageData, 0, 0);
}

// Create clear background image (turn white pixels transparent)
function clearBackgroundImage() {
    const imageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
            data[i + 3] = 0; // Make white pixels transparent
        }
    }

    processedCtx.putImageData(imageData, 0, 0);
}
