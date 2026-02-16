"use client";

import { useState, useEffect } from 'react';
import { Camera, ThumbsUp, ThumbsDown, Loader2, PlusCircle, X, Sun, Thermometer, User } from 'lucide-react';
import { getPosts, createPost, updateReaction } from '../actions';
import axios from 'axios';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ image: '', description: '' });
  const [currentWeather, setCurrentWeather] = useState<any>(null);

  useEffect(() => {
    refreshPosts();
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric&lang=kr`);
      setCurrentWeather({ temp: Math.round(res.data.main.temp), status: res.data.weather[0].description });
    });
  }, []);

  const refreshPosts = async () => setPosts(await getPosts());

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadData({ ...uploadData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const submitPost = async () => {
    if (!uploadData.image) return alert("사진을 선택해주세요!");
    setUploading(true);
    await createPost({ ...uploadData, temp: currentWeather.temp, status: currentWeather.status, age: 25, height: 175, weight: 70, gender: '남성' });
    setUploadData({ image: '', description: '' });
    setIsModalOpen(false);
    refreshPosts();
    setUploading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 pb-32">
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full">
              <User size={12} className="text-indigo-600"/>
              <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider">Community</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight" style={{fontFamily: 'Pretendard, sans-serif'}}>
              OOTD 피드
            </h1>
            <p className="text-slate-500 text-sm">오늘의 스타일을 공유하세요</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 transition-all active:scale-[0.98] self-start sm:self-auto"
          >
            <PlusCircle size={18} strokeWidth={2.5}/>
            코디 올리기
          </button>
        </header>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, idx) => (
            <article 
              key={post.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-slate-300/60 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-6" 
              style={{animationDelay: `${idx * 100}ms`, animationDuration: '700ms'}}
            >
              {/* Image */}
              <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  alt="OOTD"
                />
                
                {/* Weather Badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-slate-900/70 backdrop-blur-md text-white px-4 py-2.5 rounded-full">
                  <Thermometer size={14} strokeWidth={2.5}/>
                  <span className="text-xs font-semibold tracking-wide">
                    {post.temp}°C
                  </span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs font-medium">
                    {post.status}
                  </span>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {/* Description */}
                <p className="text-slate-700 text-sm font-medium leading-relaxed line-clamp-3">
                  {post.description || "오늘의 코디를 공유합니다 ✨"}
                </p>

                {/* Reactions */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={async () => { await updateReaction(post.id, 'like'); refreshPosts(); }} 
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-semibold text-sm transition-all active:scale-95 group/btn"
                  >
                    <ThumbsUp size={16} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform"/>
                    <span>{post.likes}</span>
                  </button>
                  <button 
                    onClick={async () => { await updateReaction(post.id, 'dislike'); refreshPosts(); }} 
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl font-semibold text-sm transition-all active:scale-95 group/btn"
                  >
                    <ThumbsDown size={16} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform"/>
                    <span>{post.dislikes}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="text-slate-400" size={32}/>
            </div>
            <h3 className="text-xl font-bold text-slate-700">아직 게시물이 없습니다</h3>
            <p className="text-slate-500 text-sm">첫 번째 코디를 공유해보세요!</p>
          </div>
        )}

      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-lg rounded-3xl p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900" style={{fontFamily: 'Pretendard, sans-serif'}}>
                  코디 공유하기
                </h3>
                <p className="text-xs text-slate-500">나만의 스타일을 공유해보세요</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-slate-600"/>
              </button>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">사진</label>
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors">
                {uploadData.image ? (
                  <div className="relative w-full h-full group">
                    <img src={uploadData.image} className="w-full h-full object-cover" alt="Upload preview"/>
                    <button 
                      onClick={() => setUploadData({...uploadData, image: ''})}
                      className="absolute top-4 right-4 w-10 h-10 bg-slate-900/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={18} className="text-white"/>
                    </button>
                  </div>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                      <Camera size={28} className="text-indigo-500"/>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 mb-1">사진 선택</span>
                    <span className="text-xs text-slate-400">클릭하여 갤러리 열기</span>
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">설명</label>
              <textarea 
                placeholder="오늘의 코디에 대해 간단히 소개해주세요..." 
                className="w-full p-5 bg-slate-50 rounded-2xl text-sm outline-none border border-transparent focus:border-indigo-200 focus:bg-white transition-all resize-none placeholder:text-slate-400" 
                rows={4}
                value={uploadData.description} 
                onChange={e=>setUploadData({...uploadData, description: e.target.value})}
              />
            </div>

            {/* Submit Button */}
            <button 
              onClick={submitPost} 
              disabled={uploading || !uploadData.image} 
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-5 rounded-2xl font-semibold shadow-lg shadow-slate-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" size={20}/>
                  업로드 중...
                </>
              ) : (
                <>
                  <PlusCircle size={20}/>
                  커뮤니티에 올리기
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}