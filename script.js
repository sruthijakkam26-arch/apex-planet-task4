const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "electronics",
        price: 1499,
        emoji: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "electronics",
        price: 2499,
        emoji: "⌚"
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "fashion",
        price: 1999,
        emoji: "👟"
    },
    {
        id: 4,
        name: "Casual T-Shirt",
        category: "fashion",
        price: 599,
        emoji: "👕"
    },
    {
        id: 5,
        name: "Travel Backpack",
        category: "accessories",
        price: 999,
        emoji: "🎒"
    },
    {
        id: 6,
        name: "Sunglasses",
        category: "accessories",
        price: 799,
        emoji: "🕶️"
    }
];

const productList = document.getElementById("productList");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");
const productCount = document.getElementById("productCount");

function displayProducts() {
    const searchText = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const sort = sortSelect.value;

    let filtered = products.filter(product => {
        const matchesName = product.name
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
            category === "all" || product.category === category;

        return matchesName && matchesCategory;
    });

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    productList.innerHTML = "";

    if (filtered.length === 0) {
        productList.textContent = "No products found.";
    } else {
        filtered.forEach(product => {
            const card = document.createElement("article");
            card.className = "product";

            const emoji = document.createElement("div");
            emoji.className = "emoji";
            emoji.textContent = product.emoji;

            const name = document.createElement("h3");
            name.textContent = product.name;

            const categoryText = document.createElement("p");
            categoryText.textContent =
                product.category.charAt(0).toUpperCase() +
                product.category.slice(1);

            const price = document.createElement("p");
            price.className = "price";
            price.textContent = "₹" + product.price.toLocaleString("en-IN");

            card.append(emoji, name, categoryText, price);
            productList.appendChild(card);
        });
    }

    productCount.textContent =
        filtered.length + " product(s) found";
}

searchInput.addEventListener("input", displayProducts);
categorySelect.addEventListener("change", displayProducts);
sortSelect.addEventListener("change", displayProducts);


// TO-DO LIST WITH LOCAL STORAGE

const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const clearTasksButton = document.getElementById("clearTasks");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("smartspaceTasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean"
        );
    }
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem(
        "smartspaceTasks",
        JSON.stringify(tasks)
    );
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            displayTasks();
        });

        li.append(checkbox, span, deleteButton);
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();
    displayTasks();
    taskInput.value = "";
    taskInput.focus();
}

addTaskButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

clearTasksButton.addEventListener("click", () => {
    if (tasks.length === 0) {
        alert("There are no tasks to clear.");
        return;
    }

    if (confirm("Are you sure you want to delete all tasks?")) {
        tasks = [];
        saveTasks();
        displayTasks();
    }
});

displayProducts();
displayTasks();