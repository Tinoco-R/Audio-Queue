interface AttendeesProps{
    children?: React.ReactNode;
};

export default function Attendees({children}: AttendeesProps) {
    return(
        <div>
            <h1 style={{display: "flex", justifyContent: "center", fontSize: 50}}>Attendees</h1>
            {children}
        </div>
    );
}