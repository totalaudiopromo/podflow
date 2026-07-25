# How Podflow Works — Architecture & Technical Deep Dive

Podflow combines audio processing, speaker diarization, speech-to-text, and LLM reasoning into an integrated pipeline.

## Processing Pipeline

```
[ Apple Podcasts DB / RSS ] -> [ Diarization & Whisper ASR ] -> [ Semantic Chunking ] -> [ LLM Reasoning ] -> [ Markdown Digest ]
```

1. **Audio Ingestion & SQLite Parsing:** Accesses local database or fetches remote RSS feed enclosure MP3/AAC streams.
2. **Speaker Diarization:** Separates distinct speakers into channels/tracks to differentiate host questions from guest responses.
3. **Speech-to-Text Transcripts:** Uses Whisper or cloud Speech API with word-level timecodes.
4. **Semantic Chunking & LLM Extraction:** Evaluates 2,000-word blocks with structured Zod schema prompts for entity resolution.
5. **Output Generation:** Writes clean Markdown file with YAML frontmatter.
