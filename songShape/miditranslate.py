import py_midicsv
from mido import MidiFile
import pandas as pd
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

## convert midifile to pandas df
for f in files:
    mid = MidiFile(join('./songs/',f))
    mc = []
    mjr = {}
    for i, track in enumerate(mid.tracks):
        for msg in track:
            mc.append('{},{}'.format(i,msg.dict()))
    mcdf = pd.DataFrame(mc)[0].str.replace('{','').str.replace('}','').str.replace('\'','').str.replace(' ','').str.split(",",expand=True)
    print(mcdf)

    for key, mcdfgb in mcdf.groupby(0):
        mjr[str(key)] = mcdfgb.to_dict('records')
    
    # mcdf['note_value'] = pd.to_numeric(mcdf['note_number'],errors='coerce').fillna(0).astype(int)
    # mcdf['note_velocity'] = pd.to_numeric(mcdf['note_velocity'],errors='coerce').fillna(0).astype(int)
    # mcdf['tick'] = pd.to_numeric(mcdf['tick'],errors='coerce').fillna(0).astype(int)
# convert tick to time_delta
    # spqn = .5
    # tpqn = 
    # spt = spqn/tpqn
    # mcdf['second'] = mcdf['tick'].map(lambda x: x*spt)
    
# octave will be radius - floor of (number divided by 12), note will be angle - (remainder of (number divided by 12)) multiplied by the variable
    # mcdf['octave'],mcdf['note_value'] = mcdf['note']//12,mcdf['note']%12
## append note and octave data to the df
    # mcdfx = mcdf.join(nmd,on='note_value',rsuffix='_nmd')

    m_csv = join('./output/',splitext(f)[0],'.csv').replace("/.csv",".csv")
    mcdf.to_csv(m_csv, encoding='utf-8')

    m_json = join('./output/',splitext(f)[0],'.json').replace("/.json",".json")

    with open(m_json,'w') as m_json:
        json.dump(mjr,m_json,indent=2)

# https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
# https://www.midimountain.com/midi/midi_note_numbers.html
# https://en.wikipedia.org/wiki/Circle_of_fifths
print('ding!')