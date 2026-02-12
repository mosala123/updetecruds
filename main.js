// تحديد العناصر
let Title = document.getElementById("Title");
let Price = document.getElementById("Price");
let Tax = document.getElementById("Tax");
let Ads = document.getElementById("Ads");
let Discount = document.getElementById("Discount");
let totalSpan = document.getElementById("total");
let Count = document.getElementById("Count");
let Category = document.getElementById("Category");
let Create = document.querySelector(".Create");

let mood = "create";
let tmp; // فهرس التحديث

// قاعدة البيانات المحلية
let dataPro = localStorage.getItem("product") 
    ? JSON.parse(localStorage.getItem("product")) 
    : [];

// ========== حساب الإجمالي ==========
function getTotal() {
    let priceVal = parseFloat(Price.value) || 0;
    let taxVal = parseFloat(Tax.value) || 0;
    let adsVal = parseFloat(Ads.value) || 0;
    let discountVal = parseFloat(Discount.value) || 0;

    if (priceVal > 0) {
        let result = (priceVal + taxVal + adsVal) - discountVal;
        totalSpan.textContent = result;
        totalSpan.classList.remove("badge-secondary");
        totalSpan.classList.add("badge-success");
    } else {
        totalSpan.textContent = "0";
        totalSpan.classList.remove("badge-success");
        totalSpan.classList.add("badge-secondary");
    }
}

// ========== مسح الحقول ==========
function clearInputs() {
    Title.value = "";
    Price.value = "";
    Tax.value = "";
    Ads.value = "";
    Discount.value = "";
    Count.value = "";
    Category.value = "";
    totalSpan.textContent = "0";
    totalSpan.classList.remove("badge-success");
    totalSpan.classList.add("badge-secondary");
}

// ========== عرض البيانات (read) ==========
function readData() {
    getTotal(); // تحديث الإجمالي الحالي
    let table = "";

    for (let i = 0; i < dataPro.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].Title || ""}</td>
            <td>${dataPro[i].Price || 0}</td>
            <td>${dataPro[i].Tax || 0}</td>
            <td>${dataPro[i].Ads || 0}</td>
            <td>${dataPro[i].Discount || 0}</td>
            <td>${dataPro[i].total || 0}</td>
            <td>${dataPro[i].Category || ""}</td>
            <td>
                <button onclick="updateData(${i})" class="btn btn-sm btn-primary">
                    <i class="bi bi-pencil"></i> تحديث
                </button>
                <button onclick="deleteData(${i})" class="btn btn-sm btn-danger">
                    <i class="bi bi-trash"></i> حذف
                </button>
            </td>
        </tr>
        `;
    }

    document.getElementById("tbody").innerHTML = table;

    // زر حذف الكل
    let deleteAllDiv = document.getElementById("deleteAll");
    if (dataPro.length > 0) {
        deleteAllDiv.innerHTML = `
            <button onclick="deleteAll()" class="btn btn-danger btn-block">
                <i class="bi bi-trash-fill"></i> حذف الكل (${dataPro.length})
            </button>
        `;
    } else {
        deleteAllDiv.innerHTML = "";
    }
}

// ========== إنشاء أو تحديث منتج ==========
Create.onclick = function () {
    // التحقق من الحقول الأساسية
    if (!Title.value.trim() || !Price.value || !Category.value.trim()) {
        alert("يرجى إدخال العنوان والسعر والفئة");
        return;
    }

    // تحويل القيم الرقمية
    let countVal = parseInt(Count.value) || 1;
    if (countVal < 1) countVal = 1;
    if (countVal > 100) countVal = 100; // حد أقصى للحماية

    let newProduct = {
        Title: Title.value.toLowerCase().trim(),
        Price: parseFloat(Price.value) || 0,
        Tax: parseFloat(Tax.value) || 0,
        Ads: parseFloat(Ads.value) || 0,
        Discount: parseFloat(Discount.value) || 0,
        total: totalSpan.textContent,
        Category: Category.value.toLowerCase().trim()
    };

    if (mood === "create") {
        // إضافة منتج (واحد أو عدة نسخ)
        if (countVal > 1) {
            for (let i = 0; i < countVal; i++) {
                dataPro.push({ ...newProduct }); // نسخة جديدة لكل منتج
            }
        } else {
            dataPro.push({ ...newProduct });
        }
    } else {
        // تحديث منتج موجود
        dataPro[tmp] = { ...newProduct };
        mood = "create";
        Create.innerHTML = '<i class="bi bi-save"></i> إنشاء منتج';
        Count.style.display = "block"; // إظهار حقل الكمية مرة أخرى
    }

    // حفظ في localStorage
    localStorage.setItem("product", JSON.stringify(dataPro));
    clearInputs();
    readData();
};

// ========== حذف منتج واحد ==========
function deleteData(index) {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
        dataPro.splice(index, 1);
        localStorage.setItem("product", JSON.stringify(dataPro));
        readData();
    }
}

// ========== حذف جميع المنتجات ==========
function deleteAll() {
    if (confirm(`هل أنت متأكد من حذف ${dataPro.length} منتج؟`)) {
        dataPro = [];
        localStorage.removeItem("product"); // إزالة المفتاح فقط
        readData();
    }
}

// ========== تجهيز التحديث ==========
function updateData(index) {
    let product = dataPro[index];
    Title.value = product.Title;
    Price.value = product.Price;
    Tax.value = product.Tax;
    Ads.value = product.Ads;
    Discount.value = product.Discount;
    Category.value = product.Category;
    Count.style.display = "none"; // إخفاء الكمية أثناء التحديث
    Create.innerHTML = '<i class="bi bi-arrow-repeat"></i> تحديث المنتج';
    mood = "update";
    tmp = index;
    getTotal(); // تحديث الإجمالي بعد تعبئة الحقول
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========== البحث ==========
let searchMood = "title";

function search(id) {
    if (id === "SearchByTitle") {
        searchMood = "title";
        document.getElementById("search").placeholder = "بحث بالعنوان...";
    } else {
        searchMood = "category";
        document.getElementById("search").placeholder = "بحث بالفئة...";
    }
    document.getElementById("search").focus();
    document.getElementById("search").value = "";
    readData(); // إظهار كل المنتجات
}

function searchData(value) {
    let table = "";
    let searchValue = value.toLowerCase().trim();

    if (searchValue === "") {
        readData(); // لو البحث فارغ أرجع الجدول كامل
        return;
    }

    for (let i = 0; i < dataPro.length; i++) {
        let condition = searchMood === "title"
            ? dataPro[i].Title.includes(searchValue)
            : dataPro[i].Category.includes(searchValue);

        if (condition) {
            table += `
            <tr>
                <td>${i + 1}</td>
                <td>${dataPro[i].Title}</td>
                <td>${dataPro[i].Price}</td>
                <td>${dataPro[i].Tax}</td>
                <td>${dataPro[i].Ads}</td>
                <td>${dataPro[i].Discount}</td>
                <td>${dataPro[i].total}</td>
                <td>${dataPro[i].Category}</td>
                <td>
                    <button onclick="updateData(${i})" class="btn btn-sm btn-primary">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button onclick="deleteData(${i})" class="btn btn-sm btn-danger">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
            `;
        }
    }

    document.getElementById("tbody").innerHTML = table;
}

// ========== تهيئة أولية ==========
readData();