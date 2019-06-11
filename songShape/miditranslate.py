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

## convert midifile to pandas df
for f in files:
    mc = py_midicsv.midi_to_csv(join('./songs/',f))
    mcdf = pd.DataFrame(mc)
    mcdf = mcdf[0].str.replace(
        ' ',''
        ).str.split(',',expand=True
            ).replace(
                '\n','',regex=True
                    ).rename(
                        columns={
                            0:'section',
                            1:'tick',
                            2:'event_desc',
                            3:'event_details',
                            4:'note_number',
                            5:'note_velocity'
                        })

    mcdf['note_value'] = pd.to_numeric(mcdf['note_number'],errors='coerce').fillna(0).astype(int)
    mcdf['note_velocity'] = pd.to_numeric(mcdf['note_velocity'],errors='coerce').fillna(0).astype(int)
    mcdf['tick'] = pd.to_numeric(mcdf['tick'],errors='coerce').fillna(0).astype(int)
# convert tick to time_delta
    spqn = .5
    tpqn = 480
    spt = spqn/tpqn
    mcdf['second'] = mcdf['tick'].map(lambda x: x*spt)
    
# octave will be radius - floor of (number divided by 12), note will be angle - (remainder of (number divided by 12)) multiplied by the variable
    mcdf['octave'],mcdf['note'] = mcdf['note_value']//12,mcdf['note_value']%12
## append note and octave data to the df
    mcdfx = mcdf.join(nmd,on='note',rsuffix='_nmd')

    m_csv = join('./output/',splitext(f)[0],'.csv').replace("/.csv",".csv")
    mcdfx.to_csv(m_csv, encoding='utf-8')

    m_json = join('./output/',splitext(f)[0],'.json').replace("/.json",".json")
    mjr = {}
    for key, mcdfgb in mcdfx.groupby('section'):
        mjr[str(key)] = mcdfgb.to_dict('records')
    with open(m_json,'w') as m_json:
        mjrf = json.dumps(mjr,indent=4)
        json.dump(mjr,m_json,indent=4)

# https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
# https://www.midimountain.com/midi/midi_note_numbers.html
# https://en.wikipedia.org/wiki/Circle_of_fifths
print('ding!')