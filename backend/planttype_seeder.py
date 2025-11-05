import psycopg2
from config import DATABASE_URL
# --- Plant types to seed ---
plant_types = [
    "Succulent",
    "Cactus",
    "Fern",
    "Monstera",
    "Philodendron",
    "Snake Plant",
    "Pothos",
    "Orchid",
    "Rose",
    "Herb",
    "Air Plant",
    "Bonsai",
    "Palm",
    "Carnivorous",
    "Flowering Plant",
    "Tree",
    "Moss / Terrarium",
    "Tropical Plant",
    "Aquatic Plant",
    "Variegated Plant",
]

def seed_plant_types():
    try:
        # connect to database
        db = psycopg2.connect(DATABASE_URL)
        cur = db.cursor()

        # insert plant types
        for name in plant_types:
            cur.execute("""
                INSERT INTO plant_types (plant_name)
                VALUES (%s)
                ON CONFLICT (plant_name) DO NOTHING;
            """, (name,))

        db.commit()
        print(f"✅ Seeded {len(plant_types)} plant types successfully!")

    except Exception as e:
        print("❌ Error seeding plant types:", e)
    finally:
        if db:
            cur.close()
            db.close()

if __name__ == "__main__":
    seed_plant_types()