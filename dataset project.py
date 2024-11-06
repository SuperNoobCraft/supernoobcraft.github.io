import nltk
import os
from nltk.tokenize import TreebankWordTokenizer
from nltk.stem import PorterStemmer
import spacy
from collections import Counter
from textblob import TextBlob
from gensim import corpora
from gensim.models.ldamodel import LdaModel

# Some initializaions
nlp = spacy.load("en_core_web_sm")
stop_words = nlp.Defaults.stop_words

# Adding some StopWords
stop_words.add("int")
stop_words.add("ext")
stop_words.add("cont'd")
stop_words.add("\n                         ")
stop_words.add("\n\n               ")
stop_words.add("\n\n                                     ")
stop_words.add("\n               ")
stop_words.add("\n                              ")
stop_words.add("\n")
stop_words.add(",")
stop_words.add(".")
stop_words.add("?")
stop_words.add("!")
stop_words.add("(")
stop_words.add(")")
stop_words.add("...")
stop_words.add("-")
stop_words.add(":")
stop_words.add(";")
stop_words.add("")

# Opening the Text File
file_path = ".venv\Dataset Project Assets\Star-Wars-6.txt"
with open(file_path, "r") as file:
    text = file.read().lower()
doc = nlp(text)

# Tokenize
tokenizer = TreebankWordTokenizer()
tokens = tokenizer.tokenize(text)
tokens_path = ".venv\\Dataset Project Assets\\tokens.txt"
with open(tokens_path, "w") as tokens_file:
    for i in tokens:
        tokens_file.write(f"{i}\n")

# Stemming
stemmer = PorterStemmer()
stemmed_data = [stemmer.stem(i) for i in tokens]
stemmed_path = ".venv\\Dataset Project Assets\\stemmed.txt"
with open(stemmed_path, "w") as stemmed_file:
    for i in stemmed_data:
        stemmed_file.write(f"{i}\n")

# Lemmatiation
lemmatized_data = [i.lemma_ for i in doc]
lemmatized_path = ".venv\\Dataset Project Assets\\lemmatized.txt"
with open(lemmatized_path, "w") as lemmatized_file:
    for i in lemmatized_data:
        lemmatized_file.write(f"{i}\n")

# Removing Stop Words
filtered_data = [i.text.strip() for i in doc if i.text.lower().strip() not in stop_words]
filtered_path = ".venv\\Dataset Project Assets\\filtered.txt"
with open(filtered_path, "w") as filtered_file:
    for i in filtered_data:
        filtered_file.write(f"{i}\n")

# Counter
tcounted_data = Counter(tokens)
tcounted_path = ".venv\\Dataset Project Assets\\tcounted.csv"
with open(tcounted_path, "w") as tcounted_file:
    tcounted_file.write("word,frequency\n")
    for i in tcounted_data.keys():
        tcounted_file.write(f"{i},{tcounted_data[i]}\n")
tTop = tcounted_data.most_common(20)
fcounted_data = Counter(filtered_data)
fcounted_path = ".venv\\Dataset Project Assets\\fcounted.csv"
with open(fcounted_path, "w") as fcounted_file:
    fcounted_file.write("word,frequency\n")
    for i in fcounted_data.keys():
        fcounted_file.write(f"{i},{fcounted_data[i]}\n")
fTop = fcounted_data.most_common(20)
countData_path = ".venv\\Dataset Project Assets\\countData.txt"
with open(countData_path, "w") as countData_file:
    countData_file.write("Top 20 Words in Text BEFORE Filtering:\n")
    j = 0
    for i in tTop:
        j += 1
        countData_file.write(f"{j}: {i}\n")
    countData_file.write("\nTop 20 Words in Text AFTER Filtering:\n")
    j = 0
    for i in fTop:
        j += 1
        countData_file.write(f"{j}: {i}\n")
print("Program Ran Successfully.")