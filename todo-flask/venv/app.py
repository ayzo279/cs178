# From tutorial: https://www.python-engineer.com/posts/flask-todo-app/
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Initialize database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define entries for the database
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    complete = db.Column(db.Boolean)

# Shared Concept 2: Routes
# Distinct Concept 1: Methods
@app.route("/add", methods=["POST"])
# Add entry to database
def add():
    title = request.form.get("title")
    new_todo = Todo(title=title, complete=False)
    # Shared Concept 1: Session
    db.session.add(new_todo)
    db.session.commit()
    # Distinct Concept 2: Redirect
    return redirect(url_for("home"))

# Shared Concept 2: Routes
@app.route("/update/<int:todo_id>")
# Edit database entry
def update(todo_id):
    # Shared Concept 3: Queries
    todo = Todo.query.filter_by(id=todo_id).first()
    todo.complete = not todo.complete
    # Shared Concept 1: Session
    db.session.commit()
    # Distinct Concept 2: Redirect
    return redirect(url_for("home"))

# Shared Concept 2: Routes
@app.route("/delete/<int:todo_id>")
# Delete entry from database
def delete(todo_id):
    # Shared Concept 3: Queries
    todo = Todo.query.filter_by(id=todo_id).first()
    # Shared Concept 1: Session
    db.session.delete(todo)
    db.session.commit()
    # Distinct Concept 2: Redirect
    return redirect(url_for("home"))

# Shared Concept 2: Routes
@app.route('/')
# Render todo app homepage
def home():
    # Shared Concept 3: Queries
    todo_list = Todo.query.all()
    return render_template("base.html", todo_list=todo_list)

if __name__ == "__main__":
    # Run app
    with app.app_context():
        db.create_all()
    # Distinct Concept 3: Debug
    app.run(debug=True)