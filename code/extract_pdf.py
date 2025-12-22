import PyPDF2
import json

pdf_path = "user_input_files/968a5073-3c11-42fe-a1f1-3bb2687034d1.pdf"

with open(pdf_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"

# Save to a text file for easier reading
with open('tmp/curriculum_content.txt', 'w', encoding='utf-8') as f:
    f.write(text)

print(f"Extracted {len(text)} characters from {len(pdf_reader.pages)} pages")
print("Content saved to tmp/curriculum_content.txt")
