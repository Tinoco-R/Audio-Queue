'use client';
import generateResult from "./getRandomData";

interface SearchResultsProps{
    children?: React.ReactNode;
};

export default function SearchResults({children}: SearchResultsProps) {
    return(
        <div>
            {generateResult()}
            {generateResult()}
            {generateResult()}
            {children}
        </div>
    );
}