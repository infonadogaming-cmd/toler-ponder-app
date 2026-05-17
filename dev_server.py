import sys
import os
from http.server import HTTPServer

# Add the project root to the python path so we can import the api module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api.process_image import handler

if __name__ == '__main__':
    server_address = ('127.0.0.1', 5328)
    httpd = HTTPServer(server_address, handler)
    print("Local Python API Server running on http://127.0.0.1:5328")
    print("Keep this terminal open, and run 'npm run dev' in another terminal.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
