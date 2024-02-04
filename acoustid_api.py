import acoustid
from pydub import AudioSegment

AudioSegment.converter = 'path/usr/local/bin/ffmpeg'

def generate_fingerprint(api_key, audio_file_path):
    try:
        acoustid.api_key = api_key
        audio = AudioSegment.from_file(audio_file_path)
        samples = audio.raw_data
        channels = audio.channels
        sample_width = audio.sample_width
        frame_rate = audio.frame_rate

        fingerprint, duration = acoustid.fingerprint(samples, sample_width, channels, frame_rate)
        return fingerprint, duration
    except Exception as e:
        print(f"Error in generate_fingerprint: {e}")
        return None, None

def identify_music(api_key, fingerprint, duration):
    try:
        acoustid.api_key = api_key
        results = acoustid.lookup(api_key, fingerprint, duration)

        for score, result in results:
            print(f"Score: {score}, Track ID: {result['id']}, Title: {result['title']}, Artist: {result['artist']}")
    except Exception as e:
        print(f"Error in identify_music: {e}")

api_key = "b'WixO9taV"
audio_file_path = 'poetic-justice.mp3'

fingerprint, duration = generate_fingerprint(api_key, audio_file_path)
print(f"Fingerprint: {fingerprint}, Duration: {duration}")

if fingerprint and duration:
    identify_music(api_key, fingerprint, duration)
