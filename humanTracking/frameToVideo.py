import cv2

image_folder = '../image_samples/'
video_name = '../video_samples/video.mp4'

fps = 25

idx = 0
image = cv2.imread(image_folder + 'output_frame_%d.jpg' % idx)
height, width, layers = image.shape
size = (width, height)
out = cv2.VideoWriter(video_name, cv2.VideoWriter_fourcc(*'DIVX'), fps, size)

while image is not None:
    out.write(image)
    idx += 1
    image = cv2.imread(image_folder + 'output_frame_%d.jpg' % idx)
out.release()

