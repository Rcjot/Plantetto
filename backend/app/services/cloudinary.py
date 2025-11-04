from dotenv import load_dotenv
load_dotenv()

import cloudinary
from cloudinary import CloudinaryImage
import cloudinary.uploader

config = cloudinary.config(secure=True)

def upload_asset(asset, public_id, media_type, folder= "") :
    if media_type == "image" :
        upload_res = cloudinary.uploader.upload(asset,
                                public_id=public_id,
                                unique_filename=False,
                                folder=folder,
                                transformation=[{"quality" : "auto:eco",
                                                    "fetch_format":"auto",
                                                    "width": 1080,
                                                    "height": 1080,
                                                    "crop": "limit"
                                                    }])
    elif media_type == "video" :
        upload_res = cloudinary.uploader.upload(asset,
                                resource_type="video",
                                public_id=public_id,
                                unique_filename=False,
                                folder=folder,
                                transformation=[{"quality" : "auto:eco",
                                                    "fetch_format":"auto",
                                                    "width": 1080,
                                                    "height": 1080,
                                                    "crop": "limit"
                                                    }])
    media_res = {
        "srcURL" : upload_res["secure_url"],
        "height" : upload_res["height"],
        "width" : upload_res["width"]
    }
    print(media_res)
    return media_res

def upload_pfp(imageFile, id) :

    upload_res = cloudinary.uploader.upload(imageFile,
                               public_id=f"pfp_{id}",
                               unique_filename=False,
                               transformation=[{"quality" : "auto:eco",
                                                "fetch_format":"auto",
                                                "width": 150,
                                                "height" : 150,
                                                 "crop": "fill"}])

    srcURL = upload_res["secure_url"]    

    print("****2. Upload an image****\nDelivery URL: ", srcURL, "\n")
    return srcURL

def get_asset(id) :
    pass