export function addToQueue(trackObject: Record<string, string>) {
    const artist    = trackObject.artist;
    const title     = trackObject.title;
    const album     = trackObject.album;
    const artwork   = trackObject.artwork;
    const urn       = trackObject.urn;
    const trackUrl  = trackObject.trackUrl;

    console.log(`Adding ${title} by ${artist} to queue!`)
}

interface QueueProps{
    children?: React.ReactNode;
};

export default function Queue({children}: QueueProps) {
    return(
        <div>
            <h1 style={{display: "flex", justifyContent: "center", fontSize: 50}}>Queue</h1>
            {children}
        </div>
    );
}