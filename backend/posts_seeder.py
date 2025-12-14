import psycopg2
import random
from datetime import datetime, timedelta, timezone
from config import DATABASE_URL

def random_timestamptz(days_back=60):
    now = datetime.now(timezone.utc)
    return now - timedelta(
        days=random.randint(0, days_back),
        seconds=random.randint(0, 86400)
    )

plant_ids = [
    60, 61, 62, 63, 67, 68, 69, 70,
    72, 73, 74, 75, 76, 78, 79,
    81, 83, 84, 85, 87, 90
]

def seed_posts(post_count):
    db = None
    cur = None

    try:
        db = psycopg2.connect(DATABASE_URL)
        cur = db.cursor()

        for _ in range(post_count):
            created_at = random_timestamptz(90)
            print(created_at)

            cur.execute("""
                INSERT INTO posts (caption, visibility, user_id, created_at)
                VALUES (%s, %s, %s, %s)
                RETURNING id;
            """, (
                random.choice([
                    "My plant today 🌱",
                    "Growth progress",
                    "New leaves!",
                    ""
                ]),
                "everyone",
                54,
                created_at
            ))

            post_id = cur.fetchone()[0]

            cur.execute("""
                INSERT INTO media (
                    media_url,
                    media_order,
                    media_type,
                    post_id,
                    width,
                    height,
                    created_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (
                "https://res.cloudinary.com/dhtkvwq6a/image/upload/v1765309205/posts/8f4ef37e-66b0-4f5c-a496-cad3e52b7703/0.jpg",
                54,
                "image",
                post_id,
                1080,
                821,
                created_at  # same TZ-aware timestamp
            ))

            for plant_id in plant_ids :
                cur.execute(""" 
                            INSERT INTO plant_tags (
                            plant_id,
                            post_id
                            )
                            VALUES (%s, %s) 
                            """,
                            (plant_id, post_id)
                            )

        db.commit()
        print(f"✅ Seeded {post_count} posts with TIMESTAMPTZ!")

    except Exception as e:
        if db:
            db.rollback()
        print("❌ Error seeding posts:", e)

    finally:
        if cur:
            cur.close()
        if db:
            db.close()

if __name__ == "__main__":
    seed_posts(1000)
