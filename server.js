const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const responses = [];

/* =========================
   HANDLE FORM SUBMISSION
=========================*/
app.post("/submit", (req, res) => {

  responses.push(req.body);

  res.send(`
    <h2 style="text-align:center;">✅ Thank you, ${req.body.name}!</h2>

    <div style="text-align:center;">
      <a href="/">Submit Another Response</a><br><br>
      <a href="/report">📊 View Survey Report</a>
    </div>
  `);
});

/* =========================
   MNC STYLE REPORT PAGE
=========================*/
app.get("/report", (req, res) => {

  if (responses.length === 0) {
    return res.send("<h2>No survey data yet.</h2>");
  }

  let totalRating = 0;
  let recommendYes = 0;

  let rows = responses.map(r => {
    totalRating += Number(r.rating);
    if (r.recommend === "Yes") recommendYes++;

    return `
      <tr>
        <td>${r.name}</td>
        <td>${r.rating}</td>
        <td>${r.recommend}</td>
        <td>${r.feedback || "-"}</td>
      </tr>
    `;
  }).join("");

  const avgRating = (totalRating / responses.length).toFixed(2);
  const recommendPercent = ((recommendYes / responses.length) * 100).toFixed(1);

  res.send(`
    <html>
    <head>
      <title>Survey Report</title>
      <style>
        body {
          font-family: Arial;
          background: #f4f6f9;
          text-align: center;
        }

        .report-box {
          width: 80%;
          margin: 40px auto;
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 0 12px rgba(0,0,0,0.15);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          padding: 10px;
          border: 1px solid #ddd;
        }

        th {
          background: #007BFF;
          color: white;
        }

        h1 {
          color: #2c3e50;
        }
      </style>
    </head>

    <body>

    <div class="report-box">

      <h1>Customer Survey Report</h1>

      <h3>Total Responses: ${responses.length}</h3>
      <h3>Average Rating: ⭐ ${avgRating}</h3>
      <h3>Recommendation Rate: 👍 ${recommendPercent}%</h3>

      <table>
        <tr>
          <th>Name</th>
          <th>Rating</th>
          <th>Recommend</th>
          <th>Feedback</th>
        </tr>
        ${rows}
      </table>

      <br>
      <a href="/">⬅ Back to Survey</a>

    </div>

    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("MNC Survey App running at http://localhost:3000 🚀");
});