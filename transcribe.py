import sys
from faster_whisper import WhisperModel


def transcribe_audio(audio_path):
    model = WhisperModel(
        "base",
        device="cpu",
        compute_type="int8"
    )

    segments, info = model.transcribe(audio_path)

    transcript = []

    for segment in segments:
        transcript.append(segment.text.strip())

    return " ".join(transcript)


if __name__ == "__main__":
    audio_path = sys.argv[1]

    transcript = transcribe_audio(audio_path)

    print(transcript)