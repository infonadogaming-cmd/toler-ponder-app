import os
import cv2
import numpy as np
import cgi
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse the multipart form data
            ctype, pdict = cgi.parse_header(self.headers.get('content-type'))
            if ctype != 'multipart/form-data':
                self.send_error(400, "Expected multipart/form-data")
                return
                
            pdict['boundary'] = bytes(pdict['boundary'], "utf-8")
            pdict['CONTENT-LENGTH'] = int(self.headers.get('Content-length'))
            
            # Using cgi.parse_multipart. It might be deprecated in newer Pythons,
            # but it works in typical environments. Vercel uses Python 3.9/3.12.
            # A safer way in Python 3.8+ is using cgi.FieldStorage, but Vercel's BaseHTTPRequestHandler
            # environment can be tricky with it.
            
            # Let's use FieldStorage for robustness
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST',
                         'CONTENT_TYPE': self.headers['Content-Type'],
                         }
            )
            
            if 'image' not in form:
                self.send_error(400, "Missing 'image' field")
                return
                
            file_item = form['image']
            image_data = file_item.file.read()
            
            # 1. Read user image
            np_arr = np.frombuffer(image_data, np.uint8)
            user_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if user_img is None:
                self.send_error(400, "Invalid image format")
                return

            # 2. Resize user image to 1920x1080
            user_img_resized = cv2.resize(user_img, (1920, 1080))
            
            # 3. Define source coordinates (the four corners of 1920x1080 image)
            src_pts = np.float32([
                [0, 0],
                [1920, 0],
                [1920, 1080],
                [0, 1080]
            ])
            
            # 4. Define placeholder destination coordinates
            # REPLACE THESE WITH THE COORDINATES FROM calibrate.py
            DESTINATION_CORNERS = [(2, 478), (1076, 525), (1071, 1226), (-2, 1549)]
            dst_pts = np.float32(DESTINATION_CORNERS)
            
            # 5. Load template image to get target canvas size and for compositing
            template_path = os.path.join(os.path.dirname(__file__), '..', 'template.png')
            template_img = cv2.imread(template_path, cv2.IMREAD_UNCHANGED)
            
            if template_img is None:
                self.send_error(500, "Template image not found on server")
                return
                
            template_h, template_w = template_img.shape[:2]
            
            # 6. Calculate Perspective Transform
            matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
            
            # 7. Warp user image to match template canvas dimensions
            warped_user_img = cv2.warpPerspective(user_img_resized, matrix, (template_w, template_h))
            
            # 8. Composite template over warped image
            # Create a 3-channel version of the template and an alpha mask
            if template_img.shape[2] == 4:
                # Extract alpha channel and normalize it to 0-1
                alpha_channel = template_img[:, :, 3] / 255.0
                alpha_mask = np.dstack([alpha_channel] * 3)
                
                # Extract BGR channels
                template_bgr = template_img[:, :, :3]
                
                # Blend the images: user_img * (1 - alpha) + template * alpha
                warped_user_img = warped_user_img.astype(float)
                template_bgr = template_bgr.astype(float)
                
                composited = (warped_user_img * (1 - alpha_mask)) + (template_bgr * alpha_mask)
                final_img = composited.astype(np.uint8)
            else:
                # If no alpha channel, just use the warped image or overwrite
                final_img = warped_user_img
                
            # 9. Encode image to JPEG
            success, encoded_img = cv2.imencode('.jpg', final_img)
            if not success:
                self.send_error(500, "Failed to encode final image")
                return
                
            # 10. Send response
            self.send_response(200)
            self.send_header('Content-Type', 'image/jpeg')
            self.send_header('Content-Length', str(len(encoded_img.tobytes())))
            # Enable CORS if frontend is on a different domain
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(encoded_img.tobytes())
            
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")
