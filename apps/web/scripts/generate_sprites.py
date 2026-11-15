#!/usr/bin/env python3
"""
Generates high quality pixel art assets for Ainda Estou Aqui (Opportunity Pilot).
"""
import os
from PIL import Image, ImageDraw

SPRITES_DIR = "prototipo/apps/web/public/assets/sprites"
TILESETS_DIR = "prototipo/apps/web/public/assets/tilesets"
os.makedirs(SPRITES_DIR, exist_ok=True)
os.makedirs(TILESETS_DIR, exist_ok=True)

# 1. NAYLA SPRITESHEET (12 frames: 4 directions x 3 walk frames, 32x32 each)
# Row 0: Down (idle, walk1, walk2)
# Row 1: Left (idle, walk1, walk2)
# Row 2: Right (idle, walk1, walk2)
# Row 3: Up (idle, walk1, walk2)
nayla_img = Image.new("RGBA", (96, 128), (0, 0, 0, 0))
draw = ImageDraw.Draw(nayla_img)

# Palettes for Nayla
HAIR_DARK = (58, 30, 22, 255)
HAIR_LIGHT = (110, 62, 45, 255)
SKIN_BASE = (244, 188, 150, 255)
SKIN_SHADOW = (212, 148, 114, 255)
JACKET_ORANGE = (235, 104, 34, 255)
JACKET_SHADOW = (180, 70, 18, 255)
PANTS_TEAL = (36, 78, 102, 255)
BOOTS_BROWN = (45, 30, 20, 255)
EYES_DARK = (30, 20, 20, 255)
HIGHLIGHT = (255, 230, 200, 255)

def draw_nayla_frame(d, col, row, direction, walk_phase):
    ox = col * 32
    oy = row * 32
    bounce = 1 if walk_phase != 0 else 0
    leg_offset = 2 if walk_phase == 1 else (-2 if walk_phase == 2 else 0)

    # Shadow on ground
    d.ellipse([ox + 9, oy + 27, ox + 23, oy + 31], fill=(40, 15, 10, 80))

    if direction == "down":
        # Legs / Boots
        d.rectangle([ox + 11, oy + 21, ox + 14, oy + 28 + leg_offset], fill=PANTS_TEAL)
        d.rectangle([ox + 17, oy + 21, ox + 20, oy + 28 - leg_offset], fill=PANTS_TEAL)
        d.rectangle([ox + 10, oy + 27 + leg_offset, ox + 14, oy + 29 + leg_offset], fill=BOOTS_BROWN)
        d.rectangle([ox + 17, oy + 27 - leg_offset, ox + 21, oy + 29 - leg_offset], fill=BOOTS_BROWN)

        # Torso / Explorer Jacket
        d.rectangle([ox + 11, oy + 13 - bounce, ox + 20, oy + 22 - bounce], fill=JACKET_ORANGE)
        d.rectangle([ox + 11, oy + 20 - bounce, ox + 20, oy + 22 - bounce], fill=JACKET_SHADOW)
        d.rectangle([ox + 15, oy + 14 - bounce, ox + 16, oy + 21 - bounce], fill=HIGHLIGHT) # Zipper
        # Arms
        d.rectangle([ox + 8, oy + 14 - bounce - leg_offset, ox + 10, oy + 20 - bounce - leg_offset], fill=JACKET_ORANGE)
        d.rectangle([ox + 21, oy + 14 - bounce + leg_offset, ox + 23, oy + 20 - bounce + leg_offset], fill=JACKET_ORANGE)
        d.rectangle([ox + 8, oy + 20 - bounce - leg_offset, ox + 10, oy + 21 - bounce - leg_offset], fill=SKIN_BASE)
        d.rectangle([ox + 21, oy + 20 - bounce + leg_offset, ox + 23, oy + 21 - bounce + leg_offset], fill=SKIN_BASE)

        # Head / Hair
        d.rectangle([ox + 11, oy + 5 - bounce, ox + 20, oy + 13 - bounce], fill=SKIN_BASE)
        d.rectangle([ox + 10, oy + 4 - bounce, ox + 21, oy + 8 - bounce], fill=HAIR_DARK)
        d.rectangle([ox + 9, oy + 7 - bounce, ox + 11, oy + 11 - bounce], fill=HAIR_DARK)
        d.rectangle([ox + 20, oy + 7 - bounce, ox + 22, oy + 11 - bounce], fill=HAIR_DARK)
        # Ponytail bobbing
        d.rectangle([ox + 21, oy + 5 - bounce, ox + 24, oy + 10 - bounce + leg_offset], fill=HAIR_LIGHT)
        # Eyes
        d.rectangle([ox + 13, oy + 9 - bounce, ox + 14, oy + 10 - bounce], fill=EYES_DARK)
        d.rectangle([ox + 17, oy + 9 - bounce, ox + 18, oy + 10 - bounce], fill=EYES_DARK)
        d.point([ox + 13, oy + 9 - bounce], fill=HIGHLIGHT)
        d.point([ox + 17, oy + 9 - bounce], fill=HIGHLIGHT)

    elif direction == "up":
        # Legs / Boots
        d.rectangle([ox + 11, oy + 21, ox + 14, oy + 28 + leg_offset], fill=PANTS_TEAL)
        d.rectangle([ox + 17, oy + 21, ox + 20, oy + 28 - leg_offset], fill=PANTS_TEAL)
        d.rectangle([ox + 10, oy + 27 + leg_offset, ox + 14, oy + 29 + leg_offset], fill=BOOTS_BROWN)
        d.rectangle([ox + 17, oy + 27 - leg_offset, ox + 21, oy + 29 - leg_offset], fill=BOOTS_BROWN)

        # Backpack
        d.rectangle([ox + 11, oy + 13 - bounce, ox + 20, oy + 22 - bounce], fill=JACKET_ORANGE)
        d.rectangle([ox + 12, oy + 14 - bounce, ox + 19, oy + 20 - bounce], fill=(60, 110, 130, 255))
        # Arms
        d.rectangle([ox + 8, oy + 14 - bounce + leg_offset, ox + 10, oy + 20 - bounce + leg_offset], fill=JACKET_ORANGE)
        d.rectangle([ox + 21, oy + 14 - bounce - leg_offset, ox + 23, oy + 20 - bounce - leg_offset], fill=JACKET_ORANGE)

        # Back of head / Ponytail
        d.rectangle([ox + 10, oy + 4 - bounce, ox + 21, oy + 12 - bounce], fill=HAIR_DARK)
        d.rectangle([ox + 14, oy + 7 - bounce, ox + 17, oy + 14 - bounce + leg_offset], fill=HAIR_LIGHT)

    elif direction == "left":
        # Legs
        d.rectangle([ox + 13, oy + 21, ox + 17, oy + 28 + leg_offset], fill=PANTS_TEAL)
        d.rectangle([ox + 11, oy + 27 + leg_offset, ox + 16, oy + 29 + leg_offset], fill=BOOTS_BROWN)

        # Torso
        d.rectangle([ox + 12, oy + 13 - bounce, ox + 19, oy + 22 - bounce], fill=JACKET_ORANGE)
        d.rectangle([ox + 18, oy + 14 - bounce, ox + 21, oy + 20 - bounce], fill=(60, 110, 130, 255)) # Backpack side
        d.rectangle([ox + 11, oy + 15 - bounce - leg_offset, ox + 14, oy + 21 - bounce - leg_offset], fill=JACKET_SHADOW)
        d.rectangle([ox + 10, oy + 20 - bounce - leg_offset, ox + 12, oy + 22 - bounce - leg_offset], fill=SKIN_BASE)

        # Head side
        d.rectangle([ox + 11, oy + 5 - bounce, ox + 18, oy + 13 - bounce], fill=SKIN_BASE)
        d.rectangle([ox + 13, oy + 4 - bounce, ox + 20, oy + 11 - bounce], fill=HAIR_DARK)
        d.rectangle([ox + 20, oy + 6 - bounce, ox + 23, oy + 11 - bounce - leg_offset], fill=HAIR_LIGHT) # Ponytail
        d.rectangle([ox + 12, oy + 9 - bounce, ox + 13, oy + 10 - bounce], fill=EYES_DARK)

    elif direction == "right":
        # Legs
        d.rectangle([ox + 14, oy + 21, ox + 18, oy + 28 + leg_offset], fill=PANTS_TEAL)
        d.rectangle([ox + 15, oy + 27 + leg_offset, ox + 20, oy + 29 + leg_offset], fill=BOOTS_BROWN)

        # Torso
        d.rectangle([ox + 12, oy + 13 - bounce, ox + 19, oy + 22 - bounce], fill=JACKET_ORANGE)
        d.rectangle([ox + 10, oy + 14 - bounce, ox + 13, oy + 20 - bounce], fill=(60, 110, 130, 255)) # Backpack side
        d.rectangle([ox + 17, oy + 15 - bounce - leg_offset, ox + 20, oy + 21 - bounce - leg_offset], fill=JACKET_SHADOW)
        d.rectangle([ox + 19, oy + 20 - bounce - leg_offset, ox + 21, oy + 22 - bounce - leg_offset], fill=SKIN_BASE)

        # Head side
        d.rectangle([ox + 13, oy + 5 - bounce, ox + 20, oy + 13 - bounce], fill=SKIN_BASE)
        d.rectangle([ox + 11, oy + 4 - bounce, ox + 18, oy + 11 - bounce], fill=HAIR_DARK)
        d.rectangle([ox + 8, oy + 6 - bounce, ox + 11, oy + 11 - bounce - leg_offset], fill=HAIR_LIGHT) # Ponytail
        d.rectangle([ox + 18, oy + 9 - bounce, ox + 19, oy + 10 - bounce], fill=EYES_DARK)

for r_idx, d_name in enumerate(["down", "left", "right", "up"]):
    for c_idx, phase in enumerate([0, 1, 2]):
        draw_nayla_frame(draw, c_idx, r_idx, d_name, phase)

nayla_img.save(os.path.join(SPRITES_DIR, "nayla.png"))
print("Saved nayla.png")

# 2. BIP SPRITESHEET (4 frames: 96x24, 24x24 each)
bip_img = Image.new("RGBA", (96, 24), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bip_img)

BIP_BODY = (210, 225, 235, 255)
BIP_DARK = (140, 160, 175, 255)
BIP_EYE_CYAN = (0, 230, 255, 255)
BIP_EYE_PULSE = (120, 255, 255, 255)
BIP_ANTENNA = (255, 180, 0, 255)

for i in range(4):
    bx = i * 24
    bob = 1 if i in [1, 3] else 0
    # Floating shadow
    bdraw.ellipse([bx + 6, 18, bx + 18, 22], fill=(40, 15, 10, 60))
    # Antenna
    bdraw.line([bx + 12, 4 + bob, bx + 12, 1 + bob], fill=BIP_DARK, width=1)
    bdraw.rectangle([bx + 11, 0 + bob, bx + 13, 2 + bob], fill=BIP_ANTENNA if i % 2 == 0 else (255, 240, 120, 255))
    # Main round body (apple-sized orb robot)
    bdraw.ellipse([bx + 5, 4 + bob, bx + 19, 17 + bob], fill=BIP_BODY)
    bdraw.ellipse([bx + 6, 11 + bob, bx + 18, 17 + bob], fill=BIP_DARK)
    # Eye screen
    bdraw.rectangle([bx + 7, 7 + bob, bx + 17, 12 + bob], fill=(20, 30, 40, 255))
    eye_col = BIP_EYE_PULSE if i == 2 else BIP_EYE_CYAN
    bdraw.rectangle([bx + 9, 8 + bob, bx + 11, 11 + bob], fill=eye_col)
    bdraw.rectangle([bx + 13, 8 + bob, bx + 15, 11 + bob], fill=eye_col)

bip_img.save(os.path.join(SPRITES_DIR, "bip.png"))
print("Saved bip.png")

# 3. OPPORTUNITY ROVER SPRITE (64x48)
opp_img = Image.new("RGBA", (64, 48), (0, 0, 0, 0))
odraw = ImageDraw.Draw(opp_img)

SOLAR_PANEL_TOP = (40, 50, 75, 255)
SOLAR_GRID = (70, 95, 135, 255)
GOLD_FOIL = (212, 160, 40, 255)
GOLD_SHADOW = (150, 110, 25, 255)
METAL_GRAY = (160, 165, 170, 255)
WHEEL_DARK = (45, 45, 50, 255)
TREAD_RIDGE = (90, 90, 95, 255)
DUST_MARS = (195, 100, 55, 200)

# Shadow
odraw.ellipse([6, 38, 58, 46], fill=(40, 15, 10, 100))

# 6 Wheels (Rocker-Bogie Suspension)
wheel_xs = [8, 20, 32, 44, 52]
for wx in [10, 22, 36, 50]:
    odraw.rectangle([wx, 36, wx + 6, 44], fill=WHEEL_DARK)
    odraw.line([wx + 1, 37, wx + 1, 43], fill=TREAD_RIDGE)
    odraw.line([wx + 5, 37, wx + 5, 43], fill=TREAD_RIDGE)
    odraw.point([wx + 3, 40], fill=DUST_MARS)

# Suspension Bogie struts
odraw.line([13, 38, 25, 30], fill=METAL_GRAY, width=2)
odraw.line([25, 30, 39, 38], fill=METAL_GRAY, width=2)
odraw.line([25, 30, 42, 28], fill=METAL_GRAY, width=2)
odraw.line([42, 28, 53, 38], fill=METAL_GRAY, width=2)

# Central Equipment Warm Box (WEB) with Gold Foil
odraw.rectangle([18, 22, 48, 32], fill=GOLD_FOIL)
odraw.rectangle([18, 28, 48, 32], fill=GOLD_SHADOW)

# Solar Panel Wings (Triangular silhouette)
odraw.polygon([(14, 22), (52, 22), (58, 17), (8, 17)], fill=SOLAR_PANEL_TOP)
# Solar cell grid lines
for gx in range(12, 56, 6):
    odraw.line([gx, 18, gx + 2, 21], fill=SOLAR_GRID)
# Thin layer of Martian dust on the panels
odraw.rectangle([16, 18, 48, 20], fill=DUST_MARS)

# High-Gain Antenna Dish
odraw.ellipse([44, 11, 52, 17], fill=(220, 225, 230, 255))
odraw.point([48, 14], fill=METAL_GRAY)

# Pancam Mast Assembly (PMA - the "Head" and neck)
odraw.line([24, 22, 24, 8], fill=METAL_GRAY, width=2)
odraw.rectangle([20, 6, 28, 11], fill=(60, 65, 70, 255))
# Stereo cameras
odraw.point([22, 8], fill=(0, 210, 255, 255))
odraw.point([26, 8], fill=(0, 210, 255, 255))
odraw.point([24, 7], fill=GOLD_FOIL)

# Robotic Arm (Instrument Deployment Device - IDD)
odraw.line([18, 30, 12, 34], fill=METAL_GRAY, width=2)
odraw.line([12, 34, 10, 40], fill=METAL_GRAY, width=2)
odraw.rectangle([8, 38, 12, 42], fill=(90, 95, 100, 255)) # Microscopic Imager / Mössbauer

opp_img.save(os.path.join(SPRITES_DIR, "opportunity.png"))
print("Saved opportunity.png")

# 4. BLUEBERRIES / HEMATITE CLUE SPRITE (32x32)
clue_img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
cdraw = ImageDraw.Draw(clue_img)

ROCK_OCHRE = (185, 95, 50, 255)
ROCK_LIGHT = (215, 130, 80, 255)
ROCK_SHADOW = (130, 60, 30, 255)
BLUEBERRY_BASE = (65, 80, 105, 255)
BLUEBERRY_HILIGHT = (110, 145, 185, 255)
SPARKLE = (255, 255, 180, 255)

# Martian bedrock outcrop
cdraw.polygon([(4, 26), (28, 26), (30, 16), (18, 10), (6, 14)], fill=ROCK_OCHRE)
cdraw.line([(6, 14), (18, 10), (30, 16)], fill=ROCK_LIGHT, width=2)
cdraw.line([(4, 26), (16, 24), (28, 26)], fill=ROCK_SHADOW, width=1)

# Concretions ("Blueberries" spherules embedded in rock)
bb_coords = [(10, 18), (14, 15), (20, 20), (24, 16), (16, 21)]
for bx, by in bb_coords:
    cdraw.ellipse([bx, by, bx + 3, by + 3], fill=BLUEBERRY_BASE)
    cdraw.point([bx + 1, by + 1], fill=BLUEBERRY_HILIGHT)

# Discovery sparkle indicator
cdraw.point([15, 7], fill=SPARKLE)
cdraw.point([14, 8], fill=SPARKLE)
cdraw.point([16, 8], fill=SPARKLE)
cdraw.point([15, 9], fill=SPARKLE)

clue_img.save(os.path.join(SPRITES_DIR, "blueberries.png"))
print("Saved blueberries.png")

# 5. MARS TILESET (128x128, 4x4 tiles of 32x32)
tiles_img = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(tiles_img)

SAND_BASE = (204, 102, 51, 255)
SAND_LIGHT = (225, 125, 70, 255)
SAND_SHADOW = (165, 75, 35, 255)
ROCK_DARK = (105, 45, 25, 255)

# Tile 0,0: Smooth red sand with ripple dunes
for y in range(0, 32):
    for x in range(0, 32):
        shade = SAND_BASE
        if (y + (x // 4)) % 8 == 0:
            shade = SAND_LIGHT
        elif (y + (x // 4)) % 8 == 4:
            shade = SAND_SHADOW
        tiles_img.putpixel((x, y), shade)

# Tile 1,0: Sand with small pebbles and hematite flecks
for y in range(0, 32):
    for x in range(32, 64):
        shade = SAND_BASE
        if (x * 7 + y * 13) % 17 == 0:
            shade = (70, 85, 110, 255) # Tiny blueberry
        elif (x + y) % 6 == 0:
            shade = SAND_LIGHT
        tiles_img.putpixel((x, y), shade)

# Tile 2,0: Rover tracks in the sand
for y in range(0, 32):
    for x in range(64, 96):
        shade = SAND_BASE
        # parallel tread marks
        lx = x - 64
        if lx in [8, 9, 22, 23]:
            shade = SAND_SHADOW if y % 4 < 2 else SAND_LIGHT
        tiles_img.putpixel((x, y), shade)

# Tile 3,0: Rocky crater rim / impassable cliff
for y in range(0, 32):
    for x in range(96, 128):
        shade = ROCK_DARK if y > 16 else ROCK_OCHRE
        if (x + y) % 5 == 0:
            shade = ROCK_LIGHT
        tiles_img.putpixel((x, y), shade)

# Tiles row 1, 2, 3: Varied rocky borders and crater textures
for ty in range(1, 4):
    for tx in range(0, 4):
        for py in range(32):
            for px in range(32):
                gx = tx * 32 + px
                gy = ty * 32 + py
                base = SAND_BASE
                if ty == 3: # impassable border rock
                    base = ROCK_DARK if (px + py) % 4 == 0 else ROCK_OCHRE
                elif (px * 3 + py * 5 + tx * 7) % 11 == 0:
                    base = SAND_LIGHT
                elif (px * 7 + py * 2) % 13 == 0:
                    base = SAND_SHADOW
                tiles_img.putpixel((gx, gy), base)

tiles_img.save(os.path.join(TILESETS_DIR, "mars_tiles.png"))
print("Saved mars_tiles.png")
