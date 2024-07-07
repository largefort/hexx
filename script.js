const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 100; // Adjust for sidebar width
canvas.height = window.innerHeight - 50; // Adjust for resource bar height

const resources = {
    wood: { amount: 0, production: 0 },
    stone: { amount: 0, production: 0 },
    food: { amount: 0, production: 0 },
    gold: { amount: 0, production: 0 },
    iron: { amount: 0, production: 0 }
};

const buildings = [];

let selectedBuilding = null;
let offsetX, offsetY;

function loadImages() {
    document.querySelectorAll('.building').forEach(building => {
        const img = new Image();
        img.src = building.querySelector('img').src;
        building.img = img;
    });
}

function drawBuildings() {
    buildings.forEach(building => {
        ctx.drawImage(building.img, building.x, building.y, building.width, building.height);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBuildings();
    requestAnimationFrame(draw);
}

function updateResources() {
    Object.keys(resources).forEach(resource => {
        resources[resource].amount += resources[resource].production;
        document.getElementById(`${resource}-amount`).innerText = resources[resource].amount;
        document.getElementById(`${resource}-production`).innerText = `(+${resources[resource].production}/s)`;
    });
}

function addProduction() {
    buildings.forEach(building => {
        resources[building.type].production += building.production;
    });
}

document.querySelectorAll('.building').forEach(building => {
    building.addEventListener('mousedown', e => {
        const type = building.getAttribute('data-type');
        const img = building.img;

        selectedBuilding = {
            type,
            img,
            x: e.clientX - 50, // Initial position
            y: e.clientY - 50, // Initial position
            width: 50,
            height: 50,
            production: 1
        };
        buildings.push(selectedBuilding);
    });
});

canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    buildings.forEach(building => {
        if (mouseX >= building.x && mouseX <= building.x + building.width &&
            mouseY >= building.y && mouseY <= building.y + building.height) {
            selectedBuilding = building;
            offsetX = mouseX - building.x;
            offsetY = mouseY - building.y;
        }
    });
});

canvas.addEventListener('mousemove', e => {
    if (selectedBuilding) {
        const rect = canvas.getBoundingClientRect();
        selectedBuilding.x = e.clientX - rect.left - offsetX;
        selectedBuilding.y = e.clientY - rect.top - offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    selectedBuilding = null;
});

loadImages();
draw();
addProduction();
setInterval(updateResources, 1000);
