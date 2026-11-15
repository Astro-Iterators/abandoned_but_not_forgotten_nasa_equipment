#!/usr/bin/env python3
"""
Generates cinematic story scenes and pixel art frames for Ainda Estou Aqui.
Inspired by A Solar Tale (storytelling/emotion), Henry's Farm Adventures (2D pixel exploration)
and PureFlow (purposeful interaction).
"""
import os
from PIL import Image, ImageDraw

SPRITES_DIR = "prototipo/apps/web/public/assets/sprites"
CINEMATICS_DIR = "prototipo/apps/web/public/assets/cinematics"
os.makedirs(SPRITES_DIR, exist_ok=True)
os.makedirs(CINEMATICS_DIR, exist_ok=True)

# 1. PROLOGUE SCENE: Nayla's Bedroom & Window into Cosmos (400x240, pixel art style)
prologue = Image.new("RGBA", (400, 240), (16, 12, 28, 255))
pdraw = ImageDraw.Draw(prologue)

# Wall and wooden floor
pdraw.rectangle([0, 0, 400, 170], fill=(24, 20, 38, 255))
pdraw.rectangle([0, 170, 400, 240], fill=(45, 28, 22, 255))
# Floor planks
for fy in range(175, 240, 15):
    pdraw.line([0, fy, 400, fy], fill=(35, 20, 15, 255))

# Big Bedroom Window showing starry night
pdraw.rectangle([130, 20, 270, 130], fill=(8, 8, 22, 255))
pdraw.rectangle([126, 16, 274, 134], outline=(70, 50, 40, 255), width=4)
pdraw.line([200, 20, 200, 130], fill=(70, 50, 40, 255), width=2)
pdraw.line([130, 75, 270, 75], fill=(70, 50, 40, 255), width=2)

# Stars & red planet Mars visible in window
stars = [(145, 35), (180, 45), (230, 30), (250, 60), (160, 95), (220, 105), (190, 80), (255, 90)]
for sx, sy in stars:
    pdraw.point([sx, sy], fill=(255, 255, 220, 255))
    pdraw.point([sx+1, sy], fill=(200, 220, 255, 180))

# Red Mars glowing in the distance
pdraw.ellipse([215, 45, 227, 57], fill=(215, 85, 45, 255))
pdraw.ellipse([217, 47, 222, 52], fill=(240, 120, 70, 255))

# Bed with orange rocket peeking underneath
pdraw.rectangle([20, 110, 110, 180], fill=(60, 75, 105, 255)) # Bed frame
pdraw.rectangle([25, 115, 60, 135], fill=(230, 235, 245, 255)) # Pillow
pdraw.rectangle([20, 130, 110, 180], fill=(205, 95, 40, 255)) # Blanket

# The glowing orange rocket under the bed
pdraw.ellipse([35, 185, 95, 210], fill=(245, 110, 35, 255))
pdraw.polygon([(95, 197), (110, 192), (110, 202)], fill=(255, 200, 60, 255)) # Rocket nose
pdraw.rectangle([30, 188, 40, 207], fill=(50, 120, 160, 255)) # Fins
pdraw.ellipse([60, 193, 70, 203], fill=(0, 220, 255, 255)) # Glowing porthole

# Window glow casting on floor
pdraw.polygon([(130, 170), (270, 170), (320, 240), (80, 240)], fill=(40, 45, 80, 45))

prologue.save(os.path.join(CINEMATICS_DIR, "scene_prologue.png"))
print("Saved scene_prologue.png")

# 2. MACRO SCANNER VIEW: Close-up of bedrock with hematite spherules (320x240)
macro = Image.new("RGBA", (320, 240), (140, 65, 35, 255))
mdraw = ImageDraw.Draw(macro)

# Stratified sedimentary rock layers (sulfates, fine laminations)
for y in range(0, 240):
    band = (y // 12) % 4
    col = (155 + band*8, 70 + band*5, 38 + band*4, 255)
    mdraw.line([0, y, 320, y], fill=col)

# Rock cracks and fine grain texture
import random
random.seed(42)
for _ in range(400):
    rx = random.randint(0, 319)
    ry = random.randint(0, 239)
    mdraw.point([rx, ry], fill=(120, 50, 25, 200))

# 8 Distinct Hematite Spherules ("Blueberries") embedded in rock
spheres = [
    (65, 60, 14), (110, 140, 18), (170, 85, 16), (220, 160, 20),
    (250, 70, 15), (80, 185, 16), (150, 195, 14), (200, 40, 12)
]

for sx, sy, r in spheres:
    # Shadow socket around sphere
    mdraw.ellipse([sx - r - 2, sy - r - 2, sx + r + 2, sy + r + 2], fill=(85, 35, 20, 220))
    # Grey-blue hematite body
    mdraw.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(70, 85, 110, 255))
    mdraw.ellipse([sx - r + 3, sy - r + 3, sx + r - 3, sy + r - 3], fill=(85, 105, 135, 255))
    # Highlight reflection (polished spherical surface)
    mdraw.ellipse([sx - r // 2, sy - r // 2, sx, sy], fill=(160, 195, 235, 255))

# Bip's cyan spectroscopic scanner grid overlay
for gx in range(30, 290, 40):
    mdraw.line([gx, 20, gx, 220], fill=(0, 230, 255, 60))
for gy in range(30, 220, 40):
    mdraw.line([30, gy, 290, gy], fill=(0, 230, 255, 60))

# Data reticle around center sphere
mdraw.rectangle([150, 65, 190, 105], outline=(0, 255, 255, 200), width=2)
mdraw.line([170, 55, 170, 63], fill=(0, 255, 255, 255), width=2)
mdraw.line([170, 107, 170, 115], fill=(0, 255, 255, 255), width=2)
mdraw.line([140, 85, 148, 85], fill=(0, 255, 255, 255), width=2)
mdraw.line([192, 85, 200, 85], fill=(0, 255, 255, 255), width=2)

macro.save(os.path.join(CINEMATICS_DIR, "scene_macro_blueberries.png"))
print("Saved scene_macro_blueberries.png")

# 3. DUST STORM DRAMATIC SCENE (400x240)
storm = Image.new("RGBA", (400, 240), (45, 18, 12, 255))
sdraw = ImageDraw.Draw(storm)

# Graded sky darkening
for y in range(0, 160):
    t = y / 160.0
    scol = (int(30 + 35 * t), int(12 + 15 * t), int(8 + 10 * t), 255)
    sdraw.line([0, y, 400, y], fill=scol)

# Distant martian crater rim silhouetted
sdraw.polygon([(0, 160), (90, 145), (180, 155), (280, 140), (400, 150), (400, 240), (0, 240)], fill=(32, 14, 10, 255))

# Opportunity Rover silhouette resting in Perseverance Valley under swirling dust
sdraw.rectangle([170, 170, 230, 190], fill=(20, 9, 7, 255)) # Chassis
sdraw.line([185, 170, 185, 145], fill=(20, 9, 7, 255), width=3) # Mast
sdraw.rectangle([180, 140, 192, 148], fill=(20, 9, 7, 255)) # Cameras
# Solar wings
sdraw.polygon([(160, 172), (240, 172), (248, 166), (152, 166)], fill=(25, 11, 8, 255))
# Wheels
for wx in [162, 180, 200, 220, 235]:
    sdraw.ellipse([wx, 185, wx + 12, 198], fill=(15, 6, 5, 255))

# Swirling Martian dust clouds overlay (opacity layers)
for _ in range(800):
    dx = random.randint(0, 399)
    dy = random.randint(0, 239)
    sdraw.point([dx, dy], fill=(195, 100, 50, random.randint(40, 180)))

# Faint solar disc barely visible through opaque dust
sdraw.ellipse([270, 40, 294, 64], fill=(255, 180, 100, 70))
sdraw.ellipse([276, 46, 288, 58], fill=(255, 230, 180, 90))

storm.save(os.path.join(CINEMATICS_DIR, "scene_dust_storm.png"))
print("Saved scene_dust_storm.png")
