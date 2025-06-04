from app import create_app

app = create_app()

if __name__ == '__main__':
    print("Successfully connected to Db!")
    app.run(debug=True)