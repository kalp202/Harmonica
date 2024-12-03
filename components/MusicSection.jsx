import React from 'react'
import MusicDetailCard from './Cards/MusicDetailCard'
function MusicSection({ songs, setSongs, setLabelText }) {
    return (
        <section className="flex flex-wrap gap-x-4 gap-y-6 justify-center">
            {
                songs.map((elem, ind) =>
                    <MusicDetailCard setLabelText = {setLabelText} setSongs = {setSongs} song={elem} key={elem.download_link} delay = {ind}/>
                )
            }
        </section>
    )
}

export default MusicSection