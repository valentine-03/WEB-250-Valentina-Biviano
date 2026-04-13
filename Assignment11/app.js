const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true
}));

// --- UI HELPER ---
// This wraps your content in a nice CSS container so we don't repeat code
const layout = (title, content) => `
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        h2 { color: #333; margin-bottom: 1.5rem; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background-color: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; transition: background 0.3s; }
        button:hover { background-color: #45a049; }
        a { color: #666; text-decoration: none; font-size: 14px; margin-top: 15px; display: inline-block; }
        .log-item { text-align: left; background: #eee; padding: 10px; margin: 5px 0; border-radius: 4px; font-size: 12px; font-family: monospace; }
        .nav { margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="card">
        ${content}
    </div>
</body>
</html>
`;

// FAKE DATA
const employees = [{ username: "emp1", password: "123" }];
const managers = [{ username: "admin", password: "admin123" }];
let loginAttempts = [];

// --- ROUTES ---

app.get("/", (req, res) => {
    const name = req.cookies.name || "";
    const email = req.cookies.email || "";

    res.send(layout("Customer Form", `
        <h2>Customer Info</h2>
        <form method="POST" action="/save">
            <input name="name" placeholder="Name" value="${name}" />
            <input name="email" placeholder="Email" value="${email}" />
            <button type="submit">Save Preferences</button>
        </form>
        <p style="font-size: 12px; color: #888; margin-top: 20px;">Your info will autofill on return.</p>
        <div class="nav">
            <a href="/employee/login">Employee Login</a> | <a href="/manager/login">Manager Login</a>
        </div>
    `));
});

app.post("/save", (req, res) => {
    const { name, email } = req.body;
    res.cookie("name", name);
    res.cookie("email", email);
    res.send(layout("Saved", `
        <h2>Success!</h2>
        <p>Your details have been saved in cookies.</p>
        <a href="/">← Go Back</a>
    `));
});

app.get("/employee/login", (req, res) => {
    res.send(layout("Employee Login", `
        <h2>Employee Portal</h2>
        <form method="POST" action="/employee/login">
            <input name="username" placeholder="Username" required/>
            <input type="password" name="password" placeholder="Password" required/>
            <button type="submit">Login</button>
        </form>
        <a href="/">← Back Home</a>
    `));
});

app.post("/employee/login", (req, res) => {
    const { username, password } = req.body;
    const user = employees.find(u => u.username === username && u.password === password);
    
    loginAttempts.push({ type: "employee", username, success: !!user, time: new Date().toLocaleString() });

    if (user) {
        req.session.employee = username;
        res.redirect("/employee/dashboard");
    } else {
        res.send(layout("Error", `<h2>Login Failed</h2><p>Invalid credentials.</p><a href="/employee/login">Try Again</a>`));
    }
});

app.get("/employee/dashboard", (req, res) => {
    if (!req.session.employee) return res.redirect("/employee/login");
    res.send(layout("Dashboard", `
        <h2>Employee Dashboard</h2>
        <p>Welcome back, <strong>${req.session.employee}</strong></p>
        <button onclick="window.location.href='/logout'" style="background:#e74c3c">Logout</button>
    `));
});

app.get("/manager/login", (req, res) => {
    res.send(layout("Manager Login", `
        <h2>Manager Portal</h2>
        <form method="POST" action="/manager/login">
            <input name="username" placeholder="Admin Username" required/>
            <input type="password" name="password" placeholder="Admin Password" required/>
            <button type="submit" style="background:#3498db">Manager Login</button>
        </form>
        <a href="/">← Back Home</a>
    `));
});

app.post("/manager/login", (req, res) => {
    const { username, password } = req.body;
    const user = managers.find(u => u.username === username && u.password === password);
    
    loginAttempts.push({ type: "manager", username, success: !!user, time: new Date().toLocaleString() });

    if (user) {
        req.session.manager = username;
        res.redirect("/manager/dashboard");
    } else {
        res.send(layout("Error", `<h2>Access Denied</h2><a href="/manager/login">Try Again</a>`));
    }
});

app.get("/manager/dashboard", (req, res) => {
    if (!req.session.manager) return res.redirect("/manager/login");
    res.send(layout("Manager Dashboard", `
        <h2>Manager Dashboard</h2>
        <p>System Logs:</p>
        <div style="max-height: 200px; overflow-y: auto;">
            ${loginAttempts.map(log => `
                <div class="log-item">
                    <strong>${log.type}</strong>: ${log.username} <br>
                    Status: ${log.success ? "✅" : "❌"} | ${log.time}
                </div>
            `).join('')}
        </div>
        <br>
        <button onclick="window.location.href='/logout'" style="background:#e74c3c">Logout</button>
    `));
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.send(layout("Logged Out", `<h2>Logged Out</h2><p>See you next time!</p><a href="/">Home</a>`));
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));