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