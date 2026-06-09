export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-950 text-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
          <img src="/next.svg" alt="Universe" className="h-20 w-20 object-contain" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Universe</h1>
          <p className="mt-1 text-sm text-slate-300/75">سامانه یکپارچه مدیریت دانشگاه</p>
        </div>

        <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-400" />
        </div>
      </div>
    </div>
  );
}
