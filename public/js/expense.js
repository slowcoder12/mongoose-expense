window.addEventListener("load", () => {
  const token = localStorage.getItem("token");
  checkPrem(token);
  displayItems();
});

const leaderboardButton = document.getElementById("leaderboard");
const reportsButton = document.getElementById("reports");
leaderboardButton.style.display = "none";
reportsButton.style.display = "none";

const form = document.querySelector("#expense-form");
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  const expenseObj = { amount, description, category };

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:3000/addExpense",
      expenseObj,
      {
        headers: { Authorization: token },
      }
    );
    console.log("after adding", response);
    const table = document.getElementById("expense-table");
    const tbody = table.querySelector("tbody");

    const newRow = tbody.insertRow();
    newRow.setAttribute("data-id", response.data.result._id);
    newRow.innerHTML = `<td>${amount}</td><td>${description}</td><td>${category}</td><td><button onclick="deleteExp('${response.data.result._id}')">Delete</button></td>`;

    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
  } catch (err) {
    console.log("error occured", err);
  }
});

async function deleteExp(id) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/deleteExpense/${id}`
    );
    console.log(response);
    if (response.status === 200) {
      const li = document.querySelector(`[data-id = "${id}"]`);
      console.log(li);
      if (li) {
        li.remove();
      }
    }
  } catch (err) {
    console.log("error in deleting", err);
  }
}

async function displayItems() {
  try {
    const token = localStorage.getItem("token");
    const result = await axios.get("http://localhost:3000/displayItems", {
      headers: { Authorization: token },
    });
    const table = document.getElementById("expense-table");
    const tbody = table.querySelector("tbody");

    tbody.innerHTML = "";
    console.log(result);
    result.data.forEach((expense) => {
      const newRow = tbody.insertRow();
      newRow.innerHTML = `<td>${expense.amount}</td><td>${expense.description}</td><td>${expense.category}</td><td><button onclick="deleteExp('${expense._id}')">Delete</button></td>`;
      newRow.setAttribute("data-id", expense._id);
    });
  } catch (err) {
    console.log("error occurred while fetching data", err);
  }
}

//document.getElementById("leaderboard").style.display = "none";
document
  .getElementById("prem-btn")
  .addEventListener("click", async function (e) {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/buyPremium",
        null,
        {
          headers: { Authorization: token },
        }
      );

      console.log("ressssspoonnseee", response);

      const key_id = response.data.key_id;
      const order_id = response.data.order.orderId;

      let options = {
        key: key_id,
        order_id: order_id,
        handler: async function (response) {
          console.log("response===>>.", response);
          console.log("1. Before axios.post(updateTransactionStatus)");
          console.log("optiopnss", options);
          try {
            await axios.post(
              "http://localhost:3000/updateTransactionStatus",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            );
            console.log("2. After axios.post(updateTransactionStatus)");
            alert("You are a premium user now");

            const premMsg = document.getElementById("prem-msg");
            premMsg.innerText = "Premium User";

            document.getElementById("prem-btn").style.display = "none";
            document.getElementById("leaderboard").style.display = "block";
          } catch (error) {
            console.error("Error updating transaction status:", error);
            alert("Transaction failed. Please try again.");
          }
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
      e.preventDefault();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Transaction failed. Please try again.");
    }
  });

async function checkPrem(token) {
  try {
    const response = await axios.get("http://localhost:3000/checkPremium", {
      headers: { Authorization: token },
    });
    console.log("response after razaypayy check", response);

    if (response.data === true) {
      const premMsg = document.getElementById("prem-msg");
      premMsg.innerText = "You are now a Premium User";

      leaderboardButton.style.display = "block";
      reportsButton.style.display = "block";
      document.getElementById("prem-btn").style.display = "none";
    } else {
      const premMsg = document.getElementById("prem-msg");
      premMsg.innerText = "";

      document.getElementById("prem-btn").style.display = "block";
      leaderboardButton.style.display = "none";
      reportsButton.style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
}

document
  .getElementById("leaderboard")
  .addEventListener("click", getLeaderBoard);

async function getLeaderBoard() {
  try {
    const response = await axios.get("http://localhost:3000/leaderBoard");
    console.log(response);

    if (response.status === 200) {
      const data = response.data;
      const leaderboardStats = document.getElementById("leaderboardStats");

      leaderboardStats.innerHTML = "";
      data.forEach((user) => {
        const newItem = document.createElement("li");
        newItem.innerHTML = `${user.name} - Total Expense: $${user.totalExpense}`;
        leaderboardStats.appendChild(newItem);
      });
    } else {
      console.log("Failed to fetch leaderboard data.");
    }
  } catch (err) {
    console.log(err);
  }
}
