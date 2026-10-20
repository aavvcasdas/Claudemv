from faster_whisper import WhisperModel
import glob,json,soundfile as sf
m=WhisperModel(glob.glob('/tmp/whisper-app/models/models*/snapshots/*')[0],device='cpu',compute_type='int8')
y,sr=sf.read('projects/pengyou_de_jiu/analysis/audio.wav')
prompt='朋友的酒，昨日一去不复回，开心比什么都贵，覆水不能再收回，桃花谢了有玫瑰。人生几十年总会有风雨来陪，潇潇洒洒赴会今不醉不归，往事后不后悔慢慢去体会，此刻朋友这杯酒最珍贵。快把酒满上干了这杯大声歌唱，好朋友好朋友今宵多欢畅，理想改变了我们的模样，也让我懂得了要珍惜朋友的肩膀。阳光总会在风雨之后撒向苍茫，让我们抬起头学会了坚强。就像朋友的这杯烈酒烫我心上，温暖我凡事别再放心上。今天我们来相会，深情斟满了酒杯，岁月匆匆如流水，管他昨天谁是谁。人生的旅程有苦有甜也有泪，好汉不提当年酒再干一杯，往事决不后悔不必再理会。'
a=[]
for start in range(0,189,20):
 x=y[int(start*sr):int((start+20)*sr)];sf.write('/tmp/friends-chunk.wav',x,sr)
 segs,_=m.transcribe('/tmp/friends-chunk.wav',language='zh',initial_prompt=prompt,word_timestamps=True,beam_size=5,condition_on_previous_text=False,no_speech_threshold=None,log_prob_threshold=-2,compression_ratio_threshold=3)
 for s in segs:
  z=dict(t=round(start+s.start,3),end=round(start+s.end,3),text=s.text,words=[dict(w=w.word,s=round(start+w.start,3),e=round(start+w.end,3)) for w in s.words]);print(z['t'],z['end'],z['text'],flush=True);a.append(z)
json.dump(a,open('projects/pengyou_de_jiu/analysis/subtitles_guided.json','w'),ensure_ascii=False,indent=2)
