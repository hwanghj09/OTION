"use client";

import { useState, useEffect } from 'react';
import { Sun, Wind, Loader2, MapPin, Sparkles, Shirt, Star, Ruler, CloudRain } from 'lucide-react';
import { getAIAdvice } from './actions';
import axios from 'axios';

export default function AIRecommendationPage() {
  const [info, setInfo] = useState({ gender: '남성', age: '25', height: '175', weight: '70', style: '캐주얼', purpose: '일상' });
  const [weather, setWeather] = useState<any>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      try {
        const wRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`);
        const aRes = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        setWeather({ temp: Math.round(wRes.data.main.temp), status: wRes.data.weather[0].description, dust: aRes.data.list[0].components.pm10, city: wRes.data.name, icon: wRes.data.weather[0].icon });
      } catch (e) { console.error("날씨 정보 호출 실패"); }
    });
  }, []);

  const handleAIRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await getAIAdvice({ ...info, ...weather });
    setAiResult(result);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-lg mx-auto px-6 py-12 space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
            <Sparkles className="text-indigo-600" size={16}/>
            <span className="text-xs font-semibold text-indigo-700 tracking-wide">AI STYLE ADVISOR</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight" style={{fontFamily: 'Pretendard, sans-serif'}}>
            오늘의 스타일 추천
          </h1>
          <p className="text-slate-500 text-sm">날씨와 당신의 취향을 분석해드립니다</p>
        </header>

        {/* Weather Card */}
        {weather && (
          <section className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200/50 overflow-hidden animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 text-indigo-200">
                <MapPin size={14} strokeWidth={2.5}/>
                <span className="text-xs font-medium tracking-wide">{weather.city}</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-bold tracking-tighter" style={{fontFamily: 'Outfit, sans-serif'}}>{weather.temp}</span>
                    <span className="text-3xl font-light text-indigo-200">°C</span>
                  </div>
                  <p className="text-base font-medium text-indigo-100 flex items-center gap-2">
                    <CloudRain size={18} strokeWidth={2}/>
                    {weather.status}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`} 
                    className="w-28 h-28 drop-shadow-lg" 
                    alt="weather icon" 
                  />
                </div>
              </div>

              {/* Air Quality Indicator */}
              <div className="mt-6 pt-6 border-t border-indigo-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-200">미세먼지</span>
                  <span className="text-sm font-semibold">{weather.dust} μg/m³</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Input Form */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Shirt className="text-indigo-600" size={20}/>
            </div>
            <h3 className="text-lg font-bold text-slate-900" style={{fontFamily: 'Pretendard, sans-serif'}}>
              맞춤 설정
            </h3>
          </div>
          
          <form onSubmit={handleAIRequest} className="space-y-5">
            {/* Personal Info */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">기본 정보</label>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="나이" 
                  className="px-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium text-slate-900 border border-transparent focus:border-indigo-200 focus:bg-white transition-all placeholder:text-slate-400" 
                  value={info.age} 
                  onChange={e=>setInfo({...info, age: e.target.value})} 
                />
                <select 
                  className="px-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium text-slate-900 border border-transparent focus:border-indigo-200 focus:bg-white transition-all" 
                  value={info.gender} 
                  onChange={e=>setInfo({...info, gender: e.target.value})}
                >
                  <option>남성</option>
                  <option>여성</option>
                </select>
              </div>
            </div>

            {/* Physical Info */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">체형 정보</label>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="키 (cm)" 
                  className="px-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium text-slate-900 border border-transparent focus:border-indigo-200 focus:bg-white transition-all placeholder:text-slate-400" 
                  value={info.height} 
                  onChange={e=>setInfo({...info, height: e.target.value})} 
                />
                <input 
                  type="number" 
                  placeholder="몸무게 (kg)" 
                  className="px-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium text-slate-900 border border-transparent focus:border-indigo-200 focus:bg-white transition-all placeholder:text-slate-400" 
                  value={info.weight} 
                  onChange={e=>setInfo({...info, weight: e.target.value})} 
                />
              </div>
            </div>

            {/* Style Preferences */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">스타일 선호도</label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="px-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium text-slate-900 border border-transparent focus:border-indigo-200 focus:bg-white transition-all" 
                  value={info.style} 
                  onChange={e=>setInfo({...info, style: e.target.value})}
                >
                  <option>캐주얼</option>
                  <option>미니멀</option>
                  <option>스트릿</option>
                  <option>비즈니스</option>
                </select>
                <select 
                  className="px-5 py-4 bg-slate-50 rounded-2xl outline-none text-sm font-medium text-slate-900 border border-transparent focus:border-indigo-200 focus:bg-white transition-all" 
                  value={info.purpose} 
                  onChange={e=>setInfo({...info, purpose: e.target.value})}
                >
                  <option>일상</option>
                  <option>데이트</option>
                  <option>출근</option>
                  <option>여행</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading || !weather} 
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-5 rounded-2xl font-semibold text-base shadow-lg shadow-slate-900/10 flex justify-center items-center gap-3 active:scale-[0.98] transition-all duration-200 mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  <Sparkles size={20} />
                  AI 스타일 분석 시작
                </>
              )}
            </button>
          </form>
        </section>

        {/* AI Result */}
        {aiResult && (
          <section className="bg-white rounded-3xl p-8 shadow-md border-t-4 border-amber-400 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Star size={16} fill="#F59E0B" className="text-amber-500"/>
              </div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">AI RECOMMENDATION</span>
            </div>
            
            <div className="space-y-6">
              {/* Main Recommendation */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
                <h4 className="text-2xl font-bold text-slate-900 leading-tight mb-2" style={{fontFamily: 'Pretendard, sans-serif'}}>
                  {aiResult.clothes}
                </h4>
              </div>

              {/* Styling Guide */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Ruler size={14} className="text-indigo-500"/>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Styling Guide</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pl-6 border-l-2 border-slate-100">
                  {aiResult.style}
                </p>
              </div>

              {/* Dust Advice */}
              <div className={`flex items-start gap-4 p-5 rounded-2xl ${weather.dust > 80 ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${weather.dust > 80 ? 'bg-red-100' : 'bg-emerald-100'}`}>
                  <Wind size={18} className={weather.dust > 80 ? 'text-red-600' : 'text-emerald-600'} strokeWidth={2.5}/>
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-semibold mb-1 ${weather.dust > 80 ? 'text-red-700' : 'text-emerald-700'}`}>
                    오늘의 미세먼지 TIP
                  </p>
                  <p className={`text-sm font-medium leading-relaxed ${weather.dust > 80 ? 'text-red-900' : 'text-emerald-900'}`}>
                    {aiResult.dustAdvice}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}