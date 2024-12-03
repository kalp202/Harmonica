import React, { useRef, useState } from 'react'
import axios from 'axios';
import LoadingBar from 'react-top-loading-bar';

export default function SearchBar({ setSongs, setLabelText }) {

    const [search, setSearch] = useState("")
    const reloadSongs = (e) => {
        ref.current.continuousStart();
        e.preventDefault();
        axios(`/api/search/${search}`).then(res => {
            setSongs(res.data)
            setLabelText(`Search Results for : ${search}`)
            ref.current.complete()
        })
    }
    const ref = useRef(null)
    return (
        <form className="flex items-center max-w-lg mx-auto" onSubmit={reloadSongs}>
            <LoadingBar color='#cfcfcf' ref={ref} />
            <label htmlFor="voice-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#fff" version="1.1" id="Capa_1" width="800px" height="800px" viewBox="0 0 344.156 344.156" xmlSpace="preserve">
                        <g>
                            <path d="M343.766,28.723c0-5.525-4.483-10.006-10.006-10.006H106.574c-5.531,0-10.006,4.48-10.006,10.006v194.18   c-10.25-8.871-23.568-14.279-38.156-14.279C26.207,208.623,0,234.824,0,267.029c0,32.209,26.207,58.41,58.412,58.41   c32.215,0,58.412-26.201,58.412-58.41c0-2.854-0.246-175.924-0.246-175.924h207.176v131.666   c-10.229-8.795-23.487-14.148-38.008-14.148c-32.217,0-58.412,26.201-58.412,58.406c0,32.209,26.195,58.41,58.412,58.41   c32.205,0,58.41-26.201,58.41-58.41C344.156,264.068,343.766,28.723,343.766,28.723z M58.412,305.43   c-21.174,0-38.4-17.227-38.4-38.4c0-21.17,17.227-38.396,38.4-38.396s38.4,17.228,38.4,38.396   C96.812,288.203,79.586,305.43,58.412,305.43z M116.578,71.094V38.728h207.176v32.365L116.578,71.094L116.578,71.094z    M285.746,305.43c-21.174,0-38.4-17.227-38.4-38.4c0-21.17,17.228-38.396,38.4-38.396s38.4,17.228,38.4,38.396   C324.146,288.203,306.92,305.43,285.746,305.43z" />
                        </g>
                    </svg>
                </div>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} id="voice-search" className="outline-none border text-sm rounded-lg block w-full ps-10 p-2.5 focus:bg-gray-800/40 transition-colors bg-gray-800/70 border-gray-600 placeholder-gray-400 text-white" placeholder="Search Your Music..." required minLength={3} maxLength={20} />
                <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </button>
            </div>
        </form>

    )
}
