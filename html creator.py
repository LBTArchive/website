import ctypes
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
import os

# Set DPI Awareness for better UI scaling
try:
    ctypes.windll.shcore.SetProcessDpiAwareness(1)
except Exception:
    pass

# --- Persistent ID counter ---
ID_COUNTER_FILE = "id_counter.txt"

def load_id_counter():
    if os.path.exists(ID_COUNTER_FILE):
        with open(ID_COUNTER_FILE, "r") as f:
            try:
                return int(f.read().strip())
            except ValueError:
                return 1
    return 1

def save_id_counter(value):
    with open(ID_COUNTER_FILE, "w") as f:
        f.write(str(value))

id_counter = load_id_counter()
# ------------------------------

def generate_html():
    global id_counter

    image_paths = app_state['images']
    title = title_var.get().strip()
    subtitle = subtitle_var.get().strip()
    year = year_var.get().strip()
    publisher = publisher_var.get().strip()
    isbn = isbn_var.get().strip()
    language = language_var.get().strip()
    notes_raw = notes_text.get("1.0", tk.END).strip()
    notes = "<br/>".join(notes_raw.splitlines())

    if not image_paths or not title:
        messagebox.showerror("Missing Info", "Please select at least one image and enter a title.")
        return

    # Generate ID from first image filename + counter
    base_image_name = os.path.splitext(os.path.basename(image_paths[0]))[0]
    html_id = f"{base_image_name}-{id_counter}"
    id_counter += 1
    save_id_counter(id_counter)

    img_html_parts = []
    for path in image_paths:
        rel_path = path.replace("\\", "/")
        if "/images/" in rel_path:
            rel_path = rel_path.split("/images/", 1)[1]
            rel_path = "/images/" + rel_path.lstrip("/")
        else:
            rel_path = "/images/" + os.path.basename(rel_path)

        img_html = f'''<a href="{rel_path}" data-lightbox="books" data-title="{title}">
        <div class="img-box">
          <img src="{rel_path}" alt="{title}" style="height:250px; object-fit:cover;" />
        </div>
      </a>'''
        img_html_parts.append(img_html)

    images_html = "\n      ".join(img_html_parts)

    info_lines = [f"<strong>Title:</strong> {title}<br/>"]
    if subtitle:
        info_lines.append(f"<strong>Subtitle:</strong> {subtitle}<br/>")
    if year:
        info_lines.append(f"<strong>Year:</strong> {year}<br/>")
    if publisher:
        info_lines.append(f"<strong>Publisher:</strong> {publisher}<br/>")
    if isbn:
        info_lines.append(f"<strong>ISBN:</strong> {isbn}<br/>")
    if language:
        info_lines.append(f"<strong>Language:</strong> {language}<br/>")
    if notes:
        info_lines.append(f"<strong>Notes:</strong> {notes}<br/>")

    info_html = "\n      ".join(info_lines)

    final_html = f'''
  <tr id="{html_id}">
    <td style="width:30%; text-align: center; vertical-align:top; padding:10px;">
      {images_html}
    </td>
    <td style="vertical-align:top; padding:10px;">
      {info_html}
    </td>
  </tr>
    '''.strip()

    output_box.delete("1.0", tk.END)
    output_box.insert(tk.END, final_html)

def select_images():
    files = filedialog.askopenfilenames(
        title="Select Image(s)",
        filetypes=[("Image Files", "*.jpg *.jpeg *.png *.gif")]
    )
    if files:
        app_state['images'] = files
        image_label.config(text=f"{len(files)} image(s) selected")

# GUI Setup
root = tk.Tk()
root.title("LBT HTML Generator")

app_state = {'images': []}

left_frame = tk.Frame(root, padx=10, pady=10)
left_frame.pack(side=tk.LEFT, fill=tk.Y)

tk.Button(left_frame, text="Select Image(s)", command=select_images).pack(pady=(0, 10))
image_label = tk.Label(left_frame, text="No images selected")
image_label.pack()

def create_field(label_text, var):
    tk.Label(left_frame, text=label_text).pack(anchor='w')
    tk.Entry(left_frame, textvariable=var, width=40).pack(pady=(0, 10))

title_var = tk.StringVar()
subtitle_var = tk.StringVar()
year_var = tk.StringVar()
publisher_var = tk.StringVar()
isbn_var = tk.StringVar()
language_var = tk.StringVar()

create_field("Title", title_var)
create_field("Subtitle", subtitle_var)
create_field("Year", year_var)
create_field("Publisher", publisher_var)
create_field("ISBN", isbn_var)
create_field("Language", language_var)

tk.Label(left_frame, text="Notes").pack(anchor='w')
notes_text = tk.Text(left_frame, width=30, height=5)
notes_text.pack(pady=(0, 10))

tk.Button(left_frame, text="Generate HTML", command=generate_html).pack(pady=10)

right_frame = tk.Frame(root, padx=10, pady=10)
right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

tk.Label(right_frame, text="Generated HTML").pack(anchor='w')
output_box = scrolledtext.ScrolledText(right_frame, width=100, height=40)
output_box.pack()

root.mainloop()
