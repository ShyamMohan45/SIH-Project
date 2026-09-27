import os
import subprocess

sdk_dir = os.path.expanduser(r"~\AppData\Local\Android\Sdk")
sdkmanager = os.path.join(sdk_dir, "cmdline-tools", "latest", "bin", "sdkmanager.bat")
java_home = r"C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"

env = os.environ.copy()
env["JAVA_HOME"] = java_home
env["ANDROID_HOME"] = sdk_dir
env["ANDROID_SDK_ROOT"] = sdk_dir
env["PATH"] = f"{os.path.join(java_home, 'bin')};{os.path.join(sdk_dir, 'cmdline-tools', 'latest', 'bin')};{env['PATH']}"

# Accept licenses
print("Accepting Android SDK licenses...")
p = subprocess.Popen([sdkmanager, "--licenses"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
p.communicate(input="y\ny\ny\ny\ny\ny\ny\ny\ny\ny\ny\ny\ny\ny\ny\ny\ny\n")

# Install platform-tools, platforms;android-34, build-tools;34.0.0
print("Installing platform-tools, build-tools, and platform...")
pkgs = ["platform-tools", "build-tools;34.0.0", "platforms;android-34", "platforms;android-35"]
p2 = subprocess.Popen([sdkmanager] + pkgs, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, env=env)
out, err = p2.communicate(input="y\ny\ny\ny\ny\n")
print(out)
if err:
    print("ERR:", err)
print("SDK installation completed!")
