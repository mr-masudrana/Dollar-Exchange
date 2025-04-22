document.addEventListener("DOMContentLoaded", function () {
  const sendAmountInput = document.getElementById("sendAmount");
  const receiveAmountInput = document.getElementById("receiveAmount");

  const exchangeRate = 0.99;

  sendAmountInput.addEventListener("input", () => {
    const sendAmount = parseFloat(sendAmountInput.value) || 0;
    const receiveAmount = (sendAmount * exchangeRate).toFixed(2);
    receiveAmountInput.value = receiveAmount;
  });

  const form = document.getElementById("exchangeForm");
  const pendingTable = document.getElementById("pendingTable");
  const completedTable = document.getElementById("completedTable");

  const scriptURL = "https://script.google.com/macros/s/AKfycbwmpezOhpq2a81MY4Ab07B7nE518EO40hSCwA-F_SVdmgH3lzT_CFuy8ZejI3Ztfftd/exec";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const sendCurrency = document.getElementById("sendCurrency").value;
    const sendAmount = document.getElementById("sendAmount").value;
    const receiveCurrency = document.getElementById("receiveCurrency").value;
    const receiveAmount = document.getElementById("receiveAmount").value;
    const username = document.getElementById("username").value;

    const data = {
      sendCurrency,
      sendAmount,
      receiveCurrency,
      receiveAmount,
      username
    };

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        alert("Exchange request submitted!");
        form.reset();
        receiveAmountInput.value = "";
      })
      .catch(err => console.error("Error submitting form:", err));
  });

  fetch(scriptURL)
    .then(res => res.json())
    .then(data => {
      const pending = data.filter(d => d.Status === "Pending" || d.Status === "Processing");
      const completed = data.filter(d => d.Status === "Accepted");

      populateTable(pending.map(formatRow), pendingTable);
      populateTable(completed.map(formatRow), completedTable);
    })
    .catch(err => console.error("Error loading data:", err));

  function formatRow(row) {
    return {
      send: row["Send Currency"],
      receive: row["Receive Currency"],
      amount: row["Send Amount"],
      user: row["Username"],
      datetime: new Date(row["Timestamp"]).toLocaleString(),
      status: row["Status"]
    };
  }

  function populateTable(data, table) {
    table.innerHTML = "";
    data.forEach(row => {
      table.innerHTML += `
        <tr>
          <td>${row.send}</td>
          <td>${row.receive}</td>
          <td>${row.amount}</td>
          <td>${row.user}</td>
          <td>${row.datetime}</td>
          <td><span class="badge bg-${row.status === "Accepted" ? "success" : "warning"}">${row.status}</span></td>
        </tr>
      `;
    });
  }
});
