let filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, min: 0, max: 200, unit: "%" },
    saturation: { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    greyscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" }
};

const imagecanvas = document.getElementById("image-canvas");
const imgInput = document.getElementById("image-input");
const canvasCtx = imagecanvas ? imagecanvas.getContext("2d") : null;

// Fixed: Removed '#' from getElementById
const resetButton = document.getElementById("reset-btn");
const downloadButton = document.getElementById("download-btn");
const presetContainer = document.querySelector(".presets");
const filtersContainer = document.querySelector(".filters");

let currentImage = null; 

function createFilterElement(name, unit = "%", value, min, max) {
    const div = document.createElement("div");
    div.classList.add("filter");

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;
    input.id = name;

    const p = document.createElement("p");
    p.innerText = `${name}: ${value}${unit}`;

    div.appendChild(p);
    div.appendChild(input);

    input.addEventListener("input", () => {
        filters[name].value = input.value;
        p.innerText = `${name}: ${input.value}${unit}`;
        applyFilters();
    });

    return div;
}

// Fixed: Removed extra '});' syntax error
function createFilters() {
    if (!filtersContainer) return;
    filtersContainer.innerHTML = "";
    Object.keys(filters).forEach(key => {
        const filterElement = createFilterElement(
            key, 
            filters[key].unit, 
            filters[key].value, 
            filters[key].min, 
            filters[key].max
        );
        filtersContainer.appendChild(filterElement);
    });
}
createFilters();

if (imgInput) {
    imgInput.addEventListener("change", (event) => {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return;

        const imagePlaceholder = document.querySelector(".placeholder");
        if (imagecanvas) imagecanvas.style.display = "block";
        if (imagePlaceholder) imagePlaceholder.style.display = "none";

        currentImage = new Image();
        currentImage.src = URL.createObjectURL(uploadedFile);
        currentImage.onload = () => {
            imagecanvas.width = currentImage.width;
            imagecanvas.height = currentImage.height;
            applyFilters();
        };
    });
}

function applyFilters() {
    if (!canvasCtx || !currentImage) return;

    canvasCtx.filter = 
        `brightness(${filters.brightness.value}${filters.brightness.unit}) ` +
        `contrast(${filters.contrast.value}${filters.contrast.unit}) ` +
        `saturate(${filters.saturation.value}${filters.saturation.unit}) ` +
        `hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit}) ` +
        `blur(${filters.blur.value}${filters.blur.unit}) ` +
        `grayscale(${filters.greyscale.value}${filters.greyscale.unit}) ` +
        `sepia(${filters.sepia.value}${filters.sepia.unit}) ` +
        `opacity(${filters.opacity.value}${filters.opacity.unit}) ` +
        `invert(${filters.invert.value}${filters.invert.unit})`;

    canvasCtx.drawImage(currentImage, 0, 0);
}

if (resetButton) {
    resetButton.addEventListener("click", () => {
        filters = {
            brightness: { value: 100, min: 0, max: 200, unit: "%" },
            contrast: { value: 100, min: 0, max: 200, unit: "%" },
            saturation: { value: 100, min: 0, max: 200, unit: "%" },
            hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
            blur: { value: 0, min: 0, max: 20, unit: "px" },
            greyscale: { value: 0, min: 0, max: 100, unit: "%" },
            sepia: { value: 0, min: 0, max: 100, unit: "%" },
            opacity: { value: 100, min: 0, max: 100, unit: "%" },
            invert: { value: 0, min: 0, max: 100, unit: "%" }
        };
        createFilters();
        applyFilters();
    });
}

if (downloadButton) {
    downloadButton.addEventListener("click", () => {
        if (!imagecanvas) return;
        const link = document.createElement("a");
        link.download = "filtered-image.png";
        link.href = imagecanvas.toDataURL();
        link.click();
    });
}

const presets = {
    normal: { brightness: 100, contrast: 100, saturation: 100, hueRotation: 0, blur: 0, greyscale: 0, sepia: 0, opacity: 100, invert: 0 },
    vintage: { brightness: 105, contrast: 90, saturation: 75, hueRotation: -10, blur: 0, greyscale: 5, sepia: 35, opacity: 100, invert: 0 },
    blackAndWhite: { brightness: 105, contrast: 115, saturation: 0, hueRotation: 0, blur: 0, greyscale: 100, sepia: 0, opacity: 100, invert: 0 },
    cinematic: { brightness: 95, contrast: 125, saturation: 85, hueRotation: -5, blur: 0, greyscale: 5, sepia: 8, opacity: 100, invert: 0 },
    warm: { brightness: 105, contrast: 105, saturation: 115, hueRotation: -12, blur: 0, greyscale: 0, sepia: 15, opacity: 100, invert: 0 },
    cool: { brightness: 100, contrast: 110, saturation: 105, hueRotation: 15, blur: 0, greyscale: 0, sepia: 0, opacity: 100, invert: 0 },
    vibrant: { brightness: 105, contrast: 115, saturation: 145, hueRotation: 0, blur: 0, greyscale: 0, sepia: 0, opacity: 100, invert: 0 }
};

if (presetContainer) {
    Object.keys(presets).forEach(presetName => {
        const presetButton = document.createElement("button");
        presetButton.classList.add("preset-btn");
        presetButton.innerText = presetName;

        // Fixed: Corrected 'prestButton' spelling to 'presetButton'
        presetButton.addEventListener("click", () => {
            const presetFilters = presets[presetName];
            Object.keys(presetFilters).forEach(filterName => {
                if (filters[filterName]) {
                    filters[filterName].value = presetFilters[filterName];
                }
            });
            createFilters();
            applyFilters();
        });

        presetContainer.appendChild(presetButton);
    });
}