from ..models.guides_image import GuidesImages
from . import cloudinary
from flask import current_app
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()

def cleanup_unused_guides_images(app) :
    with app.app_context() :
        unused_images = GuidesImages.delete_all_unused_images()
        print(unused_images)
   
        for res_tuple in unused_images :
            cloudinary.delete_guideimage(res_tuple[0], res_tuple[1])   


def init_app(app) :
    with app.app_context() :
        scheduler.add_job( lambda: cleanup_unused_guides_images(app), 'interval', hours=5)
        scheduler.start()
