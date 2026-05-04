from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# DB CONFIG
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'admin'   # your password
app.config['MYSQL_DB'] = 'quiz_system'

mysql = MySQL(app)

# ------------------ AUTH ------------------
@app.route('/')
def home():
    return "Flask API is running 🚀"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    print("REGISTER DATA:", data)  # 🔥 debug

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    cur = mysql.connection.cursor()

    # check if user exists
    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cur.fetchone()

    if user:
        return jsonify({"message": "User already exists"})

    cur.execute(
        "INSERT INTO users(name, email, password) VALUES(%s,%s,%s)",
        (name, email, password)
    )
    mysql.connection.commit()

    return jsonify({"message": "User registered"})

@app.route('/questions', methods=['GET'])
def get_all_questions():
    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT id, category, question, opt1, opt2, opt3, opt4, correctIndex 
        FROM questions
    """)
    
    rows = cur.fetchall()

    result = []
    for r in rows:
        result.append({
            "id": r[0],  # ✅ IMPORTANT
            "category": r[1],
            "question": r[2],
            "options": [r[3], r[4], r[5], r[6]],
            "correctIndex": r[7]
        })

    return jsonify(result)

@app.route('/delete-question/<int:id>', methods=['DELETE'])
def delete_question(id):
    cur = mysql.connection.cursor()

    cur.execute("DELETE FROM questions WHERE id=%s", (id,))
    mysql.connection.commit()

    return jsonify({"message": "Question deleted"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM users WHERE email=%s AND password=%s",
                (data['email'], data['password']))
    user = cur.fetchone()

    if user:
        return jsonify({"status": "success", "name": user[1]})
    else:
        return jsonify({"status": "fail"})


# ------------------ QUESTIONS ------------------

@app.route('/add-question', methods=['POST'])
def add_question():
    data = request.json
    print("RECEIVED:", data)  # 👈 DEBUG

    cur = mysql.connection.cursor()

    cur.execute("""
        INSERT INTO questions(category, question, opt1, opt2, opt3, opt4, correctIndex)
        VALUES(%s,%s,%s,%s,%s,%s,%s)
    """, (
        data['category'],
        data['question'],
        data['opt1'],
        data['opt2'],
        data['opt3'],
        data['opt4'],
        int(data['correctIndex'])
    ))

    mysql.connection.commit()

    return jsonify({"message": "Question added"})


@app.route('/questions/<category>')
def get_questions(category):
    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM questions WHERE category=%s", (category,))
    
    columns = [col[0] for col in cur.description]
    rows = cur.fetchall()

    questions = []

    for row in rows:
        data = dict(zip(columns, row))

        questions.append({
            "id": data["id"],
            "category": data["category"],
            "question": data["question"],
            "options": [
                data["opt1"],
                data["opt2"],
                data["opt3"],
                data["opt4"]
            ],
            "correctIndex": int(data["correctIndex"])
        })

    return jsonify(questions)

# ------------------ ATTEMPTS ------------------

@app.route('/save-attempt', methods=['POST'])
def save_attempt():
    data = request.json
    cur = mysql.connection.cursor()

    cur.execute("""
        INSERT INTO attempts(user_name,category,score,total,percent,date)
        VALUES(%s,%s,%s,%s,%s,%s)
    """, (
        data['name'],
        data['category'],
        data['score'],
        data['total'],
        data['percent'],
        data['date']
    ))

    mysql.connection.commit()
    return jsonify({"message": "Attempt saved"})


@app.route('/attempts/<name>')
def get_attempts(name):
    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM attempts WHERE user_name=%s ORDER BY id DESC", (name,))
    rows = cur.fetchall()

    attempts = []
    for r in rows:
        attempts.append({
            "category": r[2],
            "score"   : r[3],
            "total"   : r[4],
            "percent" : r[5],
            "date"    : r[6]
        })

    return jsonify(attempts)

@app.route('/categories')
def get_categories():
    cur = mysql.connection.cursor()

    cur.execute("SELECT DISTINCT category FROM questions")
    rows = cur.fetchall()

    categories = [r[0] for r in rows]

    print("CATEGORIES:", categories)  # debug

    return jsonify(categories)

# ------------------
from flask_cors import CORS
CORS(app)

if __name__ == "__main__":
    app.run(debug=True)