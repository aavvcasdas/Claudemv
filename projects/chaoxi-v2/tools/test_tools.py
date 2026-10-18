import importlib.util,json,tempfile,unittest
from pathlib import Path
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('validator',HERE/'validate.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
spec=importlib.util.spec_from_file_location('builder',HERE/'build_data.py');b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
class ProjectTests(unittest.TestCase):
    def test_source_and_timeline(self):self.assertEqual(len(v.check_plan()['shots']),19)
    def test_generated_data_reproducible(self):
        p=HERE.parent/'src/project-data.js';before=p.read_text();b.build();self.assertEqual(p.read_text(),before)
    def test_source_not_32_seconds(self):
        p=json.loads((HERE.parent/'plan.json').read_text());self.assertEqual(p['format']['duration_s'],56);self.assertNotEqual(p['music']['bpm'],118)
    def test_no_old_song_or_lyrics(self):
        self.assertFalse((HERE.parent/'assets/song.mp3').exists());self.assertFalse((HERE.parent/'assets/song.lrc').exists())
    def test_original_source_caption(self):
        r=json.loads((HERE.parent/'assets/captions.json').read_text());self.assertIn('NOT audio',r['scope']);self.assertEqual(r['rows'][7]['text'],'将快乐全部收集')
if __name__=='__main__':unittest.main()
