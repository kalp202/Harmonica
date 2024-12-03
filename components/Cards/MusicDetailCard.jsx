"use client"
import { createYoutubePoster, shorten } from '@/helper/Transform'
import React, { useRef } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import CustomImage from '../Custom/CustomImage'
import LoadingBar from 'react-top-loading-bar'
export default function MusicDetailCard({ song, delay, setSongs , setLabelText}) {
    const reloadSongs = () => {
        window.scrollTo(0, 0)
        ref.current.continuousStart();
        axios(`/api/recommend/${song.index}`).then(res => {
            setSongs(res.data)
            setLabelText(`Similar to : ${song.title}`)
            ref.current.complete()
        })
    }
    const ref = useRef(null)
    return (
        <motion.div
            key={song.download_link}
            transition={{ duration: 0.4, delay: 0.1 * delay }}
            initial={{ opacity: 0, translateY: '12px' }}
            animate={{ opacity: 1, translateY: '0' }}
            className='shadow-lg relative hover:shadow-xl min-h-full'>

            <LoadingBar className='absolute' color='#cfcfcf' ref={ref} />
            <div className='absolute -z-10 inset-0 transform scale-[1.01] rounded-md bg-gradient-to-br from-zinc-500 via-zinc-900/80 to-zinc-500 transition-all'></div>
            <div className="flex flex-col p-2.5 h-full rounded-md overflow-hidden outline-none bg-zinc-900/80 hover:bg-zinc-900/95 transition-colors">
                <div className="group relative">
                    <CustomImage className="block rounded h-28 w-18"
                        src={createYoutubePoster(song.download_link)}
                        alt={song.title}
                        fallbackSrc="https://img.youtube.com/d.jpg"
                    />

                    <div className="absolute bg-black rounded bg-opacity-0 group-hover:bg-opacity-60 w-full h-full top-0 flex items-center group-hover:opacity-100 transition justify-evenly">
                        <a href={song.download_link} target='_blank' className="relative top-2 group-hover:top-0 hover:scale-110 text-white opacity-0 transform translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width={40} height={40} xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" viewBox="0 0 49 49" xmlSpace="preserve">
                                <g>
                                    <g>
                                        <path d="M39.256,6.5H9.744C4.371,6.5,0,10.885,0,16.274v16.451c0,5.39,4.371,9.774,9.744,9.774h29.512    c5.373,0,9.744-4.385,9.744-9.774V16.274C49,10.885,44.629,6.5,39.256,6.5z M47,32.726c0,4.287-3.474,7.774-7.744,7.774H9.744    C5.474,40.5,2,37.012,2,32.726V16.274C2,11.988,5.474,8.5,9.744,8.5h29.512c4.27,0,7.744,3.488,7.744,7.774V32.726z" />
                                        <path d="M33.36,24.138l-13.855-8.115c-0.308-0.18-0.691-0.183-1.002-0.005S18,16.527,18,16.886v16.229    c0,0.358,0.192,0.69,0.502,0.868c0.154,0.088,0.326,0.132,0.498,0.132c0.175,0,0.349-0.046,0.505-0.137l13.855-8.113    c0.306-0.179,0.495-0.508,0.495-0.863S33.667,24.317,33.36,24.138z M20,31.37V18.63l10.876,6.371L20,31.37z" />
                                    </g>
                                </g>
                            </svg>
                        </a>
                    </div>
                </div>

                <div className="flex items-center grow-[1] mb-0 justify-between my-2 text-sm relative">
                    <div className='text-xs flex flex-col gap-y-1'>
                        <h3 className="text-white leading-tight font-semibold" title={song.title}>
                            <span>{shorten(song.title, 16)}</span>
                        </h3>
                        <p className="text-gray-400">{song.year}</p>
                    </div>
                    <div>
                        <button onClick={reloadSongs} >

                            <svg className='w-6 cursor-pointer fill-zinc-300' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" viewBox="0 0 442.04 442.04" xmlSpace="preserve">
                                <g><g><path d="M221.02,341.304c-49.708,0-103.206-19.44-154.71-56.22C27.808,257.59,4.044,230.351,3.051,229.203    c-4.068-4.697-4.068-11.669,0-16.367c0.993-1.146,24.756-28.387,63.259-55.881c51.505-36.777,105.003-56.219,154.71-56.219    c49.708,0,103.207,19.441,154.71,56.219c38.502,27.494,62.266,54.734,63.259,55.881c4.068,4.697,4.068,11.669,0,16.367    c-0.993,1.146-24.756,28.387-63.259,55.881C324.227,321.863,270.729,341.304,221.02,341.304z M29.638,221.021    c9.61,9.799,27.747,27.03,51.694,44.071c32.83,23.361,83.714,51.212,139.688,51.212s106.859-27.851,139.688-51.212    c23.944-17.038,42.082-34.271,51.694-44.071c-9.609-9.799-27.747-27.03-51.694-44.071    c-32.829-23.362-83.714-51.212-139.688-51.212s-106.858,27.85-139.688,51.212C57.388,193.988,39.25,211.219,29.638,221.021z" />
                                </g> <g> <path d="M221.02,298.521c-42.734,0-77.5-34.767-77.5-77.5c0-42.733,34.766-77.5,77.5-77.5c18.794,0,36.924,6.814,51.048,19.188    c5.193,4.549,5.715,12.446,1.166,17.639c-4.549,5.193-12.447,5.714-17.639,1.166c-9.564-8.379-21.844-12.993-34.576-12.993    c-28.949,0-52.5,23.552-52.5,52.5s23.551,52.5,52.5,52.5c28.95,0,52.5-23.552,52.5-52.5c0-6.903,5.597-12.5,12.5-12.5    s12.5,5.597,12.5,12.5C298.521,263.754,263.754,298.521,221.02,298.521z" />
                                    </g> <g> <path d="M221.02,246.021c-13.785,0-25-11.215-25-25s11.215-25,25-25c13.786,0,25,11.215,25,25S234.806,246.021,221.02,246.021z" />
                                    </g> </g>
                            </svg>
                        </button>

                    </div>
                </div>

            </div>
        </motion.div>
    )
}
