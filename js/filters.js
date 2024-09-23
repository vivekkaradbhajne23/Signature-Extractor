// filters.js

// Apply Gaussian blur (smoothing filter)
function applyGaussianBlur(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    const radius = 2;
    const kernelSize = radius * 2 + 1;
    const kernel = createGaussianKernel(radius);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const r = applyKernel(x, y, data, width, height, kernel);
            const g = applyKernel(x, y, data, width, height, kernel, 1);
            const b = applyKernel(x, y, data, width, height, kernel, 2);
            const a = 255;

            const index = (y * width + x) * 4;
            newData[index] = Math.min(255, Math.max(0, r));
            newData[index + 1] = Math.min(255, Math.max(0, g));
            newData[index + 2] = Math.min(255, Math.max(0, b));
            newData[index + 3] = a;
        }
    }

    return new ImageData(newData, width, height);
}

// Create Gaussian kernel
function createGaussianKernel(radius) {
    const kernelSize = radius * 2 + 1;
    const kernel = new Array(kernelSize);
    const sigma = radius / 2;
    let sum = 0;

    for (let y = -radius; y <= radius; y++) {
        kernel[y + radius] = new Array(kernelSize);
        for (let x = -radius; x <= radius; x++) {
            const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
            kernel[y + radius][x + radius] = value;
            sum += value;
        }
    }

    for (let y = 0; y < kernelSize; y++) {
        for (let x = 0; x < kernelSize; x++) {
            kernel[y][x] /= sum;
        }
    }

    return kernel;
}

// Apply kernel to image data
function applyKernel(x, y, data, width, height, kernel, channel = 0) {
    const radius = (kernel.length - 1) / 2;
    let value = 0;

    for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
            const px = x + kx;
            const py = y + ky;

            if (px >= 0 && px < width && py >= 0 && py < height) {
                const index = (py * width + px) * 4 + channel;
                value += data[index] * kernel[ky + radius][kx + radius];
            }
        }
    }

    return value;
}

// Apply sharpening filter
function applySharpening(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    const kernel = [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const r = applyKernel(x, y, data, width, height, kernel);
            const g = applyKernel(x, y, data, width, height, kernel, 1);
            const b = applyKernel(x, y, data, width, height, kernel, 2);
            const a = 255;

            const index = (y * width + x) * 4;
            newData[index] = Math.min(255, Math.max(0, r));
            newData[index + 1] = Math.min(255, Math.max(0, g));
            newData[index + 2] = Math.min(255, Math.max(0, b));
            newData[index + 3] = a;
        }
    }

    return new ImageData(newData, width, height);
}
