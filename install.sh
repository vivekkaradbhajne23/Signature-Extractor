#!/bin/sh

# install.sh - Automate Ubuntu 24.04 XFCE + VNC setup in Termux

# Step 1: Update Termux and install PRoot-Distro
echo "Updating Termux packages..."
pkg update -y && pkg upgrade -y

echo "Installing proot-distro..."
pkg install -y proot-distro

# Step 2: Install Ubuntu 24.04
echo "Installing Ubuntu 24.04 via proot-distro..."
proot-distro install ubuntu

# Step 3: Log into Ubuntu and configure the environment
echo "Entering Ubuntu environment to configure desktop and VNC..."
proot-distro login ubuntu <<'EOF'
echo "Updating Ubuntu packages..."
apt update && apt upgrade -y

echo "Installing XFCE desktop environment..."
apt install -y xfce4 xfce4-goodies

echo "Installing TightVNC server..."
apt install -y tightvncserver

echo "Running VNC server to initialize configuration..."
vncserver

echo "Ubuntu desktop and VNC setup complete inside Ubuntu."
EOF

echo "Installation and configuration complete. You can now run 'proot-distro login ubuntu' to start Ubuntu."
