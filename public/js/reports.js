document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndPopulateTable();
  fetchReportData();

  const itemsPerPageSelect = document.getElementById("itemsPerPage");
  itemsPerPageSelect.addEventListener("change", function () {
    fetchDataAndPopulateTable();
  });
});
const downloadbtn = document.getElementById("download-btn");
let currentPage = 1;

async function fetchDataAndPopulateTable() {
  try {
    const token = localStorage.getItem("token");
    const itemsPerPageSelect = document.getElementById("itemsPerPage");
    const limit = itemsPerPageSelect.value;
    const response = await axios.get(
      `http://localhost:3000/displayEItems?page=${currentPage}&limit=${limit}`,
      {
        headers: { Authorization: token },
      }
    );
    if (!response.status === 200) {
      throw new Error("Network response was not ok");
    }
    const data = response.data.expenses;
    console.log("expensedata==> ", data);

    const expenseTable = document.getElementById("expense-table");
    expenseTable.innerHTML = "";

    data.forEach((expense) => {
      const row = expenseTable.insertRow();
      const createdAt = new Date(expense.createdAt);
      row.insertCell(0).textContent = createdAt.toLocaleDateString();
      row.insertCell(1).textContent = expense.description;
      row.insertCell(2).textContent = expense.category;
      row.insertCell(3).textContent = expense.amount;
    });
    const totalPages = response.data.totalPages;

    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.addEventListener("click", () => {
        currentPage = i;
        fetchDataAndPopulateTable();
      });

      paginationContainer.appendChild(pageBtn);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

downloadbtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/download", {
    headers: { Authorization: token },
  });
  console.log(response);

  if (response.data.fileURL) {
    const a = document.createElement("a");
    const link = document.getElementById("link");
    link.textContent = response.data.fileURL;
    a.href = response.data.fileURL;
    a.download = "expense.txt";
    a.click();
    saveLinkToDB(response.data.fileURL);
  } else {
    console.log("No file URL found in the response");
  }
});

async function saveLinkToDB(link) {
  const linkobj = { link };

  const token = localStorage.getItem("token");

  const response = await axios.post("http://localhost:3000/savelink", linkobj, {
    headers: { Authorization: token },
  });
}

async function fetchReportData() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/reportData", {
      headers: { Authorization: token },
    });
    if (!response.status === 200) {
      throw new Error("Network response was not ok");
    }
    const data = response.data;
    console.log("linkData==> ", data);

    const expenseTable = document.getElementById("expense-table1");
    data.forEach((expense) => {
      const row = expenseTable.insertRow();
      const createdAt = new Date(expense.createdAt);
      row.insertCell(0).textContent = createdAt.toLocaleDateString();
      row.insertCell(1).textContent = expense.link;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
