/* =========================================================
   FINORA
   Business & Finance Management Dashboard
   Created by Abduraximova Karomatxon
========================================================= */


/* =========================
   SOUND EFFECT
========================= */

let audioContext;

function playSound(type = "click") {

    try {

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        if (type === "success") {
            oscillator.frequency.setValueAtTime(520, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                760,
                audioContext.currentTime + 0.12
            );
        } else {
            oscillator.frequency.setValueAtTime(420, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                500,
                audioContext.currentTime + 0.07
            );
        }

        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.05,
            audioContext.currentTime + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.12
        );

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.13);

    } catch (error) {
        console.log("Audio unavailable");
    }
}


/* =========================
   NAVIGATION
========================= */

const navItems = document.querySelectorAll(".nav-item[data-section]");
const sections = document.querySelectorAll(".page-section");

function showSection(sectionId) {

    sections.forEach(section => {
        section.classList.remove("active");
    });

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    const section = document.getElementById(sectionId);
    const button = document.querySelector(
        `.nav-item[data-section="${sectionId}"]`
    );

    if (section) section.classList.add("active");
    if (button) button.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    playSound("click");

    if (window.innerWidth <= 900) {
        document.getElementById("sidebar").classList.remove("open");
    }
}

navItems.forEach(item => {

    item.addEventListener("click", () => {

        const section = item.dataset.section;

        showSection(section);

        history.replaceState(null, "", `#${section}`);

    });

});


/* OPEN PAGE FROM URL */

const initialSection = location.hash.replace("#", "");

if (initialSection && document.getElementById(initialSection)) {
    showSection(initialSection);
}


/* =========================
   MOBILE MENU
========================= */

document.getElementById("mobileMenu").addEventListener("click", () => {

    document.getElementById("sidebar").classList.toggle("open");

    playSound();

});


/* =========================
   DARK / LIGHT MODE
========================= */

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    localStorage.setItem("finoraTheme", dark ? "dark" : "light");

    playSound();

});

if (localStorage.getItem("finoraTheme") === "dark") {
    document.body.classList.add("dark");
}


/* =========================
   TOAST
========================= */

let toastTimer;

function showToast(message = "Action completed successfully") {

    const toast = document.getElementById("toast");

    toast.querySelector("p").textContent = message;

    toast.classList.add("show");

    playSound("success");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}


/* =========================
   MODALS
========================= */

function openModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.add("active");
        playSound();
    }

}

function closeModal(id) {

    const modal = document.getElementById(id);

    if (modal) {
        modal.classList.remove("active");
        playSound();
    }

}

document.querySelectorAll(".modal-overlay").forEach(overlay => {

    overlay.addEventListener("click", event => {

        if (event.target === overlay) {
            overlay.classList.remove("active");
        }

    });

});


/* =========================
   TRANSACTIONS
========================= */

let transactions = JSON.parse(
    localStorage.getItem("finoraTransactions")
) || [

    {
        id: 1,
        description: "Salary Payment",
        date: "Oct 02, 2026",
        category: "Salary",
        type: "income",
        amount: 4200
    },

    {
        id: 2,
        description: "Grocery Shopping",
        date: "Oct 01, 2026",
        category: "Food",
        type: "expense",
        amount: 142.50
    },

    {
        id: 3,
        description: "Freelance Project",
        date: "Sep 30, 2026",
        category: "Business",
        type: "income",
        amount: 850
    },

    {
        id: 4,
        description: "Electricity Bill",
        date: "Sep 29, 2026",
        category: "Housing",
        type: "expense",
        amount: 95
    },

    {
        id: 5,
        description: "Taxi",
        date: "Sep 28, 2026",
        category: "Transport",
        type: "expense",
        amount: 34
    }

];


function saveTransactions() {

    localStorage.setItem(
        "finoraTransactions",
        JSON.stringify(transactions)
    );

}


function renderTransactions(search = "") {

    const recent = document.getElementById("recentTransactions");
    const finance = document.getElementById("financeTransactions");

    const filtered = transactions.filter(transaction => {

        const text = `${transaction.description} ${transaction.category}`.toLowerCase();

        return text.includes(search.toLowerCase());

    });


    if (recent) {

        recent.innerHTML = filtered
            .slice(0, 5)
            .map(transaction => transactionHTML(transaction, false))
            .join("");

    }


    if (finance) {

        finance.innerHTML = filtered
            .map(transaction => transactionHTML(transaction, true))
            .join("");

    }

}


function transactionHTML(transaction, full = false) {

    const income = transaction.type === "income";

    const icon = income ? "↓" : "↑";

    const amount = `${income ? "+" : "-"}$${transaction.amount.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;

    if (!full) {

        return `
            <tr>
                <td>
                    <div class="transaction-name">
                        <div class="transaction-icon ${income ? "green" : "red"}">
                            ${icon}
                        </div>
                        <strong>${escapeHTML(transaction.description)}</strong>
                    </div>
                </td>

                <td>${transaction.date}</td>

                <td>${escapeHTML(transaction.category)}</td>

                <td class="${income ? "positive" : "negative"}">
                    <strong>${amount}</strong>
                </td>
            </tr>
        `;

    }

    return `
        <tr>

            <td>
                <div class="transaction-name">
                    <div class="transaction-icon ${income ? "green" : "red"}">
                        ${icon}
                    </div>

                    <strong>${escapeHTML(transaction.description)}</strong>
                </div>
            </td>

            <td>${transaction.date}</td>

            <td>${escapeHTML(transaction.category)}</td>

            <td>
                <span class="type-badge ${income ? "" : "expense"}">
                    ${income ? "Income" : "Expense"}
                </span>
            </td>

            <td class="${income ? "positive" : "negative"}">
                <strong>${amount}</strong>
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    ×
                </button>
            </td>

        </tr>
    `;

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function deleteTransaction(id) {

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();
    renderTransactions();
    updateDashboardNumbers();

    showToast("Transaction deleted");

}


document.getElementById("saveTransaction").addEventListener(
    "click",
    () => {

        const description =
            document.getElementById("transactionDescription").value.trim();

        const amount =
            Number(document.getElementById("transactionAmount").value);

        const type =
            document.getElementById("transactionType").value;

        const category =
            document.getElementById("transactionCategory").value;

        if (!description || !amount || amount <= 0) {

            showToast("Please enter a valid description and amount");

            return;
        }

        transactions.unshift({

            id: Date.now(),

            description,

            date: new Date().toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                }
            ),

            category,

            type,

            amount

        });

        saveTransactions();

        renderTransactions();

        updateDashboardNumbers();

        closeModal("transactionModal");

        document.getElementById("transactionDescription").value = "";
        document.getElementById("transactionAmount").value = "";

        showToast("Transaction added successfully");

    }
);


/* =========================
   EXPENSE
========================= */

document.getElementById("saveExpense").addEventListener(
    "click",
    () => {

        const description =
            document.getElementById("expenseDescription").value.trim();

        const amount =
            Number(document.getElementById("expenseAmount").value);

        const category =
            document.getElementById("expenseCategory").value;

        if (!description || !amount || amount <= 0) {

            showToast("Enter a valid expense");

            return;

        }

        transactions.unshift({

            id: Date.now(),

            description,

            date: new Date().toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                }
            ),

            category,

            type: "expense",

            amount

        });

        saveTransactions();

        renderTransactions();

        updateDashboardNumbers();

        closeModal("expenseModal");

        document.getElementById("expenseDescription").value = "";
        document.getElementById("expenseAmount").value = "";

        showToast("Expense added successfully");

    }
);


/* =========================
   DASHBOARD NUMBERS
========================= */

function updateDashboardNumbers() {

    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses + 20000;


    document.getElementById("totalIncome").textContent =
        `$${income.toLocaleString("en-US", {
            minimumFractionDigits: 2
        })}`;

    document.getElementById("totalExpenses").textContent =
        `$${expenses.toLocaleString("en-US", {
            minimumFractionDigits: 2
        })}`;

    document.getElementById("totalBalance").textContent =
        `$${balance.toLocaleString("en-US", {
            minimumFractionDigits: 2
        })}`;

}


renderTransactions();
updateDashboardNumbers();


/* =========================
   SEARCH
========================= */

document.getElementById("transactionSearch").addEventListener(
    "input",
    event => {

        renderTransactions(event.target.value);

    }
);


document.getElementById("globalSearch").addEventListener(
    "input",
    event => {

        const query = event.target.value.toLowerCase().trim();

        if (!query) return;

        const matching = Array.from(navItems).find(item =>
            item.textContent.toLowerCase().includes(query)
        );

        if (matching) {
            showSection(matching.dataset.section);
        }

    }
);


/* =========================
   CURRENCY CONVERTER
========================= */

const rates = {

    USD: {
        USD: 1,
        EUR: 0.92,
        GBP: 0.78,
        UZS: 12350,
        JPY: 149.2
    },

    EUR: {
        USD: 1.09,
        EUR: 1,
        GBP: 0.85,
        UZS: 13420,
        JPY: 162.4
    },

    GBP: {
        USD: 1.28,
        EUR: 1.18,
        GBP: 1,
        UZS: 15800,
        JPY: 191
    },

    UZS: {
        USD: 0.000081,
        EUR: 0.000074,
        GBP: 0.000063,
        UZS: 1,
        JPY: 0.0121
    },

    JPY: {
        USD: 0.00670,
        EUR: 0.00616,
        GBP: 0.00524,
        UZS: 81.1,
        JPY: 1
    }

};


function convertCurrency() {

    const amount =
        Number(document.getElementById("convertAmount").value) || 0;

    const from =
        document.getElementById("fromCurrency").value;

    const to =
        document.getElementById("toCurrency").value;

    const rate = rates[from][to];

    const result = amount * rate;

    document.getElementById("conversionText").textContent =
        `${amount.toLocaleString()} ${from} ≈ ${result.toLocaleString(undefined, {
            maximumFractionDigits: 2
        })} ${to}`;

    document.getElementById("conversionResult").textContent =
        `${result.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} ${to}`;

    document.getElementById("rateText").textContent =
        `1 ${from} = ${rate} ${to}`;

}


document.getElementById("convertBtn").addEventListener(
    "click",
    () => {

        convertCurrency();
        showToast("Currency converted successfully");

    }
);


document.getElementById("swapCurrency").addEventListener(
    "click",
    () => {

        const from =
            document.getElementById("fromCurrency");

        const to =
            document.getElementById("toCurrency");

        const temp = from.value;

        from.value = to.value;
        to.value = temp;

        convertCurrency();

        playSound();

    }
);


document.getElementById("convertAmount").addEventListener(
    "input",
    convertCurrency
);

document.getElementById("fromCurrency").addEventListener(
    "change",
    convertCurrency
);

document.getElementById("toCurrency").addEventListener(
    "change",
    convertCurrency
);

convertCurrency();


/* =========================
   INVOICE
========================= */

function updateInvoice() {

    const client =
        document.getElementById("clientName").value.trim();

    const number =
        document.getElementById("invoiceNumber").value.trim();

    const product =
        document.getElementById("invoiceProduct").value.trim();

    const amount =
        Number(document.getElementById("invoiceAmount").value) || 0;


    document.getElementById("previewClient").textContent =
        client || "Client Name";

    document.getElementById("previewInvoiceNumber").textContent =
        number || "INV-2026-001";

    document.getElementById("previewProduct").textContent =
        product || "Web Development";

    document.getElementById("previewAmount").textContent =
        `$${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2
        })}`;

    document.getElementById("previewTotal").textContent =
        `$${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2
        })}`;

    document.getElementById("previewDate").textContent =
        new Date().toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

}


["clientName", "invoiceNumber", "invoiceProduct", "invoiceAmount"]
    .forEach(id => {

        document.getElementById(id).addEventListener(
            "input",
            updateInvoice
        );

    });


document.getElementById("generateInvoice").addEventListener(
    "click",
    () => {

        updateInvoice();

        showToast("Invoice generated successfully");

    }
);

updateInvoice();


function printInvoice() {

    showSection("invoice");

    setTimeout(() => {
        window.print();
    }, 400);

}


/* =========================
   PAYMENT
========================= */

const payAmount = document.getElementById("paymentAmount");
const payBtn = document.getElementById("payBtn");
const summaryAmount = document.getElementById("summaryAmount");
const summaryTotal = document.getElementById("summaryTotal");

function updatePayment() {

    const amount = Number(payAmount.value) || 0;

    const total = amount + 5;

    summaryAmount.textContent =
        `$${amount.toFixed(2)}`;

    summaryTotal.textContent =
        `$${total.toFixed(2)}`;

    payBtn.textContent =
        `Pay $${amount.toFixed(2)}`;

}

payAmount.addEventListener("input", updatePayment);

updatePayment();


document.getElementById("payCard").addEventListener(
    "input",
    event => {

        let value = event.target.value
            .replace(/\D/g, "")
            .slice(0, 16);

        value = value.match(/.{1,4}/g)?.join(" ") || "";

        event.target.value = value;

    }
);


payBtn.addEventListener(
    "click",
    () => {

        const name =
            document.getElementById("payName").value.trim();

        const card =
            document.getElementById("payCard").value.replace(/\s/g, "");

        const amount =
            Number(payAmount.value);

        if (!name) {

            showToast("Please enter cardholder name");

            return;

        }

        if (card.length !== 16) {

            showToast("Please enter a valid card number");

            return;

        }

        if (!amount || amount <= 0) {

            showToast("Please enter payment amount");

            return;

        }

        showToast(
            `Payment of $${amount.toFixed(2)} processed successfully`
        );

    }
);


/* =========================
   NOTIFICATION
========================= */

document.getElementById("notificationBtn").addEventListener(
    "click",
    () => {

        showToast("You have 3 new notifications");

    }
);


/* =========================
   CHARTS
========================= */

Chart.defaults.font.family = "Inter";
Chart.defaults.font.size = 10;
Chart.defaults.color = "#8a8fa3";


/* CASH FLOW */

const cashflowCanvas =
    document.getElementById("cashflowChart");

if (cashflowCanvas) {

    new Chart(cashflowCanvas, {

        type: "line",

        data: {

            labels: [
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct"
            ],

            datasets: [

                {
                    label: "Income",
                    data: [6200, 7100, 6800, 7600, 7900, 8420],
                    borderColor: "#6c5ce7",
                    backgroundColor: "rgba(108,92,231,.08)",
                    fill: true,
                    tension: .4,
                    borderWidth: 2,
                    pointRadius: 3
                },

                {
                    label: "Expenses",
                    data: [2900, 3100, 3000, 3250, 3150, 3280],
                    borderColor: "#ef5b67",
                    backgroundColor: "transparent",
                    fill: false,
                    tension: .4,
                    borderWidth: 2,
                    pointRadius: 3
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "top",
                    align: "end",
                    labels: {
                        boxWidth: 7,
                        usePointStyle: true
                    }
                }
            },

            scales: {

                y: {
                    beginAtZero: true,
                    grid: {
                        color: "#f0f0f4"
                    },
                    ticks: {
                        callback: value => "$" + value / 1000 + "K"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }

            }

        }

    });

}


/* EXPENSE DONUT */

const expenseCanvas =
    document.getElementById("expenseChart");

if (expenseCanvas) {

    new Chart(expenseCanvas, {

        type: "doughnut",

        data: {

            labels: [
                "Housing",
                "Food",
                "Transport",
                "Other"
            ],

            datasets: [
                {
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        "#6c5ce7",
                        "#4285f4",
                        "#21b573",
                        "#f59e42"
                    ],
                    borderWidth: 0
                }
            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "76%",

            plugins: {
                legend: {
                    display: false
                }
            }

        }

    });

}


/* INVESTMENT */

const investmentCanvas =
    document.getElementById("investmentChart");

if (investmentCanvas) {

    new Chart(investmentCanvas, {

        type: "line",

        data: {

            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct"
            ],

            datasets: [
                {
                    label: "Portfolio",
                    data: [
                        9500,
                        9800,
                        10100,
                        10400,
                        10900,
                        11100,
                        11600,
                        11900,
                        12300,
                        12840
                    ],
                    borderColor: "#6c5ce7",
                    backgroundColor: "rgba(108,92,231,.1)",
                    fill: true,
                    tension: .4,
                    borderWidth: 3,
                    pointRadius: 3
                }
            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {

                y: {
                    grid: {
                        color: "#f0f0f4"
                    },

                    ticks: {
                        callback: value => "$" + value / 1000 + "K"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }

            }

        }

    });

}


/* BUSINESS */

const businessCanvas =
    document.getElementById("businessChart");

if (businessCanvas) {

    new Chart(businessCanvas, {

        type: "bar",

        data: {

            labels: [
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct"
            ],

            datasets: [
                {
                    label: "Revenue",
                    data: [
                        32000,
                        35000,
                        37000,
                        41000,
                        45000,
                        48620
                    ],
                    backgroundColor: "#6c5ce7",
                    borderRadius: 6
                },

                {
                    label: "Profit",
                    data: [
                        11000,
                        12500,
                        13800,
                        15200,
                        16900,
                        18240
                    ],
                    backgroundColor: "#21b573",
                    borderRadius: 6
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "top",
                    align: "end"
                }
            },

            scales: {

                y: {
                    beginAtZero: true,

                    grid: {
                        color: "#f0f0f4"
                    },

                    ticks: {
                        callback: value => "$" + value / 1000 + "K"
                    }

                },

                x: {
                    grid: {
                        display: false
                    }
                }

            }

        }

    });

}


/* SALES */

const salesCanvas =
    document.getElementById("salesChart");

if (salesCanvas) {

    new Chart(salesCanvas, {

        type: "line",

        data: {

            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct"
            ],

            datasets: [
                {
                    label: "Sales",
                    data: [
                        52000,
                        56000,
                        58000,
                        62000,
                        65000,
                        69000,
                        72000,
                        76000,
                        81000,
                        84620
                    ],
                    borderColor: "#6c5ce7",
                    backgroundColor: "rgba(108,92,231,.1)",
                    fill: true,
                    tension: .4,
                    borderWidth: 3,
                    pointRadius: 3
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {

                y: {
                    beginAtZero: true,

                    grid: {
                        color: "#f0f0f4"
                    },

                    ticks: {
                        callback: value => "$" + value / 1000 + "K"
                    }

                },

                x: {
                    grid: {
                        display: false
                    }
                }

            }

        }

    });

}


/* =========================
   UNIVERSAL BUTTON SOUND
========================= */

document.addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button) return;

    if (
        button.id === "saveTransaction" ||
        button.id === "saveExpense" ||
        button.id === "convertBtn" ||
        button.id === "payBtn"
    ) {
        return;
    }

    playSound();

});


/* =========================
   KEYBOARD SHORTCUT
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        document
            .querySelectorAll(".modal-overlay.active")
            .forEach(modal => {
                modal.classList.remove("active");
            });

    }

});


/* =========================
   INITIAL MESSAGE
========================= */

console.log(
    "%cFINORA",
    "font-size:30px;font-weight:800;color:#6c5ce7"
);

console.log(
    "Business & Finance Management Dashboard"
);

console.log(
    "Created by Abduraximova Karomatxon"
);