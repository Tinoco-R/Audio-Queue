interface MediaPlayerProps{
    children?: React.ReactNode;
};

export default function MediaPlayer({children}: MediaPlayerProps) {
    return(
        <div>
            <h1 style={{display: "flex", justifyContent: "center", fontSize: 50}}>MediaPlayer</h1>
            {children}
        </div>
    );
}