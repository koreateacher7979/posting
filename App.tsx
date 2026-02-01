
import React, { useState } from 'react';
import { generateLecturePosts } from './services/geminiService';
import { LectureInfo, GeneratedPosts } from './types';
import { 
  ClipboardCopy, 
  RotateCw, 
  Send, 
  Instagram, 
  Layout, 
  Sparkles, 
  User,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState<LectureInfo>({
    location: '',
    dateTime: '',
    target: '',
    topic: '',
    feedback: ''
  });
  const [results, setResults] = useState<GeneratedPosts | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const posts = await generateLecturePosts(formData);
      setResults(posts);
      // 결과 생성 후 결과 영역으로 부드럽게 스크롤
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("포스팅 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(type);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 브랜딩 헤더 */}
      <header className="bg-indigo-950 text-white py-8 px-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[100%] bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[100%] bg-purple-500 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-inner">
              <Sparkles className="text-yellow-400 w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">강의 포스팅 마스터</h1>
              <p className="text-indigo-300 font-medium mt-1">가치있는 미래교육 연구소 | AI 홍보 비서</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold">BK</div>
              <div>
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest leading-none">Representative</p>
                <p className="text-sm font-bold mt-1">김병찬 강사</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full mt-10 px-4 space-y-12 mb-20">
        {/* 입력 폼 섹션 */}
        <section className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-50 p-3 rounded-xl">
              <BookOpen className="text-indigo-600" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">강의 정보 입력</h2>
              <p className="text-slate-500 text-sm">강의의 핵심 내용을 입력하면 AI가 맞춤형 홍보글을 작성합니다.</p>
            </div>
          </div>
          
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <MapPin size={18} className="text-indigo-500" /> 출강 장소
              </label>
              <input
                required
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-300"
                placeholder="예: 경기도교육청 북부청사"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <Calendar size={18} className="text-indigo-500" /> 출강 일시
              </label>
              <input
                required
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-300"
                placeholder="예: 2024.05.22(수) 14:00~16:00"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <Users size={18} className="text-indigo-500" /> 강의 대상
              </label>
              <input
                required
                name="target"
                value={formData.target}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-300"
                placeholder="예: 중등 미술 교사 및 에듀테크 관심 교사 40명"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <Sparkles size={18} className="text-indigo-500" /> 강의 주제
              </label>
              <input
                required
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-300"
                placeholder="예: 생성형 AI와 캔바를 활용한 창의적 미술 수업"
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <MessageSquare size={18} className="text-indigo-500" /> 강의장 반응 및 특이사항
              </label>
              <textarea
                required
                name="feedback"
                rows={4}
                value={formData.feedback}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-300"
                placeholder="선생님들의 열정이 대단했고, 특히 AI 실습 시간에 만족도가 높았습니다. 실무 적용 가능성에 대한 질문이 많았습니다."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-200/50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? <RotateCw className="animate-spin" size={24} /> : <Send size={24} />}
              {loading ? '고품격 포스팅 생성 중...' : '홍보 문구 생성하기'}
            </button>
          </form>
        </section>

        {/* 결과 섹션 */}
        {results && (
          <div id="results-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-24">
            {/* 인스타그램 카드 */}
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col group">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3 text-white font-bold text-lg">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Instagram size={24} />
                  </div>
                  <span>인스타그램 감성 피드</span>
                </div>
                <button 
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-all hover:rotate-180 duration-500"
                >
                  <RotateCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="bg-slate-50 rounded-2xl p-6 mb-6 text-slate-700 leading-relaxed whitespace-pre-wrap flex-1 border border-slate-100 italic">
                  {results.instagram.content}
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {results.instagram.hashtags.map((tag, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-100/50">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(`${results.instagram.content}\n\n${results.instagram.hashtags.join(' ')}`, 'insta')}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                    copyStatus === 'insta' ? 'bg-green-500 text-white' : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  {copyStatus === 'insta' ? <CheckCircle2 size={20} /> : <ClipboardCopy size={20} />}
                  {copyStatus === 'insta' ? '복사 완료!' : '인스타 문구 복사'}
                </button>
              </div>
            </div>

            {/* 네이버 블로그 카드 */}
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col group">
              <div className="bg-emerald-500 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3 font-bold text-lg">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <Layout size={24} />
                  </div>
                  <span>네이버 블로그 리포트</span>
                </div>
                <button 
                   onClick={() => handleGenerate()}
                   disabled={loading}
                   className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all hover:rotate-180 duration-500"
                >
                  <RotateCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-2 block ml-1">Suggested Title</span>
                  <div className="bg-emerald-50 text-emerald-900 p-4 rounded-xl font-bold border border-emerald-100/50 text-lg leading-snug">
                    {results.naverBlog.title}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-slate-700 leading-relaxed whitespace-pre-wrap flex-1 text-sm md:text-base border border-slate-100">
                  {results.naverBlog.content}
                </div>
                <button
                  onClick={() => copyToClipboard(`${results.naverBlog.title}\n\n${results.naverBlog.content}`, 'blog')}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
                    copyStatus === 'blog' ? 'bg-green-500 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {copyStatus === 'blog' ? <CheckCircle2 size={20} /> : <ClipboardCopy size={20} />}
                  {copyStatus === 'blog' ? '복사 완료!' : '블로그 전체 복사'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-slate-500 text-sm font-medium">© 2024 가치있는 미래교육 연구소. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <span className="text-slate-400 text-xs flex items-center gap-1"><CheckCircle2 size={12} /> 에듀테크 특화 AI</span>
            <span className="text-slate-400 text-xs flex items-center gap-1"><CheckCircle2 size={12} /> SNS 마케팅 최적화</span>
            <span className="text-slate-400 text-xs flex items-center gap-1"><CheckCircle2 size={12} /> 가독성 중심 설계</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
