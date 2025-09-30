interface HomeProps{
    children?: React.ReactNode;
};

export default function Home({children}: HomeProps) {
    return(
        <div>
            {children}
        </div>
    );
}