import midi

mary = midi.read_midifile("songs/mary.mid")
# slayer = midi.read_midifile("songs/Slayer_-_Expendable_youth.midi")

print mary
# print slayer

# write midi file to json, with tick being x axis, and figuring out "data" to be note and duration.