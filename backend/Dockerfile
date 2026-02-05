FROM python:3.12-slim

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN pip install gunicorn
CMD ["gunicorn", "-k", "gevent", "-w", "1", "--bind", "0.0.0.0:7370", "run:app"]

