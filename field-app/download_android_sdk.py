import os
import sys
import zipfile
import urllib.request
import subprocess

sdk_dir = os.path.expanduser(r"~\AppData\Local\Android\Sdk")
cmdline_dir = os.path.join(sdk_dir, "cmdline-tools", "latest")
zip_path = os.path.join(sdk_dir, "cmdline-tools.zip")

os.makedirs(sdk_dir, exist_ok=True)
os.makedirs(os.path.join(sdk_dir, "cmdline-tools"), exist_ok=True)

url = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"

print(f"Downloading Android Command Line Tools from {url}...")
urllib.request.urlretrieve(url, zip_path)
print("Download complete. Extracting...")

temp_extract = os.path.join(sdk_dir, "cmdline-temp")
os.makedirs(temp_extract, exist_ok=True)

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(temp_extract)

# The zip contains a 'cmdline-tools' root folder. Move its contents to 'latest'
src_tools = os.path.join(temp_extract, "cmdline-tools")
if os.path.exists(cmdline_dir):
    import shutil
    shutil.rmtree(cmdline_dir, ignore_errors=True)

import shutil
shutil.move(src_tools, cmdline_dir)
shutil.rmtree(temp_extract, ignore_errors=True)
if os.path.exists(zip_path):
    os.remove(zip_path)

print(f"Command Line Tools installed in: {cmdline_dir}")
sdkmanager_bat = os.path.join(cmdline_dir, "bin", "sdkmanager.bat")
print(f"sdkmanager exists: {os.path.exists(sdkmanager_bat)}")
