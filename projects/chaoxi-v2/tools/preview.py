#!/usr/bin/env python3
"""Origin-independent preview, rooted at the repo so ../../node_modules resolves correctly.
Includes HTTP byte ranges for native video/audio seeking. Binds 0.0.0.0 for Arena preview.
"""
import argparse,re,shutil
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import unquote,urlsplit
REPO=Path(__file__).resolve().parents[3]
class Preview(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(REPO),**kwargs)
    def send_head(self):
        self.byte_range=None
        path=unquote(urlsplit(self.path).path)
        if any(p.startswith('.') for p in Path(path).parts if p not in ('/',)):
            self.send_error(403);return None
        if path=='/':
            self.send_response(302);self.send_header('Location','/projects/chaoxi-v2/studio.html');self.end_headers();return None
        file=Path(self.translate_path(self.path))
        range_header=self.headers.get('Range')
        if range_header and file.is_file() and file.suffix.lower() in ('.mp4','.m4a','.mp3'):
            size=file.stat().st_size;m=re.fullmatch(r'bytes=(\d*)-(\d*)',range_header.strip())
            if not m or not any(m.groups()):
                self.send_error(416);return None
            start=int(m[1]) if m[1] else max(0,size-int(m[2]));end=min(size-1,int(m[2])) if m[1] and m[2] else size-1
            if start>=size or end<start:
                self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.end_headers();return None
            f=file.open('rb');f.seek(start);self.byte_range=(start,end)
            self.send_response(206);self.send_header('Content-Type',self.guess_type(str(file)));self.send_header('Content-Length',str(end-start+1));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Accept-Ranges','bytes');self.end_headers();return f
        return super().send_head()
    def end_headers(self):
        self.send_header('Cache-Control','no-cache');super().end_headers()
    def copyfile(self,source,outputfile):
        try:self._copy_media(source,outputfile)
        except (BrokenPipeError,ConnectionResetError):pass  # normal when a browser cancels a seek
    def _copy_media(self,source,outputfile):
        if self.byte_range:
            left=self.byte_range[1]-self.byte_range[0]+1
            while left:
                chunk=source.read(min(left,65536))
                if not chunk:break
                outputfile.write(chunk);left-=len(chunk)
        else:shutil.copyfileobj(source,outputfile)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=37189);a=p.parse_args()
    print(f'MV preview: 0.0.0.0:{a.port} → /projects/chaoxi-v2/studio.html',flush=True)
    ThreadingHTTPServer(('0.0.0.0',a.port),Preview).serve_forever()
