"use client"
import { useState } from "react";
import Main from '@/components/Home'
// import Label from "@/components/Footers/Label";
var backgrounds = [
  "https://w0.peakpx.com/wallpaper/476/955/HD-wallpaper-colorful-lines-abstract-art-dark-backgrounds-creative-lines-background-with-lines.jpg"
]

export default function Home() {
  const [curr, setCurr] = useState('')
  return (
    <main className='relative'>
      <div className='filter blur-[10px] absolute inset-0 w-full -z-10'
        style={{ backgroundImage: `url('${backgrounds[0]}')` }}
      ></div>
      <Main />
      <Label />
    </main>
  );
}
