"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CloudSun, Loader2, MapPin, Sparkles, Wind } from "lucide-react";
import { getAIAdvice } from "./actions";

type FormState = {
  gender: string;
  age: string;
  height: string;
  weight: string;
  style: string;
  purpose: string;
};

type WeatherInfo = {
  temp: number;
  status: string;
  dust: number;
  city: string;
  icon: string;
};

type AIResult = {
  clothes: string;
  style: string;
  colors: string;
  dustAdvice: string;
};

const initialForm: FormState = {
  gender: "남성",
  age: "25",
  height: "175",
  weight: "70",
  style: "캐주얼",
  purpose: "일상",
};

export default function AIRecommendationPage() {
  const [info, setInfo] = useState<FormState>(initialForm);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

        try {
          const weatherRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric&lang=kr`
          );
          const airRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${key}`
          );

          setWeather({
            temp: Math.round(weatherRes.data.main.temp),
            status: weatherRes.data.weather[0].description,
            dust: airRes.data.list[0].components.pm10,
            city: weatherRes.data.name,
            icon: weatherRes.data.weather[0].icon,
          });
          setGeoError("");
        } catch {
          setGeoError("날씨 정보를 불러오지 못했습니다.");
        }
      },
      () => setGeoError("위치 권한이 필요합니다. 권한 허용 후 다시 시도해주세요.")
    );
  }, []);

  const requestAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weather) return;

    setLoading(true);
    const result = await getAIAdvice({ ...info, ...weather });
    setAiResult(result);
    setLoading(false);
  };

  return (
    <main className="space-y-5 pb-14">
      <section className="panel reveal-up relative overflow-hidden p-5 sm:p-7">
        <span className="floating-dot right-3 top-2 h-20 w-20 bg-[#ffd3a6]" />
        <span className="floating-dot bottom-0 left-10 h-14 w-14 bg-[#bfe8d8]" />
        <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ce6237]">Daily Outfit Engine</p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#402312] sm:text-4xl">오늘 뭐 입지? 바로 끝내기</h1>
            <p className="mt-2 text-sm text-[#7a5a47]">날씨와 체형, 목적까지 합쳐서 현실적인 코디를 추천합니다.</p>
          </div>
          <div className="panel-soft flex items-center gap-3 px-4 py-2">
            <Sparkles size={16} className="text-[#d86131]" />
            <span className="text-xs font-semibold text-[#7a4022]">AI 기반 맞춤 추천</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1.5fr]">
        <aside className="space-y-5 reveal-up [animation-delay:120ms]">
          <section className="panel brand-gradient overflow-hidden p-5 text-[#3b2214] sm:p-6">
            {weather ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em]">
                    <MapPin size={14} />
                    {weather.city}
                  </div>
                  <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} className="h-14 w-14" alt="weather" />
                </div>
                <div className="flex items-end gap-2">
                  <strong className="font-display text-6xl leading-none">{weather.temp}</strong>
                  <span className="mb-1 text-2xl font-semibold">°C</span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <CloudSun size={16} />
                  {weather.status}
                </p>
                <div className="mt-5 border-t border-[#cc845f] pt-4 text-sm font-semibold">
                  미세먼지 {weather.dust} μg/m³
                </div>
              </>
            ) : (
              <div className="space-y-2 py-8 text-sm font-semibold">
                <p>위치 기반 날씨를 가져오는 중입니다.</p>
                {geoError && <p className="rounded-lg bg-white/45 px-3 py-2 text-[#71391e]">{geoError}</p>}
              </div>
            )}
          </section>

          {aiResult && weather && (
            <section className="panel bg-[#fffdf9] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ca6136]">Result</p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#3d2417]">{aiResult.clothes}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#5f4333]">{aiResult.style}</p>
              <div className="mt-4 rounded-xl bg-[#fff3e9] px-3 py-2 text-sm font-semibold text-[#75432b]">
                추천 컬러: {aiResult.colors}
              </div>
              <div
                className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-3 text-sm ${
                  weather.dust > 80 ? "bg-[#ffe9e5] text-[#8f3020]" : "bg-[#e8f7ef] text-[#1f6a52]"
                }`}
              >
                <Wind size={16} className="mt-0.5" />
                <span>{aiResult.dustAdvice}</span>
              </div>
            </section>
          )}
        </aside>

        <section className="panel reveal-up [animation-delay:180ms] p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ce6237]">Profile Setup</p>
            <h3 className="mt-2 text-2xl font-extrabold text-[#3f2516]">내 정보로 코디 생성</h3>
          </div>

          <form onSubmit={requestAdvice} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d5a45]">나이</span>
              <input
                type="number"
                value={info.age}
                onChange={(e) => setInfo({ ...info, age: e.target.value })}
                className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d5a45]">성별</span>
              <select
                value={info.gender}
                onChange={(e) => setInfo({ ...info, gender: e.target.value })}
                className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
              >
                <option>남성</option>
                <option>여성</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d5a45]">키 (cm)</span>
              <input
                type="number"
                value={info.height}
                onChange={(e) => setInfo({ ...info, height: e.target.value })}
                className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d5a45]">몸무게 (kg)</span>
              <input
                type="number"
                value={info.weight}
                onChange={(e) => setInfo({ ...info, weight: e.target.value })}
                className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d5a45]">스타일</span>
              <select
                value={info.style}
                onChange={(e) => setInfo({ ...info, style: e.target.value })}
                className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
              >
                <option>캐주얼</option>
                <option>미니멀</option>
                <option>스트릿</option>
                <option>비즈니스</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d5a45]">외출 목적</span>
              <select
                value={info.purpose}
                onChange={(e) => setInfo({ ...info, purpose: e.target.value })}
                className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
              >
                <option>일상</option>
                <option>데이트</option>
                <option>출근</option>
                <option>여행</option>
              </select>
            </label>

            <button
              disabled={loading || !weather}
              className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f2a37] px-5 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#a8b0ba]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              스타일 분석 시작
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
