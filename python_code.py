# Define the file path and the content
file_path = "output.txt"
content = "Hello, world!\nThis is written to a file."

# Write the content using 'with open' (safe file handling)
with open(file_path, 'w') as f:
    f.write(content)

print(f"Content written to {file_path}")
