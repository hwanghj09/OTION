"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CloudSun, Loader2, MapPin, Sparkles, Trash2, Wind } from "lucide-react";
import { addWardrobeItem, deleteWardrobeItem, getAIAdvice, getWardrobeItems } from "./actions";

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
  imageUrl?: string;
};

// ... (keep rest)

{
  aiResult && weather && (
    <section className="panel bg-[#fffdf9] p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ca6136]">Result</p>
      <h2 className="mt-2 text-2xl font-extrabold text-[#3d2417]">{aiResult.clothes}</h2>
      <p className="mt-4 text-sm leading-relaxed text-[#5f4333]">{aiResult.style}</p>

      {aiResult.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-[#f0d7c3]">
          <img
            src={aiResult.imageUrl}
            alt="AI 추천 코디 이미지"
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 rounded-xl bg-[#fff3e9] px-3 py-2 text-sm font-semibold text-[#75432b]">
        추천 컬러: {aiResult.colors}
      </div>
      <div
        className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-3 text-sm ${weather.dust > 80 ? "bg-[#ffe9e5] text-[#8f3020]" : "bg-[#e8f7ef] text-[#1f6a52]"
          }`}
      >
        <Wind size={16} className="mt-0.5" />
        <span>{aiResult.dustAdvice}</span>
      </div>
    </section>
  )
}
        </aside >

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
      </div >

  <section className="panel reveal-up [animation-delay:240ms] p-5 sm:p-7">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ce6237]">My Closet</p>
        <h3 className="mt-2 text-2xl font-extrabold text-[#3f2516]">내 옷장</h3>
      </div>
      <span className="rounded-full bg-[#fff0e2] px-3 py-1 text-xs font-bold text-[#8f4b29]">{wardrobe.length}개</span>
    </div>

    <form onSubmit={submitWardrobeItem} className="grid grid-cols-1 gap-3 sm:grid-cols-5">
      <select
        value={wardrobeForm.category}
        onChange={(e) => setWardrobeForm({ ...wardrobeForm, category: e.target.value })}
        className="rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-3 py-3 text-sm outline-none focus:border-[#ef8354]"
      >
        <option>상의</option>
        <option>하의</option>
        <option>아우터</option>
        <option>신발</option>
        <option>액세서리</option>
      </select>
      <input
        placeholder="아이템 이름"
        value={wardrobeForm.name}
        onChange={(e) => setWardrobeForm({ ...wardrobeForm, name: e.target.value })}
        className="rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-3 py-3 text-sm outline-none focus:border-[#ef8354]"
      />
      <input
        placeholder="색상"
        value={wardrobeForm.color}
        onChange={(e) => setWardrobeForm({ ...wardrobeForm, color: e.target.value })}
        className="rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-3 py-3 text-sm outline-none focus:border-[#ef8354]"
      />
      <label className="cursor-pointer rounded-xl border border-dashed border-[#efc8ac] bg-[#fff7f0] px-3 py-3 text-center text-xs font-semibold text-[#8f4b29]">
        {wardrobeForm.image ? "사진 변경" : "사진 추가"}
        <input type="file" accept="image/*" onChange={onWardrobeImageChange} className="hidden" />
      </label>
      <div className="flex gap-2">
        <select
          value={wardrobeForm.season}
          onChange={(e) => setWardrobeForm({ ...wardrobeForm, season: e.target.value })}
          className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-3 py-3 text-sm outline-none focus:border-[#ef8354]"
        >
          <option>사계절</option>
          <option>봄/가을</option>
          <option>여름</option>
          <option>겨울</option>
        </select>
        <button className="rounded-xl bg-[#1f2a37] px-4 py-3 text-sm font-bold text-white">추가</button>
      </div>
    </form>

    {wardrobeForm.image && (
      <div className="mt-3 overflow-hidden rounded-xl border border-[#f0d7c3] bg-[#fffaf6] p-2">
        <img src={wardrobeForm.image} alt="옷장 미리보기" className="h-28 w-full rounded-lg object-cover sm:h-36" />
      </div>
    )}

    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {wardrobe.map((item) => (
        <div key={item.id} className="rounded-xl border border-[#f0d7c3] bg-[#fffaf6] p-2">
          <img src={item.image} alt={item.name} className="h-36 w-full rounded-lg object-cover" />
          <div className="mt-2 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-[#8f4b29]">{item.category}</p>
              <p className="text-sm font-semibold text-[#3f2516]">{item.name}</p>
              <p className="text-xs text-[#7d5a45]">{item.color} · {item.season}</p>
            </div>
            <button
              type="button"
              onClick={() => removeWardrobeItem(item.id)}
              className="rounded-lg bg-[#ffe9df] p-2 text-[#a6452a]"
              aria-label="아이템 삭제"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      {wardrobe.length === 0 && (
        <p className="text-sm text-[#7d5a45]">아직 등록된 아이템이 없습니다. 옷을 추가해보세요.</p>
      )}
    </div>
  </section>
    </main >
  );
}
