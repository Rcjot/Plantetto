import cv2
import numpy as np


def detect_face(file) :
    # image_input = 'input_img_no.jpg'

    image_bytes = file.read()
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # img=cv2.imread(image_input)

    print(img.shape)
    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    print(gray_image.shape)
    face_classifier = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    face = face_classifier.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(40,40)
    )

    has_face = len(face) > 0

    # for (x, y, w, h) in face :
    #     cv2.rectangle(img, (x, y), (x+w, y+h), (0,255,0), 4)


    # saved = cv2.imwrite("test_rgb.jpg", img)
    # print("saved:", saved)


    return has_face

