import tkinter as tk
import sys
import math

points = []
dragged_idx = None
DRAG_RADIUS = 15  # Generous radius to make clicking dots easy

def redraw():
    # Remove all drawings but keep the image (which doesn't have the 'overlay' tag)
    canvas.delete("overlay")
    
    # Draw lines connecting the points
    if len(points) > 1:
        for i in range(len(points) - 1):
            canvas.create_line(points[i][0], points[i][1], points[i+1][0], points[i+1][1], 
                               fill="#00FF00", width=2, tags="overlay")
                               
    # Close the polygon if we have 4 points
    if len(points) == 4:
        canvas.create_line(points[3][0], points[3][1], points[0][0], points[0][1], 
                           fill="#00FF00", width=2, tags="overlay")
        
    # Draw points (dots) on top of lines
    for x, y in points:
        canvas.create_oval(x-6, y-6, x+6, y+6, fill="#FF0000", outline="#FFFFFF", tags="overlay")

def on_click(event):
    global dragged_idx
    actual_x = canvas.canvasx(event.x)
    actual_y = canvas.canvasy(event.y)
    
    # Check if the click is near an existing point (to start a drag)
    for i, (px, py) in enumerate(points):
        dist = math.hypot(actual_x - px, actual_y - py)
        if dist <= DRAG_RADIUS:
            dragged_idx = i
            return
            
    # If not dragging and we need more points, add a new one
    if len(points) < 4:
        points.append((actual_x, actual_y))
        redraw()

def on_drag(event):
    global dragged_idx
    # If a point was selected, update its coordinates and redraw
    if dragged_idx is not None:
        actual_x = canvas.canvasx(event.x)
        actual_y = canvas.canvasy(event.y)
        points[dragged_idx] = (actual_x, actual_y)
        redraw()

def on_release(event):
    global dragged_idx
    dragged_idx = None

def confirm(event=None):
    if len(points) == 4:
        # Convert points to absolute integers before printing
        final_points = [(int(x), int(y)) for x, y in points]
        print("\n--- Calibration Complete ---")
        print("Copy the following array into your process_image.py:")
        print(f"DESTINATION_CORNERS = {final_points}")
        print("\nYou can now close the window.")
    else:
        print(f"Please place all 4 points first. You currently have {len(points)}.")

def reset(event=None):
    global points
    points = []
    redraw()
    print("Points reset. Click to place up to 4 points.")

root = tk.Tk()
root.title("Calibrate Template - Press 'Enter' to confirm, 'r' to reset")

# Withdraw root temporarily to get screen size accurately
root.withdraw()
screen_w = root.winfo_screenwidth()
screen_h = root.winfo_screenheight()

try:
    img = tk.PhotoImage(file="template.png")
except Exception as e:
    print("Error: Could not load 'template.png'. Make sure it's in the same directory and is a valid PNG.")
    sys.exit(1)

w, h = img.width(), img.height()

# Create a frame for canvas and scrollbars
frame = tk.Frame(root)
frame.pack(fill=tk.BOTH, expand=True)

# Create canvas with limited window size but large scrollregion
canvas = tk.Canvas(frame, cursor="crosshair", scrollregion=(0, 0, w, h))
hbar = tk.Scrollbar(frame, orient=tk.HORIZONTAL, command=canvas.xview)
hbar.pack(side=tk.BOTTOM, fill=tk.X)
vbar = tk.Scrollbar(frame, orient=tk.VERTICAL, command=canvas.yview)
vbar.pack(side=tk.RIGHT, fill=tk.Y)

canvas.config(xscrollcommand=hbar.set, yscrollcommand=vbar.set)
canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

# Set window size to match screen or image, whichever is smaller, leaving some padding
win_w = min(w + 20, screen_w - 100)
win_h = min(h + 20, screen_h - 100)
root.geometry(f"{win_w}x{win_h}")
root.deiconify() # Restore window

# Draw image (background)
canvas.create_image(0, 0, anchor=tk.NW, image=img)

# Bind mouse and keyboard events
canvas.bind("<Button-1>", on_click)
canvas.bind("<B1-Motion>", on_drag)
canvas.bind("<ButtonRelease-1>", on_release)
root.bind("<Return>", confirm)
root.bind("r", reset)

print("Click to place up to 4 points.")
print("Click and drag any point to adjust its position.")
print("Order: Top-Left, Top-Right, Bottom-Right, Bottom-Left.")
print("Press 'Enter' to confirm and print coordinates.")
print("Press 'r' to reset points if you make a mistake.")

root.lift()
root.attributes('-topmost', True)
root.after_idle(root.attributes, '-topmost', False)

root.mainloop()
