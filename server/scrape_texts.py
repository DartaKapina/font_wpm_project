from models.text_entry import TextEntry
from controllers.db_controller import DatabaseController
import requests
from bs4 import BeautifulSoup
import re
import random
import json
import sys
import os

# Add the server directory to Python path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def clean_text(text):
    # Try to find Project Gutenberg header and footer
    parts = re.split(r'\*\*\* *START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*|'
                     r'\*\*\* *END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*',
                     text, flags=re.IGNORECASE | re.DOTALL)

    # If we found the markers, take the middle part, otherwise use the whole text
    if len(parts) >= 3:
        text = parts[1].strip()
    elif len(parts) == 2:
        text = parts[1].strip() if '*** START' in text else parts[0].strip()

    # Remove chapter headings, numbers and extra whitespace
    text = re.sub(r'CHAPTER [IVXLC]+', '', text)
    text = text.replace('\r\n', '\n')  # Normalize Windows line endings
    # Split by empty lines (paragraphs)
    paragraphs = re.split(r'\n\s*\n', text)

    # Clean up each paragraph individually
    paragraphs = [re.sub(r'\s+', ' ', p.strip()) for p in paragraphs]
    clean_paragraphs = []

    print(len(paragraphs))

    for paragraph in paragraphs:
        # Clean up the paragraph
        paragraph = paragraph.strip()

        # Filter conditions:
        # - Not too short or too long (between 100 and 500 characters)
        # - Contains only letters, spaces, commas and periods
        # - Has at least 3 sentences (rough check for periods)
        if (100 <= len(paragraph) <= 500 and
            re.match(r'^[A-Za-z\s,.]+$', paragraph) and
                paragraph.count('.') >= 3):
            clean_paragraphs.append(paragraph)

    return clean_paragraphs


def get_gutenberg_text(book_id):
    # Try different URL patterns
    urls = [
        f'https://www.gutenberg.org/files/{book_id}/{book_id}-0.txt',
        f'https://www.gutenberg.org/files/{book_id}/{book_id}.txt',
        f'https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}.txt'
    ]

    for url in urls:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                return response.text
        except:
            continue

    print(f"Failed to fetch book {book_id}")
    return None


def calculate_difficulty(sentence: str) -> str:
    # Calculate average word length
    words = sentence.split()
    avg_word_length = sum(len(word) for word in words) / len(words)

    # Count words with more than 6 letters (considered "complex")
    complex_words = sum(1 for word in words if len(word) > 6)
    complex_ratio = complex_words / len(words)

    # Determine difficulty based on both metrics
    if avg_word_length < 4.5 and complex_ratio < 0.2:
        return "easy"
    elif avg_word_length > 5.5 or complex_ratio > 0.4:
        return "hard"
    else:
        return "normal"


def main():
    # Initialize database connection
    db = DatabaseController()

    # Popular simple English books from Project Gutenberg
    book_ids = [
        11,  # Alice's Adventures in Wonderland
        74,  # The Adventures of Tom Sawyer
        1661,  # The Adventures of Sherlock Holmes
        98,  # A Tale of Two Cities
        84,  # Frankenstein
        1342,  # Pride and Prejudice
        2701,  # Moby Dick
        244,  # A Study in Scarlet
        1952,  # The Yellow Wallpaper
        16,  # Peter Pan
    ]

    all_paragraphs = []

    for book_id in book_ids:
        print(f"Processing book {book_id}...")
        text = get_gutenberg_text(book_id)
        if text:
            paragraphs = clean_text(text)
            print(
                f"Found {len(paragraphs)} valid paragraphs in book {book_id}")
            all_paragraphs.extend(paragraphs)

    print(f"\nTotal paragraphs found: {len(all_paragraphs)}")

    selected_paragraphs = all_paragraphs

    # Save to database
    print("Saving paragraphs to database...")
    for paragraph in selected_paragraphs:
        text_entry = TextEntry(
            content=paragraph,
            source="Project Gutenberg"
        )
        db.add(text_entry)

    db.commit()
    print(f"Saved {len(selected_paragraphs)} paragraphs to database")


if __name__ == "__main__":
    main()
