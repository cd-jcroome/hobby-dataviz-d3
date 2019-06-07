import py_midicsv
import pandas as pd
import numpy as np
import json
import csv
from os import listdir
from os.path import isfile, join, splitext

# for all of the mid or midi files in a given folder...
files = [f for f in listdir('./songs') if isfile(join('./songs/',f))]
print(files)

d = {
    'note':[0,7,2,9,4,11,6,1,8,3,10,5],
    'note_name':['C','G','D','A','E','B','F#','C#','G#','D#','A#','F'],
    'angle':[0,30,60,90,120,150,180,210,240,270,300,330,]}
nmd = pd.DataFrame(data=d)
nmd['note'] = pd.to_numeric(nmd['note'],errors='ignore').astype(int)
print(nmd)

## convert midifile to pandas df
for f in files:
    mc = py_midicsv.midi_to_csv(join('./songs/',f))
    mcdf = pd.DataFrame(mc)
    mcdf = mcdf[0].str.split(',',expand=True).replace('\n','',regex=True)
    
        
    mcdf['note_value'] = pd.to_numeric(mcdf[4],errors='coerce').fillna(0).astype(int)
    
# octave # will be radius - floor of (number divided by 12)
# note will be angle - (remainder of (number divided by 12)) multiplied by the variable
    mcdf['octave'],mcdf['note'] = mcdf['note_value']//12,mcdf['note_value']%12

    mcdfx = mcdf.join(nmd,on='note',rsuffix='_nmd')

    print(mcdfx)

## append note and octave data to the df
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

    m_csv = join('./output/',splitext(f)[0],'.csv').replace("/.csv",".csv")
    
    mcdfx.to_csv(m_csv, encoding='utf-8')

# https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
# https://www.midimountain.com/midi/midi_note_numbers.html
# https://en.wikipedia.org/wiki/Circle_of_fifths
print('ding!')