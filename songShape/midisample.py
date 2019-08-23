from mido import MidiFile

mid = MidiFile(input("song?\n"))
for i, track in enumerate(mid.tracks):
    for msg in track:
        print(msg)