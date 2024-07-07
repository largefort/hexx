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
let isDragging = false;
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
    saveGameState();
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
        const rect = canvas.getBoundingClientRect();

        selectedBuilding = {
            type,
            img,
            x: e.clientX - rect.left - 25, // Adjust for image center
            y: e.clientY - rect.top - 25, // Adjust for image center
            width: 50,
            height: 50,
            production: 1
        };

        isDragging = true;
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
            isDragging = true;
        }
    });
});

canvas.addEventListener('mousemove', e => {
    if (isDragging && selectedBuilding) {
        const rect = canvas.getBoundingClientRect();
        selectedBuilding.x = e.clientX - rect.left - offsetX;
        selectedBuilding.y = e.clientY - rect.top - offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDragging && selectedBuilding) {
        if (!buildings.includes(selectedBuilding)) {
            buildings.push(selectedBuilding);
            addProduction();
        }
        saveGameState();
    }
    isDragging = false;
    selectedBuilding = null;
});

function saveGameState() {
    const gameState = {
        resources,
        buildings: buildings.map(building => ({
            type: building.type,
            x: building.x,
            y: building.y,
            width: building.width,
            height: building.height,
            production: building.production
        }))
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        Object.assign(resources, gameState.resources);
        gameState.buildings.forEach(savedBuilding => {
            const img = new Image();
            img.src = `./${savedBuilding.type}.png`;
            buildings.push({ ...savedBuilding, img });
        });
    }
}

loadImages();
loadGameState();
draw();
setInterval(updateResources, 1000);

