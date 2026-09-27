import os
import sys

# Add n-lams-backend to sys.path so app modules are loaded
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backend_pkg = os.path.join(root_dir, 'n-lams-backend')
if backend_pkg not in sys.path:
    sys.path.insert(0, backend_pkg)

# Import the modular FastAPI application
from app.main import app
