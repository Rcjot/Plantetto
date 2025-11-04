from dotenv import load_dotenv
load_dotenv()

import cloudinary
from cloudinary import CloudinaryImage
import cloudinary.uploader

config = cloudinary.config(secure=True)

def upload_asset(imageFile) :
    cloudinary.uploader.upload(imageFile,
                               public_id="test",
                               unique_filename=False,
                               transformation=[{"quality" : "auto:eco",
                                                "fetch_format":"auto"
                                                }])

    srcURL = CloudinaryImage("test").build_url()

    print("****2. Upload an image****\nDelivery URL: ", srcURL, "\n")

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
                                                    "width": 150,
                                                    "height" : 150,
                                                    "crop": "fill"}])
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