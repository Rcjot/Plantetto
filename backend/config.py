from os import getenv

SECRET_KEY = getenv("SECRET_KEY")
DATABASE_URL = f"postgresql://{getenv("DB_USERNAME")}:{getenv("DB_PASSWORD")}@{getenv("DB_HOST")}:{getenv("DB_PORT")}/{"DB_NAME"}"