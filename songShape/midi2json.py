import py_midicsv
import pandas
import json
import csv


# convert file to csv
mc = py_midicsv.midi_to_csv("songs/mary.mid")

# append note and octave data

with open('mary.csv','w') as m_csv:
    writer = csv.writer(m_csv)
    writer.writerows([mc])

# write midi file to csv, with tick being x axis, and figuring out "data" to be note and duration.
# floor()
# octave # will be radius - floor of (number divided by 12)
# numpy.floor(midi{NoteOnEvent}.data)
# note will be angle - (remainder of (number divided by 12)) multiplied by the variable
# note_angle = {'angles':[
#     {0,{'note':'C','angle':0}},
#     {7,{'note':'G','angle':30}},
#     {2,{'note':'D','angle':60}},
#     {9,{'note':'A','angle':90}},
#     {4,{'note':'E','angle':120}},
#     {11,{'note':'B','angle':150}},
#     {6,{'note':'F#','angle':180}},
#     {1,{'note':'C#','angle':210}},
#     {8,{'note':'G#','angle':240}},
#     {3,{'note':'D#','angle':270}},
#     {10,{'note':'A#','angle':300}},
#     {5,{'note':'F','angle':330}}
#     ]}

# https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
# https://www.midimountain.com/midi/midi_note_numbers.html
# https://en.wikipedia.org/wiki/Circle_of_fifths
print('ding!')