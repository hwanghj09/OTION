"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Camera,
  Flame,
  ListFilter,
  Loader2,
  Plus,
  Search,
  Thermometer,
  ThumbsDown,
  ThumbsUp,
  UserCircle2,
  X,
} from "lucide-react";
import { createPost, getPosts, updateReaction } from "../actions";

type Post = {
  id: number;
  image: string;
  description: string;
  temp: number;
  status: string;
  likes: number;
  dislikes: number;
};

type WeatherPreview = {
  temp: number;
  status: string;
};

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({ image: "", description: "" });
  const [currentWeather, setCurrentWeather] = useState<WeatherPreview | null>(null);
  const [filters, setFilters] = useState({
    query: "",
    tempBand: "all",
    sort: "latest" as "latest" | "likes",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric&lang=kr`
      );
      setCurrentWeather({ temp: Math.round(res.data.main.temp), status: res.data.weather[0].description });
    });
  }, []);

  const refreshPosts = useCallback(async () => {
    const tempRangeByBand: Record<string, { minTemp?: number; maxTemp?: number }> = {
      all: {},
      cold: { maxTemp: 9 },
      mild: { minTemp: 10, maxTemp: 19 },
      warm: { minTemp: 20, maxTemp: 27 },
      hot: { minTemp: 28 },
    };

    const range = tempRangeByBand[filters.tempBand] || {};
    const nextPosts = await getPosts({
      search: filters.query.trim() || undefined,
      minTemp: range.minTemp,
      maxTemp: range.maxTemp,
      sort: filters.sort,
    });

    setPosts(nextPosts as Post[]);
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshPosts();
    }, 200);
    return () => clearTimeout(timer);
  }, [refreshPosts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setUploadData((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const submitPost = async () => {
    if (!uploadData.image || !currentWeather) return;

    setUploading(true);
    await createPost({
      ...uploadData,
      temp: currentWeather.temp,
      status: currentWeather.status,
      age: 25,
      height: 175,
      weight: 70,
      gender: "남성",
    });
    setUploading(false);
    setIsModalOpen(false);
    setUploadData({ image: "", description: "" });
    refreshPosts();
  };

  const reactToPost = async (postId: number, type: "like" | "dislike") => {
    const result = await updateReaction(postId, type);
    if (!result.applied) {
      alert(result.message);
      return;
    }
    refreshPosts();
  };

  return (
    <main className="space-y-5 pb-16">
      <section className="panel reveal-up relative overflow-hidden p-5 sm:p-7">
        <span className="floating-dot right-4 top-2 h-16 w-16 bg-[#ffd19a]" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c96138]">Community Feed</p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#3f2415] sm:text-4xl">OOTD 아카이브</h1>
            <p className="mt-2 text-sm text-[#7a5a47]">온도별 코디를 보고 바로 참고할 수 있는 스타일 피드.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1f2a37] px-5 py-3 text-sm font-bold text-white"
          >
            <Plus size={16} /> 코디 올리기
          </button>
        </div>
      </section>

      <section className="panel reveal-up [animation-delay:100ms] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-[#785542]">
          <ListFilter size={16} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Filter</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="relative sm:col-span-2">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#ac846d]" />
            <input
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="설명/날씨 키워드 검색"
              className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] py-3 pl-9 pr-3 text-sm outline-none focus:border-[#ef8354]"
            />
          </label>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as "latest" | "likes" })}
            className="rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-3 py-3 text-sm outline-none focus:border-[#ef8354]"
          >
            <option value="latest">최신순</option>
            <option value="likes">좋아요순</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { value: "all", label: "전체" },
            { value: "cold", label: "9°C 이하" },
            { value: "mild", label: "10-19°C" },
            { value: "warm", label: "20-27°C" },
            { value: "hot", label: "28°C 이상" },
          ].map((band) => (
            <button
              key={band.value}
              onClick={() => setFilters({ ...filters, tempBand: band.value })}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                filters.tempBand === band.value ? "bg-[#1f2a37] text-white" : "bg-[#ffeede] text-[#764429]"
              }`}
            >
              {band.label}
            </button>
          ))}
        </div>
      </section>

      {posts.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="panel reveal-up overflow-hidden"
              style={{ animationDelay: `${120 + index * 50}ms` }}
            >
              <div className="relative aspect-[4/5] bg-[#f7ebdf]">
                <img src={post.image} alt="코디 이미지" className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 rounded-full bg-[#1f2a37]/85 px-3 py-1.5 text-xs font-semibold text-white">
                  <span className="inline-flex items-center gap-1.5">
                    <Thermometer size={13} /> {post.temp}°C · {post.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <p className="line-clamp-3 text-sm leading-relaxed text-[#634938]">
                  {post.description || "오늘 스타일 공유합니다."}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={async () => reactToPost(post.id, "like")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#ffe5d8] px-3 py-2 text-sm font-bold text-[#934727]"
                  >
                    <ThumbsUp size={14} /> {post.likes}
                  </button>
                  <button
                    onClick={async () => reactToPost(post.id, "dislike")}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#e8f7ef] px-3 py-2 text-sm font-bold text-[#1f6a52]"
                  >
                    <ThumbsDown size={14} /> {post.dislikes}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="panel reveal-up [animation-delay:150ms] px-6 py-16 text-center">
          <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#fff0e1] text-[#cd6639]">
            <Camera size={24} />
          </div>
          <h2 className="text-xl font-extrabold text-[#442618]">첫 스타일을 올려보세요</h2>
          <p className="mt-2 text-sm text-[#785543]">지금 올라온 게시물이 없어요. 첫 번째 코디를 남겨주세요.</p>
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center">
          <div className="w-full max-w-xl rounded-2xl border border-[#f1d8c3] bg-[#fffaf4] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c55d34]">New Post</p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#3e2416]">오늘 코디 공유</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffe9d6] text-[#7b452a]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#7a5846]">사진</span>
                <div className="relative overflow-hidden rounded-xl border border-dashed border-[#eebf9e] bg-[#fff4ea]">
                  {uploadData.image ? (
                    <img src={uploadData.image} alt="업로드 미리보기" className="aspect-square w-full object-cover" />
                  ) : (
                    <div className="aspect-square grid place-items-center text-center">
                      <div>
                        <div className="mx-auto mb-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe7d3] text-[#c45b31]">
                          <Camera size={18} />
                        </div>
                        <p className="text-sm font-semibold text-[#71422a]">이미지 선택</p>
                      </div>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 cursor-pointer opacity-0" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#7a5846]">설명</span>
                <textarea
                  rows={4}
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="w-full rounded-xl border border-[#f0d7c3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#ef8354]"
                  placeholder="오늘 코디 포인트를 적어주세요"
                />
              </label>

              <div className="panel-soft flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#654638]">
                <UserCircle2 size={16} />
                작성 정보는 현재 기본 프로필로 저장됩니다.
              </div>

              <button
                onClick={submitPost}
                disabled={uploading || !uploadData.image || !currentWeather}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f2a37] px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#a8b0ba]"
              >
                {uploading ? <Loader2 size={17} className="animate-spin" /> : <Flame size={17} />}
                업로드하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
