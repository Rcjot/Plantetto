from dotenv import load_dotenv
load_dotenv()

import cloudinary
from cloudinary import CloudinaryImage
import cloudinary.uploader
import cloudinary.api

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
                               folder="users_pfp/",
                               transformation=[{"quality" : "auto:eco",
                                                "fetch_format":"auto",
                                                "width": 150,
                                                "height" : 150,
                                                 "crop": "fill"}])

    srcURL = upload_res["secure_url"]    

    print("****Uploaded profile picture****\nDelivery URL: ", srcURL, "\n")
    return srcURL


def upload_plantpic(imageFile, plant_uuid) :
    try :
        upload_res = cloudinary.uploader.upload(imageFile,
                                public_id=f"plantpic_{plant_uuid}",
                                unique_filename=False,
                                folder="plantpic/",
                                transformation=[{"quality" : "auto:eco",
                                                    "fetch_format":"auto",
                                                    "width": 1080,
                                                    "height" : 1080,
                                                    "crop": "limit"}])
        srcURL = upload_res["secure_url"]    

        print("****Uploaded plant picture****\nDelivery URL: ", srcURL, "\n")
        return srcURL
    except Exception as e :
        print(f"something erorr in cloudinary upload: {e}")
        raise Exception("cloudinary upload failed")
    

def delete_plantpic(plant_uuid) :
    try :
        res = cloudinary.uploader.destroy(f"plantpic/plantpic_{plant_uuid}", resource_type="image")
        if (res['result'] != 'ok') :
            raise Exception("cloudinary delete failed : result not found")
    except Exception as e:
        print(f"something erorr in cloudinary deletion: {e}")
        raise 

def delete_post(folder) :
    cloudinary.api.delete_resources_by_prefix(f"posts/{folder}")
    cloudinary.api.delete_folder(f"posts/{folder}")
    return True