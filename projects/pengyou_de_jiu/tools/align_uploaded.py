import json,glob,numpy as np,soundfile as sf
from faster_whisper import WhisperModel
from faster_whisper.tokenizer import Tokenizer
m=WhisperModel(glob.glob('/tmp/whisper-app/models/models*/snapshots/*')[0],device='cpu',compute_type='int8')
y,sr=sf.read('projects/pengyou_de_jiu/analysis/audio.wav');import librosa
y=librosa.resample(y,orig_sr=sr,target_sr=16000)
tok=Tokenizer(m.hf_tokenizer,m.model.is_multilingual,task='transcribe',language='zh')
verse1=['昨日一去不复回 哦耶','开心比什么都贵','覆水不能再收回 哦耶','桃花谢了有玫瑰','人生几十年总会有风雨来陪','潇潇洒洒赴会今不醉不归','往事后不后悔慢慢去体会','此刻朋友这杯酒最珍贵']
verse2=['今天我们来相会 哦耶','深情斟满了酒杯','岁月匆匆如流水 哦耶','管他昨天谁是谁','人生的旅程有苦有甜也有泪','好汉不提当年酒再干一杯','往事决不后悔不必再理会','此刻朋友这杯酒最珍贵']
chorus=['快把酒满上干了这杯大声歌唱','好朋友好朋友今宵多欢畅','理想改变了我们的模样','也让我懂得了要珍惜朋友的肩膀','阳光总会在风雨之后撒向苍茫','让我们抬起头学会了坚强','就像朋友的这杯烈酒烫我心上','温暖我凡事别再放心上']
# Anchors estimated from the upload's chunk transcription, not a different recording's LRC.
groups=[(0,16,verse1[:2]),(16,32,verse1[2:4]),(32,47.5,verse1[4:]),(47.5,63,chorus[:4]),(63,79.5,chorus[4:]),(82,98,verse2[:2]),(98,112,verse2[2:4]),(112,126.7,verse2[4:]),(126.7,142,chorus[:4]),(142,157,chorus[4:]),(157,171.5,chorus[:4]),(171.5,188.25,chorus[4:])]
lines=[]
for start,end,texts in groups:
 x=y[round(start*16000):round(end*16000)].astype(np.float32);features=m.feature_extractor(x);enc=m.encode(features)
 text=' '.join(texts);tokens=tok.encode(text);res=m.find_alignment(tok,[tokens],enc,num_frames=round(len(x)/160))
 words=res[0];idx=0
 for text in texts:
  n=len(''.join(text.split()));chosen=[];count=0
  while idx<len(words) and count<n:
   w=words[idx];s=w['word'].strip();idx+=1
   if not s:continue
   count+=len(s)
   for j,c in enumerate(s):chosen.append(dict(w=c,s=round(start+float(w['start'])+(float(w['end'])-float(w['start']))*j/len(s),3),e=round(start+float(w['start'])+(float(w['end'])-float(w['start']))*(j+1)/len(s),3)))
  if chosen:
   z=dict(t=chosen[0]['s'],end=chosen[-1]['e'],text=''.join(text.split()),words=chosen,alignment='forced-attention-estimate');lines.append(z);print(z['t'],z['end'],z['text'],flush=True)
json.dump(lines,open('projects/pengyou_de_jiu/analysis/lyrics_forced.json','w'),ensure_ascii=False,indent=2)
