from imageai.Detection import ObjectDetection
import os
import cv2
import math
import json

def transformCoord(coord):
    x = 4 - ((352-coord[1])/52.5)
    y = 3 * (0.8*coord[1] + 360 - coord[0])/(1.45*coord[1] + 135)

    return [x, y]

def calc_dist(coord_list):
    dist = 0
    for idx in range(1, len(coord_list)):
        x0 = coord_list[idx-1][0]
        y0 = coord_list[idx-1][1]
        x1 = coord_list[idx][0]
        y1 = coord_list[idx][1]
        dist += math.sqrt(math.pow((x0 - x1), 2) + math.pow((y0 - y1), 2))
    return dist

def calc_area(coord_list):
    minX = -1
    minY = -1
    maxX = -1
    maxY = -1
    for coord in coord_list:
        if coord[0] < minX or minX == -1:
            minX = coord[0]
        if coord[0] > maxX or maxX == -1:
            maxX = coord[0]
        if coord[1] < minY or minY == -1:
            minY = coord[1]
        if coord[1] > maxY or maxY == -1:
            maxY = coord[1]
    return (maxX - minX)*(maxY - minY)


execution_path = os.getcwd()

detector = ObjectDetection()
detector.setModelTypeAsRetinaNet()
detector.setModelPath(os.path.join(execution_path, "../model/resnet50_coco_best_v2.0.1.h5"))
detector.loadModel()

cascPath = "face_cascades/haarcascade_frontalface_default.xml"
faceCascade = cv2.CascadeClassifier(cascPath)

vidcap = cv2.VideoCapture('../video_samples/comedor_3.mp4')
success, image = vidcap.read()
count = 0
person_num = 0
tracked = {}

movement_dict = {}
output_json = []

while success:
    print("*"*50)
    print("FRAME: " + str(count))

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=6,
        minSize=(20, 20),
        maxSize=(30, 30),
        # flags=cv2.cv.CV_HAAR_SCALE_IMAGE
        flags=0
    )

    # Draw a rectangle around the faces
    for (x, y, w, h) in faces:
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    cv2.imwrite("../image_samples/input_frame.jpg", image)
    detections = detector.detectObjectsFromImage(
        input_image=os.path.join(execution_path, "../image_samples/input_frame.jpg"),
        output_image_path=os.path.join(execution_path, "../image_samples/output_frame_%d.jpg" % count))

    people = [o for o in detections if o['name'] == 'person']
    new_tracked = {}
    for person in people:
        #print(str(person["percentage_probability"]) + " : " + str(person['box_points']))
        total = -1
        for key, value in tracked.items():
            s = abs(value[0] - (person['box_points'][0] + int((person['box_points'][2] - person['box_points'][0])/2)))
            #s += abs(value[1] - (person['box_points'][1] + int((person['box_points'][3] - person['box_points'][1])/2)))
            s += abs(value[1] - value[2] - person['box_points'][1])
            s += abs(value[2] - (person['box_points'][3] - person['box_points'][3]))
            if (s < total or total == -1) and (s < 400):
                total = s
                total_id = key

        if total == -1:
            #new_tracked['person_' + str(person_num)] = [person['box_points'][0] + int((person['box_points'][2] - person['box_points'][0])/2), person['box_points'][1] + int((person['box_points'][3] - person['box_points'][1])/2)]
            new_tracked['person_' + str(person_num)] = [
                person['box_points'][0] + int((person['box_points'][2] - person['box_points'][0]) / 2),
                person['box_points'][3],
                person['box_points'][3] - person['box_points'][1]]
            movement_dict['person_' + str(person_num)] = []
            print('new ' + str(person_num) + ' ' + str(new_tracked['person_' + str(person_num)]))
            person_num += 1
        else:
            #new_tracked[total_id] = [person['box_points'][0] + int((person['box_points'][2] - person['box_points'][0])/2), person['box_points'][1] + int((person['box_points'][3] - person['box_points'][1])/2)]
            new_tracked[total_id] = [
                person['box_points'][0] + int((person['box_points'][2] - person['box_points'][0]) / 2),
                person['box_points'][3],
                person['box_points'][3] - person['box_points'][1]]
            print('continue ' + str(total_id) + ' ' + str(new_tracked[total_id]))

    for key, value in tracked.items():
        found = False
        for new_key, new_value in new_tracked.items():
            if key == new_key:
                diff = abs(value[2] - new_value[2])
                if 0.9 > new_value[2]/value[2]:
                    print("Found difference in " + str(key))
                    new_tracked[new_key][1] = new_value[1] + diff
                    new_tracked[new_key][2] = value[2]
                found = True
                break
        if not found:
            new_tracked[key] = value
            print("not found " + str(key) + ' ' + str(new_tracked[key]))

    print('\n' + '-' * 25 + '\n')

    tracked = new_tracked.copy()

    for key, value in tracked.items():
        print(str(key) + ': ' + str(value))

    success, image = vidcap.read()
    count += 1

    output_json.append({})

    for key, value in tracked.items():
        c = transformCoord(value)
        movement_dict[key].append(c)
        if c[1] > 1.5:
            section = 'Female'
        elif c[0] > 2:
            section = 'Male'
        else:
            section = 'Child'
        output_json[len(output_json) - 1][key] = {"gender": "Female" if key=="person_0" else "Male",
                                                  "section": section,
                                                  "distance": calc_dist(movement_dict[key]),
                                                  "area": calc_area(movement_dict[key]),
                                                  "positionx": max(0.1, min(c[0], 3.9)),
                                                  "positiony": max(0.1, min(c[1], 2.9)),
                                                  "time": count
                                                  }
    if count == 50:
        with open('../data_50frames.json', 'w') as outfile:
            json.dump(output_json, outfile)
    if count == 100:
        with open('../data_100frames.json', 'w') as outfile:
            json.dump(output_json, outfile)

with open('../data.json', 'w') as outfile:
    json.dump(output_json, outfile)


