import importlib.util,threading,unittest
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.error import HTTPError
from http.server import ThreadingHTTPServer
spec=importlib.util.spec_from_file_location('preview',Path(__file__).with_name('preview.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class PreviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server=ThreadingHTTPServer(('127.0.0.1',0),m.Preview);cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start();cls.url='http://127.0.0.1:'+str(cls.server.server_port)
    @classmethod
    def tearDownClass(cls):cls.server.shutdown();cls.server.server_close();cls.thread.join()
    def request(self,path,**headers):return urlopen(Request(self.url+path,headers={'Host':'37189-test.e2b.app',**headers}))
    def test_home_and_relative_dependencies(self):
        with self.request('/') as r:self.assertIn('/projects/chaoxi-v2/studio.html',r.url);self.assertIn('一颗心的潮汐',r.read().decode())
        with self.request('/node_modules/p5/lib/p5.min.js') as r:self.assertEqual(r.status,200)
    def test_audio_byte_range(self):
        data=(m.REPO/'projects/chaoxi-v2/assets/song.m4a').read_bytes()
        with self.request('/projects/chaoxi-v2/assets/song.m4a',Range='bytes=0-15') as r:self.assertEqual(r.status,206);self.assertEqual(r.read(),data[:16])
        with self.request('/projects/chaoxi-v2/assets/song.m4a',Range='bytes=-16') as r:self.assertEqual(r.read(),data[-16:])
    def test_block_git(self):
        with self.assertRaises(HTTPError) as e:self.request('/.git/HEAD')
        self.assertEqual(e.exception.code,403)
if __name__=='__main__':unittest.main()
