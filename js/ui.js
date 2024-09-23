// ui.js

const uploadImage = document.getElementById('uploadImage');
const thresholdSlider = document.getElementById('thresholdSlider');
const thresholdDisplay = document.getElementById('thresholdDisplay');
const downloadLink = document.getElementById('downloadLink');
const clearBackgroundLink = document.getElementById('clearBackgroundLink');
const applyBlurButton = document.getElementById('applyBlur');
const applySharpenButton = document.getElementById('applySharpen');
const undoButton = document.getElementById('undoButton');
const resetButton = document.getElementById('resetButton');
const controls = document.querySelector('.controls');
const filterSection = document.querySelector('.filter-section');
const imagesSection = document.querySelector('.images');
const downloadSection = document.querySelector('.download-section');

let previousImageData;

// ui.js

const dropZone = document.getElementById('dropZone');

// Handle file selection via the drop zone
dropZone.addEventListener('click', () => {
    uploadImage.click();
});

// Handle drag over event
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

// Handle drag leave event
dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

// Handle drop event
dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        uploadImage.files = files; // Assign the dropped files to the input
        const event = new Event('change'); // Create a change event
        uploadImage.dispatchEvent(event); // Dispatch the event to trigger upload logic
    }
});


// Event listener for image upload
uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;

        image.onload = () => {
            originalCanvas.width = image.width;
            originalCanvas.height = image.height;
            processedCanvas.width = image.width;
            processedCanvas.height = image.height;

            originalCtx.drawImage(image, 0, 0);
            previousImageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
            processImage(thresholdSlider.value);

            // Show UI elements after image is loaded
            controls.style.display = 'flex';
            filterSection.style.display = 'flex';
            imagesSection.style.display = 'flex';
            downloadSection.style.display = 'block';
        };
    };

    reader.readAsDataURL(file);
});

// Event listener for threshold slider
thresholdSlider.addEventListener('input', (event) => {
    const threshold = event.target.value;
    thresholdDisplay.textContent = threshold;
    processImage(threshold);
});

// Event listener for downloading processed image
downloadLink.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = processedCanvas.toDataURL();
    link.download = 'processed_image.png';
    link.click();
});

// Event listener for downloading clear background image
clearBackgroundLink.addEventListener('click', () => {
    clearBackgroundImage();
    const link = document.createElement('a');
    link.href = processedCanvas.toDataURL('image/png');
    link.download = 'clear_background_image.png';
    link.click();
});

// Event listeners for applying filters
applyBlurButton.addEventListener('click', () => {
    previousImageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
    const imageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
    const blurredImageData = applyGaussianBlur(imageData);
    processedCtx.putImageData(blurredImageData, 0, 0);
});

applySharpenButton.addEventListener('click', () => {
    previousImageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
    const imageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
    const sharpenedImageData = applySharpening(imageData);
    processedCtx.putImageData(sharpenedImageData, 0, 0);
});

// Event listener for undoing last operation
undoButton.addEventListener('click', () => {
    if (previousImageData) {
        const tempData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
        processedCtx.putImageData(previousImageData, 0, 0);
        previousImageData = tempData; // Update previousImageData to the current state
    }
});

// Event listener for resetting all operations
resetButton.addEventListener('click', () => {
    originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    processedCtx.clearRect(0, 0, processedCanvas.width, processedCanvas.height);
    thresholdSlider.value = 150;
    thresholdDisplay.textContent = 150;
    controls.style.display = 'none';
    filterSection.style.display = 'none';
    imagesSection.style.display = 'none';
    downloadSection.style.display = 'none';
    previousImageData = null; // Reset previous image data
});
