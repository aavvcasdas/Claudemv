import importlib.util
import unittest
from pathlib import Path
p=Path(__file__).parent/'upstream/align_lyrics.py'
spec=importlib.util.spec_from_file_location('lyrics',p)
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class LyricsTests(unittest.TestCase):
    def test_plain(self): self.assertEqual(m.lyric_lines('海浪\n\n月光'),['海浪','月光'])
    def test_lrc_repeats(self): self.assertEqual(m.lyric_lines('[00:20][00:40]潮汐\n[00:30]月光'),['潮汐','月光','潮汐'])
    def test_no_metadata(self): self.assertEqual(m.lyric_lines('[ti:潮汐]\n[00:01.00]你好'),['你好'])
    def test_normalisation(self): self.assertEqual(m.norm_chars('你好， A!'),list('你好a'))
    def test_fmt(self): self.assertEqual(m.fmt(61.25),'[01:01.25]')
if __name__=='__main__':unittest.main()
