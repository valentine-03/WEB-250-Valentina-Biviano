from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__)

# Connect to database
def get_db():
    conn = sqlite3.connect("pizza.db")
    conn.row_factory = sqlite3.Row
    return conn

# Create tables (run once)
def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS Customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS Orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            total REAL
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS OrderDetails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            pizza_name TEXT,
            quantity INTEGER
        )
    ''')

    conn.commit()
    conn.close()

# ---------------- ROUTES ----------------

@app.route('/')
def index():
    conn = get_db()
    customers = conn.execute("SELECT * FROM Customers").fetchall()
    conn.close()

    return render_template('index.html', customers=customers)


@app.route('/add_customer', methods=['POST'])
def add_customer():
    name = request.form['name']
    email = request.form['email']

    conn = get_db()
    conn.execute("INSERT INTO Customers (name, email) VALUES (?, ?)", (name, email))
    conn.commit()
    conn.close()

    return "Customer added!"


@app.route('/add_order', methods=['POST'])
def add_order():
    customer_id = request.form['customer_id']
    pizza_name = request.form['pizza_name']
    quantity = request.form['quantity']

    conn = get_db()

    cursor = conn.execute(
        "INSERT INTO Orders (customer_id, total) VALUES (?, ?)",
        (customer_id, 0)
    )

    order_id = cursor.lastrowid

    conn.execute(
        "INSERT INTO OrderDetails (order_id, pizza_name, quantity) VALUES (?, ?, ?)",
        (order_id, pizza_name, quantity)
    )

    conn.commit()
    conn.close()

    return f"Order placed! Order ID: {order_id}"


@app.route('/orders')
def view_orders():
    conn = get_db()

    orders = conn.execute('''
        SELECT Orders.id, Customers.name, pizza_name, quantity
        FROM Orders
        JOIN Customers ON Orders.customer_id = Customers.id
        JOIN OrderDetails ON Orders.id = OrderDetails.order_id
    ''').fetchall()

    conn.close()

    return render_template('orders.html', orders=orders)


# ALWAYS LAST
if __name__ == '__main__':
    init_db()
    app.run(debug=True)