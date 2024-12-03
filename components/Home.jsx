"use client"

import React, { useState, useEffect, useRef } from 'react'
import LoadingBar from 'react-top-loading-bar'
import SearchBar from './Headers/SearchBar'
import MusicSection from './MusicSection'
import axios from 'axios'


export default function Home() {

    const ref = useRef(null);
    const [songs, setSongs] = useState([])
    const [labelText, setLabelText] = useState("")
    useEffect(() => {
        ref.current.continuousStart();
        axios('/api/search').then(res => {
            setSongs(res.data)
            ref.current.complete()
        })
    }, [])

    return (
        <section className="flex flex-col justify-center items-center mx-auto relative place-items-center min-h-screen bg-black/60 overflow-hidden pb-10">
            <LoadingBar color='#cbcbcb' ref={ref} />
            <div className='max-w-5xl mb-5 my-8'>
                <div className='my-6 mx-auto w-fit text-center select-none'>
                    <p className="font-fancy text-4xl text-center sm:text-5xl md:text-3xl font-bold text-gray-200 -mb-5">Welcome to</p>
                    <h1 className="font-fancy text-4xl sm:text-5xl md:text-6xl font-bold text-gray-200">Harmonika</h1>
                </div>
                <div className='mt-6 mb-6'>
                    <SearchBar setLabelText= {setLabelText} setSongs={setSongs}/>
                </div>
            {labelText && <p className='text-gray-100 tracking-wide text-left text-md my-4 left-2 relative'>{labelText}</p>}
                <MusicSection setLabelText = {setLabelText} songs={songs} setSongs= {setSongs}/>
            </div>
        </section>


    )
}
