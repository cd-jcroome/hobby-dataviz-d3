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
    'note_value':[0,7,2,9,4,11,6,1,8,3,10,5],
    'note_name':['C','G','D','A','E','B','F#','C#','G#','D#','A#','F'],
    'angle':[0,30,60,90,120,150,180,210,240,270,300,330,]}
nmd = pd.DataFrame(data=d)
nmd['note_value'] = pd.to_numeric(nmd['note_value'],errors='ignore').astype(int)

## convert midifile to pandas df
for f in files:
    mid = MidiFile(join('./songs/',f))
    
    mc = []
    mjr = {}
    for i, track in enumerate(mid.tracks):
        for msg in track:
            mc.append(msg.dict())

    mcdf_raw = pd.DataFrame(mc)
    mcdf_raw['note_midi_value'] = mcdf_raw['note']
    mcdf_raw['note_velocity'] = mcdf_raw['velocity']
# filter to just note_on events
    note_on_only_vel = mcdf_raw['note_velocity']>0
    note_on_only = mcdf_raw['type'] == 'note_on'
    mcdf_1 = mcdf_raw[note_on_only_vel]
    mcdf = mcdf_1[note_on_only]
# convert tick to time_delta
    mcdf['note_time'] = mcdf['time'].cumsum()
    mspq = 500000
    tpq = mid.ticks_per_beat
    spt = (mspq/tpq)/1000000
    mcdf['note_seconds'] = mcdf['note_time'].map(lambda x: x*spt)

# octave will be radius - floor of (number divided by 12), note will be angle - (remainder of (number divided by 12)) multiplied by the variable
    mcdf['octave'],mcdf['note_value'] = mcdf['note_midi_value']//12,mcdf['note_midi_value']%12
    
    mcdfx = mcdf.join(nmd,on='note_value',rsuffix='_nmd'
    ).drop(['note','velocity','time','note_value_nmd','type','clocks_per_click','control','denominator','notated_32nd_notes_per_beat','numerator','program','value'],axis=1
    )
    mcdf_h = mcdfx
    mcdf_h['prior_midi_note'] = mcdf_h['note_midi_value'].shift(+1)
    mcdf_h['prior_note_name'] = mcdf_h['note_name'].shift(+1)
    mcdf_h['prior_octave'] = mcdf_h['octave'].shift(+1)
    mcdf_h = mcdf_h.groupby(['channel','note_midi_value','prior_midi_note','octave','note_name','prior_octave','prior_note_name']).size().reset_index(name='edge_count')

# convert to JSON
    mcdf_j = mcdfx.groupby('channel')
    print('...converting {} to JSON...'.format(f))
    for key, gb in mcdf_j:
        gb1 = gb.apply(lambda x: pd.Series(x.dropna()),axis=1).sort_values('note_seconds').to_dict('records')
        mjr[str(key)] = gb1
    m_json = join('./output/',splitext(f)[0],'.json').replace("/.json",".json")
    with open(m_json,'w') as m_json:
        json.dump(mjr,m_json,indent=2)
# convert to csv
    print('...converting {} to CSV...'.format(f))
    m_csv = join('./output/',splitext(f)[0],'.csv').replace("/.csv",".csv")
    mh_csv = join('./output/',splitext(f)[0],'_group.csv').replace("/_group.csv","_group.csv")
    mcdfx.to_csv(m_csv)
    mcdf_h.to_csv(mh_csv)

# https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
# https://www.midimountain.com/midi/midi_note_numbers.html
# https://en.wikipedia.org/wiki/Circle_of_fifths
print('ding!')