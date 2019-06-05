import py_midicsv
import pandas as pd
import json
import csv
from os import listdir
from os.path import isfile, join, splitext

# for all of the mid or midi files in a given folder...
files = [f for f in listdir('./songs') if isfile(join('./songs/',f))]
print(files)
## convert midifile to pandas df
for f in files:
    mc = py_midicsv.midi_to_csv(join('./songs/',f))
    mcdf = pd.DataFrame(mc)
    print(mcdf[0])

## append note and octave data to the df
## octave # will be radius - floor of (number divided by 12)
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

    with open(join('./output/',splitext(f)[0],'.csv').replace("/.csv",".csv"),'w') as m_csv:
        for row in mc:
            m_csv.write(row)

# https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
# https://www.midimountain.com/midi/midi_note_numbers.html
# https://en.wikipedia.org/wiki/Circle_of_fifths
print('ding!')